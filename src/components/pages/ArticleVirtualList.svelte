<script lang="ts">
import { onMount } from "svelte";
import AnimatedTabs from "@/components/controls/AnimatedTabs.svelte";
import { commentConfig } from "@/config/commentConfig";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import {
	createArticleCoverLifecycle,
	parseArticleCoverApiUrls,
} from "@/utils/article-cover-lifecycle";
import { removeFileExtension } from "@/utils/url-utils";

type ArticleListView = "list" | "grid";

type ArticleListTag = {
	name: string;
	url: string;
};

export type ArticleListPost = {
	id: string;
	title: string;
	url: string;
	publishedIso: string;
	publishedText: string;
	category: string;
	categoryUrl: string;
	tags: ArticleListTag[];
	description: string;
	imageUrl: string;
	imageApiUrls: string[];
	apiUrls?: string[];
	fallbackImageUrl?: string;
	categoryHue?: number;
	wordCount?: number;
	pinned: boolean;
	hasRealCover: boolean;
};

interface Props {
	posts: ArticleListPost[];
	defaultView?: ArticleListView;
	postsPerPage?: number;
	allowLayoutSwitch?: boolean;
}

let {
	posts,
	defaultView = "list",
	postsPerPage = 9,
	allowLayoutSwitch = true,
}: Props = $props();

let containerRef = $state<HTMLElement | null>(null);
let view = $state<ArticleListView>(getInitialViewFromDOM());
let viewInitialized = false;

function getInitialViewFromDOM(): ArticleListView {
	if (typeof document !== "undefined") {
		const attr = document.documentElement.getAttribute("data-article-view");
		if (isArticleListView(attr)) return attr;
	}
	if (typeof localStorage !== "undefined") {
		const saved = localStorage.getItem("postListLayout");
		if (isArticleListView(saved)) return saved;
	}
	return defaultView;
}
let gridColumnCount = $state(3);
let currentPage = $state(1);
let isMobile = $state(false);

const categoryColorPalette = [
	"#fbbf24",
	"#fb7185",
	"#34d399",
	"#60a5fa",
	"#a78bfa",
	"#f472b6",
	"#2dd4bf",
	"#fb923c",
	"#22d3ee",
	"#818cf8",
	"#e879f9",
	"#a3e635",
	"#f87171",
	"#a78bfa",
	"#06b6d4",
	"#f59e0b",
	"#f43f5e",
	"#10b981",
];

const categoryColors = $derived.by(() => {
	const map = new Map<string, string>();
	const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort(
		(a, b) => a.localeCompare(b, "zh-CN"),
	);
	for (let i = 0; i < cats.length; i++) {
		map.set(cats[i], categoryColorPalette[i % categoryColorPalette.length]);
	}
	return map;
});

function getCategoryHue(name: string): number {
	let hash = 2166136261;
	for (let i = 0; i < name.length; i++) {
		hash ^= name.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0) % 360;
}

function getCategoryColor(name: string): string {
	return `--article-category-hue: ${getCategoryHue(name)}`;
}

const pinnedPosts = $derived(posts.filter((post) => post.pinned));
const regularPosts = $derived(posts.filter((post) => !post.pinned));
const paginatedPosts = $derived(
	regularPosts.slice(
		(currentPage - 1) * postsPerPage,
		currentPage * postsPerPage,
	),
);
const totalPages = $derived(
	Math.max(1, Math.ceil(regularPosts.length / postsPerPage)),
);
let pinnedActiveIndex = $state(0);
let pinnedCarouselTimer: ReturnType<typeof setTimeout> | null = null;
let pinnedPaused = $state(false);
let coverLifecycles: ReturnType<typeof createArticleCoverLifecycle>[] = [];
let coverAbortController: AbortController | null = null;
let viewCountAbort: (() => void) | null = null;
let viewCountDisposers: (() => void)[] = [];
let pinnedSectionRef = $state<HTMLElement | null>(null);
let wheelLockUntil = 0;
let touchStartRef: { x: number; y: number; t: number } | null = null;

