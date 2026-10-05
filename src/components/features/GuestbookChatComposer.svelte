<script lang="ts">
import {
	ImagePlus,
	LoaderCircle,
	Reply,
	Smile,
	TriangleAlert,
	X,
} from "lucide-svelte";
import { tick } from "svelte";
import { commentConfig } from "@/config/commentConfig";
import type {
	GuestbookAuthUser,
	GuestbookChatMessage,
	GuestbookEmojiItem,
	GuestbookEmojiPack,
	GuestbookImageAttachment,
	GuestbookProfile,
} from "@/types/guestbook-chat";
import {
	loadGuestbookEmojiPacks,
	uploadGuestbookImage,
	WALINE_INLINE_IMAGE_SIZE_LIMIT,
} from "@/utils/guestbook-chat";

interface Props {
	profile: GuestbookProfile;
	authUser: GuestbookAuthUser | null;
	draft: string;
	replyTarget: GuestbookChatMessage | null;
	composerError: string;
	isOffline: boolean;
	isSending: boolean;
	loggingIn: boolean;
	loginMode: "enable" | "force" | "disable";
	onProfileChange: (profile: GuestbookProfile) => void;
	onDraftChange: (draft: string) => void;
	onReplyCancel: () => void;
	onLogin: () => void;
	onLogout: () => void;
	onSend: (
		content: string,
		attachment?: GuestbookImageAttachment,
	) => Promise<boolean>;
	onToolError: (message: string) => void;
}

let {
	profile,
	authUser,
	draft,
	replyTarget,
	composerError,
	isOffline,
	isSending,
	loggingIn,
	loginMode,
	onProfileChange,
	onDraftChange,
	onReplyCancel,
	onLogin,
	onLogout,
	onSend,
	onToolError,
}: Props = $props();

const MAX_DRAFT_LENGTH = 300;
const MAX_REMOTE_IMAGE_SIZE = 5 * 1024 * 1024;
const MIN_MESSAGE_PANE_HEIGHT = 128;
const RESIZE_KEYBOARD_STEP = 16;
const emojiSources = commentConfig.waline?.emoji ?? [];
const imageUploadURL = commentConfig.waline?.imageUploadURL ?? "";
const maxImageSize = imageUploadURL
	? MAX_REMOTE_IMAGE_SIZE
	: WALINE_INLINE_IMAGE_SIZE_LIMIT;
const supportedImageTypes = new Set([
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/webp",
]);

let textarea = $state<HTMLTextAreaElement | null>(null);
let emojiTrigger = $state<HTMLButtonElement | null>(null);
let emojiPanel = $state<HTMLDivElement | null>(null);
let imageInput = $state<HTMLInputElement | null>(null);
let profileDialog = $state<HTMLDialogElement | null>(null);
let profileNickInput = $state<HTMLInputElement | null>(null);
let showEmojiPicker = $state(false);
let isComposing = $state(false);
let isLoadingEmojis = $state(false);
let isUploadingImage = $state(false);
let pendingImage = $state<GuestbookImageAttachment | null>(null);
let emojiError = $state("");
let emojiPacks = $state<GuestbookEmojiPack[]>([]);
let activeEmojiPackIndex = $state(0);
let manualTextareaHeight = $state<number | null>(null);
let resizePointerId = $state<number | null>(null);
let profileDraft = $state<GuestbookProfile>({ nick: "", mail: "", link: "" });
let profileDialogError = $state("");
let resizeStartY = 0;
let resizeStartHeight = 0;

const inputDisabled = $derived(
	isOffline || (loginMode === "force" && !authUser),
);
const authName = $derived(authUser?.display_name || "访客");
const activeEmojiPack = $derived(emojiPacks[activeEmojiPackIndex] ?? null);
const hasGuestProfile = $derived(profile.nick.trim().length >= 2);

function formatMobileIdentityName(value: string): string {
	const characters = Array.from(value.trim());
	return characters.length > 4
		? `${characters.slice(0, 4).join("")}...`
		: characters.join("");
}

