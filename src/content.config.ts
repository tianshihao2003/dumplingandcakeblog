import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const publicOrRemoteImage = z.string().refine((value) => {
	return (
		value.startsWith("/") ||
		value.startsWith("http://") ||
		value.startsWith("https://") ||
		value.startsWith("data:")
	);
});

const postsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		// category 已废弃：改由文件夹路径自动推导（src/utils/category-tree.ts#getCategoryFromId），历史 frontmatter 中的 category 将被迁移脚本移除
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		author: z.string().optional().default(""),
		sourceLink: z.string().optional().default(""),
		licenseName: z.string().optional().default(""),
		licenseUrl: z.string().optional().default(""),
		comment: z.boolean().optional().default(true),
		order: z.number().optional().default(0),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const specCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({}),
});

const momentsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/moments" }),
	schema: ({ image }) =>
		z.object({
			id: z.string().optional().default(""),
			author: z.string().optional().default("团子和蛋糕"),
			avatar: z.string().optional().default("/assets/ziyuan/tx.webp"),
			pinned: z.boolean().optional().default(false),
			published: z.date(),
			images: z
				.array(image().or(z.string()))
				.or(z.string())
				.optional()
				.default([]),
			tags: z.array(z.string()).optional().default([]),
			location: z.string().optional().default(""),
			device: z.string().optional().default(""),
		}),
});

const bangumiCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx,yaml,yml}",
		base: "./src/content/bangumi",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			name_cn: z.string().optional(),
			category: z
				.enum(["book", "anime", "music", "game", "real"])
				.default("anime"),
			subcategory: z.enum(["movie", "tv", "anime", "documentary"]).optional(),
			status: z.number().min(1).max(5).default(2), // 1: 想看, 2: 看过, 3: 在看, 4: 搁置, 5: 抛弃
			image: image().or(z.string()),
			link: z.string().optional(), // 对应文章的链接；为空时自动从文件路径推导
			score: z.number().min(0).max(10).optional(),
			comment: z.string().optional(),
			tags: z.array(z.string()).optional().default([]),
			published: z.date().optional(),
			// Music-specific fields
			artist: z.string().optional(),
			audioUrl: z.string().optional(),
			lrcUrl: z.string().optional(),
			metingServer: z.string().optional(),
			metingId: z.string().optional(),
		}),
});

const lifeCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/life" }),
	schema: z.object({
		label: z.string().optional().default(""),
		value: z.string().optional().default(""),
		title: z.string().optional().default(""),
		description: z.string().optional().default(""),
		date: z.coerce.date().optional(),
		createdAt: z.coerce.date().optional(),
		completedAt: z.coerce.date().optional(),
		content: z.string().optional().default(""),
		status: z.enum(["done", "todo"]).optional(),

		// Notebook
		name: z.string().optional().default(""),
		cover: z.string().optional().default(""),
		summary: z.string().optional().default(""),
		entries: z.number().optional().default(0),
		updatedAt: z.union([z.string(), z.date()]).optional(),
		tags: z.array(z.string()).optional().default([]),

		// Plan
		planName: z.string().optional().default(""),
		targetDesc: z.string().optional().default(""),
		dailyTarget: z.number().optional().default(1),
		monthlyTarget: z.number().optional().default(20),
		checkins: z.array(z.coerce.date()).optional().default([]),

		// Place
		id: z.string().optional().default(""),
		province: z.string().optional().default(""),
		city: z.string().optional().default(""),
		experience: z.string().optional().default(""),
		visitCount: z.number().optional().default(1),
		lat: z.number().optional(),
		lng: z.number().optional(),
		url: z.string().optional().default(""),
		urlLabel: z.string().optional().default(""),
		photos: z.array(z.string()).optional().default([]),

		// Legacy fields (keep compatibility with existing data)
		waterCups: z.number().optional(),
		meals: z
			.array(z.object({ name: z.string(), value: z.string() }))
			.optional()
			.default([]),
		streak: z.number().optional().default(0),
		progress: z.number().min(0).max(100).optional().default(0),
	}),
});

const notebooksCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,json}",
		base: "./src/content/life/notebooks",
	}),
	schema: z.object({
		name: z.string().optional().default("未命名日记本"),
		cover: z.string().optional().default(""),
		summary: z.string().optional().default(""),
		// 新字段：对齐动态 images，支持 string|string[]（逗号/分号分隔的字符串也会在页面层归一为数组）
		images: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.default(""),
		// 兼容旧 image 字段：存量数据未迁移时仍可读取
		image: z
			.union([z.string(), z.array(z.string())])
			.optional()
			.default(""),
		tags: z.array(z.string()).optional().default([]),
		date: z.coerce.date().optional(),
	}),
});

const albumCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx,json}", base: "./src/content/album" }),
	schema: ({ image }) => {
		const albumImage = publicOrRemoteImage.or(image()).or(z.string());

		return z.object({
			title: z.string(),
			subtitle: z.string().optional().default(""),
			cover: albumImage.optional(),
			date: z.coerce.date(),
			location: z.string().optional().default(""),
			photos: z
				.array(
					albumImage.or(
						z.object({
							src: z.string(),
							alt: z.string().optional(),
							caption: z.string().optional(),
						}),
					),
				)
				.optional()
				.default([]),
			tags: z.array(z.string()).optional().default([]),
			draft: z.boolean().optional().default(false),
			// 图床文件夹路径，设置后从 CloudFlare ImgBed 动态加载图片
			imgbedFolder: z.string().optional().default(""),
		});
	},
});

const ziyuanCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/ziyuan" }),
	schema: z.union([
		z.object({
			title: z.string(),
			content: z.string(),
			closable: z.boolean().optional().default(true),
			link: z
				.object({
					enable: z.boolean().optional().default(true),
					text: z.string(),
					url: z.string(),
					external: z.boolean().optional().default(false),
				})
				.optional(),
			quotes: z.undefined().optional(),
		}),
		z.object({
			title: z.string(),
			quotes: z.array(
				z.object({
					text: z.string(),
					author: z.string(),
				}),
			),
			content: z.undefined().optional(),
			closable: z.undefined().optional(),
			link: z.undefined().optional(),
		}),
	]),
});

const friendsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/friends" }),
	schema: z.object({
		title: z.string(),
		imgurl: z.string(),
		desc: z.string(),
		siteurl: z.string(),
		tags: z.array(z.string()).optional().default([]),
		weight: z.number().optional().default(0),
		enabled: z.boolean().optional().default(true),
		added: z.date().optional(),
		group: z.enum(["friend", "other"]).optional().default("other"),
	}),
});

const appsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/apps" }),
	schema: z.object({
		title: z.string(),
		imgurl: z.string(),
		desc: z.string(),
		siteurl: z.string(),
		tags: z.array(z.string()).optional().default([]),
		weight: z.number().optional().default(0),
		enabled: z.boolean().optional().default(true),
	}),
});

const tombstonesCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/tombstones" }),
	schema: z.object({
		title: z.string(),
		avatar: z.string().optional(),
		note: z.string().optional(),
	}),
});

const daohangCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/daohang" }),
	schema: z.object({
		name: z.string(),
		url: z.string(),
		icon: z.string().optional().default(""),
		description: z.string().optional().default(""),
		category: z.string().default("未分类"),
		tags: z.array(z.string()).optional().default([]),
		color: z.string().optional().default(""),
		image: z.string().optional().default(""),
		featured: z.boolean().optional().default(false),
		order: z.number().optional().default(0),
	}),
});

const billsCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/bills" }),
	schema: z.object({
		title: z.string().optional().default(""),
		amount: z.number(),
		type: z.enum(["income", "expense"]).default("expense"),
		category: z.string().default("其他"),
		account: z.string().default("其他"),
		date: z.coerce.date(),
		description: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
	}),
});

const schedulesCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/schedules" }),
	schema: z
		.object({
			title: z.string(),
			date: z.coerce.date().optional(),
			endDate: z.coerce.date().optional(),
			allDay: z.boolean().optional().default(false),
			priority: z.enum(["none", "low", "medium", "high"]).default("none"),
			status: z.enum(["todo", "done", "cancelled"]).default("todo"),
			location: z.string().optional().default(""),
			repeat: z.string().optional().default(""),
			category: z
				.enum(["schedule", "birthday", "anniversary", "holiday"])
				.optional()
				.default("schedule"),
			person: z.string().optional().default(""),
			isLunar: z.boolean().optional().default(false),
			lunarMonth: z.number().int().min(1).max(12).optional(),
			lunarDay: z.number().int().min(1).max(30).optional(),
			lunarLeap: z.boolean().optional().default(false),
		})
		.superRefine((data, ctx) => {
			if (!data.isLunar && !data.date) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "非农历需填 date",
					path: ["date"],
				});
			}
			if (data.isLunar && (!data.lunarMonth || !data.lunarDay)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "农历需填 lunarMonth/lunarDay",
					path: ["lunarMonth"],
				});
			}
		}),
});

const changelogCollection = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
	schema: z.object({
		version: z.string(),
		date: z.date(),
		time: z.string().optional(),
		type: z.enum(["feature", "improvement", "fix", "removal"]),
		description: z.string(),
	}),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	moments: momentsCollection,
	bangumi: bangumiCollection,
	life: lifeCollection,
	notebooks: notebooksCollection,
	album: albumCollection,
	daohang: daohangCollection,
	ziyuan: ziyuanCollection,
	friends: friendsCollection,
	apps: appsCollection,
	changelog: changelogCollection,
	tombstones: tombstonesCollection,
	bills: billsCollection,
	schedules: schedulesCollection,
};