const columns = $derived(
	(() => {
		const cols = Array.from(
			{ length: gridColumnCount },
			() => [] as { post: ArticleListPost; index: number }[],
		);
		paginatedPosts.forEach((post, idx) => {
			const colIdx = idx % gridColumnCount;
			cols[colIdx].push({
				post,
				index: (currentPage - 1) * postsPerPage + idx,
			});
		});
		return cols;
	})(),
);

function isArticleListView(
	value: string | null | undefined,
): value is ArticleListView {
	return value === "list" || value === "grid";
}

function syncViewFromStorage() {
	if (typeof localStorage === "undefined") return;
	const savedView = localStorage.getItem("postListLayout");
	if (isArticleListView(savedView)) {
		view = savedView;
	} else if (!viewInitialized) {
		view = defaultView;
	}
	viewInitialized = true;
}

function getGridColumnCount() {
	if (typeof window === "undefined") return 3;
	if (view !== "grid") return 1;
	return window.innerWidth <= 768 ? 1 : 3;
}

function updateGridColumns() {
	if (typeof window === "undefined") return;
	gridColumnCount = getGridColumnCount();
}

function startPinnedCarousel() {
	if (pinnedPaused || typeof window === "undefined") return;
	if (pinnedPosts.length <= 1) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	if (pinnedCarouselTimer) clearTimeout(pinnedCarouselTimer);
	pinnedCarouselTimer = setTimeout(() => {
		pinnedActiveIndex = (pinnedActiveIndex + 1) % pinnedPosts.length;
		startPinnedCarousel();
	}, 6000);
}

function stopPinnedCarousel() {
	if (pinnedCarouselTimer) {
		clearTimeout(pinnedCarouselTimer);
		pinnedCarouselTimer = null;
	}
}

function goToPinned(index: number) {
	if (pinnedPosts.length === 0) return;
	pinnedActiveIndex =
		((index % pinnedPosts.length) + pinnedPosts.length) % pinnedPosts.length;
	stopPinnedCarousel();
	startPinnedCarousel();
	requestAnimationFrame(() => initCoverLifecycles());
}

function handlePinnedWheel(event: WheelEvent) {
	if (pinnedPosts.length <= 1) return;
	const deltaY = event.deltaY;
	if (Math.abs(deltaY) < 8) return;
	if (Date.now() < wheelLockUntil) return;
	event.preventDefault();
	const dir = deltaY > 0 ? 1 : -1;
	wheelLockUntil = Date.now() + 550;
	goToPinned(pinnedActiveIndex + dir);
}

function handlePinnedTouchStart(event: TouchEvent) {
	if (pinnedPosts.length <= 1) return;
	const t = event.touches[0];
	if (!t) return;
	touchStartRef = { x: t.clientX, y: t.clientY, t: Date.now() };
}

function handlePinnedTouchMove(event: TouchEvent) {
	if (!touchStartRef || pinnedPosts.length <= 1) return;
	const t = event.touches[0];
	if (!t) return;
	const dx = t.clientX - touchStartRef.x;
	const dy = t.clientY - touchStartRef.y;
	if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy) * 1.2) {
		event.preventDefault();
	}
}

