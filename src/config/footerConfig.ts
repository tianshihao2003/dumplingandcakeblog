import type { FooterConfig } from "../types/config";

/**
 * 手绘 Doodle Crew 页脚的全部内容。
 * 巨型字用 4–9 个大写字母最好看；角色 letter 是巨型字里的字母下标（从 0 开始）。
 */
export const footerConfig: FooterConfig = {
	wordmark: "DUMPLING",
	brand: "团子和蛋糕",
	blurb: "技术分享、生活记录，以及一些没什么用但很开心的小玩意。",
	tagline: "记录技术，也记录生活里那些值得留下的瞬间。",

	columns: [
		{
			title: "内容",
			links: [
				{ label: "文章", href: "/posts/" },
				{ label: "归档", href: "/archive/" },
				{ label: "图谱", href: "/categories/" },
				{ label: "动态", href: "/moments/" },
			],
		},
		{
			title: "记录",
			links: [
				{ label: "书架", href: "/books/" },
				{ label: "影视与游戏", href: "/movies-games/" },
				{ label: "相册", href: "/album/" },
				{ label: "足迹", href: "/life/places/" },
			],
		},
		{
			title: "关于",
			links: [
				{ label: "关于", href: "/about/" },
				{ label: "友链", href: "/friends/" },
				{ label: "赞助", href: "/sponsor/" },
				{ label: "更新日志", href: "/changelog/" },
			],
		},
		{
			title: "更多",
			links: [
				{ label: "导航", href: "/projects/" },
				{ label: "留言板", href: "/guestbook/" },
				{ label: "搜索", href: "/search/" },
				{ label: "RSS", href: "/rss.xml", noSwup: true },
			],
		},
	],

	actions: [
		{
			label: "开始阅读",
			href: "/posts/",
			icon: "bolt",
			variant: "solid",
		},
		{
			label: "RSS 订阅",
			href: "/rss.xml",
			icon: "star",
			variant: "outline",
			noSwup: true,
		},
	],

	copyright: "Copyright © 2025-2026 团子和蛋糕 保留版权所有.",

	legal: [
		{
			label: "豫ICP备2025145348号-1",
			href: "https://beian.miit.gov.cn",
			external: true,
			rel: "nofollow noopener",
		},
		{
			label: "豫公网安备41018402000785号",
			href: "https://beian.mps.gov.cn/#/query/webSearch?code=41018402000785",
			external: true,
			rel: "noreferrer noopener",
		},
	],

	socials: [
		{
			label: "GitHub",
			href: "https://github.com/tianshihao2003",
			external: true,
		},
		{
			label: "Bilibili",
			href: "https://space.bilibili.com/1394731616",
			external: true,
		},
		{ label: "邮箱", href: "mailto:3109581507@qq.com" },
	],

	crew: [
		{
			kind: "yeti",
			letter: 0,
			seat: "front",
			offset: -0.32,
			name: "团子",
			says: "饿。有吃的吗？",
		},
		{
			kind: "bird",
			letter: 1,
			seat: "top",
			offset: 0.02,
			name: "啾啾",
			says: "记得常来！",
		},
		{
			kind: "mushroom",
			letter: 2,
			seat: "front",
			offset: 0.12,
			scale: 0.95,
			name: "小菇",
			says: "我很好相处（菌）的。",
		},
		{
			kind: "kid",
			letter: 4,
			seat: "top",
			offset: -0.05,
			name: "小满",
			says: "上面风景最好！",
		},
		{
			kind: "ghost",
			letter: 6,
			seat: "behind",
			offset: 0,
			name: "阿飘",
			says: "哇！……不好意思，你好。",
		},
		{
			kind: "cat",
			letter: 7,
			seat: "front",
			offset: 0.42,
			flip: true,
			name: "蛋糕",
			says: "喵。光标不错。",
		},
	],

	doodles: [
		"flame",
		"sandwich",
		"star",
		"flame",
		"heart",
		"sandwich",
		"bolt",
		"sparkle",
	],
	doodleCount: 12,
	serifFamily:
		'"Iowan Old Style", "Palatino Linotype", Palatino, "LXGW WenKai", "Songti SC", "Noto Serif SC", "SimSun", Georgia, serif',
};
