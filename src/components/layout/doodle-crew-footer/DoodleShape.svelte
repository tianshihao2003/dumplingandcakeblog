<script lang="ts">
import type { DoodleKind } from "@/types/config";

let { kind }: { kind: DoodleKind } = $props();

const COLORS = {
	flame: "#ff7a1a",
	flameCore: "#ffd23f",
	gold: "#ffd23f",
	heart: "#ff5c7a",
	bread: "#f2c48d",
	leaf: "#5fb247",
};
</script>

{#if kind === "flame"}
	<path fill={COLORS.flame} d="M0 14 C-9 14 -12 6 -10 0 C-8 -5 -4 -6 -4 -12 C1 -9 3 -5 2 -1 C4 -3 5 -6 5 -8 C10 -3 11 4 8 9 C6 12 3 14 0 14 Z"></path>
	<path fill={COLORS.flameCore} d="M0 11.5 C-4 11.5 -6 8 -5 5 C-4 2 -1 1 -1 -3 C2 -1 4 3 3 6 C4 5 5 4 5 3 C7 6 5 11.5 0 11.5 Z"></path>
{:else if kind === "sandwich"}
	<path fill={COLORS.bread} d="M-13 5 L13 5 L12.5 9.5 C4 11 -4 11 -12.5 9.5 Z"></path>
	<path fill={COLORS.gold} d="M-12 2 L12 2 L11 5 L5 5 L3 9 L1 5 L-12 5 Z"></path>
	<path fill="none" stroke={COLORS.leaf} stroke-width="2.6" d="M-13 1 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0"></path>
	<path fill={COLORS.bread} d="M-13 -1 C-14 -8 -10 -11 -6 -10 C-3 -13.5 3 -13.5 6 -10 C10 -11 14 -8 13 -1 Z"></path>
	<path fill="none" stroke-width="1.2" d="M-6 -6 l1.5 -1 M0 -8 l1.5 -1 M6 -6 l1.5 -1"></path>
{:else if kind === "star"}
	<path fill={COLORS.gold} d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z"></path>
{:else if kind === "heart"}
	<path fill={COLORS.heart} d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z"></path>
{:else if kind === "bolt"}
	<path fill={COLORS.gold} d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z"></path>
{:else if kind === "sparkle"}
	<path fill="#8fdcff" d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z"></path>
{:else if kind === "spiral"}
	<path fill="none" d="M0 0 C2 -2 4 0 3 3 C1 6 -4 5 -5 1 C-6 -4 -1 -8 4 -7 C9 -5 10 2 7 6"></path>
{:else if kind === "plane"}
	<path class="dcf-paperfill" d="M-13 -1 L13 -10 L4 12 L0 3 Z"></path>
	<path fill="none" d="M0 3 L13 -10 M0 3 L-2 9 L2 5"></path>
{/if}
