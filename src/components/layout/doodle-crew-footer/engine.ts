/**
 * Doodle Crew 页脚的纯计算层：字宽排版、座位、视线、涂鸦漂移、分镜时间线。
 * 这里不碰 DOM（测量字体在组件里做），方便单独用 tsx 跑一遍断言。
 */
import type { CrewKind, CrewMember, Seat } from "@/types/config";

/** 固定种子的 hash → [0, 1)，保证每次渲染的布局一致 */
export const hash = (n: number): number => {
	const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return s - Math.floor(s);
};

export const clamp = (v: number, lo: number, hi: number): number =>
	v < lo ? lo : v > hi ? hi : v;

/**
 * 按每个字母的 advance（字体单位）排字：返回每个字母的左边缘、宽度和总宽。
 * 非有限值或负数按 0 处理，避免一个坏字形把整行挤飞。
 */
export const layoutWord = (
	advances: number[],
	tracking: number,
	fontSize: number,
): { x: number[]; w: number[]; width: number } => {
	const x: number[] = [];
	const w: number[] = [];
	let at = 0;
	const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize;
	for (let i = 0; i < advances.length; i++) {
		const a = Number.isFinite(advances[i]) && advances[i] > 0 ? advances[i] : 0;
		x.push(at);
		w.push(a);
		at += a + (i < advances.length - 1 ? gap : 0);
	}
	return { x, w, width: Math.max(0, at) };
};

/**
 * 角色站在哪：front 站在字前的地面上，top 坐在字顶，behind 从字后探出头。
 * offset 沿字母滑动，单位是字母宽度。
 */
export const seatPoint = (
	seat: Seat,
	letterX: number,
	letterW: number,
	cap: number,
	offset: number,
	scale: number,
): { x: number; y: number } => {
	const x = letterX + letterW * (0.5 + (Number.isFinite(offset) ? offset : 0));
	if (seat === "top") return { x, y: -cap };
	if (seat === "behind") return { x, y: -cap + 30 * scale };
	return { x, y: 0 };
};

/**
 * 瞳孔位置：朝目标点，最远不超过 max；目标贴近眼睛时自然减速，避免抖动。
 */
export const lookAt = (
	ex: number,
	ey: number,
	tx: number,
	ty: number,
	max: number,
	reach: number,
): { x: number; y: number } => {
	const dx = tx - ex;
	const dy = ty - ey;
	const d = Math.hypot(dx, dy);
	if (!Number.isFinite(d) || d < 1e-6 || max <= 0) return { x: 0, y: 0 };
	const k = (max * Math.min(1, d / Math.max(1e-6, reach))) / d;
	return { x: dx * k, y: dy * k };
};

export type Floater = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	rot: number;
	vr: number;
	fall: number;
	phase: number;
	/** 剩余 pop 秒数；0 表示正常漂移 */
	pop: number;
};

/**
 * 涂鸦漂移一步：各自下落 + 左右摇摆；指针在 radius 内把它推开；松手后回到漂移；
 * 出界从另一侧回来。被戳破的涂鸦等计时结束再从顶部重新进场。
 */
export const stepFloater = (
	f: Floater,
	dt: number,
	t: number,
	w: number,
	h: number,
	px: number,
	py: number,
	radius: number,
	rand: () => number,
): Floater => {
	const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05);
	const m = 40;
	if (f.pop > 0) {
		f.pop -= step;
		if (f.pop <= 0) {
			f.pop = 0;
			f.x = rand() * w;
			f.y = -m;
			f.vx = 0;
			f.vy = f.fall;
		}
		return f;
	}
	const sway = Math.sin(t * 0.7 + f.phase) * 14;
	if (Number.isFinite(px) && Number.isFinite(py) && radius > 0) {
		const dx = f.x - px;
		const dy = f.y - py;
		const d = Math.hypot(dx, dy);
		if (d < radius && d > 0.01) {
			const k = (1 - d / radius) * (1 - d / radius) * 2400;
			f.vx += (dx / d) * k * step;
			f.vy += (dy / d) * k * step;
			f.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step;
		}
	}
	const ease = Math.min(1, step * 2.4);
	f.vx += (sway - f.vx) * ease;
	f.vy += (f.fall - f.vy) * ease;
	f.vr += (Math.sin(f.phase * 3) * 18 - f.vr) * Math.min(1, step * 0.8);
	f.x += f.vx * step;
	f.y += f.vy * step;
	f.rot = (f.rot + f.vr * step) % 360;
	if (f.y > h + m) {
		f.y = -m;
		f.x = rand() * w;
	} else if (f.y < -m * 3) {
		f.y = h + m;
	}
	if (f.x < -m) f.x = w + m;
	else if (f.x > w + m) f.x = -m;
	return f;
};

/**
 * 分镜时间线（ms，从页脚进入视口开始算）：画地面 → 字母逐个盖章 →
 * 角色登场 → 涂鸦 → 文案逐字 → 按钮。
 */
