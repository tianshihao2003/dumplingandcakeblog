import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 网站导航（页面在 /projects/）
		{
			name: "导航",
			url: "/projects/",
			icon: "material-symbols:public",
		},

		// 文章（带下拉子菜单）
		{
			name: "文章",
			url: "/posts/",
			icon: "material-symbols:article",
			children: [
				// 文章列表
				LinkPreset.Posts,

				// 文章分类
				{
					name: "分类",
					url: "/categories/",
					icon: "material-symbols:folder-open",
				},

				// 归档
				LinkPreset.Archive,
			],
		},
	];

	// 动态（带下拉子菜单）
	links.push({
		name: "动态",
		url: "/moments/",
		icon: "material-symbols:local-cafe",
		children: [
			{
				name: "说说",
				url: "/moments/",
				icon: "material-symbols:chat-bubble-outline",
			},
			{
				name: "相册",
				url: "/album/",
				icon: "material-symbols:photo-album-outline",
			},
			{
				name: "留言板",
				url: "/guestbook/",
				icon: "material-symbols:edit-outline",
			},
			{
				name: "笔记本",
				url: "/life/notebooks/",
				icon: "material-symbols:menu-book-outline",
			},
			// 朋友圈
			LinkPreset.Circle,
		],
	});

	// 记录入口 - 书架、影视与游戏、音乐、规划、足迹
	const recordChildren: (NavBarLink | LinkPreset)[] = [];
	if (siteConfig.pages.books) {
		recordChildren.push(LinkPreset.Books);
	}
	if (siteConfig.pages.moviesGames) {
		recordChildren.push(LinkPreset.MoviesGames);
	}
	// 音乐已移入「我的」分组，此处不再重复
	if (siteConfig.pages.changelog) {
		recordChildren.push(LinkPreset.Changelog);
	}
	// 足迹
	recordChildren.push({
		name: "足迹",
		url: "/life/places/",
		icon: "material-symbols:location-on",
	});
	if (recordChildren.length > 0) {
		const defaultUrl = siteConfig.pages.books
			? "/books/"
			: siteConfig.pages.moviesGames
				? "/movies-games/"
				: "/music/";

		links.push({
			name: "记录",
			url: defaultUrl,
			icon: "material-symbols:camera-outdoor",
			children: recordChildren,
		});
	}

	// 关于及其子菜单
	links.push({
		name: "关于",
		url: "/about/",
		icon: "material-symbols:info",
		children: [
			// 关于页面
			LinkPreset.About,

			// 友链
			LinkPreset.Friends,

			// QQ群
			{
				name: "QQ群",
				url: "https://qm.qq.com/q/FjkXxV9Hmo",
				icon: "material-symbols:group",
				external: true,
			},

			// 赞助
			...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []),
		],
	});

	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出。
	// （个人资料面板的「其他站点」列表不在这里维护：构建时直接读 daohang 集合里
	//  「我的网站」分类的条目，改 /projects/ 那边的站点即可，见 NavbarProfileCard.astro）
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
