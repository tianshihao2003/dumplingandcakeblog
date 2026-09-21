import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	buildCategoryTree,
	type CategoryNode,
	getCategoryFromId,
} from "@utils/category-tree";
import { getCategoryUrl, getTagUrl } from "@utils/url-utils";

type SortableEntry = {
	id: string;
	order?: number | undefined;
};

// 未写 order 的文章排在同目录末尾（order 降序，故用负无穷表示最小）
function resolveOrder(order?: number): number {
	return order ?? Number.NEGATIVE_INFINITY;
}

/**
 * 同日期内两条文章的比较：先按目录（文件夹路径）分组，组内 order 降序，组间按目录名。
 *
 * order 与日期同向（都是大的在前），因此跨日期分组的系列序号能连续递减、不会跳号
 * （如 68→51 接 50→42 接 41→27）。
 * 组间不能用「组内最大 order」比较——那样不满足传递性，排序结果会依赖比较顺序。
 * 供按目录聚合的列表（左侧全站文章目录）复用相同的组内规则。
 */
export function compareInSameDate(a: SortableEntry, b: SortableEntry): number {
	const folderA = getCategoryFromId(a.id);
	const folderB = getCategoryFromId(b.id);
	if (folderA !== folderB) return folderA.localeCompare(folderB, "zh-CN");
	return resolveOrder(b.order) - resolveOrder(a.order);
}

/**
 * 文章统一排序规则（唯一真相源）：
 * 置顶优先 → 发布日期降序 → 同日期内按目录分组，组内 order 降序（未写的排该组末尾）
 *
 * 分类页、文章列表页、左侧全站文章目录共用此函数，不要在调用处另写排序。
 */
export function comparePostsByOrderAndDate(
	a: {
		id: string;
		data: { published: Date; order?: number | undefined; pinned?: boolean };
	},
	b: {
		id: string;
		data: { published: Date; order?: number | undefined; pinned?: boolean };
	},
): number {
	if (a.data.pinned && !b.data.pinned) return -1;
	if (!a.data.pinned && b.data.pinned) return 1;

	const dateA = new Date(a.data.published).getTime();
	const dateB = new Date(b.data.published).getTime();
	if (dateA !== dateB) return dateB - dateA;

	return compareInSameDate(
		{ id: a.id, order: a.data.order },
		{ id: b.id, order: b.data.order },
	);
}

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort(comparePostsByOrderAndDate);
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	id: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
	}));

	return sortedPostsList;
}

export type ArchiveItem = {
	id: string;
	type: "post" | "moment" | "bangumi" | "life";
	data: {
		title: string;
		published: Date;
		tags: string[];
		category?: string | null;
		image?: string;
		link?: string;
		order?: number | undefined;
	};
};

// 辅助函数
const isIn = (entryId: string, folder: string) =>
	entryId.replace(/\\/g, "/").startsWith(`${folder}/`);

