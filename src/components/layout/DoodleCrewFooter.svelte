<script lang="ts">
import { onDestroy } from "svelte";
import type {
	DoodleKind,
	FooterAction,
	FooterConfig,
	FooterLink,
} from "@/types/config";
import "../../styles/components/doodle-crew-footer.css";
import DoodleCrewArt from "./doodle-crew-footer/DoodleCrewArt.svelte";
import DoodleShape from "./doodle-crew-footer/DoodleShape.svelte";
import {
	ART_META,
	clamp,
	DEFAULT_FONT,
	DEFAULT_SERIF,
	estimate,
	type Floater,
	FONT_SIZE,
	hash,
	layoutWord,
	lookAt,
	type Metrics,
	type Placed,
	seatPoint,
	stepFloater,
	timeline,
} from "./doodle-crew-footer/engine";

let {
	wordmark = "DUMPLING",
	brand = "团子和蛋糕",
	blurb = "",
	tagline = "",
	columns = [],
	actions = [],
	copyright = "",
	legal = [],
	socials = [],
	crew = [],
	doodles = [],
	doodleCount = 12,
	palette = {},
	fontFamily = DEFAULT_FONT,
	serifFamily = DEFAULT_SERIF,
	tracking = -0.02,
	interactive = true,
}: FooterConfig = $props();

const rawId = $props.id();
const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
const word = $derived(wordmark.toUpperCase());
const chars = $derived(Array.from(word));
const colors = {
	background: "var(--page-bg)",
	ink: "var(--deep-text)",
	accent: "#ff6b2c",
	...palette,
};

let rootEl = $state<HTMLElement>();
let svgEl = $state<SVGSVGElement>();
let worldEl = $state<HTMLDivElement>();
let crewLayer0 = $state<SVGGElement>();
let crewLayer1 = $state<SVGGElement>();
let pupilEls = $state<(SVGGElement | null)[]>([]);
let blinkEls = $state<(SVGGElement | null)[]>([]);
let doodleEls = $state<(HTMLDivElement | null)[]>([]);

let metrics = $state<Metrics>(estimate(wordmark.toUpperCase()));
let play = $state(false);
let reduced = $state(false);
let talking = $state(-1);
let hopping = $state(-1);
let talkTimer = 0;

const layout = $derived(layoutWord(metrics.advances, tracking, FONT_SIZE));
const cap = $derived(metrics.cap);

const placed: Placed[] = $derived.by(() => {
	const out: Placed[] = [];
	crew.forEach((m, i) => {
		const art = ART_META[m.kind];
		if (!art || !chars.length) return;
		const li = clamp(Math.floor(m.letter) || 0, 0, chars.length - 1);
		const scale = (cap / 144) * art.k * (m.scale ?? 1);
		const seat = m.seat || art.seat;
		const p = seatPoint(
			seat,
			layout.x[li],
			layout.w[li],
			cap,
			m.offset ?? 0,
			scale,
		);
		out.push({
			i,
			m,
			art,
			seat,
			scale,
			...p,
			flip: m.flip ? -1 : 1,
		});
	});
	return out;
});

// viewBox 紧贴巨型字、角色和地面
const view = $derived.by(() => {
	let l = 0;
	let r = layout.width;
	let t = -cap;
	let b = 30;
	for (const p of placed) {
		const bx =
			p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l];
		l = Math.min(l, p.x + bx[0] * p.scale);
		r = Math.max(r, p.x + bx[1] * p.scale);
		t = Math.min(t, p.y + p.art.box.t * p.scale);
		b = Math.max(b, p.y + p.art.box.b * p.scale);
	}
	const pad = 24;
	return {
		x: l - pad,
		y: t - pad,
		w: r - l + pad * 2,
		h: b - t + pad * 2,
	};
});

const vb = $derived(
	`${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`,
);

const words = $derived(Array.from(tagline));
const tl = $derived(
	timeline(chars.length, placed.length, words.length, actions.length),
);

