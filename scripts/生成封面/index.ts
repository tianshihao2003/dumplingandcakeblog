/**
 * 文章封面批量生成脚本 — 调用文生图 API 为缺少封面的文章生成「黑板粉笔手绘风」专属封面
 *
 * 用法：
 *   pnpm cli cover --dry-run              # 只打印将要发送的提示词，不调 API（先看这个）
 *   pnpm cli cover --limit=3              # 只生成 3 张，试水
 *   pnpm cli cover                        # 为所有缺封面的文章生成
 *   pnpm cli cover --force --limit=1      # 覆盖已生成的封面，只做 1 张
 *   pnpm cli cover --only=AI使用          # 只处理某个分类（匹配相对路径前缀）
 *
 * 提示词模板改自 tblog.mmzhiku.xyz 公开的「黑板封面」模板（详见 CLAUDE.md 第 15 节）。
 * 封面风格由下面的 STYLE_TEMPLATE 常量控制，改这里即可整体换风格。
 *
 * ── 环境变量（.env，已 gitignore）─────────────────────────────
 *   二选一，取决于用哪个 provider：
 *     DASHSCOPE_API_KEY   阿里云百炼，provider=dashscope（默认）
 *     GEMINI_API_KEY      Google AI Studio，provider=gemini
 *   可选：
 *     COVER_PROVIDER      dashscope | gemini，默认 dashscope
 *     COVER_MODEL         覆盖默认模型
 *     HTTPS_PROXY         走 gemini 时必须配，如 http://127.0.0.1:7890
 *
 * 产物：public/assets/images/post-covers/*.webp（1600x900），并把 image 字段写回 frontmatter。
 * 已有 image 字段的文章默认跳过，可用 --force 覆盖，所以脚本可反复中断续跑。
 */

import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

// ============================================================
// 常量配置
// ============================================================

const POSTS_DIR = path.resolve("src/content/posts");
const OUT_DIR = path.resolve("public/assets/images/post-covers");
/** 写回 frontmatter 的 URL 前缀（public 目录对外暴露在站点根路径下） */
const PUBLIC_PREFIX = "/assets/images/post-covers";

/** 输出尺寸，16:9；比列表页实际展示宽一倍，够 retina 用 */
const OUT_WIDTH = 1600;
const OUT_HEIGHT = 900;
const WEBP_QUALITY = 82;

/** 单张生成失败最大重试次数 */
const MAX_RETRIES = 2;
/** 每张之间的间隔，避免触发限流 */
const DELAY_MS = 1200;

/** 封面里的固定角色形象。想换吉祥物就改这一段。 */
const MASCOT =
	"右侧为一位二次元少女：黑色短发配猫耳发饰，大眼睛，穿深色连帽卫衣，表情活泼俏皮";

/**
 * 负向提示词。注意：这里**故意不含「文字」**——参考站原模板带了「文字」，
 * 那会压制封面上的大标题，抄的时候必须删掉。
 */
const NEGATIVE_PROMPT = [
	"低质量",
	"模糊",
	"过曝",
	"欠曝",
	"塑料皮肤",
	"假光影",
	"错误手部结构",
	"多手指",
	"畸形手",
	"比例错误",
	"背景扁平",
	"涂抹感",
	"贴图感",
	"过饱和",
	"AI感过强",
	"水印",
	"logo",
	"多余人物",
	"脸部不一致",
	"眼睛错位",
].join("，");

// ============================================================
// CLI 参数
// ============================================================

interface Options {
	dryRun: boolean;
	force: boolean;
	limit: number;
	only: string;
	provider: string;
	model: string;
}

function parseArgs(): Options {
	const argv = process.argv.slice(2);
	const get = (name: string): string => {
		const hit = argv.find((a) => a.startsWith(`--${name}=`));
		return hit ? hit.slice(name.length + 3) : "";
	};
	const has = (name: string): boolean => argv.includes(`--${name}`);

	return {
		dryRun: has("dry-run"),
		force: has("force"),
		limit: Number.parseInt(get("limit"), 10) || 0,
		only: get("only"),
		provider: (
			get("provider") ||
			process.env.COVER_PROVIDER ||
			"dashscope"
		).toLowerCase(),
		model: get("model") || process.env.COVER_MODEL || "",
	};
}

// ============================================================
// 工具函数
// ============================================================

function log(emoji: string, msg: string): void {
	const ts = new Date().toISOString().slice(11, 19);
	console.log(`[${ts}] ${emoji}  ${msg}`);
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 递归收集目录下所有 .md / .mdx 文件 */
function collectMarkdownFiles(dir: string): string[] {
	const result: string[] = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			result.push(...collectMarkdownFiles(fullPath));
		} else if (/\.(md|mdx)$/i.test(entry.name)) {
			result.push(fullPath);
		}
	}
	return result;
}