export async function getArchiveList(): Promise<ArchiveItem[]> {
	const posts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const moments = await getCollection("moments");
	const bangumi = await getCollection("bangumi");
	const lifeEntries = await getCollection("life");
	const notebooksEntries = await getCollection("notebooks");
	const postItems: ArchiveItem[] = posts.map((post) => ({
		id: post.id,
		type: "post",
		data: {
			title: post.data.title,
			published: post.data.published,
			tags: post.data.tags,
			category: getCategoryFromId(post.id) || null,
			order: post.data.order,
		},
	}));

	const momentItems: ArchiveItem[] = moments.map((moment) => {
		// 提取摘要作为标题
		let title = moment.body || "";
		title = title.replace(/[#*`]/g, "").trim(); // 移除 markdown 符号
		if (title.length > 50) title = `${title.substring(0, 50)}...`;
		if (!title) title = i18n(I18nKey.moments) || "日常动态";

		return {
			id: moment.id,
			type: "moment",
			data: {
				title: title,
				published: moment.data.published,
				tags: moment.data.tags,
				category: null,
			},
		};
	});

	const bangumiItems: ArchiveItem[] = bangumi.map((b) => {
		let link = b.data.link || "";
		if (!link) {
			const slug = b.id
				.replace(/\\/g, "/")
				.replace(/\.(md|mdx|markdown)$/i, "");
			if (b.data.category === "book") {
				link = `/books/${slug}/`;
			} else if (b.data.category === "music") {
				link = "/music/";
			} else {
				link = "/movies-games/";
			}
		}
		return {
			id: b.id,
			type: "bangumi",
			data: {
				title: b.data.title,
				published: b.data.published || new Date(0),
				tags: [],
				category: null,
				image:
					typeof b.data.image === "string" ? b.data.image : b.data.image.src,
				link,
			},
		};
	});

	// 生活动态归档
	const lifeItems: ArchiveItem[] = [];

	// 足迹记录
	lifeEntries
		.filter((entry) => isIn(entry.id, "places"))
		.forEach((p) => {
			const parts = [p.data.province, p.data.city].filter(Boolean);
			lifeItems.push({
				id: p.id,
				type: "life",
				data: {
					title: parts.length > 0 ? parts.join(" ") : "足迹记录",
					published: p.data.date || new Date(),
					tags: ["足迹"],
					link: "/life/places/",
				},
			});
		});

	// 笔记本记录（排除 _index 元数据条目）
	notebooksEntries
		.filter((n) => !n.id.includes("_index"))
		.forEach((n) => {
			lifeItems.push({
				id: n.id,
				type: "life",
				data: {
					title: n.data.name || "笔记本",
					published: n.data.date || new Date(),
					tags: ["笔记本"],
					link: "/life/notebooks/",
				},
			});
		});

	return [...postItems, ...momentItems, ...bangumiItems, ...lifeItems].sort(
		(a, b) => {
			const timeA = a.data.published.getTime();
			const timeB = b.data.published.getTime();
			if (timeA !== timeB) return timeB - timeA;
			// 同一天发布的文章沿用统一排序（按目录分组、组内 order 降序）
			return compareInSameDate(
				{ id: a.id, order: a.data.order },
				{ id: b.id, order: b.data.order },
			);
		},
	);
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const allMoments = await getCollection("moments");

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	allMoments.forEach((moment: { data: { tags: string[] } }) => {
		if (Array.isArray(moment.data.tags)) {
			moment.data.tags.forEach((tag: string) => {
				if (!countMap[tag]) countMap[tag] = 0;
				countMap[tag]++;
			});
		}
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	const uncategorized = i18n(I18nKey.uncategorized);
	for (const post of allBlogPosts as unknown as { id: string }[]) {
		const full = getCategoryFromId((post as { id: string }).id);
		if (!full) {
			count[uncategorized] = (count[uncategorized] ?? 0) + 1;
			continue;
		}
		const parts = full.split("/");
		for (let i = 1; i <= parts.length; i++) {
			const pref = parts.slice(0, i).join("/");
			count[pref] = (count[pref] ?? 0) + 1;
		}
	}

	const lst = Object.keys(count).sort((a, b) => {
		return (
			count[b] - count[a] || a.toLowerCase().localeCompare(b.toLowerCase())
		);
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const postsForTree = (
		allBlogPosts as unknown as { id: string; data: { tags: string[] } }[]
	).map((p) => ({
		id: p.id,
		tags: p.data.tags ?? [],
	}));
	return buildCategoryTree(postsForTree);
}

export type CategoryTag = {
	name: string;
	count: number;
	url: string;
};

export type CategoryTagGroup = Category & {
	tags: CategoryTag[];
};

export async function getCategoryTagGroups(): Promise<CategoryTagGroup[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const groupMap = new Map<
		string,
		{ count: number; tagCounts: Map<string, number> }
	>();
	const uncategorized = i18n(I18nKey.uncategorized);

	for (const post of allBlogPosts as unknown as {
		id: string;
		data: { tags: string[] };
	}[]) {
		const categoryName = getCategoryFromId(post.id) || uncategorized;
		const group = groupMap.get(categoryName) ?? {
			count: 0,
			tagCounts: new Map<string, number>(),
		};

		group.count++;
		const postTags = new Set(
			(post.data.tags ?? []).map((tag: string) => tag.trim()).filter(Boolean),
		);
		for (const tag of postTags) {
			group.tagCounts.set(tag, (group.tagCounts.get(tag) ?? 0) + 1);
		}
		groupMap.set(categoryName, group);
	}

	return [...groupMap.entries()]
		.map(([name, group]) => ({
			name,
			count: group.count,
			url: getCategoryUrl(name),
			tags: [...group.tagCounts.entries()]
				.map(([tagName, count]) => ({
					name: tagName,
					count,
					url: getTagUrl(tagName),
				}))
				.sort(
					(a, b) =>
						b.count - a.count ||
						a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
				),
		}))
		.sort(
			(a, b) =>
				b.count - a.count ||
				a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
		);
}