const ground = $derived.by(() => {
	const x0 = view.x + 6;
	const x1 = view.x + view.w - 6;
	let d = `M${x0.toFixed(1)} 6`;
	const n = 14;
	for (let k = 1; k <= n; k++) {
		const x = x0 + ((x1 - x0) * k) / n;
		d += ` Q${(x - (x1 - x0) / n / 2).toFixed(1)} ${(6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1)} ${x.toFixed(1)} ${(6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1)}`;
	}
	let tufts = "";
	for (let k = 0; k < 22; k++) {
		const x = x0 + 20 + hash(k * 11.3) * (x1 - x0 - 40);
		const s = 0.7 + hash(k * 5.9) * 0.6;
		tufts += `M${x.toFixed(1)} 6 l${(2 * s).toFixed(1)} ${(-9 * s).toFixed(1)} M${(x + 3 * s).toFixed(1)} 6 l${(1 * s).toFixed(1)} ${(-12 * s).toFixed(1)} M${(x + 6 * s).toFixed(1)} 6 l${(-1 * s).toFixed(1)} ${(-7 * s).toFixed(1)} `;
	}
	const pebbles = Array.from({ length: 9 }, (_, k) => ({
		x: x0 + 40 + hash(k * 17.1) * (x1 - x0 - 80),
		y: 14 + hash(k * 2.3) * 8,
		r: 2 + hash(k * 9.4) * 2.6,
	}));
	return { d, tufts, pebbles };
});

const doodleList = $derived.by(() => {
	const kinds = doodles.length ? doodles : [];
	const n = kinds.length ? clamp(Math.floor(doodleCount) || 0, 0, 40) : 0;
	return Array.from({ length: n }, (_, k) => {
		const kind = kinds[k % kinds.length] as DoodleKind;
		return { kind, size: 22 + hash(k * 4.7) * 14, seed: k };
	});
});

const hatch = `url(#${uid}-hatch)`;

type Gaze = {
	x: number;
	y: number;
	tx: number;
	ty: number;
	next: number;
	blinkAt: number;
	blink: number;
	_o0: { x: number; y: number };
	_o1: { x: number; y: number };
};

const sim = {
	floaters: [] as Floater[],
	w: 0,
	h: 0,
	px: Number.NaN,
	py: Number.NaN,
	inside: false,
	visible: false,
	gaze: [] as Gaze[],
	seed: 1,
	start: 0,
};

function measure(text: string, family: string): Metrics | null {
	if (typeof document === "undefined") return null;
	const ctx = document.createElement("canvas").getContext("2d");
	if (!ctx) return null;
	ctx.font = `900 ${FONT_SIZE}px ${family}`;
	const list = Array.from(text);
	const advances: number[] = [];
	let prev = 0;
	for (let i = 0; i < list.length; i++) {
		const wNow = ctx.measureText(list.slice(0, i + 1).join("")).width;
		advances.push(wNow - prev);
		prev = wNow;
	}
	const m = ctx.measureText(text.replace(/\s/g, "") || "H");
	const cap =
		m.actualBoundingBoxAscent > 0
			? m.actualBoundingBoxAscent
			: 0.73 * FONT_SIZE;
	return { advances, cap };
}