/**
 * 生成落盘文件名。
 *
 * CLAUDE.md 第 2 节硬性规则：public 下的文件名必须「英文小写 + 连字符」，禁止中文/空格/括号。
 * 但文章名多为中文，直接音译需要额外依赖，所以取相对路径里可用的 ASCII 片段做前缀，
 * 再拼上路径哈希：哈希保证唯一且**跨平台/跨次运行稳定**（重跑不会换名字，续跑才可能幂等）。
 */
function makeOutName(relPath: string): string {
	// 先归一成正斜杠，否则 Windows/Linux 下哈希不同，同一篇文章会得到两个文件名
	const normalized = relPath.split(path.sep).join("/");
	const ascii = path
		.basename(normalized, path.extname(normalized))
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40);
	const hash = createHash("sha1").update(normalized).digest("hex").slice(0, 8);
	return ascii ? `${ascii}-${hash}` : `cover-${hash}`;
}

// ============================================================
// 提示词构建
// ============================================================

interface PostItem {
	filePath: string;
	relPath: string;
	title: string;
	description: string;
	raw: string;
	hasImage: boolean;
	currentImage: string;
	outName: string;
}

/** 拼出最终的封面提示词 */
function buildPrompt(item: PostItem): string {
	// 文章要点优先用已有的 AI 摘要；没有就退回标题，避免正文太长把提示词撑爆
	const summary = item.description || item.title;

	return `生成技术教程类文章封面，黑板粉笔手绘风，16:9 横版构图，画面干净。

整体构图：左侧为超大粗体中文标题文字，${MASCOT}

基底背景：深色纯黑黑板质感底色，带有轻微黑板肌理，模拟粉笔书写的载体。

文字设计：粗厚卡通手写字体，像彩色粉笔写在黑板上；核心重点需要搭配下划线、描边装饰，高对比撞色，区分配色，重点配色明显。

上色质感：扁平化，几乎没有渐变、写实光影；色彩干净明快，蓝/黄/白高对比配色，粉笔质感的柔和边缘，没有厚重阴影。

右侧设计：女孩旁边要包含与文章内容相关的图标或图示（如代码窗口、流程图、书本、齿轮等），女孩需要包含本文章主题的相关元素，然后摆出眨眼可爱动作。

文章标题：${item.title}

文章内容：${summary}`;
}

// ============================================================
// 生图 Provider
// ============================================================

/** 统一返回图片二进制 */
type ImageBytes = Buffer;

/** 阿里云百炼 qwen-image：同步接口，直接返回图片 URL */
async function generateWithDashscope(
	prompt: string,
	model: string,
): Promise<ImageBytes> {
	const key = process.env.DASHSCOPE_API_KEY;
	if (!key) throw new Error("缺少 DASHSCOPE_API_KEY（在 .env 里配置）");

	const resp = await fetch(
		"https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${key}`,
			},
			body: JSON.stringify({
				model: model || "qwen-image",
				input: { messages: [{ role: "user", content: [{ text: prompt }] }] },
				parameters: {
					negative_prompt: NEGATIVE_PROMPT,
					size: "1664*928", // 百炼这边 16:9 的档位
					prompt_extend: false, // 关掉改写，否则标题文字容易被扩写乱
					watermark: false,
				},
			}),
		},
	);

	const text = await resp.text();
	if (!resp.ok) {
		// 欠费会返回 400 + Arrearage，这里单独点出来免得排查半天
		if (text.includes("Arrearage")) {
			throw new Error(
				"百炼账户欠费（Arrearage）：请先充值，或改用 --provider=gemini",
			);
		}
		throw new Error(`DashScope ${resp.status}: ${text.slice(0, 300)}`);
	}

	const json = JSON.parse(text) as {
		output?: { choices?: { message?: { content?: { image?: string }[] } }[] };
	};
	const url = json.output?.choices?.[0]?.message?.content?.find(
		(c) => c.image,
	)?.image;
	if (!url) throw new Error(`DashScope 未返回图片: ${text.slice(0, 300)}`);

	const img = await fetch(url);
	if (!img.ok) throw new Error(`下载生成图失败 ${img.status}`);
	return Buffer.from(await img.arrayBuffer());
}

/**
 * Google Nano Banana（gemini-*-image）：返回 base64。
 * 模型选择：
 *   gemini-2.5-flash-image  一代 Nano Banana，有免费额度，中文长文本精度一般
 *   gemini-3.1-flash-image  更快的新版 flash
 *   gemini-3-pro-image      Nano Banana Pro，中文排版最强，按张计费
 */
