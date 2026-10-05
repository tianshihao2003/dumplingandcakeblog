<script lang="ts">
import Icon from "@components/common/Icon.svelte";
import { onDestroy, onMount } from "svelte";
import "../../../styles/pages/music-visualizer.css";

interface Track {
	name: string;
	artist: string;
	pic?: string;
}

interface MusicState {
	track: Track | null;
	playlist: Track[];
	currentIndex: number;
	isPlaying: boolean;
	volume: number;
	isMuted: boolean;
	playMode: number;
	currentTimeStr: string;
	durationStr: string;
	progress: number;
	initialized: boolean;
}

interface FireflyMusicManager {
	getState: () => MusicState;
	init: () => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrev: () => void;
	cyclePlayMode: () => void;
	toggleMute: () => void;
	setVolume: (value: number) => void;
	seek: (percent: number) => void;
	playTrackByIndex: (index: number) => void;
}

declare global {
	interface Window {
		__fireflyMusic?: FireflyMusicManager;
	}
}

let currentTrack: Track | null = $state(null);
let playlist: Track[] = $state([]);
let currentIndex = $state(0);
let isPlaying = $state(false);
let volume = $state(0.6);
let isMuted = $state(false);
let playMode = $state(0);
let currentTimeStr = $state("0:00");
let durationStr = $state("0:00");
let progress = $state(0);
let isPlaylistOpen = $state(true);
let playlistListEl: HTMLDivElement;

function syncPlaylistScroll() {
	if (!playlistListEl) return;

	const activeItem = playlistListEl.querySelector<HTMLElement>(
		".music-visualizer__playlist-item--active",
	);
	activeItem?.scrollIntoView({
		block: "center",
		behavior: "smooth",
	});
}

function togglePlay() {
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.togglePlay();
}

function playNext() {
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.playNext();
}

function playPrev() {
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.playPrev();
}

function cycleMode() {
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.cyclePlayMode();
}

function toggleMute() {
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.toggleMute();
}

function onVolumeClick(e: MouseEvent) {
	const target = e.currentTarget as HTMLElement;
	const rect = target.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const val = Math.max(0, Math.min(1, x / rect.width));
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.setVolume(val);
}

function onProgressClick(e: MouseEvent) {
	const target = e.currentTarget as HTMLElement;
	const rect = target.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const percent = Math.max(0, Math.min(1, x / rect.width));
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.seek(percent);
}

function playTrack(index: number) {
	const mgr = window.__fireflyMusic;
	if (mgr) mgr.playTrackByIndex(index);
}

// 进度条键盘步进（a11y：slider 需支持方向键）
function handleProgressKeydown(e: KeyboardEvent) {
	const mgr = window.__fireflyMusic;
	if (!mgr) return;
	if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
		e.preventDefault();
		mgr.seek(Math.max(0, Math.min(1, progress / 100 - 0.05)));
	} else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
		e.preventDefault();
		mgr.seek(Math.max(0, Math.min(1, progress / 100 + 0.05)));
	}
}

// 音量条键盘步进（a11y：slider 需支持方向键）
function handleVolumeKeydown(e: KeyboardEvent) {
	const mgr = window.__fireflyMusic;
	if (!mgr) return;
	if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
		e.preventDefault();
		mgr.setVolume(Math.max(0, Math.min(1, volume - 0.1)));
	} else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
		e.preventDefault();
		mgr.setVolume(Math.max(0, Math.min(1, volume + 0.1)));
	}
}

function togglePlaylist() {
	isPlaylistOpen = !isPlaylistOpen;
}

function syncState() {
	const mgr = window.__fireflyMusic;
	if (!mgr) return;
	const state = mgr.getState();
	currentTrack = state.track;
	playlist = state.playlist || [];
	currentIndex = state.currentIndex || 0;
	isPlaying = state.isPlaying;
	volume = state.volume;
	isMuted = state.isMuted;
	playMode = state.playMode;
	currentTimeStr = state.currentTimeStr;
	durationStr = state.durationStr;
	progress = state.progress;
	setTimeout(syncPlaylistScroll, 0);
}