function handlePinnedTouchEnd(event: TouchEvent) {
	if (!touchStartRef || pinnedPosts.length <= 1) return;
	const t = event.changedTouches[0];
	const start = touchStartRef;
	touchStartRef = null;
	if (!t || !start) return;
	const dx = t.clientX - start.x;
	const dy = t.clientY - start.y;
	if (Math.abs(dx) < 28 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
	const dir = dx < 0 ? 1 : -1;
	goToPinned(pinnedActiveIndex + dir);
}

function initViews() {
	viewCountAbort?.();
	viewCountAbort = null;
	if (typeof document === "undefined") return;
	const serverURL = commentConfig.waline?.serverURL;
	if (
		commentConfig.type !== "waline" ||
		!commentConfig.waline?.visitorCount ||
		!serverURL
	)
		return;
	if (
		document.querySelectorAll(".article-views .waline-pageview-count")
			.length === 0
	)
		return;
	let disposed = false;
	import("@waline/client/pageview")
		.then(({ pageviewCount }) => {
			if (disposed) return;
			// update: false —— 列表页只读浏览量，不把列表页访问计入文章计数
			viewCountAbort = pageviewCount({
				serverURL,
				selector: ".article-views .waline-pageview-count",
				update: false,
			});
		})
		.catch(() => undefined);
	viewCountDisposers.push(() => {
		disposed = true;
	});
}

function initCoverLifecycles() {
	if (coverAbortController) coverAbortController.abort();
	coverAbortController = new AbortController();
	const signal = coverAbortController.signal;
	for (const lc of coverLifecycles) lc.dispose();
	coverLifecycles = [];
	if (typeof document === "undefined") return;
	const wraps = document.querySelectorAll<HTMLElement>(
		"[data-article-list-cover-wrap]",
	);
	for (const wrap of wraps) {
		const img = wrap.querySelector<HTMLImageElement>(
			"[data-article-list-cover]",
		);
		if (!img) return;
		const apiUrls = parseArticleCoverApiUrls(img.dataset.apiUrls);
		const fallbackSrc = img.dataset.fallbackSrc || undefined;
		const lc = createArticleCoverLifecycle({
			host: wrap,
			image: img,
			apiUrls,
			fallbackSrc,
			baseUrl: document.baseURI,
			signal,
		});
		coverLifecycles.push(lc);
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) lc.setVisible(entry.isIntersecting);
			},
			{ rootMargin: "200px 0px" },
		);
		observer.observe(wrap);
		signal.addEventListener("abort", () => observer.disconnect(), {
			once: true,
		});
		// initial check: if already visible
		const rect = wrap.getBoundingClientRect();
		const visible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
		lc.setVisible(visible);
	}
}

function handleLayoutChange(event: Event) {
	const layout = (event as CustomEvent<{ layout?: string }>).detail?.layout;
	if (!isArticleListView(layout) || layout === view) return;
	view = layout;
	updateGridColumns();
	requestAnimationFrame(() => initCoverLifecycles());
	requestAnimationFrame(() => initViews());
}

function handleImageLoad(event: Event) {
	const img = event.currentTarget as HTMLImageElement;
	img.classList.add("is-loaded");
	img.parentElement?.classList.remove("skeleton-shimmer");
}

function handleImageError(event: Event, apiUrls: string[]) {
	const image = event.currentTarget as HTMLImageElement;
	const nextIndex = Number(image.dataset.apiIndex || "0") + 1;
	if (nextIndex < apiUrls.length) {
		image.dataset.apiIndex = String(nextIndex);
		image.src = apiUrls[nextIndex];
		return;
	}
	image
		.closest(
			".article-grid-card__image-wrapper, .article-list-row-card__bg-wrapper",
		)
		?.classList.add("is-hidden");
}

function goToPage(page: number) {
	const nextPage = Math.max(1, Math.min(totalPages, page));
	if (nextPage === currentPage) return;
	if (containerRef) {
		window.scrollTo(
			0,
			Math.max(0, window.scrollY + containerRef.getBoundingClientRect().top),
		);
	}
	requestAnimationFrame(() => {
		currentPage = nextPage;
		requestAnimationFrame(() => initCoverLifecycles());
	});
}

function generatePageNumbers(
	current: number,
	total: number,
): (number | string)[] {
	const delta = 2;
	const rangeWithDots: (number | string)[] = [];
	if (total <= 7) {
		for (let i = 1; i <= total; i++) rangeWithDots.push(i);
		return rangeWithDots;
	}
	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);
	rangeWithDots.push(1);
	if (left > 2) rangeWithDots.push("...");
	for (let i = left; i <= right; i++) rangeWithDots.push(i);
	if (right < total - 1) rangeWithDots.push("...");
	if (total > 1) rangeWithDots.push(total);
	return rangeWithDots;
}

