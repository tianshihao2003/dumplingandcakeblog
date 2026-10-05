// 配置索引文件 - 统一导出所有配置
// 这样组件可以一次性导入多个相关配置，减少重复的导入语句

// 类型导出
export type {
	AnnouncementConfig,
	BackgroundWallpaperConfig,
	CommentConfig,
	CoverImageConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	GuestbookAnnouncementItem,
	GuestbookConfig,
	HomeConfig,
	HomeDisplayLayerConfig,
	HomePortfolioShutterConfig,
	HomePortfolioShutterInterlude,
	HomePortfolioShutterPanel,
	LicenseConfig,
	MusicPlayerConfig,
	NavBarConfig,
	ProfileConfig,
	SakuraConfig,
	SidebarLayoutConfig,
	SiteConfig,
	SponsorConfig,
	SponsorItem,
	SponsorMethod,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";
export { adConfig1, adConfig2 } from "./adConfig"; // 广告配置
export { announcementConfig } from "./announcementConfig"; // 公告配置
// 样式配置
export { backgroundWallpaper } from "./backgroundWallpaper"; // 背景壁纸配置
// 功能配置
export { circleConfig } from "./circleConfig"; // 朋友圈配置
export { commentConfig } from "./commentConfig"; // 评论系统配置
export { coverImageConfig } from "./coverImageConfig"; // 封面图配置
export { expressiveCodeConfig } from "./expressiveCodeConfig"; // 代码高亮配置
export { fontConfig } from "./fontConfig"; // 字体配置
export { footerConfig } from "./footerConfig"; // 页脚配置
export { friendsPageConfig } from "./friendsConfig"; // 友链配置
export { guestbookConfig } from "./guestbookConfig"; // 留言板配置
export { homeConfig } from "./homeConfig"; // 首页视觉与资料配置
export { homePortfolioShutterConfig } from "./homePortfolioShutterConfig";
export { licenseConfig } from "./licenseConfig"; // 许可证配置
export { momentConfig } from "./momentConfig"; // 动态评论配置
// 组件配置
export { musicPlayerConfig } from "./musicConfig"; // 音乐播放器配置
export { navBarConfig, navBarSearchConfig } from "./navBarConfig"; // 导航栏配置与搜索配置
export { live2dModelConfig, spineModelConfig } from "./pioConfig"; // 看板娘配置
export { profileConfig } from "./profileConfig"; // 用户资料配置
export { relationshipConfig } from "./relationshipConfig"; // 恋爱计时配置
export { sakuraConfig } from "./sakuraConfig"; // 樱花特效配置
export { isHiddenFromLists, notesHiddenFromLists } from "./notesConfig"; // 自用系列笔记：不进文章列表页与 RSS
// 布局配置
export { sidebarLayoutConfig } from "./sidebarConfig"; // 侧边栏布局配置
// 核心配置
export { siteConfig } from "./siteConfig"; // 站点基础配置
export { skillsConfig } from "./skillsConfig";
export { sponsorConfig } from "./sponsorConfig"; // 赞助配置
export { ttsConfig } from "./ttsConfig"; // 文章朗读（TTS）配置