function onInit() {
	syncState();
}

function onTrack(e: CustomEvent) {
	currentTrack = e.detail.track;
	currentIndex = e.detail.index;
	progress = 0;
	currentTimeStr = "0:00";
	durationStr = "0:00";
	setTimeout(syncPlaylistScroll, 0);
}

function onPlayState(e: CustomEvent) {
	isPlaying = e.detail.isPlaying;
}

function onTime(e: CustomEvent) {
	currentTimeStr = e.detail.currentTimeStr;
	durationStr = e.detail.durationStr;
	progress = e.detail.progress;
}

function onVolume(e: CustomEvent) {
	volume = e.detail.volume;
	isMuted = e.detail.isMuted;
}

function onMode(e: CustomEvent) {
	playMode = e.detail.playMode;
}

onMount(() => {
	const mgr = window.__fireflyMusic;
	if (mgr && !mgr.getState().initialized) {
		mgr.init();
	}

	setTimeout(syncState, 100);

	window.addEventListener("fm:init", onInit);
	window.addEventListener("fm:track", onTrack as EventListener);
	window.addEventListener("fm:play-state", onPlayState as EventListener);
	window.addEventListener("fm:time", onTime as EventListener);
	window.addEventListener("fm:volume", onVolume as EventListener);
	window.addEventListener("fm:mode", onMode as EventListener);
});

onDestroy(() => {
	window.removeEventListener("fm:init", onInit);
	window.removeEventListener("fm:track", onTrack as EventListener);
	window.removeEventListener("fm:play-state", onPlayState as EventListener);
	window.removeEventListener("fm:time", onTime as EventListener);
	window.removeEventListener("fm:volume", onVolume as EventListener);
	window.removeEventListener("fm:mode", onMode as EventListener);
});
</script>

