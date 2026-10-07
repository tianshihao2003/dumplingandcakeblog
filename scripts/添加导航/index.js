#!/usr/bin/env node

/**
 * 添加网站导航条目脚本
 *
 * 用法：
 *   node scripts/添加导航/index.js
 *   node scripts/add-daohang/index.js --url=https://example.com
 *
 * 功能：
 *   1. 输入网站地址
 *   2. 自动获取网站 ICO 图标
 *   3. 填写名称、描述、分类、标签等信息
 *   4. 生成 Markdown 文件到 src/content/daohang/
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const TARGET_DIR = path.join(ROOT, "src", "content", "daohang");

// 常用分类
const CATEGORIES = [
	"我的网站",
	"工具网站",
	"设计资源",
	"学习网站",
	"开发工具",
	"AI 工具",
	"社交媒体",
	"其他",
];

// 预设颜色
const COLORS = [
	{ name: "蓝色", value: "#3b82f6" },
	{ name: "绿色", value: "#10b981" },
	{ name: "紫色", value: "#8b5cf6" },
	{ name: "红色", value: "#ef4444" },
	{ name: "橙色", value: "#f97316" },
	{ name: "青色", value: "#06b6d4" },
	{ name: "粉色", value: "#ec4899" },
	{ name: "黄色", value: "#eab308" },
	{ name: "灰色", value: "#6b7280" },
];

// ═══════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

function question(prompt) {
	return new Promise((resolve) => rl.question(prompt, resolve));
}

function yamlEscape(value) {
	const str = String(value);
	if (/[:#\n"'{}[\],&*?|>!%`@]/.test(str) || str.includes("\\")) {
		return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
	}
	return str;
}

// 从 URL 提取域名作为默认文件名
function urlToFilename(url) {
	try {
		const hostname = new URL(url).hostname;
		return hostname
			.replace(/^www\./, "")
			.replace(/\./g, "-")
			.replace(/[^a-zA-Z0-9-]/g, "")
			.toLowerCase();
	} catch {
		return "";
	}
}

// 从 URL 提取域名作为默认名称
function urlToName(url) {
	try {
		const hostname = new URL(url).hostname;
		return hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
}

// 获取已有文件中的所有分类
function getExistingCategories() {
	if (!fs.existsSync(TARGET_DIR)) return [];
	const categories = new Set();
	const files = fs.readdirSync(TARGET_DIR).filter((f) => f.endsWith(".md"));
	for (const file of files) {
		try {
			const content = fs.readFileSync(path.join(TARGET_DIR, file), "utf-8");
			const match = content.match(/^---\n([\s\S]*?)\n---/);
			if (match) {
				const catMatch = match[1].match(/^category:\s*(.+)$/m);
				if (catMatch) {
					const cat = catMatch[1].trim().replace(/^["']|["']$/g, "");
					if (cat) categories.add(cat);
				}
			}
		} catch {}
	}
	return [...categories].sort();
}

// 加载已有条目数据（用于编辑模式预填）
function loadExistingEntry(targetUrl) {
	if (!fs.existsSync(TARGET_DIR)) return null;
	const normalizedTarget = targetUrl.replace(/\/+$/, "").toLowerCase();
	const files = fs.readdirSync(TARGET_DIR).filter((f) => f.endsWith(".md"));
	for (const file of files) {
		try {
			const content = fs.readFileSync(path.join(TARGET_DIR, file), "utf-8");
			const match = content.match(/^---\n([\s\S]*?)\n---/);
			if (match) {
				const fm = match[1];
				const urlMatch = fm.match(/^url:\s*(.+)$/m);
				if (urlMatch) {
					const existingUrl = urlMatch[1].trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "").toLowerCase();
					if (existingUrl === normalizedTarget) {
						const get = (key) => {
							const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
							return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
						};
						const getBool = (key) => {
							const m = fm.match(new RegExp(`^${key}:\\s*true`, "m"));
							return !!m;
						};
						const getArray = (key) => {
							const m = fm.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "m"));
							if (!m) return [];
							return m[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
						};
						return {
							filename: file.replace(".md", ""),
							name: get("name"),
							url: get("url"),
							icon: get("icon"),
							description: get("description"),
							category: get("category"),
							tags: getArray("tags"),
							color: get("color"),
							featured: getBool("featured"),
							order: parseInt(get("order"), 10) || 0,
						};
					}
				}
			}
		} catch {}
	}
	return null;
}

// 检查 URL 是否已存在于现有文件中
function checkUrlExists(targetUrl) {
	if (!fs.existsSync(TARGET_DIR)) return null;
	const normalizedTarget = targetUrl.replace(/\/+$/, "").toLowerCase();
	const files = fs.readdirSync(TARGET_DIR).filter((f) => f.endsWith(".md"));
	for (const file of files) {
		try {
			const content = fs.readFileSync(path.join(TARGET_DIR, file), "utf-8");
			const match = content.match(/^---\n([\s\S]*?)\n---/);
			if (match) {
				const urlMatch = match[1].match(/^url:\s*(.+)$/m);
				if (urlMatch) {
					const existingUrl = urlMatch[1].trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "").toLowerCase();
					if (existingUrl === normalizedTarget) return file;
				}
			}
		} catch {}
	}
	return null;
}

// 获取现有文件的最大 order 值
function getMaxOrder() {
	if (!fs.existsSync(TARGET_DIR)) return 0;
	const files = fs.readdirSync(TARGET_DIR).filter((f) => f.endsWith(".md"));
	let maxOrder = 0;
	for (const file of files) {
		try {
			const content = fs.readFileSync(path.join(TARGET_DIR, file), "utf-8");
			const match = content.match(/^---\n([\s\S]*?)\n---/);
			if (match) {
				const orderMatch = match[1].match(/^order:\s*(\d+)$/m);
				if (orderMatch) {
					const order = parseInt(orderMatch[1], 10);
					if (order > maxOrder) maxOrder = order;
				}
			}
		} catch {}
	}
	return maxOrder;
}

// ═══════════════════════════════════════════════════
// 获取 ICO
// ═══════════════════════════════════════════════════

async function fetchIco(url) {
	try {
		const apiUrl = `https://v2.xxapi.cn/api/ico?url=${encodeURIComponent(url)}`;
		console.log("  正在获取网站图标...");
		const resp = await fetch(apiUrl);
		const data = await resp.json();
		if (data.code === 200 && data.data) {
			console.log(`  ✓ 图标获取成功: ${data.data}`);
			return data.data;
		}
		console.log("  ⚠ 未获取到图标");
		return "";
	} catch (e) {
		console.log(`  ⚠ 图标获取失败: ${e.message}`);
		return "";
	}
}

// ═══════════════════════════════════════════════════
// 主流程
// ═══════════════════════════════════════════════════

async function main() {
	console.log("╔══════════════════════════════════════╗");
	console.log("║      添加网站导航条目               ║");
	console.log("╚══════════════════════════════════════╝\n");

	// 1. 获取网站地址
	let url = process.argv.find((a) => a.startsWith("--url="));
	if (url) {
		url = url.split("=").slice(1).join("=");
	} else {
		url = await question("请输入网站地址: ");
	}
	url = url.trim();
	if (!url) {
		console.log("✗ 网址不能为空");
		rl.close();
		return;
	}
	if (!url.startsWith("http")) url = "https://" + url;

	// 2. 检查 URL 是否已存在
	const existingEntry = loadExistingEntry(url);
	let isEditMode = false;
	if (existingEntry) {
		console.log(`\n⚠ 该网址已存在于: ${existingEntry.filename}.md`);
		console.log(`  1. 编辑已有条目（更新信息/修复 ICO）`);
		console.log(`  2. 仍然新建`);
		console.log(`  0. 取消`);
		const choice = (await question("选择操作 [0-2] (默认: 0): ")).trim();
		if (choice === "1") {
			isEditMode = true;
			console.log("\n进入编辑模式（回车保留原值）\n");
		} else if (choice === "2") {
			isEditMode = false;
			console.log("\n");
		} else {
			console.log("已取消");
			rl.close();
			return;
		}
	}

	// 3. 自动获取 ICO（编辑模式下也重新获取，以修复失效图标）
	const icon = await fetchIco(url);

	// 4. 填写基本信息（编辑模式下预填原值）
	const defaultName = isEditMode ? existingEntry.name : urlToName(url);
	const name = (await question(`网站名称 [${defaultName}]: `)).trim() || defaultName;

	const defaultDesc = isEditMode ? (existingEntry.description || "") : "";
	const description = (await question(`网站描述 [${defaultDesc}]: `)).trim() || defaultDesc;

	// 5. 选择分类（合并预设 + 已有分类）
	const existingCategories = getExistingCategories();
	const allCategories = [...new Set([...CATEGORIES, ...existingCategories])];
	const defaultCat = isEditMode ? existingEntry.category : "";
	console.log("\n可选分类:");
	allCategories.forEach((c, i) => {
		const marker = c === defaultCat ? " ← 当前" : "";
		console.log(`  ${i + 1}. ${c}${marker}`);
	});
	console.log(`  0. 输入新分类`);
	const catInput = (await question(`选择分类 [0-${allCategories.length}]${defaultCat ? ` (当前: ${defaultCat})` : ""}: `)).trim();
	let category;
	if (catInput === "" && defaultCat) {
		category = defaultCat;
	} else if (catInput === "0") {
		category = (await question("输入新分类名称: ")).trim();
		if (!category) category = defaultCat || "其他";
	} else if (catInput) {
		category = allCategories[parseInt(catInput, 10) - 1] || catInput;
	} else {
		category = defaultCat || "其他";
	}

	// 6. 输入标签
	const defaultTags = isEditMode ? (existingEntry.tags || []).join(", ") : "";
	const tagsInput = (await question(`标签 (逗号分隔) [${defaultTags}]: `)).trim();
	const tags = tagsInput
		? tagsInput.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
		: defaultTags
			? defaultTags.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
			: [];

	// 7. 选择颜色
	const defaultColorIdx = isEditMode
		? COLORS.findIndex((c) => c.value === existingEntry.color) + 1
		: 0;
	console.log("\n可选颜色:");
	COLORS.forEach((c, i) => {
		const marker = i + 1 === defaultColorIdx ? " ← 当前" : "";
		console.log(`  ${i + 1}. ${c.name} (${c.value})${marker}`);
	});
	const colorInput = (await question(`选择颜色 [1-${COLORS.length}]${defaultColorIdx ? ` (当前: ${COLORS[defaultColorIdx - 1].name})` : " (默认: 蓝色)"}: `)).trim();
	let color;
	if (colorInput === "" && defaultColorIdx) {
		color = COLORS[defaultColorIdx - 1].value;
	} else if (colorInput) {
		color = COLORS[parseInt(colorInput, 10) - 1]?.value || colorInput;
	} else {
		color = "#3b82f6";
	}

	// 8. 是否置顶
	const defaultFeatured = isEditMode ? existingEntry.featured : false;
	const featuredHint = defaultFeatured ? "(当前: 是)" : "";
	const featuredInput = (await question(`是否置顶？(y/N) ${featuredHint}: `)).trim().toLowerCase();
	const featured = featuredInput === "y" || featuredInput === "yes"
		? true
		: featuredInput === "n" || featuredInput === "no"
			? false
			: defaultFeatured;

	// 9. 生成文件名和 order
	const defaultFilename = isEditMode
		? existingEntry.filename
		: urlToFilename(url);
	const filename = (await question(`文件名 [${defaultFilename}]: `)).trim() || defaultFilename;
	const filepath = path.join(TARGET_DIR, `${filename}.md`);

	// 编辑模式下直接覆盖原文件，非编辑模式检查文件是否存在
	if (!isEditMode && fs.existsSync(filepath)) {
		const overwrite = (await question(`⚠ 文件 ${filename}.md 已存在，覆盖？(y/N): `)).trim().toLowerCase();
		if (overwrite !== "y" && overwrite !== "yes") {
			console.log("已取消");
			rl.close();
			return;
		}
	}

	const order = isEditMode ? existingEntry.order : getMaxOrder() + 1;

	// 9. 生成 Markdown 内容
	const lines = ["---"];
	lines.push(`name: ${yamlEscape(name)}`);
	lines.push(`url: ${url}`);
	if (icon) lines.push(`icon: ${icon}`);
	if (description) lines.push(`description: ${yamlEscape(description)}`);
	lines.push(`category: ${category}`);
	if (tags.length > 0) {
		lines.push(`tags: [${tags.map(yamlEscape).join(", ")}]`);
	}
	if (color) lines.push(`color: "${color}"`);
	if (featured) lines.push(`featured: true`);
	lines.push(`order: ${order}`);
	lines.push("---");
	lines.push("");
	if (description) {
		lines.push(description);
	} else {
		lines.push(`${name} — ${url}`);
	}
	lines.push("");

	// 10. 写入文件
	fs.mkdirSync(TARGET_DIR, { recursive: true });
	fs.writeFileSync(filepath, lines.join("\n"), "utf-8");

	console.log(`\n════════════════════════════════════════`);
	console.log(`✓ ${isEditMode ? "已更新" : "已创建"}: src/content/daohang/${filename}.md`);
	console.log(`  名称: ${name}`);
	console.log(`  地址: ${url}`);
	const iconChanged = isEditMode && icon && icon !== existingEntry.icon;
	console.log(`  图标: ${icon || "(无)"}${iconChanged ? " (已更新)" : ""}`);
	console.log(`  分类: ${category}`);
	console.log(`  标签: ${tags.join(", ") || "(无)"}`);
	console.log(`  颜色: ${color}`);
	console.log(`  置顶: ${featured ? "是" : "否"}`);
	console.log(`  排序: ${order}`);
	console.log(`════════════════════════════════════════\n`);

	rl.close();
}

main().catch((e) => {
	console.error("错误:", e);
	rl.close();
	process.exit(1);
});
