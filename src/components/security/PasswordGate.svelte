<script lang="ts">
/**
 * 页面加密毛玻璃门（与 EncryptGate.astro 配套）
 *
 * SSR 渲染固定全屏毛玻璃遮罩 + 中央锁卡，未解锁时页面的敏感容器是空的
 * （构建时已被 EncryptGate 加密成密文）。解锁成功后把解密 HTML 注入容器，
 * 播放"散焦 → 清晰"过渡，并同步派发 swup:content:replaced，
 * 让账单翻页脚本、笔记本展开/评论委托等依赖该事件的自注册逻辑重新初始化。
 */
import { Lock } from "lucide-svelte";
import { onMount, tick } from "svelte";
import { securityConfig } from "@/config";
import {
	clearGateFailures,
	type GatePayload,
	getGateFailureState,
	hasCachedGateKey,
	recordGateFailure,
	tryUnlockWithStoredKey,
	unlockGateWithPassword,
} from "@/utils/encrypt-gate";

interface Props {
	gateId: string;
}

let { gateId }: Props = $props();

let locked = $state(true);
let unlocking = $state(false);
let busy = $state(false);
let password = $state("");
let error = $state("");
let remember = $state(securityConfig.rememberDays > 0);
let cooldownUntil = $state(0);
let nowTick = $state(Date.now());
let inputEl = $state<HTMLInputElement | null>(null);

let payload: GatePayload | null = null;
let cooldownTimer: number | undefined;
let removeTimer: number | undefined;

const cooling = $derived(cooldownUntil > nowTick);
const cooldownLeft = $derived(
	cooling ? Math.ceil((cooldownUntil - nowTick) / 1000) : 0,
);
const rememberLabel = $derived(
	securityConfig.rememberText.replace(
		"{days}",
		String(securityConfig.rememberDays),
	),
);

function findPayload(): GatePayload | null {
	const holder = document.querySelector(
		`[data-gate-id="${CSS.escape(gateId)}"]`,
	);
	const template = holder?.querySelector("template[data-gate-template]");
	// 模板的文本在 content fragment 里，template.textContent 可能为空，需读 content
	const raw = (
		template?.content?.textContent ??
		template?.textContent ??
		""
	).trim();
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as GatePayload;
		return parsed.salt && parsed.iv && parsed.ct ? parsed : null;
	} catch {
		return null;
	}
}

function injectPayload(html: string) {
	const holder = document.querySelector(
		`[data-gate-id="${CSS.escape(gateId)}"]`,
	);
	if (!holder) return;
	holder.innerHTML = html;
	holder.classList.remove("encrypt-payload");
	// innerHTML 注入的 <script> 不会执行：重建 script 元素激活解密内容里的
	// 内联脚本（账单筛选/分页等），脚本自身用 dataset guard 保证幂等
	holder.querySelectorAll("script").forEach((old) => {
		const s = document.createElement("script");
		for (const attr of Array.from(old.attributes)) {
			s.setAttribute(attr.name, attr.value);
		}
		s.textContent = old.textContent;
		old.parentNode?.replaceChild(s, old);
	});
}

function lockBackgroundScroll() {
	document.documentElement.style.overflow = "hidden";
	document.body.style.overflow = "hidden";
}

function unlockBackgroundScroll() {
	document.documentElement.style.overflow = "";
	document.body.style.overflow = "";
}

function shakeInput() {
	if (!inputEl) return;
	inputEl.animate(
		[
			{ transform: "translateX(0)" },
			{ transform: "translateX(-7px)" },
			{ transform: "translateX(6px)" },
			{ transform: "translateX(-4px)" },
			{ transform: "translateX(3px)" },
			{ transform: "translateX(0)" },
		],
		{ duration: 400, easing: "ease" },
	);
}

async function finishUnlock() {
	clearGateFailures();
	unlockBackgroundScroll();
	unlocking = true;
	window.dispatchEvent(new CustomEvent("swup:content:replaced"));
	if (typeof inputEl?.animate !== "function") {
		locked = false;
		return;
	}
	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	removeTimer = window.setTimeout(
		() => {
			locked = false;
			unlocking = false;
		},
		reduceMotion ? 0 : 560,
	);
}