export const timeline = (
	letters: number,
	crew: number,
	words: number,
	actions: number,
) => {
	const L = Math.max(0, Math.floor(letters) || 0);
	const C = Math.max(0, Math.floor(crew) || 0);
	const W = Math.max(0, Math.floor(words) || 0);
	const A = Math.max(0, Math.floor(actions) || 0);
	const letter = (i: number) => 160 + i * 80;
	const crewStart = letter(Math.max(0, L - 1)) + 420;
	const member = (j: number) => crewStart + j * 130;
	const doodles = crewStart + Math.max(0, C - 1) * 130 * 0.5;
	const copy = crewStart + 260;
	const word = (k: number) => copy + k * 45;
	const actionsStart = word(W) + 120;
	const action = (k: number) => actionsStart + k * 110;
	const total = Math.max(
		member(Math.max(0, C - 1)) + 720,
		action(Math.max(0, A - 1)) + 600,
		letter(Math.max(0, L - 1)) + 560,
	);
	return {
		ground: 60,
		letter,
		crewStart,
		member,
		doodles,
		word,
		action,
		total,
	};
};

// ---- 字体与测量 ---------------------------------------------------------------

export const FONT_SIZE = 200;
export const DEFAULT_FONT =
	'"Arial Black", "Inter Display", Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';
export const DEFAULT_SERIF =
	'"Iowan Old Style", "Palatino Linotype", Palatino, "LXGW WenKai", "Songti SC", "Noto Serif SC", "SimSun", Georgia, serif';

export type Metrics = { advances: number[]; cap: number };

const isWide = (c: string): boolean => /[\u3000-\u9fff\uff00-\uffef]/.test(c);

/** 首屏（SSR）没有 canvas 时的估算，水合后会被真实测量覆盖 */
export const estimate = (word: string): Metrics => ({
	advances: Array.from(word).map(
		(c) =>
			(c === " "
				? 0.3
				: isWide(c)
					? 1
					: /[IJ1]/.test(c)
						? 0.42
						: /[MW]/.test(c)
							? 0.98
							: 0.76) * FONT_SIZE,
	),
	cap: 0.73 * FONT_SIZE,
});

// ---- 角色绘制元数据 -----------------------------------------------------------

export type Eye = {
	x: number;
	y: number;
	r: number;
	pupil: number;
	max: number;
};

export type ArtMeta = {
	/** 相对字母的大小 */
	k: number;
	box: { l: number; r: number; t: number; b: number };
	eyes: Eye[];
	seat: Seat;
	idle?: string;
};

/** 每种角色自己的坐标系：原点在脚底中心，向上为负，字母 cap 高约 144 单位 */
export const ART_META: Record<CrewKind, ArtMeta> = {
	yeti: {
		k: 1,
		box: { l: -72, r: 60, t: -140, b: 6 },
		seat: "front",
		eyes: [
			{ x: -15, y: -86, r: 8, pupil: 3.6, max: 3.6 },
			{ x: 13, y: -88, r: 8, pupil: 3.6, max: 3.6 },
		],
	},
	kid: {
		k: 1.28,
		box: { l: -30, r: 30, t: -88, b: 42 },
		seat: "top",
		eyes: [
			{ x: -6, y: -58, r: 0, pupil: 2.5, max: 1.8 },
			{ x: 6.5, y: -58, r: 0, pupil: 2.5, max: 1.8 },
		],
	},
	bird: {
		k: 1.22,
		box: { l: -34, r: 30, t: -62, b: 2 },
		seat: "top",
		eyes: [
			{ x: 3, y: -30, r: 4.6, pupil: 2.3, max: 2 },
			{ x: 12, y: -31, r: 4.6, pupil: 2.3, max: 2 },
		],
		idle: "dcf-peck",
	},
	cat: {
		k: 1.06,
		box: { l: -30, r: 52, t: -110, b: 4 },
		seat: "front",
		eyes: [{ x: 10, y: -76, r: 6, pupil: 2.8, max: 2.6 }],
	},
	ghost: {
		k: 1.3,
		box: { l: -26, r: 26, t: -70, b: 0 },
		seat: "behind",
		eyes: [
			{ x: -8, y: -44, r: 6.5, pupil: 3.2, max: 3 },
			{ x: 9, y: -44, r: 6.5, pupil: 3.2, max: 3 },
		],
		idle: "dcf-bob",
	},
	mushroom: {
		k: 1.12,
		box: { l: -27, r: 27, t: -56, b: 4 },
		seat: "front",
		eyes: [
			{ x: -4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
			{ x: 4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
		],
		idle: "dcf-sway",
	},
};

export type Placed = {
	i: number;
	m: CrewMember;
	art: ArtMeta;
	seat: Seat;
	scale: number;
	x: number;
	y: number;
	flip: 1 | -1;
};