async function openGuestProfile() {
	profileDraft = { ...profile };
	profileDialogError = "";
	if (!profileDialog?.open) profileDialog?.showModal();
	document.body.style.overflow = "hidden";
	await tick();
	profileNickInput?.focus();
}

function closeGuestProfile() {
	if (profileDialog?.open) profileDialog.close();
	profileDialogError = "";
	document.body.style.overflow = "";
}

function validateGuestProfile(nextProfile: GuestbookProfile): string {
	if (nextProfile.nick.length < 2) return "游客昵称至少需要 2 个字符";
	if (!nextProfile.mail) return "请填写邮箱，游客留言需要留下邮箱";
	if (
		nextProfile.mail &&
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(nextProfile.mail)
	) {
		return "邮箱格式不正确";
	}
	if (nextProfile.link) {
		try {
			const website = new URL(nextProfile.link);
			if (website.protocol !== "http:" && website.protocol !== "https:") {
				return "网站地址仅支持 http 或 https";
			}
		} catch {
			return "网站地址格式不正确";
		}
	}
	return "";
}

function saveGuestProfile() {
	const nextProfile = {
		nick: profileDraft.nick.trim(),
		mail: profileDraft.mail.trim(),
		link: profileDraft.link.trim(),
	};
	profileDialogError = validateGuestProfile(nextProfile);
	if (profileDialogError) return;
	onProfileChange(nextProfile);
	onToolError("");
	closeGuestProfile();
}

function resizeTextarea() {
	if (!textarea) return;
	if (manualTextareaHeight !== null) return;
	textarea.style.height = "auto";
	textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
}

function getTextareaHeightBounds() {
	if (!textarea) return null;
	const styles = getComputedStyle(textarea);
	const minHeight = Number.parseFloat(styles.minHeight);
	const cssMaxHeight = Number.parseFloat(styles.maxHeight);
	const conversation = textarea.closest<HTMLElement>(
		".guestbook-chat__conversation",
	);
	const composer = textarea.closest<HTMLElement>(
		".guestbook-chat__composer-area",
	);
	const currentHeight = textarea.getBoundingClientRect().height;
	const fixedComposerHeight = composer
		? composer.getBoundingClientRect().height - currentHeight
		: 0;
	const availableHeight = conversation
		? conversation.getBoundingClientRect().height -
			fixedComposerHeight -
			MIN_MESSAGE_PANE_HEIGHT
		: window.innerHeight * 0.45;
	const configuredMax = Number.isFinite(cssMaxHeight)
		? cssMaxHeight
		: window.innerHeight * 0.45;
	const minimum = Number.isFinite(minHeight) ? minHeight : 56;

	return {
		min: minimum,
		max: Math.max(minimum, Math.min(configuredMax, availableHeight)),
	};
}

function setTextareaHeight(height: number) {
	if (!textarea) return;
	const bounds = getTextareaHeightBounds();
	if (!bounds) return;
	const nextHeight = Math.round(
		Math.min(bounds.max, Math.max(bounds.min, height)),
	);
	manualTextareaHeight = nextHeight;
	textarea.style.height = `${nextHeight}px`;
}

function startTextareaResize(event: PointerEvent) {
	if (!textarea || event.button !== 0) return;
	event.preventDefault();
	resizePointerId = event.pointerId;
	resizeStartY = event.clientY;
	resizeStartHeight = textarea.getBoundingClientRect().height;
	(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
}

function moveTextareaResize(event: PointerEvent) {
	if (resizePointerId !== event.pointerId) return;
	setTextareaHeight(resizeStartHeight + resizeStartY - event.clientY);
}

function finishTextareaResize(event: PointerEvent) {
	if (resizePointerId !== event.pointerId) return;
	const handle = event.currentTarget as HTMLButtonElement;
	if (handle.hasPointerCapture(event.pointerId)) {
		handle.releasePointerCapture(event.pointerId);
	}
	resizePointerId = null;
}

function handleResizeKeydown(event: KeyboardEvent) {
	if (
		!textarea ||
		!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)
	) {
		return;
	}
	event.preventDefault();
	const bounds = getTextareaHeightBounds();
	if (!bounds) return;
	const currentHeight = textarea.getBoundingClientRect().height;
	if (event.key === "Home") setTextareaHeight(bounds.min);
	else if (event.key === "End") setTextareaHeight(bounds.max);
	else {
		setTextareaHeight(
			currentHeight +
				(event.key === "ArrowUp"
					? RESIZE_KEYBOARD_STEP
					: -RESIZE_KEYBOARD_STEP),
		);
	}
}