const pageNumbers = $derived(generatePageNumbers(currentPage, totalPages));

onMount(() => {
	syncViewFromStorage();
	if (!viewInitialized) view = defaultView;
	updateGridColumns();
	startPinnedCarousel();
	requestAnimationFrame(() => initCoverLifecycles());
	initViews();

	// 检测移动端
	const checkMobile = () => {
		isMobile = window.innerWidth < 768;
	};
	checkMobile();

	let resizeTicking = false;
	const onResize = () => {
		if (resizeTicking) return;
		resizeTicking = true;
		requestAnimationFrame(() => {
			updateGridColumns();
			checkMobile();
			resizeTicking = false;
		});
	};

	window.addEventListener("resize", onResize);
	window.addEventListener("layoutChange", handleLayoutChange);

	// Swup 替换 DOM 后重新初始化（Svelte onMount 不会重新执行）
	const onSwupReplaced = () => {
		syncViewFromStorage();
		updateGridColumns();
		checkMobile();
		startPinnedCarousel();
		initCoverLifecycles();
		initViews();
	};
	window.addEventListener("swup:content:replaced", onSwupReplaced);

	return () => {
		stopPinnedCarousel();
		if (coverAbortController) coverAbortController.abort();
		for (const lc of coverLifecycles) lc.dispose();
		viewCountAbort?.();
		for (const dispose of viewCountDisposers) dispose();
		viewCountDisposers = [];
		window.removeEventListener("resize", onResize);
		window.removeEventListener("layoutChange", handleLayoutChange);
		window.removeEventListener("swup:content:replaced", onSwupReplaced);
	};
});

$effect(() => {
	view;
	posts;
	if (typeof window !== "undefined") updateGridColumns();
});

$effect(() => {
	pinnedPosts.length;
	if (typeof window !== "undefined") {
		pinnedActiveIndex = 0;
		stopPinnedCarousel();
		startPinnedCarousel();
	}
});
</script>

