/**
 * 空闲时预取「常点的内部链接」—— 对齐 VitePress 的 prefetchLinks 机制。
 *
 * ── 为什么需要它 ──
 * 参考站（sugarat.top，VitePress）点导航是「点了就来」，靠的就是 prefetchLinks：
 * 页面加载完后在**空闲时间**把内部链接对应的目标页资源预先抓进缓存，点击时只做一次
 * DOM 替换。本项目的 Swup 只在 **hover** 时预载（手机没有 hover ＝ 零预取），所以
 * 手机上每次点导航都要现拉目标页的 HTML 与样式表，等待时长就等于进度条跑完的时间。
 *
 * ── 做了什么 ──
 * 加载完成后（以及每次 Swup 换页后）在 requestIdleCallback 里挑出导航区最常点的
 * 几个同源链接（最多 MAX_PREFETCH 个），先抓它自己的 HTML，再从 HTML 里解析出
 * 样式表 / modulepreload / 脚本一并抓一遍 —— 全部落进浏览器 HTTP 缓存，
 * 之后 Swup 真正导航时命中缓存，几乎零等待（SwupHeadPlugin 的 awaitAssets 也就等不到了）。
 *
 * ── 防御 ──
 * - 省流模式或 2G/3G 直接不预取（navigator.connection）；
 * - 只碰同源绝对路径，跳过当前页与已预取过的 URL（Set 去重）；
 * - 一次最多 MAX_PREFETCH 个页面 —— 本项目单页 HTML 很重（/projects/ 约 1.5MB、
 *   每页样式表约 0.5MB），预取是有流量代价的，宁少勿多；
 * - 预取只是加速：任何一步失败都静默跳过，绝不抛错影响页面。
 */

/** 一次最多预取几个目标页（页面重，别贪多） */
const MAX_PREFETCH = 3;
/** requestIdleCallback 不可用时的兜底延迟 */
const IDLE_FALLBACK_DELAY = 1500;
/** Swup 换页后延迟多久再暖新页面的链接 */
const AFTER_NAV_DELAY = 800;
/** 预取都走低优先级，别跟当前页面的请求抢带宽 */
const LOW_PRIORITY: RequestInit = {
	credentials: "same-origin",
	priority: "low",
} as RequestInit;

/** 导航区链接（桌面导航栏 / 移动浮岛菜单 / 顶部工具区） */
const HOT_LINK_SELECTORS = [
	"#navbar a[href]",
	"#top-row a[href]",
	".nav-drawer a[href]",
	"#menu-sheet a[href]",
].join(",");

const warmed = new Set<string>();

/** 省流或慢网时不预取 */
function shouldSkip(): boolean {
	const conn = (
		navigator as Navigator & {
			connection?: { saveData?: boolean; effectiveType?: string };
		}
	).connection;
	if (!conn) return false;
	if (conn.saveData) return true;
	return /(^|-)2g$|slow-2g|^3g$/.test(conn.effectiveType ?? "");
}

/** 抓一个同源资源进缓存（失败静默） */
async function warmAsset(url: string): Promise<void> {
	if (warmed.has(url)) return;
	warmed.add(url);
	try {
		await fetch(url, LOW_PRIORITY);
	} catch {
		// 预取失败无所谓，照常导航
	}
}

/** 预热一个目标页：它自己的 HTML + 其中的样式表 / 预载模块 / 脚本 */
async function warmPage(pathname: string): Promise<void> {
	if (warmed.has(pathname)) return;
	warmed.add(pathname);
	try {
		const res = await fetch(pathname, LOW_PRIORITY);
		if (!res.ok) return;
		const html = await res.text();

		let doc: Document;
		try {
			doc = new DOMParser().parseFromString(html, "text/html");
		} catch {
			return;
		}

		const assets = new Set<string>();
		doc
			.querySelectorAll<HTMLLinkElement | HTMLScriptElement>(
				'link[rel="stylesheet"][href], link[rel="modulepreload"][href], script[src]',
			)
			.forEach((el) => {
				const url = el.getAttribute("href") ?? el.getAttribute("src") ?? "";
				if (url.startsWith("/")) assets.add(url);
			});
		assets.forEach((url) => {
			void warmAsset(url);
		});
	} catch {
		// 同上：拿不到就算了
	}
}

/** 从导航区挑出要预取的同源路径（最多 MAX_PREFETCH 个） */
function collectTargets(): string[] {
	const targets: string[] = [];
	const seen = new Set<string>();

	for (const anchor of Array.from(
		document.querySelectorAll<HTMLAnchorElement>(HOT_LINK_SELECTORS),
	)) {
		const href = anchor.getAttribute("href") ?? "";
		if (!href.startsWith("/") || href.startsWith("//")) continue;

		let url: URL;
		try {
			url = new URL(href, window.location.origin);
		} catch {
			continue;
		}
		if (url.origin !== window.location.origin) continue;
		if (url.pathname === window.location.pathname) continue;
		if (seen.has(url.pathname) || warmed.has(url.pathname)) continue;

		seen.add(url.pathname);
		targets.push(url.pathname);
		if (targets.length >= MAX_PREFETCH) break;
	}

	return targets;
}

function run(): void {
	if (shouldSkip()) return;
	for (const pathname of collectTargets()) {
		void warmPage(pathname);
	}
}

/**
 * 安装空闲预取。可重复调用（内部只生效一次）。
 */
export function installHotPrefetch(): void {
	if (typeof window === "undefined") return;
	const w = window as Window & { __hotPrefetchInited?: boolean };
	if (w.__hotPrefetchInited) return;
	w.__hotPrefetchInited = true;

	const schedule = (): void => {
		const ric = (
			window as Window & {
				requestIdleCallback?: (
					cb: () => void,
					opts?: { timeout: number },
				) => number;
			}
		).requestIdleCallback;
		if (typeof ric === "function") {
			ric(run, { timeout: 3000 });
		} else {
			window.setTimeout(run, IDLE_FALLBACK_DELAY);
		}
	};

	if (document.readyState === "complete") {
		schedule();
	} else {
		window.addEventListener("load", schedule, { once: true });
	}

	// Swup 换页后，新页面的导航链接也暖一遍（去重后基本是空转）
	document.addEventListener("swup:content:replaced", () => {
		window.setTimeout(run, AFTER_NAV_DELAY);
	});
	document.addEventListener("astro:page-load", () => {
		window.setTimeout(run, AFTER_NAV_DELAY);
	});
}