function paintDoodles() {
	const s = sim;
	const k = clamp(s.w / 1100, 0.5, 1);
	for (let i = 0; i < s.floaters.length; i++) {
		const el = doodleEls[i];
		const f = s.floaters[i];
		if (!el || !f) continue;
		let sc = k;
		let op = 1;
		if (f.pop > 0) {
			const age = 1.4 - f.pop;
			sc = k * (1 + Math.min(1, age / 0.3) * 0.7);
			op = Math.max(0, 1 - age / 0.3);
		}
		el.style.transform = `translate3d(${f.x.toFixed(1)}px,${f.y.toFixed(1)}px,0) rotate(${f.rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
		el.style.opacity = String(op);
	}
}

function dustPath(i: number): string {
	const x = layout.x[i];
	const w = layout.w[i];
	return `M${x - 6} -6 l-16 -6 M${x - 4} -16 l-12 -12 M${x + w + 6} -6 l16 -6 M${x + w + 4} -16 l12 -12`;
}

function pct(v: number, base: number, span: number): string {
	return `${(((v - base) / span) * 100).toFixed(3)}%`;
}

function figureTransform(p: Placed): string {
	return `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${(p.scale * p.flip).toFixed(4)} ${p.scale.toFixed(4)})`;
}

function letterStyle(i: number): string {
	const r = ((hash(i * 2.3) - 0.5) * 9).toFixed(2);
	return `--d: ${tl.letter(i)}ms; --r: ${r}deg`;
}

function doodleStyle(size: number): string {
	return `width: ${size}px; height: ${size}px; margin-left: ${-size / 2}px; margin-top: ${-size / 2}px`;
}

function bubbleStyle(p: Placed): string {
	const left = pct(p.x, view.x, view.w);
	const top = pct(p.y + p.art.box.t * p.scale - 6, view.y, view.h);
	return `left: ${left}; top: ${top}`;
}

function actionClass(a: FooterAction): string {
	return `dcf-btn dcf-pop ${a.variant === "outline" ? "is-outline" : "is-solid"}`;
}

function onPointerMove(e: PointerEvent) {
	sim.px = e.clientX;
	sim.py = e.clientY;
	sim.inside = true;
}

function onPointerLeave() {
	sim.inside = false;
}

function poke(c: number) {
	if (!interactive) return;
	talking = c;
	hopping = -1;
	requestAnimationFrame(() => {
		hopping = c;
	});
	clearTimeout(talkTimer);
	talkTimer = window.setTimeout(() => {
		talking = -1;
		hopping = -1;
	}, 2600);
}

function popDoodle(k: number) {
	if (!interactive) return;
	const f = sim.floaters[k];
	if (f && f.pop <= 0) {
		f.pop = 1.4;
		paintDoodles();
	}
}

// ---- 字体实测：水合后再量一次，等 web font 加载完再量一次 ----
$effect(() => {
	const run = () => {
		const m = measure(word, fontFamily);
		if (m) metrics = m;
	};
	run();
	const fonts = typeof document !== "undefined" ? document.fonts : undefined;
	if (!fonts) return;
	let alive = true;
	fonts.ready.then(() => {
		if (alive) run();
	});
	fonts.addEventListener?.("loadingdone", run);
	return () => {
		alive = false;
		fonts.removeEventListener?.("loadingdone", run);
	};
});

// ---- 涂鸦布局：世界尺寸变化时重排 ----
$effect(() => {
	const el = worldEl;
	if (!el) return;
	const s = sim;
	const size = () => {
		const r = el.getBoundingClientRect();
		const ow = s.w;
		const oh = s.h;
		s.w = r.width;
		s.h = r.height;
		if (s.floaters.length !== doodleList.length || !ow) {
			s.floaters = doodleList.map((_, k) => ({
				x:
					(0.04 +
						0.92 *
							((k + hash(k * 9.1) * 0.8) / Math.max(1, doodleList.length))) *
					r.width,
				y: (0.02 + hash(k * 3.3) * 0.56) * r.height,
				vx: 0,
				vy: 0,
				rot: (hash(k * 1.7) - 0.5) * 50,
				vr: (hash(k * 6.1) - 0.5) * 30,
				fall: 9 + hash(k * 2.9) * 16,
				phase: hash(k * 8.3) * Math.PI * 2,
				pop: 0,
			}));
		} else if (ow && oh) {
			for (const f of s.floaters) {
				f.x *= r.width / ow;
				f.y *= r.height / oh;
			}
		}
		paintDoodles();
	};
	size();
	if (typeof ResizeObserver === "undefined") return;
	const ro = new ResizeObserver(size);
	ro.observe(el);
	return () => ro.disconnect();
});

// ---- reduced motion ----
$effect(() => {
	if (typeof window === "undefined" || !window.matchMedia) return;
	const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
	const on = () => {
		reduced = mq.matches;
	};
	on();
	mq.addEventListener?.("change", on);
	return () => mq.removeEventListener?.("change", on);
});

// ---- 进入视口开始分镜；离开视口时循环空转 ----
$effect(() => {
	const root = rootEl;
	if (!root) return;
	if (typeof IntersectionObserver === "undefined") {
		sim.visible = true;
		play = true;
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				sim.visible = e.isIntersecting;
				if (e.isIntersecting && e.intersectionRatio > 0.12) play = true;
			}
		},
		{ threshold: [0, 0.12, 0.3] },
	);
	io.observe(root);
	return () => io.disconnect();
});

$effect(() => {
	if (play && !sim.start) sim.start = performance.now();
});

// ---- 常驻循环：眼睛、眨眼、涂鸦、线条 boil ----
$effect(() => {
	if (typeof window === "undefined") return;
	const s = sim;
	let raf = 0;
	let last = performance.now();
	let boilAt = 0;
	let boil = 0;
	const rand = () => {
		s.seed = (s.seed * 16807) % 2147483647;
		return s.seed / 2147483647;
	};
	const svgPoint = (svg: SVGSVGElement, cx: number, cy: number) => {
		const m = svg.getScreenCTM();
		if (!m) return null;
		const inv = m.inverse();
		return {
			x: inv.a * cx + inv.c * cy + inv.e,
			y: inv.b * cx + inv.d * cy + inv.f,
		};
	};
	const frame = (now: number) => {
		raf = requestAnimationFrame(frame);
		if (!s.visible || document.hidden) {
			last = now;
			return;
		}
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		const t = now / 1000;
		const svg = svgEl;
		const world = worldEl;

		let target: { x: number; y: number } | null = null;
		if (svg && s.inside && interactive) target = svgPoint(svg, s.px, s.py);
		for (let c = 0; c < placed.length; c++) {
			const p = placed[c];
			let g = s.gaze[c];
			if (!g) {
				g = {
					x: 0,
					y: 0,
					tx: 0,
					ty: 0,
					next: 0,
					blinkAt: t + 1 + hash(c * 3.7) * 3,
					blink: 0,
					_o0: { x: 0, y: 0 },
					_o1: { x: 0, y: 0 },
				};
				s.gaze[c] = g;
			}
			if (!target && t > g.next) {
				const other =
					placed[
						(c + 1 + Math.floor(rand() * Math.max(1, placed.length - 1))) %
							placed.length
					];
				if (other && rand() < 0.45) {
					g.tx = other.x;
					g.ty = other.y - 60 * other.scale;
				} else {
					g.tx = p.x + (rand() - 0.5) * 900;
					g.ty = p.y - 80 * p.scale + (rand() - 0.5) * 500;
				}
				g.next = t + 1.4 + rand() * 2.6;
			}
			if (t > g.blinkAt) {
				g.blink = 0.16;
				g.blinkAt = t + 2.2 + rand() * 4;
			}
			g.blink = Math.max(0, g.blink - dt);
			const lid =
				g.blink > 0 ? 0.12 + (Math.abs(g.blink - 0.08) / 0.08) * 0.88 : 1;
			for (let e = 0; e < p.art.eyes.length; e++) {
				const eye = p.art.eyes[e];
				const ex = p.x + eye.x * p.scale * p.flip;
				const ey = p.y + eye.y * p.scale;
				const tx = target ? target.x : g.tx;
				const ty = target ? target.y : g.ty;
				const o = lookAt(ex, ey, tx, ty, eye.max, 220);
				const prev = e === 0 ? g._o0 : g._o1;
				const ease = Math.min(1, dt * (target ? 14 : 6));
				const nx = prev.x + (o.x * p.flip - prev.x) * ease;
				const ny = prev.y + (o.y - prev.y) * ease;
				if (e === 0) g._o0 = { x: nx, y: ny };
				else g._o1 = { x: nx, y: ny };
				const pupil = pupilEls[p.i * 2 + e];
				const blink = blinkEls[p.i * 2 + e];
				if (pupil)
					pupil.setAttribute(
						"transform",
						`translate(${nx.toFixed(2)} ${ny.toFixed(2)})`,
					);
				if (blink)
					blink.setAttribute(
						"transform",
						`translate(0 ${(eye.y * (1 - lid)).toFixed(2)}) scale(1 ${lid.toFixed(3)})`,
					);
			}
		}

		if (world && s.floaters.length) {
			const started =
				play && s.start ? now - s.start > tl.doodles || reduced : false;
			if (started) {
				const r = world.getBoundingClientRect();
				const px = s.inside && interactive ? s.px - r.left : Number.NaN;
				const py = s.inside && interactive ? s.py - r.top : Number.NaN;
				if (!reduced) {
					for (const f of s.floaters)
						stepFloater(f, dt, t, s.w, s.h, px, py, 110, rand);
				}
				paintDoodles();
			}
		}

		// 手绘线条 boil：三套笔触以 8fps 交换
		if (!reduced && now - boilAt > 125) {
			boilAt = now;
			boil = (boil + 1) % 3;
			const f = `url(#${uid}-boil${boil})`;
			for (const el of [crewLayer0, crewLayer1]) {
				if (el) el.setAttribute("filter", f);
			}
		}
	};
	raf = requestAnimationFrame(frame);
	return () => cancelAnimationFrame(raf);
});