function handleWindowResize() {
	if (manualTextareaHeight !== null) {
		setTextareaHeight(manualTextareaHeight);
	}
}

function handleInput(event: Event) {
	onDraftChange((event.currentTarget as HTMLTextAreaElement).value);
	resizeTextarea();
}

function handleKeydown(event: KeyboardEvent) {
	if (
		event.key !== "Enter" ||
		event.shiftKey ||
		event.isComposing ||
		isComposing ||
		isUploadingImage
	) {
		return;
	}
	event.preventDefault();
	void submitMessage();
}

function handleWindowKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") showEmojiPicker = false;
}

function handleWindowPointerdown(event: PointerEvent) {
	const target = event.target;
	if (!(target instanceof Node)) return;
	if (emojiTrigger?.contains(target) || emojiPanel?.contains(target)) return;
	showEmojiPicker = false;
}

function insertContent(content: string): boolean {
	if (!textarea) {
		const nextDraft = `${draft}${content}`;
		if (nextDraft.length > MAX_DRAFT_LENGTH) {
			onToolError(`消息不能超过 ${MAX_DRAFT_LENGTH} 个字符`);
			return false;
		}
		onDraftChange(nextDraft);
		return true;
	}

	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const nextDraft = `${draft.slice(0, start)}${content}${draft.slice(end)}`;
	if (nextDraft.length > MAX_DRAFT_LENGTH) {
		onToolError(`消息不能超过 ${MAX_DRAFT_LENGTH} 个字符`);
		return false;
	}
	onDraftChange(nextDraft);
	void tick().then(() => {
		if (!textarea) return;
		textarea.focus();
		textarea.setSelectionRange(start + content.length, start + content.length);
		resizeTextarea();
	});
	return true;
}

async function loadEmojis() {
	if (isLoadingEmojis) return;
	isLoadingEmojis = true;
	emojiError = "";
	try {
		emojiPacks = await loadGuestbookEmojiPacks(emojiSources);
		activeEmojiPackIndex = 0;
	} catch (error) {
		emojiError =
			error instanceof Error
				? error.message
				: "Waline 表情加载失败，请稍后重试";
	} finally {
		isLoadingEmojis = false;
	}
}

function toggleEmojiPicker() {
	showEmojiPicker = !showEmojiPicker;
	if (showEmojiPicker && emojiPacks.length === 0) void loadEmojis();
}

function insertEmoji(emoji: GuestbookEmojiItem) {
	if (insertContent(`:${emoji.key}:`)) showEmojiPicker = false;
}

function serializeEmojiShortcodes(content: string): string {
	const emojiByKey = new Map(
		emojiPacks.flatMap((pack) =>
			pack.items.map((emoji) => [emoji.key, emoji.url] as const),
		),
	);
	return content.replace(/:([A-Za-z0-9_-]+):/gu, (shortcode, key: string) => {
		const url = emojiByKey.get(key);
		return url ? `![${key}](${url} "emoji")` : shortcode;
	});
}

function renderDraftWithEmojis(content: string): string {
	if (!content || emojiPacks.length === 0) return "";
	const emojiByKey = new Map(
		emojiPacks.flatMap((pack) =>
			pack.items.map((emoji) => [emoji.key, emoji.url] as const),
		),
	);
	let hasEmoji = false;
	const html = content
		.replace(/&/gu, "&amp;")
		.replace(/</gu, "&lt;")
		.replace(/>/gu, "&gt;")
		.replace(/:([A-Za-z0-9_-]+):/gu, (_match, key: string) => {
			const url = emojiByKey.get(key);
			if (url) {
				hasEmoji = true;
				return `<img src="${url}" alt=":${key}:" class="guestbook-composer__preview-emoji" loading="lazy" />`;
			}
			return `:${key}:`;
		})
		.replace(/\n/gu, "<br>");
	return hasEmoji ? html : "";
}

