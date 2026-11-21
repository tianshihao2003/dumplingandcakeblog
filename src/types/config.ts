import type {
	DARK_MODE,
	LIGHT_MODE,
	SYSTEM_MODE,
} from "../constants/constants";
import type { SidebarPageType } from "../utils/page-type";

export type SiteConfig = {
	title: string;
	subtitle: string;
	site_url: string;
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	// 站点语言。2026-10-20 起只保留简体中文：i18n 只有 zh_CN 一份翻译表，
	// 写别的值不会报错但界面仍是中文（日期格式会跟着 lang 变），所以类型直接收窄
	lang: "zh_CN";

	themeColor: {
		hue: number;
		fixed: boolean;
		defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
	};

	// 页面整体宽度（单位：rem）
	pageWidth?: number;

	// 卡片样式配置
	card: {
		// 是否开启卡片边框和阴影立体效果
		border: boolean;
	};

	// 字体配置
	font: FontConfig;

	// 站点开始日期，用于计算运行天数
	siteStartDate?: string; // 格式: "YYYY-MM-DD"

	// 门户区配置
	portal?: {
		// 公告跑马灯
		announcement?: {
			enable: boolean;
			text: string;
		};
		// 每日一言
		dailyQuote?: {
			enable: boolean;
			quotes: { text: string; source: string }[];
		};
		// 最近文章预览数量
		recentPostsCount?: number;
		// 最近说说预览数量
		recentMomentsCount?: number;
	};

	// 可选：站点时区，使用 IANA 时区标识，例如 "Asia/Shanghai"、"UTC"
	timezone?: string;
	workHours?: { start: number; end: number; workDays: number[] };

	// 提醒框配置
	rehypeCallouts: {
		theme: "github" | "obsidian" | "vitepress";
	};

	// 添加bangumi配置
	bangumi?: {
		userId?: string; // Bangumi用户ID
	};

	// 添加豆瓣配置
	douban?: {
		userId?: string; // 豆瓣用户ID
	};

	generateOgImages: boolean;
	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;

	navbar: {
		/** 导航栏Logo图标，可选类型：icon库、本地图片、网络图片链接 */
		logo?: {
			type: "icon" | "image" | "url";
			value: string; // icon名、本地图片路径或网络图片url
			alt?: string; // 图片alt文本
		};
		title?: string; // 导航栏标题，如果不设置则使用 title
		widthFull?: boolean; // 导航栏是否占满屏幕宽度
		followTheme?: boolean; // 导航栏图标和标题是否跟随主题色
		hoverTitle?: string; // 页面离开时显示的标题
	};

	showLastModified: boolean; // 控制"上次编辑"卡片显示的开关
	outdatedThreshold?: number; // 文章过期阈值（天数），超过此天数才显示"上次编辑"卡片
	sharePoster?: boolean; // 是否显示分享海报按钮

	// 页面开关配置
	pages: {
		sponsor: boolean; // 赞助页面开关
		guestbook: boolean; // 留言板页面开关
		bangumi: boolean;
		books: boolean; // 书架页面开关
		moviesGames: boolean; // 影视与游戏页面开关
		musicPage: boolean; // 音乐页面开关
		changelog: boolean; // 更新日志页面开关
		categories: boolean; // 分类图谱页面开关（/categories/）
	};

	// 分类导航栏开关
	categoryBar?: boolean;

	// 归档页统计配置
	archiveStats?: {
		annualPostGoal: number; // 年度文章目标
	};

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
		allowSwitch: boolean; // 是否允许用户切换布局
		grid: {
			// 网格布局配置，仅在 defaultMode 为 "grid" 或允许切换布局时生效
			// 是否开启瀑布流布局
			masonry: boolean;
			// 网格模式列数：2、3 或 4，默认为 2。注意：3/4列模式仅在单侧边栏（或无侧边栏）且屏幕宽度足够时生效
			columns?: 2 | 3 | 4;
		};
	};

	// 分页配置
	pagination: {
		postsPerPage: number; // 每页显示的文章数量
	};

	// 统计分析
	analytics?: {
		googleAnalyticsId?: string; // Google Analytics ID
		microsoftClarityId?: string; // Microsoft Clarity ID
		umamiAnalytics?: {
			websiteId: string; // Umami Website ID
			scriptUrl?: string; // Umami 脚本地址，默认 https://cloud.umami.is/script.js
			shareId?: string; // Umami 分享链接ID，用于前端实时拉取统计，无需暴露账号密码
		};
	};

	// 说说页面封面配置
	momentsCover?: {
		enable: boolean; // 是否显示封面区域
		image: string; // 封面图片URL
	};

	// 图片优化配置
	imageOptimization?: {
		/**
		 * 输出图片格式
		 * - "avif": 仅输出 AVIF 格式（最小体积，兼容性较低）
		 * - "webp": 仅输出 WebP 格式（体积适中，兼容性好）
		 * - "both": 同时输出 AVIF 和 WebP（推荐，浏览器自动选择最佳格式）
		 */
		formats?: "avif" | "webp" | "both";
		/**
		 * 图片压缩质量 (1-100)
		 * 值越低体积越小但质量越差，推荐 70-85
		 */
		quality?: number;
	};

	// 地图配置（支持 Leaflet 或高德地图）
	mapConfig?: {
		/**
		 * 高德地图 Web端 JS API Key（可选）
		 * 申请地址: https://console.amap.com/dev/key/app
		 * 如果未设置，将使用 Leaflet + OpenStreetMap（完全免费）
		 */
		amapKey?: string;
		/**
		 * 地图初始中心点 [经度, 纬度]
		 * 默认: [104.195, 35.861] (中国地理中心)
		 */
		center?: [number, number];
		/**
		 * 初始缩放级别
		 * 默认: 4
		 */
		zoom?: number;
		/**
		 * 最小缩放级别
		 * 默认: 3
		 */
		minZoom?: number;
		/**
		 * 最大缩放级别
		 * 默认: 18
		 */
		maxZoom?: number;
		/**
		 * 是否显示地图标记点
		 * 默认: true
		 */
		showMarkers?: boolean;
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Sponsor = 4,
	Guestbook = 5,
	Bangumi = 6,
	Books = 7,
	MoviesGames = 8,
	MusicPage = 9,
	Changelog = 10,
	Posts = 11,
	Circle = 12,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
	/**
	 * 动态数据源：导航渲染前由 Navbar / MobileMenuSheet 从内容目录实时填充 children。
	 * 目前只有 "post-categories"（文章分类），配置里只写按钮本身，不用手维护分类列表。
	 */
	dynamicSource?: "post-categories";
	/** 条目右侧的数量徽标（分类菜单里是文章数），由动态数据源填充 */
	count?: number;
	/** 子项层级，从 1 开始；仅用于「分类」下拉的缩进，不影响其它导航项 */
	depth?: number;
};

