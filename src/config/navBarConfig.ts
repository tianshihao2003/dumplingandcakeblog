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

		// 文章（带下拉子菜单：文章列表 → 图谱 → 归档）
		{
			name: "文章",
			url: "/posts/",
			icon: "material-symbols:article",
			children: [
				// 文章列表
				LinkPreset.Posts,

				// 知识图谱（原「分类」三视图页已被 /categories/ 的四层图谱取代）
				...(siteConfig.pages.categories
					? [
							{
								name: "图谱",
								url: "/categories/",
								icon: "material-symbols:hub-outline",
							},
						]
					: []),

				// 归档
				LinkPreset.Archive,
			],
		},

		// 分类（下拉里的各项在构建时从文章目录自动生成，见 utils/nav-categories.ts；
		// 这里只放按钮本身，新加分类文件夹后无需改本文件）
		...(siteConfig.pages.categories
			? [
					{
						name: "分类",
						url: "/categories/",
						icon: "material-symbols:folder-outline",
						dynamicSource: "post-categories" as const,
					},
				]
			: []),
	];

	// 动态（带下拉子菜单）
	links.push({
		name: "动态",
		url: "/moments/",
		icon: "material-symbols:local-cafe",
		children: [
			{
				name: "闪念",
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

/**
 * 导航栏「分类」下拉的生成规则。
 * 分类列表本身来自文章目录（src/content/文章/<分类>/），这里只控制「怎么显示」。
 * 外观沿用站内其它下拉（白底描边卡片），只有排列是多列网格。
 */
export const navCategoryConfig: {
	showCount: boolean;
	exclude: readonly string[];
} = {
	/** 下拉项右侧显示文章数（网格卡片上默认不显示） */
	showCount: false,
	/**
	 * 不展示的分类（写分类文件夹路径，多级用 /，按路径段前缀匹配）：
	 * "已弃用" → 连同其子文件夹一起隐藏，但 /categories/已弃用/ 页面本身仍可访问。
	 */
	exclude: ["已弃用"],
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