function openImagePicker() {
	showEmojiPicker = false;
	imageInput?.click();
}

async function submitMessage() {
	if (!authUser && loginMode !== "force" && !hasGuestProfile) {
		onToolError(
			loginMode === "disable"
				? "请先通过游客访问填写资料后再发送"
				: "请选择游客访问并填写资料，或登录后发送",
		);
		return;
	}
	const accepted = await onSend(
		serializeEmojiShortcodes(draft.trim()),
		pendingImage ?? undefined,
	);
	if (accepted) pendingImage = null;
}

async function handleImageSelection(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file) return;
	if (!supportedImageTypes.has(file.type)) {
		onToolError("仅支持 PNG、JPEG、GIF 或 WebP 图片");
		return;
	}
	if (file.size > maxImageSize) {
		onToolError(
			imageUploadURL ? "图片不能超过 5 MB" : "Waline 原生图片不能超过 128 KB",
		);
		return;
	}

	isUploadingImage = true;
	onToolError("");
	try {
		const url = await uploadGuestbookImage(file, imageUploadURL);
		const name = file.name
			.replace(/\.[^.]+$/u, "")
			.replace(/[[\]]/gu, "")
			.trim();
		pendingImage = { name: name || "图片", url };
	} catch (error) {
		onToolError(
			error instanceof Error ? error.message : "图片上传失败，请稍后重试",
		);
	} finally {
		isUploadingImage = false;
	}
}
</script>

<svelte:window
	onkeydown={handleWindowKeydown}
	onpointerdown={handleWindowPointerdown}
	onresize={handleWindowResize}
/>