export enum NavBarSearchMethod {
	PageFind = 0,
}

export type NavBarSearchConfig = {
	method: NavBarSearchMethod;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

// HomePortfolioShutterPanel / HomePortfolioShutterInterlude /
// HomePortfolioShutterFinalImage / HomePortfolioShutterConfig /
// HomeDisplayLayerConfig 已于 2026-10-20 删除：
// 首页的全屏滚动展示层（HomeDisplayLayer：柱子展开 + 百叶窗 + 结尾大图/视频）
// 已下线，相关的百叶窗动画配置一并移除。
// 注意：「地图指南」数据层（HomeDataLayer）仍在，homeConfig.dataLayer 保留。

export type HeroDialogueLine = {
	/** 说话者：host=站长 / visitor=访客，默认 host。左上角名牌随之切换 */
	speaker?: "host" | "visitor";
	/** 台词文本（逐字打字机播放） */
	text: string;
};

export type HeroDialogueTopic = {
	/** 话题菜单标题，如「关于我」 */
	title: string;
	/** 该话题的逐句台词 */
	lines: HeroDialogueLine[];
};

export type HeroDialogueConfig = {
	/** 是否启用对话框；关闭则 Hero 不渲染对话框 */
	enabled?: boolean;
	/** 说话者名称 */
	speakers?: {
		host?: string;
		visitor?: string;
	};
	/** 默认展示的简介台词，逐句播放；末句后可打开话题菜单 */
	intro: HeroDialogueLine[];
	/** 话题列表；点击某话题进入其逐句台词，末句后返回菜单 */
	topics: HeroDialogueTopic[];
	/** 话题菜单提示语，默认「想聊点什么？」 */
	menuTitle?: string;
	/** 打字机速度（毫秒/字），默认 45 */
	typingSpeed?: number;
	/** 自动播放时每句停留时间（毫秒），默认 1600 */
	autoDelay?: number;
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	displayName?: string;
	occupation?: string;
	avatarOffWork?: string;
	bio?: string | string[];
	links: {
		name: string;
		url: string;
		icon: string;
		showName?: boolean;
	}[];
};

export type HomeConfig = {
	avatar?: string;
	avatarOnWork?: string;
	avatarOffWork?: string;
	name: string;
	displayName?: string;
	nameBadge?: string;
	occupation?: string;
	bio?: string | string[];
	hero: {
		backgroundImage: string;
		backgroundImageMobile?: string;
		backgroundImagePool?: string[];
		backgroundImageMobilePool?: string[];
		characterImage?: string;
		speechAccentImage: string;
		speech?: {
			text: string;
			english: string;
		};
		dialogue?: HeroDialogueConfig;
		rightPanel?: {
			pill: string;
			title: string;
			diamond: string;
			microText: string;
		};
		rain?: {
			enabled?: boolean;
			intensity?: number;
			color?: string;
		};
	};
	dataLayer: {
		visitImage: string;
		archiveImage: string;
		contactImage: string;
		skillsImage: string;
	};
	// displayLayer / portfolioShutter 已于 2026-10-20 随首页展示层组件删除
	skills?: {
		name: string;
		icon?: string;
		group?: string;
	}[];
	links: {
		name: string;
		url: string;
		icon: string;
		showName?: boolean;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};
// 评论配置

export type CommentConfig = {
	/**
	 * 当前启用的评论系统类型
	 * "none" | "twikoo" | "waline" | "giscus" | "disqus" | 'artalk'
	 */
	type: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk";
	twikoo?: {
		envId: string;
		region?: string;
		lang?: string;
		visitorCount?: boolean;
	};
	waline?: {
		serverURL: string;
		lang?: string;
		emoji?: string[];
		imageUploadURL?: string;
		login?: "enable" | "force" | "disable";
		visitorCount?: boolean; // 是否统计访问量，true 启用访问量，false 关闭
	};
	artalk?: {
		// 后端程序 API 地址
		server: string;
		/**
		 * 语言，支持语言如下：
		 * - "en" (English)
		 * - "zh-CN" (简体中文)
		 * - "zh-TW" (繁体中文)
		 * - "ja" (日本語)
		 * - "ko" (한국어)
		 * - "fr" (Français)
		 * - "ru" (Русский)
		 * */
		locale: string | "auto";
		// 是否统计访问量，true 启用访问量，false 关闭
		visitorCount?: boolean;
	};
	giscus?: {
		repo: string;
		repoId: string;
		category: string;
		categoryId: string;
		mapping: string;
		strict: string;
		reactionsEnabled: string;
		emitMetadata: string;
		inputPosition: string;
		lang: string;
		loading: string;
	};
	disqus?: {
		shortname: string;
	};
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof SYSTEM_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	/** @deprecated 使用 darkTheme 和 lightTheme 代替 */
	theme?: string;
	/** 暗色主题名称（用于暗色模式） */
	darkTheme: string;
	/** 亮色主题名称（用于亮色模式） */
	lightTheme: string;
	/** 代码块折叠插件配置 */
	pluginCollapsible?: PluginCollapsibleConfig;
};

export type PluginCollapsibleConfig = {
	enable: boolean; // 是否启用代码块折叠功能
	lineThreshold: number; // 触发折叠的行数阈值
	previewLines: number; // 折叠时显示的预览行数
	defaultCollapsed: boolean; // 默认是否折叠
};

export type AnnouncementConfig = {
	// enable属性已移除，现在通过sidebarLayoutConfig统一控制
	title?: string; // 公告栏标题
	content: string; // 公告栏内容
	icon?: string; // 公告栏图标
	type?: "info" | "warning" | "success" | "error"; // 公告类型
	closable?: boolean; // 是否可关闭
	link?: {
		enable: boolean; // 是否启用链接
		text: string; // 链接文字
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
};

// 单个字体配置
export type FontItem = {
	id: string; // 字体唯一标识符
	name: string; // 字体显示名称
	src: string; // 字体文件路径或URL链接
	family: string; // CSS font-family 名称
	weight?: string | number; // 字体粗细，如 "normal", "bold", 400, 700 等
	style?: "normal" | "italic" | "oblique"; // 字体样式
	display?: "auto" | "block" | "swap" | "fallback" | "optional"; // font-display 属性
	unicodeRange?: string; // Unicode 范围，用于字体子集化
	format?:
		| "woff"
		| "woff2"
		| "truetype"
		| "opentype"
		| "embedded-opentype"
		| "svg"; // 字体格式，仅当 src 为本地文件时需要
};

// 字体配置
export type FontConfig = {
	enable: boolean; // 是否启用自定义字体功能
	selected: string | string[]; // 当前选择的字体ID，支持单个或多个字体组合
	fonts: Record<string, FontItem>; // 字体库，以ID为键的对象
	fallback?: string[]; // 全局字体回退列表
	preload?: boolean; // 是否预加载字体文件以提高性能
};

// ===== 页脚（Doodle Crew）=====
export type Seat = "front" | "top" | "behind";

export type CrewKind = "yeti" | "kid" | "bird" | "cat" | "ghost" | "mushroom";

export type DoodleKind =
	| "flame"
	| "sandwich"
	| "star"
	| "heart"
	| "bolt"
	| "sparkle"
	| "spiral"
	| "plane";

export type FooterLink = {
	label: string;
	href?: string;
	external?: boolean;
	rel?: string;
	/** 非 HTML 资源（如 /rss.xml）加 data-no-swup，避免被 Swup 当页面接管 */
	noSwup?: boolean;
};

export type FooterColumn = {
	title: string;
	links: FooterLink[];
};

export type FooterAction = {
	label: string;
	href: string;
	icon?: DoodleKind;
	variant?: "solid" | "outline";
	external?: boolean;
	noSwup?: boolean;
};

export type CrewMember = {
	kind: CrewKind;
	/** 巨型字里的字母下标 */
	letter: number;
	seat?: Seat;
	/** 沿字母左右滑动，单位是字母宽度 */
	offset?: number;
	scale?: number;
	flip?: boolean;
	name?: string;
	says?: string;
};

export type FooterConfig = {
	/** 巨型字，短、大写、4–9 个字母最好看 */
	wordmark: string;
	brand: string;
	blurb?: string;
	tagline: string;
	columns: FooterColumn[];
	actions: FooterAction[];
	copyright: string;
	legal: FooterLink[];
	socials: FooterLink[];
	crew: CrewMember[];
	doodles: DoodleKind[];
	doodleCount: number;
	palette?: { background?: string; ink?: string; accent?: string };
	fontFamily?: string;
	serifFamily?: string;
	tracking?: number;
	interactive?: boolean;
};

export type CoverImageConfig = {
	enableInPost: boolean; // 是否在文章详情页显示封面图
	randomCoverImage: {
		enable: boolean; // 是否启用随机图功能
		apis: string[]; // 随机图API列表
		fallback?: string; // API失败时的回退图片路径（相对于src目录或以/开头的public目录路径）
		showLoading?: boolean; // 是否显示加载动画
	};
};

// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "postDirectory"
	| "advertisement"
	| "stats"
	| "calendar"
	| "music"
	| "relationship"
	| "recentItems"
	| "lifeStats"
	| "siteHeatmap"
	| "quoteOfTheDay"
	| "douyinHot"
	| "weather";

// 恋爱计时小组件配置
export type RelationshipConfig = {
	startDate: string; // 格式: "YYYY-MM-DD"
	name1: string;
	name2: string;
	avatar1: string;
	avatar2: string;
	title?: string;
};

export type WidgetComponentConfig = {
	type: WidgetComponentType; // 组件类型
	enable: boolean; // 是否启用该组件
	position: "top" | "sticky"; // 组件位置：top=固定在顶部，sticky=粘性定位（可滚动）
	configId?: string; // 配置ID，用于广告组件指定使用哪个配置
	showOnPostPage?: boolean; // 是否在文章详情页显示
	showOnNonPostPage?: boolean; // 是否在非文章详情页显示
	/** 只在列出的页面类型显示（白名单）；与 hideOnPages 互斥，同时配置时以本字段为准 */
	showOnPages?: SidebarPageType[];
	/** 在列出的页面类型不显示（黑名单） */
	hideOnPages?: SidebarPageType[];
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
};

export type MobileBottomComponentConfig = {
	type: WidgetComponentType; // 组件类型
	enable: boolean; // 是否启用该组件
	configId?: string; // 配置ID，用于广告组件指定使用哪个配置
	showOnPostPage?: boolean; // 是否在文章详情页显示
	showOnNonPostPage?: boolean; // 是否在非文章详情页显示
	/** 只在列出的页面类型显示（白名单）；与 hideOnPages 互斥，同时配置时以本字段为准 */
	showOnPages?: SidebarPageType[];
	/** 在列出的页面类型不显示（黑名单） */
	hideOnPages?: SidebarPageType[];
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
};

export type SidebarLayoutConfig = {
	enable: boolean; // 是否启用侧边栏
	position: "left" | "right" | "both"; // 侧边栏位置：左侧、右侧或双侧
	tabletSidebar?: "left" | "right"; // 平板端(769-1279px)显示哪侧侧边栏，仅position为both时生效，默认left
	showBothSidebarsOnPostPage?: boolean; // 当position为left或right时，是否在文章详情页显示双侧边栏
	leftComponents: WidgetComponentConfig[]; // 左侧边栏组件配置列表
	rightComponents: WidgetComponentConfig[]; // 右侧边栏组件配置列表
	mobileBottomComponents: MobileBottomComponentConfig[]; // 移动端底部组件配置列表（<768px显示）
};

export type SakuraConfig = {
	enable: boolean; // 是否启用樱花特效
	sakuraNum: number; // 樱花数量，默认21
	limitTimes: number; // 樱花越界限制次数，-1为无限循环
	size: {
		min: number; // 樱花最小尺寸倍数
		max: number; // 樱花最大尺寸倍数
	};
	opacity: {
		min: number; // 樱花最小不透明度
		max: number; // 樱花最大不透明度
	};
	speed: {
		horizontal: {
			min: number; // 水平移动速度最小值
			max: number; // 水平移动速度最大值
		};
		vertical: {
			min: number; // 垂直移动速度最小值
			max: number; // 垂直移动速度最大值
		};
		rotation: number; // 旋转速度
		fadeSpeed: number; // 消失速度，不应大于最小不透明度
	};
	zIndex: number; // 层级，确保樱花在合适的层级显示
};

// Spine 看板娘配置
export type SpineModelConfig = {
	enable: boolean; // 是否启用 Spine 看板娘
	model: {
		path: string; // 模型文件路径 (.json)
		scale?: number; // 模型缩放比例，默认1.0
		x?: number; // X轴偏移，默认0
		y?: number; // Y轴偏移，默认0
	};
	position: {
		corner: "bottom-left" | "bottom-right" | "top-left" | "top-right"; // 显示位置
		offsetX?: number; // 水平偏移量，默认20px
		offsetY?: number; // 垂直偏移量，默认20px
	};
	size: {
		width?: number; // 容器宽度，默认280px
		height?: number; // 容器高度，默认400px
	};
	interactive?: {
		enabled?: boolean; // 是否启用交互功能，默认true
		clickAnimations?: string[]; // 点击时随机播放的动画列表
		clickMessages?: string[]; // 点击时随机显示的文字消息
		messageDisplayTime?: number; // 文字显示时间（毫秒），默认3000
		idleAnimations?: string[]; // 待机动画列表
		idleInterval?: number; // 待机动画切换间隔（毫秒），默认10000
	};
	responsive?: {
		hideOnMobile?: boolean; // 是否在移动端隐藏，默认false
		mobileBreakpoint?: number; // 移动端断点，默认768px
	};
	zIndex?: number; // 层级，默认1000
	opacity?: number; // 透明度，0-1，默认1.0
};

// Live2D 看板娘配置
export type Live2DModelConfig = {
	enable: boolean; // 是否启用 Live2D 看板娘
	model: {
		path: string; // 模型文件夹路径或model3.json文件路径
	};
	position?: {
		corner?: "bottom-left" | "bottom-right" | "top-left" | "top-right"; // 显示位置，默认bottom-right
		offsetX?: number; // 水平偏移量，默认20px
		offsetY?: number; // 垂直偏移量，默认20px
	};
	size?: {
		width?: number; // 容器宽度，默认280px
		height?: number; // 容器高度，默认250px
	};
	interactive?: {
		enabled?: boolean; // 是否启用交互功能，默认true
		// motions 和 expressions 将从模型 JSON 文件中自动读取
		clickMessages?: string[]; // 点击时随机显示的文字消息
		messageDisplayTime?: number; // 文字显示时间（毫秒），默认3000
	};
	responsive?: {
		hideOnMobile?: boolean; // 是否在移动端隐藏，默认false
		mobileBreakpoint?: number; // 移动端断点，默认768px
	};
};

export type BackgroundWallpaperConfig = {
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片

	// Banner模式特有配置
	banner?: {
		position?:
			| "top"
			| "center"
			| "bottom"
			| "top left"
			| "top center"
			| "top right"
			| "center left"
			| "center center"
			| "center right"
			| "bottom left"
			| "bottom center"
			| "bottom right"
			| "left top"
			| "left center"
			| "left bottom"
			| "right top"
			| "right center"
			| "right bottom"
			| string; // 壁纸位置，支持CSS object-position的所有值，包括百分比和像素值
		homeText?: {
			enable: boolean; // 是否在首页显示自定义文字（全局开关）
			switchable?: boolean; // 是否允许用户通过控制面板切换横幅标题显示
			title?: string; // 主标题
			subtitle?: string | string[]; // 副标题，支持单个字符串或字符串数组
			titleSize?: string; // 主标题字体大小，如 "3.5rem"
			subtitleSize?: string; // 副标题字体大小，如 "1.5rem"
			typewriter?: {
				enable: boolean; // 是否启用打字机效果
				speed: number; // 打字速度（毫秒）
				deleteSpeed: number; // 删除速度（毫秒）
				pauseTime: number; // 完整显示后的暂停时间（毫秒）
			};
		};
		credit?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 桌面端是否显示横幅图片来源文本
						mobile: boolean; // 移动端是否显示横幅图片来源文本
				  }; // 是否显示横幅图片来源文本，支持布尔值或分别设置桌面端和移动端
			text:
				| string
				| {
						desktop: string; // 桌面端显示的来源文本
						mobile: string; // 移动端显示的来源文本
				  }; // 横幅图片来源文本，支持字符串或分别设置桌面端和移动端
			url?:
				| string
				| {
						desktop: string; // 桌面端原始艺术品或艺术家页面的 URL 链接
						mobile: string; // 移动端原始艺术品或艺术家页面的 URL 链接
				  }; // 原始艺术品或艺术家页面的 URL 链接，支持字符串或分别设置桌面端和移动端
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 导航栏透明模式
			enableBlur?: boolean; // 是否开启毛玻璃模糊效果
			blur?: number; // 毛玻璃模糊度
		};
		waves?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 桌面端是否启用水波纹动画效果
						mobile: boolean; // 移动端是否启用水波纹动画效果
				  }; // 是否启用水波纹动画效果，支持布尔值或分别设置桌面端和移动端
			switchable?: boolean; // 是否允许用户通过控制面板切换水波纹动画
		};
	};
};