<div class="music-visualizer__controls">
	<div class="music-visualizer__track-summary">
		<div class="music-visualizer__current-cover">
			{#if currentTrack?.pic}
				<img src={currentTrack.pic} alt="" />
			{:else}
				<Icon icon="material-symbols:music-note-rounded" size="lg" />
			{/if}
		</div>
		<div class="music-visualizer__track-info">
			<div class="music-visualizer__track-name">
				{currentTrack?.name || "未播放"}
			</div>
			<div class="music-visualizer__track-artist">
				{currentTrack?.artist || ""}
			</div>
		</div>
	</div>

	<div class="music-visualizer__progress-wrapper">
		<span class="music-visualizer__time">{currentTimeStr}</span>
		<div
			class="music-visualizer__progress-bar"
			onclick={onProgressClick}
			role="slider"
			aria-label="进度"
			aria-valuenow={progress}
			aria-valuemin="0"
			aria-valuemax="100"
			tabindex="0"
			onkeydown={handleProgressKeydown}
		>
			<div
				class="music-visualizer__progress-fill"
				style={`width: ${progress}%`}
			></div>
		</div>
		<span class="music-visualizer__time">{durationStr}</span>
	</div>

	<div class="music-visualizer__controls-buttons">
		<button
			class="music-visualizer__btn music-visualizer__btn--playlist"
			class:music-visualizer__btn--active={isPlaylistOpen}
			onclick={togglePlaylist}
			title={isPlaylistOpen ? "关闭歌单" : "打开歌单"}
			aria-label={isPlaylistOpen ? "关闭歌单" : "打开歌单"}
			aria-controls="music-visualizer-playlist-panel"
			aria-expanded={isPlaylistOpen}
		>
			<Icon icon="material-symbols:queue-music-rounded" size="lg" />
		</button>

		<button
			class="music-visualizer__btn music-visualizer__btn--mode"
			onclick={cycleMode}
			title="播放模式"
		>
			{#if playMode === 0}
				<Icon icon="material-symbols:repeat-rounded" size="lg" />
			{:else if playMode === 1}
				<Icon icon="material-symbols:repeat-one-rounded" size="lg" />
			{:else}
				<Icon icon="material-symbols:shuffle-rounded" size="lg" />
			{/if}
		</button>

		<button
			class="music-visualizer__btn music-visualizer__btn--prev"
			onclick={playPrev}
			title="上一首"
		>
			<Icon icon="material-symbols:skip-previous-rounded" size="2xl" />
		</button>

		<button
			class="music-visualizer__btn music-visualizer__btn--play"
			onclick={togglePlay}
			title={isPlaying ? "暂停" : "播放"}
		>
			{#if isPlaying}
				<Icon icon="material-symbols:pause-rounded" size="2xl" />
			{:else}
				<Icon icon="material-symbols:play-arrow-rounded" size="2xl" />
			{/if}
		</button>

		<button
			class="music-visualizer__btn music-visualizer__btn--next"
			onclick={playNext}
			title="下一首"
		>
			<Icon icon="material-symbols:skip-next-rounded" size="2xl" />
		</button>

		<button
			class="music-visualizer__btn music-visualizer__btn--back"
			onclick={() => window.location.href = '/'}
			title="返回首页"
			aria-label="返回首页"
		>
			<Icon icon="material-symbols:home-outline-rounded" size="lg" />
		</button>

		<div class="music-visualizer__volume-group">
			<button
				class="music-visualizer__btn music-visualizer__btn--mute"
				onclick={toggleMute}
				title="音量"
			>
				{#if isMuted || volume === 0}
					<Icon icon="material-symbols:volume-off-rounded" size="lg" />
				{:else}
					<Icon icon="material-symbols:volume-up-rounded" size="lg" />
				{/if}
			</button>
			<div
				class="music-visualizer__volume-bar"
				onclick={onVolumeClick}
				role="slider"
				aria-label="音量"
				aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
				aria-valuemin="0"
				aria-valuemax="100"
				tabindex="0"
				onkeydown={handleVolumeKeydown}
			>
				<div
					class="music-visualizer__volume-fill"
					style={`width: ${isMuted ? 0 : volume * 100}%`}
				></div>
			</div>
		</div>
	</div>
</div>

<aside
	id="music-visualizer-playlist-panel"
	class="music-visualizer__playlist-panel"
	class:music-visualizer__playlist-panel--open={isPlaylistOpen}
	aria-label="歌单切换"
	aria-hidden={!isPlaylistOpen}
>
	<div class="music-visualizer__playlist-stage">
		<div class="music-visualizer__playlist-timeline"></div>
		<div class="music-visualizer__playlist-header">
			<div>
				<div class="music-visualizer__playlist-kicker">PLAYLIST</div>
				<div class="music-visualizer__playlist-title">歌单切换</div>
			</div>
			<div class="music-visualizer__playlist-count">{playlist.length}</div>
		</div>

		<div
			bind:this={playlistListEl}
			class="music-visualizer__playlist-list"
			role="listbox"
			aria-label="当前歌单"
		>
			{#if playlist.length === 0}
				<div class="music-visualizer__playlist-empty">歌单加载中</div>
			{:else}
				{#each playlist as track, i}
					<button
						type="button"
						class="music-visualizer__playlist-item"
						class:music-visualizer__playlist-item--active={i === currentIndex}
						onclick={() => playTrack(i)}
						role="option"
						aria-selected={i === currentIndex}
						title={`${track.name} - ${track.artist}`}
					>
						<div class="music-visualizer__playlist-cover">
							{#if track.pic}
								<img src={track.pic} alt="" loading="lazy" />
							{:else}
								<Icon icon="material-symbols:music-note-rounded" size="sm" />
							{/if}
						</div>
						<div class="music-visualizer__playlist-meta">
							<div class="music-visualizer__playlist-name">{track.name}</div>
							<div class="music-visualizer__playlist-artist">{track.artist}</div>
						</div>
						{#if i === currentIndex}
							<div class="music-visualizer__playlist-eq" aria-hidden="true">
								<span></span>
								<span></span>
								<span></span>
							</div>
						{/if}
					</button>
				{/each}
			{/if}
		</div>
	</div>
</aside>
