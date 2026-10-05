/**
 * 自用系列笔记：**不进 /posts/ 文章列表页、不进 RSS**（站长 2026-10-03 要求）。
 *
 * 值写分类文件夹路径（与 src/content/posts/<分类路径>/ 一致，支持多级），匹配按「路径段」：
 *   "Java笔记本"               → 命中 Java笔记本/xxx.md，不会误伤 Java笔记本2/
 *   "编程学习/JavaWeb学习笔记" → 命中该文件夹及其子文件夹下的全部文章
 *
 * ⚠️ 只影响三处调用点（都调了 utils/content-utils 的 excludeHiddenNotes）：
 *     src/pages/posts/[...page].astro（文章列表页）
 *     src/pages/rss.xml.ts、src/pages/rss.astro（RSS 与它的预览页）
 *    **分类详情页 /categories/... 照常显示这些笔记**；首页、归档、搜索、统计、sitemap 都不受影响。
 *    想连首页/归档一起隐藏，就在对应页面的调用点加一次 excludeHiddenNotes 即可。
 *
 * 以后想增删：在这个数组里加/删一行。
 */
export const notesHiddenFromLists: string[] = [
	"编程学习/JavaWeb学习笔记", // 113 篇
	"编程学习/Python学习笔记", // 68 篇
	"编程学习/LangChain学习笔记", // 25 篇
	"编程学习/MySQL学习笔记", // 17 篇
	"编程学习/JavaWebAI", // 49 篇
	"Java笔记本", // 13 篇
	"学习路线", // 2 篇（站长 2026-10-03 追加）
];

/**
 * 归一化：去反斜杠、去 md/mdx 扩展名、小写、空格转连字符 ——
 * 与 src/utils/category-tree.ts 的 normalizeCategory 保持同一套规则
 * （Astro 生成 entry id 时会把大写转小写、空格转连字符，配置里写正常写法即可）。
 */
function normalize(idOrFolder: string): string {
	return idOrFolder
		.replace(/\\/g, "/")
		.replace(/\.(md|mdx)$/i, "")
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^\/+|\/+$/g, "");
}

/** 某篇文章（entry id）是否属于「不进列表」的文件夹 */
export function isHiddenFromLists(id: string): boolean {
	const target = normalize(id);
	return notesHiddenFromLists.some((folder) => {
		const prefix = normalize(folder);
		return target === prefix || target.startsWith(prefix + "/");
	});
}
