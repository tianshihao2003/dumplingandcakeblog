/**
 * 朋友圈（Friends Circle）配置
 * 数据来源：hexo-circle-of-friends Simple Mode 生成的 data.json
 */

export interface CircleConfig {
	/** data.json 的访问地址 */
	dataUrl: string;
	/** 每页显示的文章数量 */
	pageSize: number;
	/** 是否显示统计卡片 */
	showStats: boolean;
	/** 是否显示文章序号 */
	showFloor: boolean;
	/** 缓存时间（毫秒），避免重复请求 */
	cacheTime: number;
}

export const circleConfig: CircleConfig = {
	// EdgeOne 托管的 data.json 地址
	dataUrl: "https://cir.tsh520.cn/data.json",

	// 每页显示 24 篇文章（桌面端 4 列 × 6 行）
	pageSize: 24,

	// 显示统计卡片（友链总数、活跃数、文章数等）
	showStats: true,

	// 不显示文章序号
	showFloor: false,

	// 缓存 5 分钟
	cacheTime: 5 * 60 * 1000,
};