// 广告栏配置
export type AdConfig = {
	title?: string; // 广告栏标题
	content?: string; // 广告栏文本内容
	image?: {
		src: string; // 图片地址
		alt?: string; // 图片描述
		link?: string; // 图片点击链接
		external?: boolean; // 是否外部链接
	};
	link?: {
		text: string; // 链接文本
		url: string; // 链接地址
		external?: boolean; // 是否外部链接
	};
	padding?: {
		top?: string; // 上边距，如 "0", "1rem", "16px"
		right?: string; // 右边距
		bottom?: string; // 下边距
		left?: string; // 左边距
		all?: string; // 统一边距，会覆盖单独设置
	};
	closable?: boolean; // 是否可关闭
	displayCount?: number; // 显示次数限制，-1为无限制
	expireDate?: string; // 过期时间 (ISO 8601 格式)
};

// 友链配置
export type FriendLink = {
	title: string; // 友链标题
	imgurl: string; // 头像图片URL
	desc: string; // 友链描述
	siteurl: string; // 友链地址
	tags?: string[]; // 标签数组
	weight: number; // 权重，数字越大排序越靠前
	enabled: boolean; // 是否启用
};

export type FriendsPageConfig = {
	columns: 2 | 3; // 显示列数：2列或3列
};

// 音乐播放器配置
export type MusicPlayerConfig = {
	// 使用方式：'meting' 或 'local'
	mode?: "meting" | "local"; // "meting" 使用 Meting API，"local" 使用本地音乐列表

	// 默认音量 (0-1)
	volume?: number;

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode?: "list" | "one" | "random";

	// 是否显示歌词
	showLyrics?: boolean;

	// 是否在导航栏显示音乐播放器
	showInNavbar?: boolean;

	// Meting API 配置
	meting?: {
		// Meting API 地址
		api?: string;

		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server?: "netease" | "tencent" | "kugou" | "xiami" | "baidu";

		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type?: "song" | "playlist" | "album" | "search" | "artist";

		// 歌单/专辑/单曲 ID 或搜索关键词
		id?: string;

		// 认证 token（可选）
		auth?: string;

		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis?: string[];
	};

	// 本地音乐配置（当 mode 为 'local' 时使用）
	local?: {
		playlist?: Array<{
			name: string; // 歌曲名称
			artist: string; // 艺术家
			url: string; // 音乐文件路径（相对于 public 目录）
			cover?: string; // 封面图片路径（相对于 public 目录）
			lrc?: string; // 歌词内容，支持 LRC 格式
		}>;
	};

	// 3D 可视化器配置
	visualizer?: MusicVisualizerConfig;
};

