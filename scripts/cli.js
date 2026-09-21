#!/usr/bin/env node

/**
 * 博客工具箱 — 统一入口
 * 用法: node scripts/cli.js [命令] [...参数]
 */

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const commands = [
	// sync 命令已移除
	{
		name: "new",
		desc: "创建新文章",
		usage: "pnpm cli new <文件名>",
		run: (args) =>
			spawn("node", [resolve(__dirname, "新建文章", "index.js"), ...args], {
				stdio: "inherit",
			}),
		prompt: async (q) => {
			const name = await q("文章文件名: ");
			return name ? [name] : null;
		},
	},
	{
		name: "media",
		desc: "下载影视封面 + 生成博客 md（TMDB）",
		usage: 'pnpm cli media "片名" [--type=movie|tv] [-y]',
		run: (args) =>
			spawn("python", [resolve(__dirname, "下载影视", "index.py"), ...args], {
				stdio: "inherit",
			}),
		prompt: async (q) => {
			const name = await q("影视名称: ");
			if (!name) return null;
			const args = [name];
			const type = await q("类型 (movie/tv/anime/documentary，回车跳过): ");
			if (type) args.push(`--type=${type}`);
			const fast = await q("快速模式？(y/n，默认 n): ");
			if (fast.toLowerCase() === "y") args.push("-y");
			return args;
		},
	},
	{
		name: "music",
		desc: "下载音乐（Meting API 搜索下载，含歌词/封面/md）",
		usage: 'pnpm cli music "歌名" ["歌手"] --md',
		run: (args) =>
			spawn(
				"python",
				[resolve(__dirname, "下载音乐", "fetch-lrc.py"), ...args],
				{ stdio: "inherit" },
			),
		prompt: async (q) => {
			const name = await q("歌名: ");
			if (!name) return null;
			const args = [name];
			const artist = await q("歌手 (回车跳过): ");
			if (artist) args.push(artist);
			args.push("--md");
			const server = await q("平台 (netease/tencent/kugou，默认 netease): ");
			if (server) args.push(`--server=${server}`);
			return args;
		},
	},
	{
		name: "lrc",
		desc: "从本地 M4A 文件提取歌词/封面",
		usage: "pnpm cli lrc <文件或目录>",
		run: (args) =>
			spawn(
				"python",
				[resolve(__dirname, "下载音乐", "extract-lrc.py"), ...args],
				{ stdio: "inherit" },
			),
		prompt: async (q) => {
			const path = await q("M4A 文件或目录路径: ");
			return path ? [path] : null;
		},
	},
	{
		name: "batch-music",
		desc: "批量下载音乐（QQ 音乐歌单文本 → 逐首下载）",
		usage:
			"pnpm cli batch-music <歌曲列表文件> [--server=netease] [--skip-existing] [--dry-run]",
		run: (args) =>
			spawn(
				"python",
				[resolve(__dirname, "下载音乐", "batch-download.py"), ...args],
				{ stdio: "inherit" },
			),
		prompt: async (q) => {
			const file = await q("歌曲列表文件路径 (或回车从剪贴板粘贴): ");
			const args = file ? [file] : [];
			const server = await q("平台 (netease/tencent/kugou，默认 netease): ");
			if (server) args.push(`--server=${server}`);
			const skip = await q("跳过已下载？(y/n，默认 y): ");
			if (skip.toLowerCase() !== "n") args.push("--skip-existing");
			return args;
		},
	},
	{
		name: "desc",
		desc: "AI 批量生成文章摘要（调用千问 API）",
		usage: "pnpm cli desc",
		run: () =>
			spawn(
				"pnpm",
				[
					"exec",
					"tsx",
					"--env-file=.env",
					resolve(__dirname, "生成摘要", "index.ts"),
				],
				{ stdio: "inherit", shell: true },
			),
	},
	{
		name: "cover",
		desc: "AI 批量生成文章封面（黑板粉笔手绘风）",
		usage:
			"pnpm cli cover [--dry-run] [--limit=3] [--force] [--only=分类] [--provider=dashscope|gemini]",
		// NODE_USE_ENV_PROXY=1 让 Node 24 原生 fetch 认 HTTPS_PROXY（走 gemini 时需要）；
		// 没配代理变量时它不生效，所以对 dashscope 直连无影响。
		run: (args) => {
			// 拼成单条命令字符串：同时传 args 和 shell:true 会触发 Node DEP0190 警告
			const target = resolve(__dirname, "生成封面", "index.ts");
			return spawn(
				`pnpm exec tsx --env-file=.env "${target}" ${args.join(" ")}`,
				{
					stdio: "inherit",
					shell: true,
					env: {
						...process.env,
						NODE_USE_ENV_PROXY: process.env.NODE_USE_ENV_PROXY || "1",
					},
				},
			);
		},
		prompt: async (q) => {
			const mode = await q(
				"模式 (1=先预览提示词 2=试做3张 3=全部补齐，默认1): ",
			);
			if (mode === "2") return ["--limit=3"];
			if (mode === "3") return [];
			return ["--dry-run"];
		},
	},
	{
		name: "nav",
		desc: "添加网站导航条目（自动获取 ICO 图标）",
		usage: "pnpm cli nav [--url=https://example.com]",
		run: (args) =>
			spawn("node", [resolve(__dirname, "添加导航", "index.js"), ...args], {
				stdio: "inherit",
			}),
	},
	{
		name: "dev",
		desc: "启动本地开发服务器",
		usage: "pnpm cli dev",
		run: () => spawn("pnpm", ["dev"], { stdio: "inherit", shell: true }),
	},
	{
		name: "build",
		desc: "构建生产站点（含图标生成 + Pagefind 索引）",
		usage: "pnpm cli build",
		run: () => spawn("pnpm", ["build"], { stdio: "inherit", shell: true }),
	},
];