<footer class="guestbook-composer">
	{#if replyTarget}
		<div class="guestbook-composer__reply">
			<Reply size={16} aria-hidden="true" />
			<div>
				<span>回复 @{replyTarget.nick}</span>
				<small>{replyTarget.body.slice(0, 80)}</small>
			</div>
			<button type="button" onclick={onReplyCancel} aria-label="取消引用" title="取消引用">
				<X size={18} aria-hidden="true" />
			</button>
		</div>
	{/if}

	<div
		class:is-resizing={resizePointerId !== null}
		class="guestbook-composer__editor"
	>
		<button
			class="guestbook-composer__resize-handle"
			type="button"
			onpointerdown={startTextareaResize}
			onpointermove={moveTextareaResize}
			onpointerup={finishTextareaResize}
			onpointercancel={finishTextareaResize}
			onkeydown={handleResizeKeydown}
			aria-label="调整输入框高度"
			title="向上拖动扩大输入框"
		></button>
		<textarea
			bind:this={textarea}
			value={draft}
			oninput={handleInput}
			onkeydown={handleKeydown}
			oncompositionstart={() => (isComposing = true)}
			oncompositionend={() => (isComposing = false)}
			rows="3"
			maxlength="300"
			placeholder={loginMode === "force" && !authUser
				? "登录后参与聊天"
				: "说点什么..."}
			aria-label="聊天消息"
			disabled={inputDisabled}
		></textarea>

		{#if draft && emojiPacks.length > 0}
			{@const previewHtml = renderDraftWithEmojis(draft)}
			{#if previewHtml}
				<div class="guestbook-composer__preview">{@html previewHtml}</div>
			{/if}
		{/if}

		{#if pendingImage}
			<div class="guestbook-composer__image-preview">
				<img src={pendingImage.url} alt={pendingImage.name} />
				<span>{pendingImage.name}</span>
				<button
					type="button"
					onclick={() => (pendingImage = null)}
					aria-label="移除待发送图片"
					title="移除图片"
				>
					<X size={16} aria-hidden="true" />
				</button>
			</div>
		{/if}

		<div class="guestbook-composer__footer">
			<div class="guestbook-composer__tools">
				<button
					bind:this={emojiTrigger}
					type="button"
					class:is-active={showEmojiPicker}
					onclick={toggleEmojiPicker}
					aria-label="选择表情"
					aria-expanded={showEmojiPicker}
					aria-controls="guestbook-emoji-picker"
					title="表情"
					disabled={inputDisabled}
				>
					<Smile size={20} aria-hidden="true" />
				</button>
				<button
					type="button"
					onclick={openImagePicker}
					aria-label="上传图片"
					title="图片"
					disabled={inputDisabled || isUploadingImage}
				>
					{#if isUploadingImage}
						<LoaderCircle class="is-spinning" size={20} aria-hidden="true" />
					{:else}
						<ImagePlus size={20} aria-hidden="true" />
					{/if}
				</button>
				<input
					bind:this={imageInput}
					class="guestbook-composer__file-input"
					type="file"
					accept="image/png,image/jpeg,image/gif,image/webp"
					onchange={handleImageSelection}
					tabindex="-1"
					aria-hidden="true"
				/>
			</div>

			<div class="guestbook-composer__actions">
				<span class="guestbook-composer__count">{draft.length}/300</span>
				{#if authUser}
					<span
						class:is-admin={authUser.type === "administrator"}
						class="guestbook-composer__identity-summary"
						role="button"
						tabindex="0"
						aria-label={`当前登录用户：${authName}`}
					>
						<span
							class="guestbook-composer__identity-label guestbook-composer__identity-label--desktop"
						>
							{authUser.type === "administrator" ? "管理员" : "已登录"} · {authName}
						</span>
						<span
							class="guestbook-composer__identity-label guestbook-composer__identity-label--mobile"
						>
							{authUser.type === "administrator"
								? "管理员"
								: formatMobileIdentityName(authName)}
						</span>
						<span class="guestbook-composer__identity-tooltip" role="tooltip">
							<span>当前用户：{authName}</span>
						</span>
					</span>
				{:else if loginMode !== "force"}
					<span
						class="guestbook-composer__identity-summary"
						role="button"
						tabindex="0"
						aria-label={hasGuestProfile
							? `游客资料，昵称 ${profile.nick}，邮箱 ${profile.mail || "未填写"}，网址 ${profile.link || "未填写"}`
							: "游客资料未填写"}
					>
						<span
							class="guestbook-composer__identity-label guestbook-composer__identity-label--desktop"
						>
							{hasGuestProfile ? profile.nick : "无"}
						</span>
						<span
							class="guestbook-composer__identity-label guestbook-composer__identity-label--mobile"
						>
							{hasGuestProfile ? formatMobileIdentityName(profile.nick) : "无"}
						</span>
						<span class="guestbook-composer__identity-tooltip" role="tooltip">
							{#if hasGuestProfile}
								<span>昵称：{profile.nick}</span>
								<span>邮箱：{profile.mail || "未填写"}</span>
								<span>网址：{profile.link || "未填写"}</span>
							{:else}
								<span>尚未填写游客资料</span>
							{/if}
						</span>
					</span>
					<button
						class="guestbook-composer__guest-profile"
						type="button"
						onclick={() => void openGuestProfile()}
						title={hasGuestProfile ? "修改游客资料" : "填写游客资料"}
					>
						游客访问
					</button>
				{/if}
				{#if loginMode !== "disable"}
					{#if authUser}
						<button
							class="guestbook-composer__login guestbook-composer__login--logout"
							type="button"
							onclick={onLogout}
							title="退出 Waline 登录"
						>
							退出
						</button>
					{:else}
						<button
							class="guestbook-composer__login"
							type="button"
							onclick={onLogin}
							disabled={loggingIn}
						>
							{loggingIn ? "登录中" : "登录"}
						</button>
					{/if}
				{/if}

				<button
					class="guestbook-composer__send"
					type="button"
					onclick={() => void submitMessage()}
					disabled={inputDisabled || isSending || isUploadingImage}
					aria-busy={isSending}
				>
					{isSending ? "发送中" : "发送"}
				</button>
			</div>
		</div>

		{#if showEmojiPicker}
			<div
				bind:this={emojiPanel}
				id="guestbook-emoji-picker"
				class="guestbook-composer__emojis"
				role="dialog"
				aria-label="Waline 表情"
			>
				{#if isLoadingEmojis}
					<div class="guestbook-composer__emoji-state" role="status">
						<LoaderCircle class="is-spinning" size={18} aria-hidden="true" />加载表情
					</div>
				{:else if emojiError}
					<div class="guestbook-composer__emoji-state" role="alert">
						<span>{emojiError}</span>
						<button type="button" onclick={() => void loadEmojis()}>重试</button>
					</div>
				{:else if activeEmojiPack}
					<div class="guestbook-composer__emoji-tabs" role="tablist" aria-label="表情包">
						{#each emojiPacks as pack, index}
							<button
								type="button"
								role="tab"
								aria-selected={activeEmojiPackIndex === index}
								class:is-active={activeEmojiPackIndex === index}
								onclick={() => (activeEmojiPackIndex = index)}
								title={pack.name}
							>
								<img src={pack.icon} alt={pack.name} loading="lazy" />
							</button>
						{/each}
					</div>
					<div class="guestbook-composer__emoji-grid">
						{#each activeEmojiPack.items as emoji}
							<button
								type="button"
								onclick={() => insertEmoji(emoji)}
								aria-label={`插入 ${emoji.key}`}
								title={emoji.key}
							>
								<img src={emoji.url} alt="" loading="lazy" />
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if composerError}
		<div class="guestbook-composer__error" role="alert">
			<TriangleAlert size={16} aria-hidden="true" />
			<span>{composerError}</span>
			<button
				type="button"
				onclick={() => onToolError("")}
				aria-label="关闭提示"
				title="关闭提示"
			>
				<X size={15} aria-hidden="true" />
			</button>
		</div>
	{/if}
</footer>

<dialog
	bind:this={profileDialog}
	class="privacy-modal guestbook-profile-modal"
	aria-labelledby="guestbook-profile-title"
	onclose={() => {
		profileDialogError = "";
		document.body.style.overflow = "";
	}}
	oncancel={(event) => {
		event.preventDefault();
		closeGuestProfile();
	}}
>
	<div class="privacy-overlay" role="button" tabindex="-1" onclick={closeGuestProfile} onkeydown={(e) => { if (e.key === "Enter" || e.key === " ") closeGuestProfile(); }}></div>
	<form
		class="privacy-panel guestbook-profile-modal__panel"
		onsubmit={(event) => {
			event.preventDefault();
			saveGuestProfile();
		}}
	>
		<div class="privacy-header">
			<h2 id="guestbook-profile-title" class="privacy-title">游客资料</h2>
			<button
				class="privacy-close"
				type="button"
				onclick={closeGuestProfile}
				aria-label="关闭游客资料"
			>
				<X size={20} aria-hidden="true" />
			</button>
		</div>
		<div class="privacy-body guestbook-profile-modal__body">
			<label>
				<span>昵称</span>
				<input
					bind:this={profileNickInput}
					bind:value={profileDraft.nick}
					maxlength="30"
					autocomplete="nickname"
					placeholder="至少 2 个字符"
					required
				/>
			</label>
			<label>
				<span>邮箱</span>
				<input
					bind:value={profileDraft.mail}
					maxlength="100"
					type="email"
					autocomplete="email"
					placeholder="用于头像，不公开"
				/>
			</label>
			<label>
				<span>网址</span>
				<input
					bind:value={profileDraft.link}
					maxlength="200"
					type="url"
					autocomplete="url"
					placeholder="可选"
				/>
			</label>
			{#if profileDialogError}
				<p class="guestbook-profile-modal__error" role="alert">
					{profileDialogError}
				</p>
			{/if}
		</div>
		<div class="privacy-footer guestbook-profile-modal__actions">
			<button type="button" onclick={closeGuestProfile}>取消</button>
			<button class="privacy-confirm-btn" type="submit">保存资料</button>
		</div>
	</form>
</dialog>