// 3D 可视化器主题配置
export type MusicVisualizerThemeConfig = {
	base1: string;
	base2: string;
	coolCore: string;
	coolEdge: string;
	warmCore: string;
	warmEdge: string;
	rippleColor: string;
	fogColor: string;
	glowIntensity: number;
};

// 3D 可视化器地形高度配置
export type MusicVisualizerHeightConfig = {
	idle: number;
	subBass: number;
	bass: number;
	lowMid: number;
	mid: number;
	highMid: number;
	energy: number;
	ripple: number;
	rippleAccent: number;
};

// 3D 可视化器配置
export type MusicVisualizerConfig = {
	background?: {
		dark: string;
		light: string;
	};
	camera?: {
		position?: {
			x: number;
			y: number;
			z: number;
		};
	};
	autoRotate?: boolean;
	autoRotateSpeed?: number;
	height?: MusicVisualizerHeightConfig;
	theme?: MusicVisualizerThemeConfig;
};

// 赞助方式类型
export type SponsorMethod = {
	name: string; // 赞助方式名称，如 "支付宝"、"微信"、"PayPal"
	icon?: string; // 图标名称（Iconify 格式），如 "fa7-brands:alipay"
	qrCode?: string; // 收款码图片路径（相对于 public 目录），可选
	link?: string; // 赞助链接 URL，可选。如果提供，会显示跳转按钮
	description?: string; // 描述文本
	enabled: boolean; // 是否启用
};