function showHelp() {
	console.log("╔══════════════════════════════════════════════╗");
	console.log("║     团子和蛋糕的博客 · 工具箱               ║");
	console.log("╠══════════════════════════════════════════════╣");
	console.log("║                                              ║");
	for (const cmd of commands) {
		const aliasTag = cmd.alias ? ` (${cmd.alias})` : "";
		const label = cmd.name + aliasTag;
		console.log(`║  ${label.padEnd(18)} ${cmd.desc.padEnd(28)} ║`);
	}
	console.log("║                                              ║");
	console.log("║  直接运行 pnpm cli 进入交互菜单              ║");
	console.log("║  运行 pnpm cli <命令> --help 查看命令帮助    ║");
	console.log("╚══════════════════════════════════════════════╝");
}

function showCommandHelp(cmd) {
	console.log(`\n${cmd.desc}`);
	console.log(`用法: ${cmd.usage}`);
	if (cmd.alias) console.log(`别名: ${cmd.alias}`);
	console.log("");
}

function makeReadline() {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const q = (txt) => new Promise((resolve) => rl.question(txt, resolve));
	return { rl, q };
}

async function interactiveMenu() {
	showHelp();
	console.log("");

	let rl, q;

	while (true) {
		// 每次循环新建 readline 实例
		({ rl, q } = makeReadline());

		console.log("选择操作：");
		commands.forEach((cmd, i) => {
			console.log(`  ${i + 1}. ${cmd.desc}`);
		});
		console.log("  0. 退出");
		console.log("");

		const choice = await q("输入编号或命令名 > ");

		if (
			choice === "0" ||
			choice.toLowerCase() === "exit" ||
			choice.toLowerCase() === "q"
		) {
			console.log("再见");
			rl.close();
			break;
		}

		const n = Number.parseInt(choice, 10);
		let match =
			n >= 1 && n <= commands.length
				? commands[n - 1]
				: commands.find((cmd) => cmd.name === choice || cmd.alias === choice);

		// 未匹配时，猜测用户意图 —— 中文输入大概率是搜影视/音乐
		if (!match && /[一-龥]/.test(choice)) {
			console.log(`\n"${choice}" 可能是影视或音乐名称？`);
			const guess = await q("  [m] 下载影视  [u] 下载音乐  [n] 取消 > ");
			if (guess === "m") match = commands.find((c) => c.name === "media");
			else if (guess === "u") match = commands.find((c) => c.name === "music");
		}

		if (!match) {
			console.log(`未知命令: ${choice}`);
			rl.close();
			continue;
		}

		// 收集参数
		let extraArgs = [];
		if (match.prompt) {
			console.log(`\n${match.desc}`);
			console.log("(回车跳过则取消)\n");
			const result = await match.prompt(q);
			if (!result) {
				console.log("已取消\n");
				rl.close();
				continue;
			}
			extraArgs = result;
		}

		// 关闭 readline，彻底释放 stdin 给子进程
		rl.close();

		console.log(`\n执行: ${match.desc}...\n`);

		const proc = match.run(extraArgs);
		if (proc) {
			await new Promise((resolve) => proc.on("close", resolve));
		}

		console.log("");
	}
}

// --- 入口 ---
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
	if (args[0] === "--help" || args[0] === "-h") {
		showHelp();
	} else {
		await interactiveMenu();
	}
} else {
	const cmdName = args[0];
	const rest = args.slice(1);

	if (rest[0] === "--help" || rest[0] === "-h") {
		const cmd = commands.find((c) => c.name === cmdName || c.alias === cmdName);
		if (cmd) {
			showCommandHelp(cmd);
		} else {
			console.log(`未知命令: ${cmdName}`);
			showHelp();
		}
		process.exit(0);
	}

	const cmd = commands.find((c) => c.name === cmdName || c.alias === cmdName);
	if (!cmd) {
		console.log(`未知命令: ${cmdName}`);
		console.log("运行 pnpm cli 查看可用命令");
		process.exit(1);
	}

	const proc = cmd.run(rest);

	if (proc) {
		proc.on("close", (code) => process.exit(code || 0));
	}

	process.on("SIGINT", () => {
		if (proc) proc.kill("SIGINT");
		process.exit(0);
	});
}