{#snippet articleViews(postId: string)}
	{#if commentConfig.type === "waline" && commentConfig.waline?.visitorCount}
		<span class="article-views" aria-label={i18n(I18nKey.pageViews)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
			<span class="waline-pageview-count" data-path={`/posts/${removeFileExtension(postId)}`}></span>
		</span>
	{/if}
{/snippet}

{#if posts.length === 0}
	<div class="article-list-empty">
		<span class="article-list-empty__title">暂无文章</span>
		<span class="article-list-empty__meta">新的内容会显示在这里。</span>
	</div>
{:else}
	{#if pinnedPosts.length > 0}
		<section
			class="article-list-pinned"
			aria-labelledby="article-list-pinned-title"
			bind:this={pinnedSectionRef}
			style="touch-action: pan-y;"
			onmouseenter={() => { pinnedPaused = true; stopPinnedCarousel(); }}
			onmouseleave={() => { pinnedPaused = false; startPinnedCarousel(); }}
			onfocusin={() => { pinnedPaused = true; stopPinnedCarousel(); }}
			onfocusout={() => { pinnedPaused = false; startPinnedCarousel(); }}
			onwheel={handlePinnedWheel}
			ontouchstart={handlePinnedTouchStart}
			ontouchmove={handlePinnedTouchMove}
			ontouchend={handlePinnedTouchEnd}
		>
			<div class="article-list-pinned__heading">
				<h2 id="article-list-pinned-title" class="article-list-section-title">置顶</h2>
				<div class="article-list-pinned__switch" class:is-hidden={!allowLayoutSwitch}>
					<AnimatedTabs activeTab={view} />
				</div>
			</div>
			<div
				class="article-list-pinned__collection"
				data-article-list-pinned-carousel
			>
				{#each pinnedPosts as pinnedPost, pinnedIndex (pinnedPost.id)}
					<article
						class="article-list-pinned-item"
						data-article-list-pinned-item
						hidden={pinnedIndex !== pinnedActiveIndex}
						aria-hidden={pinnedIndex !== pinnedActiveIndex}
					>
						<div class="article-list-pinned-item__content">
							<h3 class="article-list-pinned-item__title">
								<span class="article-list-pinned-item__title-text">{pinnedPost.title}</span>
							</h3>
							<div class="article-list-pinned-item__meta">
								<div class="article-list-pinned-item__meta-row">
									<span
										class="article-list-pinned-item__taxonomy article-list-pinned-item__taxonomy--category"
										style={getCategoryColor(pinnedPost.category)}
									>
										{pinnedPost.category}
									</span>
									{@render articleViews(pinnedPost.id)}
								</div>
								<div class="article-list-pinned-item__meta-row">
									<span class="article-list-pinned-item__meta-item">
										<svg class="article-calendar-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" fill-rule="evenodd" d="M8 4h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2zM5 8v12h14V8zm2 3h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm0 4h2v2h-2zm-4 0h2v2h-2zm-4 0h2v2H7z" /></svg>
										<time datetime={pinnedPost.publishedIso}>{pinnedPost.publishedText}</time>
									</span>
									<span class="article-list-pinned-item__meta-item">
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
										<span>{(pinnedPost.wordCount ?? 0).toLocaleString()} 字</span>
									</span>
									{#if pinnedPost.tags.length > 0}
										{#each pinnedPost.tags.slice(0, 3) as tag, i (tag.name)}
											<span class="article-list-pinned-item__taxonomy article-list-pinned-item__taxonomy--tag">{tag.name}</span>
										{/each}
										{#if pinnedPost.tags.length > 3}
											<span class="article-list-pinned-item__tag-overflow">+{pinnedPost.tags.length - 3}</span>
										{/if}
									{/if}
								</div>
							</div>
							<p class="article-list-pinned-item__description">{pinnedPost.description}</p>
						</div>
						<div class="article-list-pinned-item__cover-wrap image-pixel-reveal-host" data-article-list-cover-wrap>
							<span class="article-list-pinned-item__cover-loader" aria-hidden="true">
								<span class="article-list-pinned-item__cover-loader-dot"></span>
								<span class="article-list-pinned-item__cover-loader-dot"></span>
								<span class="article-list-pinned-item__cover-loader-dot"></span>
								<span class="article-list-pinned-item__cover-loader-dot"></span>
							</span>
							<span class="image-pixel-reveal" data-image-pixel-reveal aria-hidden="true"></span>
							{#if pinnedPost.imageUrl}
								<img
									class="article-list-pinned-item__cover image-pixel-reveal-source"
									src={pinnedPost.imageUrl}
									alt={`置顶文章配图：${pinnedPost.title}`}
									data-article-list-cover
									data-fallback-src={pinnedPost.fallbackImageUrl ?? ""}
									data-api-urls={(pinnedPost.apiUrls ?? pinnedPost.imageApiUrls ?? []).length > 0 ? JSON.stringify(pinnedPost.apiUrls ?? pinnedPost.imageApiUrls) : undefined}
									loading={pinnedIndex === 0 ? "eager" : "lazy"}
									decoding="async"
								/>
							{:else}
								<div class="article-grid-card__image-placeholder"></div>
							{/if}
						</div>
						<a href={pinnedPost.url} class="article-list-pinned-item__surface-link" aria-label={`打开置顶文章：${pinnedPost.title}`}></a>
					</article>
				{/each}
			</div>
			{#if pinnedPosts.length > 1}
				<div class="article-list-pinned__dots" role="tablist" aria-label="置顶轮播">
					{#each pinnedPosts as _, dotIndex (dotIndex)}
						<button
							type="button"
							data-article-list-pinned-dot
							role="tab"
							aria-label={`切换到第 ${dotIndex + 1} 篇置顶`}
							aria-selected={dotIndex === pinnedActiveIndex}
							aria-current={dotIndex === pinnedActiveIndex ? "true" : undefined}
							onclick={() => goToPinned(dotIndex)}
						></button>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<div
		class="article-list-virtual"
		data-view={view}
		bind:this={containerRef}
		style={`--article-list-grid-columns: ${gridColumnCount};`}
	>
		{#if view === "grid"}
		<div class="article-list-view">
			<div class="article-list-regular__toolbar" aria-label="常规文章">
				<h2 class="article-list-regular__title">文章</h2>
				<span class="article-list-regular__count">共 <strong>{regularPosts.length}</strong> 篇文章</span>
			</div>
			<div
				class="article-list-masonry"
				style="--cols: {gridColumnCount};"
				aria-label="文章卡片列表"
			>
				{#each columns as column}
					<div class="article-list-masonry__col">
						{#each column as entry (entry.post.id)}
							{@const post = entry.post}
							{@const isPinned = post.pinned}
							<article
								class="article-list-card"
								data-article-list-card
								style={`--article-category-hue: ${post.categoryHue ?? getCategoryHue(post.category)}`}
							>
								<div
									class="article-list-card__cover-wrap image-pixel-reveal-host"
									data-article-list-cover-wrap
								>
									<span class="article-list-card__cover-loader" aria-hidden="true">
										<span class="article-list-card__cover-loader-dot"></span>
										<span class="article-list-card__cover-loader-dot"></span>
										<span class="article-list-card__cover-loader-dot"></span>
										<span class="article-list-card__cover-loader-dot"></span>
									</span>
									<span class="image-pixel-reveal" data-image-pixel-reveal aria-hidden="true"></span>
									<img
										class="article-list-card__cover image-pixel-reveal-source"
										src={post.imageUrl}
										alt={`文章配图：${post.title}`}
										data-article-list-cover
										data-fallback-src={post.fallbackImageUrl ?? ""}
										data-api-urls={(post.apiUrls ?? post.imageApiUrls ?? []).length > 0 ? JSON.stringify(post.apiUrls ?? post.imageApiUrls) : undefined}
										loading="lazy"
										decoding="async"
									/>
								</div>
								<div class="article-list-card__content">
									<div class="article-list-card__title-row">
										<h3 class="article-list-card__title">
											<span class="article-list-card__title-text" title={post.title}>{post.title}</span>
										</h3>
									</div>
									<div class="article-list-card__meta">
										<div class="article-list-pinned-item__meta-row">
											<span class="article-list-card__taxonomy">{post.category}</span>
											{@render articleViews(post.id)}
										</div>
										<div class="article-list-pinned-item__meta-row">
											<span class="article-list-card__meta-item">
												<svg class="article-calendar-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" fill-rule="evenodd" d="M8 4h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2zM5 8v12h14V8zm2 3h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm0 4h2v2h-2zm-4 0h2v2h-2zm-4 0h2v2H7z" /></svg>
												<time datetime={post.publishedIso}>{post.publishedText}</time>
											</span>
											<span class="article-list-card__meta-item">
												<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
												<span>{(post.wordCount ?? 0).toLocaleString()} 字</span>
											</span>
										</div>
									</div>
									<div class="article-list-card__rule" aria-hidden="true"></div>
									<p class="article-list-card__description">{post.description}</p>
								</div>
								<a href={post.url} class="article-list-card__surface-link" aria-label={`查看文章：${post.title}`} title={post.title}></a>
							</article>
						{/each}
					</div>
				{/each}
			</div>
		</div>
		{/if}

		{#if view === "list"}
		<div class="article-list-view">
			<div class="article-list-regular__toolbar" aria-label="常规文章">
				<h2 class="article-list-regular__title">文章</h2>
				<span class="article-list-regular__count">共 <strong>{regularPosts.length}</strong> 篇文章</span>
			</div>
			<div class="article-list-vertical article-list-vertical--pinned" aria-label="文章列表">
				{#each paginatedPosts as post (post.id)}
					<article class="article-list-pinned-item article-list-row-pinned" data-article-list-pinned-item>
						<div class="article-list-pinned-item__content">
							<h3 class="article-list-pinned-item__title">
								<span class="article-list-pinned-item__title-text" title={post.title}>{post.title}</span>
							</h3>
							<div class="article-list-pinned-item__meta">
								<div class="article-list-pinned-item__meta-row">
									<span class="article-list-pinned-item__taxonomy article-list-pinned-item__taxonomy--category" style={getCategoryColor(post.category)}>{post.category}</span>
									{@render articleViews(post.id)}
								</div>
								<div class="article-list-pinned-item__meta-row">
									<span class="article-list-pinned-item__meta-item">
										<svg class="article-calendar-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" fill-rule="evenodd" d="M8 4h8V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2zM5 8v12h14V8zm2 3h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm0 4h2v2h-2zm-4 0h2v2h-2zm-4 0h2v2H7z" /></svg>
										<time datetime={post.publishedIso}>{post.publishedText}</time>
									</span>
									<span class="article-list-pinned-item__meta-item">
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
										<span>{(post.wordCount ?? 0).toLocaleString()} 字</span>
									</span>
									{#if post.tags.length > 0}
										{#each post.tags.slice(0, 3) as tag (tag.name)}
											<span class="article-list-pinned-item__taxonomy article-list-pinned-item__taxonomy--tag">{tag.name}</span>
										{/each}
										{#if post.tags.length > 3}
											<span class="article-list-pinned-item__tag-overflow">+{post.tags.length - 3}</span>
										{/if}
									{/if}
								</div>
							</div>
							<p class="article-list-pinned-item__description">{post.description}</p>
						</div>
						<div class="article-list-pinned-item__cover-wrap image-pixel-reveal-host" data-article-list-cover-wrap aria-hidden="true">
							<span class="article-list-card__cover-loader" aria-hidden="true">
								<span class="article-list-card__cover-loader-dot"></span>
								<span class="article-list-card__cover-loader-dot"></span>
								<span class="article-list-card__cover-loader-dot"></span>
								<span class="article-list-card__cover-loader-dot"></span>
							</span>
							<span class="image-pixel-reveal" data-image-pixel-reveal aria-hidden="true"></span>
							{#if post.imageUrl}
								<img class="article-list-pinned-item__cover image-pixel-reveal-source" src={post.imageUrl} alt="" loading="lazy" decoding="async" data-article-list-cover data-fallback-src={post.fallbackImageUrl ?? ""} data-api-urls={(post.apiUrls ?? post.imageApiUrls ?? []).length > 0 ? JSON.stringify(post.apiUrls ?? post.imageApiUrls) : undefined} />
							{:else}
								<div class="article-list-pinned-item__cover" style="background: var(--btn-plain-bg-hover);"></div>
							{/if}
						</div>
						<a href={post.url} class="article-list-pinned-item__surface-link" aria-label={`查看文章：${post.title}`} title={post.title}></a>
					</article>
				{/each}
			</div>
		</div>
		{/if}
	</div>

	{#if totalPages > 1}
		<div class="article-list-pagination">
			<div class="article-list-pagination__inner article-list-pagination__inner--simple">
				<button
					type="button"
					class="article-list-pagination__btn"
					disabled={currentPage === 1}
					aria-label="上一页"
					onclick={() => goToPage(currentPage - 1)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
				</button>

				<div class="bg-[var(--card-bg)] flex items-center rounded-[0.5rem] px-3.5 h-11 gap-1.5 border border-dashed border-[var(--line-divider)] shadow-sm">
					<span class="text-sm font-bold text-[var(--primary)] tabular-nums">{currentPage}</span>
					<span class="text-sm text-[var(--content-meta)]">/</span>
					<span class="text-sm font-bold text-[var(--content-meta)] tabular-nums">{totalPages}</span>
				</div>

				<button
					type="button"
					class="article-list-pagination__btn"
					disabled={currentPage === totalPages}
					aria-label="下一页"
					onclick={() => goToPage(currentPage + 1)}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
				</button>
			</div>
		</div>
	{/if}
{/if}
