/* 友链站点截图：Playwright 无头浏览器逐个访问友链站点，压缩为 640 宽 webp
   用法：node scripts/友链截图/index.mjs [友链id] [--force]
     - 传友链 id（如 36-secret-blog）：只截该友链，并强制覆盖已有截图
     - --force：忽略已存在的截图，全部重截
   产物提交回仓库由 Action 完成；依赖：pnpm add -D playwright（chromium） */

import fs from "node:fs";
import path from "node:path";
import { slug as githubSlug } from "github-slugger";
import { chromium } from "playwright";
import sharp from "sharp";

const FRIENDS_DIR = path.join(import.meta.dirname, "../../src/content/friends");
const OUT_DIR = path.join(import.meta.dirname, "../../public/assets/friends-shots");

// 默认无头 UA 带 "HeadlessChrome" 会被部分站点反爬识别，换成真实 Chrome UA
const UA =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

function readEntries() {
	const entries = [];
	for (const f of fs.readdirSync(FRIENDS_DIR).filter((x) => x.endsWith(".md"))) {
		const raw = fs.readFileSync(path.join(FRIENDS_DIR, f), "utf8");
		const m = raw.match(/^siteurl:\s*(.+)$/m);
		// id 必须与 Astro glob loader 的 entry id 一致：github-slugger 规则（小写 + 移除标点、空格转连字符）。
		// 仅 toLowerCase 不够：文件名含全角逗号等标点时 Astro id 会去掉标点（如 39-胡超，作品集 → 39-胡超作品集），
		// 截图文件名若对不上，页面 shotExists() 匹配失败，卡片退化为无截图
		if (m) entries.push({ id: githubSlug(f.replace(/\.md$/, "")), url: m[1].trim().replace(/^["']|["']$/g, "") });
	}
	return entries;
}

// 命令行参数：非 -- 开头的视为友链 id（只截这一个并强制覆盖）
const argId = process.argv.slice(2).find((a) => !a.startsWith("--"));
const force = process.argv.includes("--force");

const allEntries = readEntries();
const entries = argId ? allEntries.filter((e) => e.id === argId) : allEntries;
if (argId && !entries.length) {
	console.error(`❌ 未找到友链 "${argId}"，可用 id：\n  ${allEntries.map((e) => e.id).join("\n  ")}`);
	process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
// context 级伪装真实浏览器（UA/语言/时区）；2 倍像素截图再压 640 宽，文字更清晰
const context = await browser.newContext({
	userAgent: UA,
	locale: "zh-CN",
	timezoneId: "Asia/Shanghai",
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 2,
});

// 单次截图：load 后先等网络空闲（覆盖二次导航/客户端路由接管/开屏动画，
// 轮询站等不到则 6s 超时放弃）→ 再等字体就绪 → 固定缓冲（懒加载图/骨架屏转完）
async function takeShot(entry) {
	const page = await context.newPage();
	try {
		await page.goto(entry.url, { waitUntil: "load", timeout: 30000 });
		await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
		// 字体就绪最多等 5s：资源挂起时 fonts.ready 永不 resolve；二次导航销毁
		// 执行上下文会抛 context destroyed——两种情况都跳过字体等待即可
		await page
			.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]).then(() => true))
			.catch(() => {});
		await page.waitForTimeout(2000);
		const buf = await page.screenshot({ type: "png" });
		return await sharp(buf).resize({ width: 640 }).webp({ quality: 75 }).toBuffer();
	} finally {
		await page.close();
	}
}

const ok = [];
const failed = [];
for (const entry of entries) {
	const outPath = path.join(OUT_DIR, `${entry.id}.webp`);
	if (fs.existsSync(outPath) && !force && !argId) {
		console.log(`⏭  已有 ${entry.id}.webp`);
		continue;
	}
	try {
		// 共 3 次机会（首次 + 2 次重试）：慢站点/偶发拦截多给机会，全败才算失败
		let buf;
		for (let attempt = 1; attempt <= 3; attempt++) {
			try {
				buf = await takeShot(entry);
				break;
			} catch (e) {
				if (attempt === 3) throw e;
				console.log(`  ↻ ${entry.id} 第 ${attempt} 次失败，重试…`);
			}
		}
		fs.writeFileSync(outPath, buf);
		ok.push(entry.id);
		console.log(`✅ ${entry.id}  ${entry.url}`);
	} catch (e) {
		failed.push(`${entry.id}（${String(e.message).slice(0, 60)}）`);
		console.log(`❌ ${entry.id}  ${entry.url}`);
	}
}
await context.close();
await browser.close();

console.log(`\n完成：成功 ${ok.length}，失败 ${failed.length}`);
if (failed.length) console.log("失败列表：\n  " + failed.join("\n  "));