// 赞助者列表项
export type SponsorItem = {
	name: string; // 赞助者名称，如果想显示匿名，可以直接设置为"匿名"或使用 i18n
	amount?: string; // 赞助金额（可选）
	date?: string; // 赞助日期（可选，ISO 格式）
	message?: string; // 留言（可选）
};

// 赞助配置
export type SponsorConfig = {
	title?: string; // 页面标题，默认使用 i18n
	description?: string; // 页面描述文本
	usage?: string; // 赞助用途说明
	methods: SponsorMethod[]; // 赞助方式列表
	sponsors?: SponsorItem[]; // 赞助者列表（可选）
	showSponsorsList?: boolean; // 是否显示赞助者列表，默认 true
	showButtonInPost?: boolean; // 是否在文章详情页底部显示赞助按钮，默认 true
};

// 响应式图像布局类型
export type ResponsiveImageLayout = "constrained" | "full-width" | "none";

// 图像格式类型
export type ImageFormat = "avif" | "webp" | "png" | "jpg" | "jpeg" | "gif";

export type GuestbookAnnouncementItem = {
	id: string;
	title: string;
	summary: string;
	lead?: string;
	rules: string[];
};

export type GuestbookConfig = {
	announcements: GuestbookAnnouncementItem[];
	adminNicknames?: string[];
};