onDestroy(() => clearTimeout(talkTimer));
</script>

{#snippet link(l: FooterLink)}
	{#if l.href}
		<a
			class="dcf-link"
			href={l.href}
			target={l.external ? "_blank" : undefined}
			rel={l.external ? l.rel ?? "noopener noreferrer" : undefined}
			data-no-swup={l.noSwup ? "" : undefined}
		>
			<span>{l.label}</span>
			<svg
				class="dcf-squiggle"
				viewBox="0 0 100 8"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<path
					pathLength={1}
					d="M1 5 C10 1 16 7 25 4 S40 1 50 4 S66 7 75 4 S90 1 99 4"
				></path>
			</svg>
		</a>
	{:else}
		<span class="dcf-link">{l.label}</span>
	{/if}
{/snippet}

{#snippet figure(p: Placed, part: "body" | "front")}
	<g transform={figureTransform(p)}>
		<g
			class="dcf-arrive dcf-arrive-{p.seat}"
			style="--d: {tl.member(p.i)}ms"
		>
			<g class="dcf-hopper" class:is-hop={hopping === p.i}>
				<g class="dcf-art {p.art.idle ?? ''}" style="--i: {p.i}">
					{#if part === "body"}
						<DoodleCrewArt kind={p.m.kind} {hatch} part="body"></DoodleCrewArt>
						{#each p.art.eyes as eye, e}
							<g bind:this={blinkEls[p.i * 2 + e]}>
								{#if eye.r > 0}
									<circle cx={eye.x} cy={eye.y} r={eye.r}></circle>
								{/if}
								<g bind:this={pupilEls[p.i * 2 + e]}>
									<circle class="k" cx={eye.x} cy={eye.y} r={eye.pupil}></circle>
									<circle
										class="dcf-glint"
										cx={eye.x + eye.pupil * 0.35}
										cy={eye.y - eye.pupil * 0.4}
										r={eye.pupil * 0.32}
									></circle>
								</g>
							</g>
						{/each}
					{:else}
						<DoodleCrewArt kind={p.m.kind} {hatch} part="front"></DoodleCrewArt>
					{/if}
				</g>
			</g>
		</g>
	</g>
{/snippet}

<footer
	bind:this={rootEl}
	class="dcf"
	data-play={play || reduced ? "1" : "0"}
	data-interactive={interactive ? "1" : "0"}
	style="--dcf-bg: {colors.background}; --dcf-ink: {colors.ink}; --dcf-accent: {colors.accent}; --dcf-serif: {serifFamily}; --dcf-display: {fontFamily};"
	onpointermove={onPointerMove}
	onpointerdown={onPointerMove}
	onpointerleave={onPointerLeave}
>
	<div class="dcf-top dcf-rise" style="--d: 0ms">
		<div class="dcf-brand">
			<span class="dcf-logo" aria-hidden="true">
				<svg viewBox="-60 -150 120 120" width="30" height="30">
					<g class="dcf-art">
						<path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z"></path>
						<path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z"></path>
						<path d="M-44 -30 C-54 -56 -54 -70 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -68 56 -54 48 -30 Z"></path>
						<circle class="k" cx="-15" cy="-84" r="5.5"></circle>
						<circle class="k" cx="13" cy="-86" r="5.5"></circle>
						<path class="n" d="M-12 -66 C-6 -60 6 -60 12 -67"></path>
					</g>
				</svg>
			</span>
			<span class="dcf-brandname">{brand}</span>
		</div>
		{#if blurb}
			<p class="dcf-blurb">{blurb}</p>
		{/if}
		{#if columns.length > 0}
			<nav class="dcf-cols" aria-label="页脚导航">
				{#each columns as col (col.title)}
					<div class="dcf-col">
						<h3 class="dcf-coltitle">{col.title}</h3>
						<ul>
							{#each col.links as l (l.label)}
								<li>{@render link(l)}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</nav>
		{/if}
	</div>

	<div class="dcf-world" bind:this={worldEl}>
		<div class="dcf-stage">
			<h2 class="dcf-sr">{wordmark}</h2>
			<svg
				bind:this={svgEl}
				class="dcf-svg"
				viewBox={vb}
				role="group"
				aria-label="{wordmark} —— 认识一下这群小家伙"
			>
				<defs>
					<pattern
						id="{uid}-hatch"
						width="4.6"
						height="4.6"
						patternUnits="userSpaceOnUse"
						patternTransform="rotate(38)"
					>
						<line
							x1="0"
							y1="0"
							x2="0"
							y2="4.6"
							style="stroke: var(--dcf-ink)"
							stroke-width="1.25"
						></line>
					</pattern>
					{#each [0, 1, 2] as k (k)}
						<filter
							id="{uid}-boil{k}"
							x="-10%"
							y="-10%"
							width="120%"
							height="120%"
						>
							<feTurbulence
								type="fractalNoise"
								baseFrequency="0.035"
								numOctaves="2"
								seed={k * 7 + 3}
								result="n"
							></feTurbulence>
							<feDisplacementMap
								in="SourceGraphic"
								in2="n"
								scale="2.6"
								xChannelSelector="R"
								yChannelSelector="G"
							></feDisplacementMap>
						</filter>
					{/each}
					<filter
						id="{uid}-ink"
						x="-4%"
						y="-6%"
						width="108%"
						height="112%"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.045"
							numOctaves="3"
							seed="11"
							result="edge"
						></feTurbulence>
						<feDisplacementMap
							in="SourceGraphic"
							in2="edge"
							scale="5"
							xChannelSelector="R"
							yChannelSelector="G"
							result="rough"
						></feDisplacementMap>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.018 0.32"
							numOctaves="2"
							seed="4"
							result="streak"
						></feTurbulence>
						<feColorMatrix
							in="streak"
							type="matrix"
							values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 5.6"
							result="streakA"
						></feColorMatrix>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.7"
							numOctaves="1"
							seed="9"
							result="speck"
						></feTurbulence>
						<feColorMatrix
							in="speck"
							type="matrix"
							values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 7.0"
							result="speckA"
						></feColorMatrix>
						<feComposite
							in="streakA"
							in2="speckA"
							operator="arithmetic"
							k1="0"
							k2="1"
							k3="1"
							k4="0"
							result="holes"
						></feComposite>
						<feComposite in="rough" in2="holes" operator="out"></feComposite>
					</filter>
				</defs>

				<g bind:this={crewLayer0}>
					<g class="dcf-ground">
						<path
							class="dcf-draw"
							pathLength={1}
							d={ground.d}
							style="--d: {tl.ground}ms"
						></path>
						<path
							class="dcf-tufts dcf-fade"
							d={ground.tufts}
							style="--d: {tl.ground + 500}ms"
						></path>
						{#each ground.pebbles as pb, k (k)}
							<ellipse
								class="dcf-pebble dcf-fade"
								cx={pb.x}
								cy={pb.y}
								rx={pb.r * 1.5}
								ry={pb.r}
								style="--d: {tl.ground + 600}ms"
							></ellipse>
						{/each}
					</g>
					{#each placed.filter((p) => p.seat === "behind") as p (p.i)}
						{@render figure(p, "body")}
					{/each}
				</g>

				{#each chars as c, i (i)}
					{#if c !== " "}
						<g
							class="dcf-letter"
							style={letterStyle(i)}
						>
							<g class="dcf-glyph">
								<text
									x={layout.x[i]}
									y="0"
									font-size={FONT_SIZE}
									font-weight="900"
									style="font-family: {fontFamily}"
									filter="url(#{uid}-ink)">{c}</text>
							</g>
							<path class="dcf-dust" d={dustPath(i)}></path>
						</g>
					{/if}
				{/each}

				<g bind:this={crewLayer1}>
					{#each placed.filter((p) => p.seat === "behind") as p (p.i)}
						{@render figure(p, "front")}
					{/each}
					{#each placed.filter((p) => p.seat !== "behind") as p (p.i)}
						{@render figure(p, "body")}
					{/each}
				</g>

				{#if interactive}
					{#each placed as p (p.i)}
						{@const bx =
							p.flip > 0
								? [p.art.box.l, p.art.box.r]
								: [-p.art.box.r, -p.art.box.l]}
						{@const top = p.art.box.t}
						{@const bottom = p.seat === "behind" ? -30 : p.art.box.b}
						<rect
							class="dcf-hit"
							x={p.x + bx[0] * p.scale}
							y={p.y + top * p.scale}
							width={(bx[1] - bx[0]) * p.scale}
							height={(bottom - top) * p.scale}
							rx={12}
							role="button"
							tabindex="0"
							aria-label={(p.m.name || p.m.kind) +
								(p.m.says ? ": " + p.m.says : "")}
							onclick={() => poke(p.i)}
							onkeydown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									poke(p.i);
								}
							}}
						></rect>
					{/each}
				{/if}
			</svg>

			<div class="dcf-bubbles" aria-live="polite">
				{#each placed as p (p.i)}
					{#if talking === p.i && p.m.says}
						<div
							class="dcf-bubble"
							class:is-left={p.x > view.x + view.w * 0.72}
							class:is-right={p.x < view.x + view.w * 0.24}
							style={bubbleStyle(p)}
						>
							{p.m.says}
						</div>
					{/if}
				{/each}
			</div>
		</div>

		{#if doodleList.length > 0}
			<div class="dcf-doodles" aria-hidden="true">
				{#each doodleList as d, k (k)}
					<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
					<div
						class="dcf-doodle"
						bind:this={doodleEls[k]}
						style={doodleStyle(d.size)}
						onpointerdown={() => popDoodle(k)}
					>
						<span
							class="dcf-doodle-in"
							style="--d: {tl.doodles + k * 70}ms"
						>
							<svg viewBox="-16 -16 32 32" width={d.size} height={d.size}>
								<DoodleShape kind={d.kind}></DoodleShape>
							</svg>
						</span>
					</div>
				{/each}
			</div>
		{/if}

		<div class="dcf-cta">
			<p class="dcf-tagline">
				{#each words as w, k (k)}
					<span class="dcf-word" style="--d: {tl.word(k)}ms">{w}</span>
				{/each}
			</p>
			{#if actions.length > 0}
				<div class="dcf-actions">
					{#each actions as a, k (a.label)}
						<a
							class={actionClass(a)}
							style="--d: {tl.action(k)}ms"
							href={a.href}
							target={a.external ? "_blank" : undefined}
							rel={a.external ? "noopener noreferrer" : undefined}
							data-no-swup={a.noSwup ? "" : undefined}
						>
							{#if a.icon}
								<svg
									class="dcf-icon"
									viewBox="-16 -16 32 32"
									width="18"
									height="18"
									aria-hidden="true"
								>
									<DoodleShape kind={a.icon}></DoodleShape>
								</svg>
							{/if}
							<span>{a.label}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="dcf-bar dcf-rise" style="--d: 120ms">
		<p class="dcf-copy">{copyright}</p>
		{#if legal.length > 0}
			<ul class="dcf-inline">
				{#each legal as l (l.label)}
					<li>{@render link(l)}</li>
				{/each}
			</ul>
		{/if}
		{#if socials.length > 0}
			<ul class="dcf-inline dcf-socials">
				{#each socials as l (l.label)}
					<li>{@render link(l)}</li>
				{/each}
			</ul>
		{/if}
	</div>
</footer>