async function attemptWithPassword() {
	if (!payload) {
		error = "页面数据异常，请刷新重试";
		return;
	}
	const trimmed = password.trim();
	if (!trimmed) {
		error = securityConfig.emptyError;
		shakeInput();
		return;
	}
	busy = true;
	error = "";
	try {
		const html = await unlockGateWithPassword(payload, trimmed, remember);
		injectPayload(html);
		await finishUnlock();
	} catch {
		const state = recordGateFailure();
		if (state.cooldownUntil > Date.now()) {
			cooldownUntil = state.cooldownUntil;
			nowTick = Date.now();
			error = `${securityConfig.cooldownError}（${securityConfig.cooldownSeconds} 秒后可重试）`;
		} else {
			error = securityConfig.wrongError;
		}
		shakeInput();
	} finally {
		busy = false;
	}
}

function handleSubmit(event: SubmitEvent) {
	event.preventDefault();
	if (busy || cooling) return;
	void attemptWithPassword();
}

onMount(() => {
	payload = findPayload();

	const failure = getGateFailureState();
	if (failure.cooldownUntil > Date.now()) cooldownUntil = failure.cooldownUntil;

	// 会话内已有密钥（Swup 导航回加密页）：不渲染门，直接注入
	if (payload && hasCachedGateKey(payload)) {
		locked = false;
		void tryUnlockWithStoredKey(payload).then((html) => {
			if (html) injectPayload(html);
			else locked = true;
		});
	} else if (payload && securityConfig.rememberDays > 0) {
		// 重开浏览器后的持久记忆：免输入解锁注入，失败则保持门
		void tryUnlockWithStoredKey(payload).then((html) => {
			if (html) {
				injectPayload(html);
				void finishUnlock();
			} else {
				void tick().then(() => inputEl?.focus());
			}
		});
	} else {
		void tick().then(() => inputEl?.focus());
	}

	if (locked) lockBackgroundScroll();
	cooldownTimer = window.setInterval(() => {
		nowTick = Date.now();
	}, 1000);

	return () => {
		if (cooldownTimer) window.clearInterval(cooldownTimer);
		if (removeTimer) window.clearTimeout(removeTimer);
		unlockBackgroundScroll();
	};
});
</script>

{#if locked}
	<div
		class="encrypt-gate"
		class:is-unlocking={unlocking}
		role="dialog"
		aria-modal="true"
		aria-label="加密内容解锁"
	>
		<div class="encrypt-gate__skeletons" aria-hidden="true">
			<div class="encrypt-gate__skeleton"></div>
			<div class="encrypt-gate__skeleton"></div>
			<div class="encrypt-gate__skeleton"></div>
			<div class="encrypt-gate__skeleton"></div>
		</div>

		<div class="encrypt-gate__card">
			<div class="encrypt-gate__lock" aria-hidden="true">
				<Lock size={26} strokeWidth={2.2} />
			</div>
			<h2 class="encrypt-gate__title">{securityConfig.title}</h2>
			<p class="encrypt-gate__hint">{securityConfig.hint}</p>

			<form class="encrypt-gate__form" onsubmit={handleSubmit}>
				<input
					bind:this={inputEl}
					bind:value={password}
					class="encrypt-gate__input"
					class:is-error={Boolean(error)}
					type="password"
					placeholder="访问密码"
					autocomplete="current-password"
					aria-label="访问密码"
					disabled={busy || cooling}
					oninput={() => {
						error = "";
					}}
				/>
				<p class="encrypt-gate__error" role="alert">
					{#if cooling}
						{securityConfig.cooldownError}（{cooldownLeft}s）
					{:else}
						{error}
					{/if}
				</p>
				<button
					class="encrypt-gate__submit"
					type="submit"
					disabled={busy || cooling}
				>
					{busy
						? securityConfig.unlockingText
						: cooling
							? `请等待 ${cooldownLeft}s`
							: securityConfig.unlockText}
				</button>
			</form>

			{#if securityConfig.rememberDays > 0}
				<label class="encrypt-gate__remember">
					<input type="checkbox" bind:checked={remember} />
					<span>{rememberLabel}</span>
				</label>
			{/if}

			<noscript>
				<p class="encrypt-gate__noscript">需要启用 JavaScript 才能解锁此页面</p>
			</noscript>
		</div>
	</div>
{/if}