async function generateWithGemini(
	prompt: string,
	model: string,
): Promise<ImageBytes> {
	const key = process.env.GEMINI_API_KEY;
	if (!key) throw new Error("缺少 GEMINI_API_KEY（在 .env 里配置）");
	if (!process.env.HTTPS_PROXY && !process.env.https_proxy) {
		log(
			"⚠️",
			"没检测到 HTTPS_PROXY；国内直连 Google 会超时，需配合 NODE_USE_ENV_PROXY=1",
		);
	}

	const useModel = model || "gemini-2.5-flash-image";
	const resp = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${useModel}:generateContent`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json", "x-goog-api-key": key },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					responseModalities: ["IMAGE"],
					imageConfig: { aspectRatio: "16:9" },
				},
			}),
		},
	);

	const text = await resp.text();
	if (!resp.ok) throw new Error(`Gemini ${resp.status}: ${text.slice(0, 300)}`);

	const json = JSON.parse(text) as {
		candidates?: {
			content?: { parts?: { inlineData?: { data?: string } }[] };
		}[];
	};
	const b64 = json.candidates?.[0]?.content?.parts?.find(
		(p) => p.inlineData?.data,
	)?.inlineData?.data;
	if (!b64) throw new Error(`Gemini 未返回图片: ${text.slice(0, 300)}`);
	return Buffer.from(b64, "base64");
}

/**
 * 空跑 provider —— 不联网，用 sharp 生成一张纯色占位图。
 * 用途：验证「扫描 → 转换 → 写回 frontmatter」整条流水线，不花 API 费用，
 * 也不会因为真实调用而污染提示词调试。产物是占位图，别留在正式封面目录里。
 */
async function generateWithMock(_prompt: string): Promise<ImageBytes> {
	return sharp({
		create: {
			width: OUT_WIDTH,
			height: OUT_HEIGHT,
			channels: 3,
			background: "#1b2838",
		},
	})
		.png()
		.toBuffer();
}

// ============================================================
// 落盘
// ============================================================

/** 统一压成 16:9 webp，裁掉生成时可能多出来的边 */
async function saveCover(bytes: ImageBytes, outName: string): Promise<string> {
	fs.mkdirSync(OUT_DIR, { recursive: true });
	const outPath = path.join(OUT_DIR, `${outName}.webp`);
	// 不放大：生成尺寸小于目标时按原尺寸保留比例
	await sharp(bytes)
		.resize(OUT_WIDTH, OUT_HEIGHT, {
			fit: "cover",
			position: "centre",
			withoutEnlargement: true,
		})
		.webp({ quality: WEBP_QUALITY })
		.toFile(outPath);
	return outPath;
}

/**
 * 把 image 字段写回 frontmatter。
 *
 * 只做字符串手术（不用 gray-matter 的 stringify），否则 240 个文件的 YAML 会被整体重排。
 * 注意：替换必须**限定在 frontmatter 区间内**——仓库里有若干篇讲封面配置的教程，
 * 正文示例里也含 `image:` 开头的行，全文件正则替换会改坏正文。
 */
function writeImageField(filePath: string, raw: string, url: string): void {
	const imgLine = `image: ${url}`;

	if (!raw.startsWith("---")) {
		log("⚠️", `文件不是以 frontmatter 开头，跳过写回: ${filePath}`);
		return;
	}
	const closingIdx = raw.indexOf("\n---", 3);
	if (closingIdx === -1) {
		log("⚠️", `frontmatter 结构异常，跳过写回: ${filePath}`);
		return;
	}

	const fm = raw.slice(0, closingIdx); // "---\n字段…"，不含结尾换行
	const tail = raw.slice(closingIdx); // "\n---\n\n正文…"
	const newFm = /^image\s*:/m.test(fm)
		? fm.replace(/^image\s*:.*$/m, imgLine)
		: `${fm.trimEnd()}\n${imgLine}`;

	// 用 `${newFm}${tail}` 而非 `${newFm}\n${tail}`：tail 自带换行，否则会在 --- 前多一个空行
	fs.writeFileSync(filePath, `${newFm}${tail}`, "utf-8");
}

// ============================================================
// 主流程
// ============================================================

async function main(): Promise<void> {
	const opts = parseArgs();
	log("🚀", "封面批量生成脚本启动");
	log(
		"📡",
		`provider=${opts.provider}${opts.model ? ` model=${opts.model}` : ""}`,
	);
	log("📂", `文章目录: ${POSTS_DIR}`);
	log("💾", `输出目录: ${OUT_DIR}`);

	if (opts.dryRun)
		log("🔍", "--dry-run：只打印提示词，不会调用 API、不会写回 frontmatter");

	const all = collectMarkdownFiles(POSTS_DIR);
	const pending: PostItem[] = [];
	let skippedHas = 0;

	for (const filePath of all) {
		const raw = fs.readFileSync(filePath, "utf-8");
		const relPath = path.relative(POSTS_DIR, filePath);
		// 统一成正斜杠再比较，否则 Windows 下 --only=分类/文件名 匹配不上（relative 返回反斜杠）
		if (
			opts.only &&
			!relPath
				.split(path.sep)
				.join("/")
				.startsWith(opts.only.replace(/\\/g, "/"))
		) {
			continue;
		}

		let gm: matter.GrayMatterFile<string>;
		try {
			gm = matter(raw);
		} catch {
			// frontmatter 有语法错误（例如未加引号的模板变量）时不让整个批量任务挂掉
			log("⚠️", `frontmatter 解析失败，跳过: ${relPath}`);
			continue;
		}
		const hasImage = Boolean(gm.data.image);
		if (hasImage && !opts.force) {
			skippedHas++;
			continue;
		}

		const base = path.basename(relPath, path.extname(relPath));
		pending.push({
			filePath,
			relPath,
			title: String(gm.data.title || base),
			description: String(gm.data.description || ""),
			raw,
			hasImage,
			currentImage: String(gm.data.image || ""),
			outName: makeOutName(relPath),
		});
	}

	log("📊", `扫描到 ${all.length} 篇文章`);
	log("⏭️", `${skippedHas} 篇已有封面 -> 跳过（--force 可覆盖）`);
	log("📝", `${pending.length} 篇待生成`);

	const queue = opts.limit > 0 ? pending.slice(0, opts.limit) : pending;
	if (opts.limit > 0)
		log("✂️", `--limit=${opts.limit}，本次只处理前 ${queue.length} 篇`);
	if (queue.length === 0) {
		log("✅", "没有需要处理的文章");
		return;
	}

	if (opts.dryRun) {
		log("🔍", `预览第 1 篇的完整提示词（共 ${queue.length} 篇待处理）：`);
		console.log(
			`\n${"-".repeat(60)}\n${buildPrompt(queue[0])}\n${"-".repeat(60)}\n`,
		);
		log("🔍", `负向提示词：${NEGATIVE_PROMPT}`);
		console.log("");
		queue.forEach((it, i) => {
			console.log(`  ${i + 1}. ${it.relPath}`);
		});
		return;
	}

	let ok = 0;
	let failed = 0;
	const failures: string[] = [];

	for (const [index, item] of queue.entries()) {
		const tag = `[${index + 1}/${queue.length}]`;
		log("⏳", `${tag} 生成中: ${item.relPath}`);

		const prompt = buildPrompt(item);
		let bytes: ImageBytes | null = null;

		for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
			try {
				bytes =
					opts.provider === "gemini"
						? await generateWithGemini(prompt, opts.model)
						: opts.provider === "mock"
							? await generateWithMock(prompt)
							: await generateWithDashscope(prompt, opts.model);
				break;
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				log("❌", `${tag} ${msg}（尝试 ${attempt + 1}/${MAX_RETRIES + 1}）`);
				// 欠费/缺 key 这类硬错误重试没意义，直接退出
				if (/Arrearage|缺少 DASHSCOPE_API_KEY|缺少 GEMINI_API_KEY/.test(msg)) {
					log("🛑", "凭据问题，终止本次执行");
					process.exit(1);
				}
				if (attempt < MAX_RETRIES) await sleep(2000 * (attempt + 1));
			}
		}

		if (!bytes) {
			failed++;
			failures.push(item.relPath);
			continue;
		}

		try {
			const outPath = await saveCover(bytes, item.outName);
			const url = `${PUBLIC_PREFIX}/${item.outName}.webp`;
			writeImageField(item.filePath, item.raw, url);
			const kb = Math.round(fs.statSync(outPath).size / 1024);
			log("✅", `${tag} ${path.basename(outPath)} (${kb}KB) -> ${url}`);
			ok++;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			log("❌", `${tag} 落盘失败: ${msg}`);
			failed++;
			failures.push(item.relPath);
		}

		if (index < queue.length - 1) await sleep(DELAY_MS);
	}

	log("", "");
	log("🏁", "执行完毕");
	log("   ", `✅ 成功: ${ok} 篇`);
	log("   ", `❌ 失败: ${failed} 篇`);
	if (failures.length > 0) {
		log("💡", "失败列表（可重跑本脚本自动续做）：");
		failures.forEach((f) => {
			console.log(`     ${f}`);
		});
	}
	log("🔎", "建议核对: pnpm build");
}

main().catch((err) => {
	console.error("脚本异常终止:", err);
	process.exit(1);
});
