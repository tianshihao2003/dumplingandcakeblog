<script lang="ts">
import type { CrewKind } from "@/types/config";

let {
	kind,
	hatch,
	part = "body",
}: { kind: CrewKind; hatch: string; part?: "body" | "front" } = $props();
</script>

{#if part === "body"}
	{#if kind === "yeti"}
		<ellipse class="dcf-shadow" cx="0" cy="2" rx="54" ry="5"></ellipse>
		<path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z"></path>
		<path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" fill={hatch} stroke="none"></path>
		<path class="n" d="M-67 -64 C-58 -59 -50 -59 -43 -64"></path>
		<path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z"></path>
		<path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z"></path>
		<path class="n" d="M-38 -124 L-28 -119 M39 -125 L33 -116"></path>
		<path d="M-44 -2 C-54 -28 -54 -66 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -64 58 -28 48 -2 C30 4 -26 4 -44 -2 Z"></path>
		<path d="M40 -96 C54 -66 54 -30 46 -4 C40 -2 34 -1 30 0 C40 -30 42 -64 33 -101 Z" fill={hatch} stroke="none"></path>
		<path class="n" d="M-7 -117 C-5 -126 1 -128 3 -120 C5 -127 11 -126 11 -116"></path>
		<path class="n thin" d="M-14 -24 l-3 4 M8 -40 l3 4 M14 -46 l3 3 M20 -30 l3 3"></path>
		<path class="n" d="M-48 -62 C-22 -50 10 -32 49 -26 M-50 -52 C-24 -40 8 -22 49 -16"></path>
		<rect x="-12" y="-46" width="15" height="13" rx="2.5" transform="rotate(26 -4.5 -39.5)"></rect>
		<path d="M-46 -60 C-62 -50 -63 -29 -51 -19 C-45 -15 -38 -19 -40 -28 C-43 -36 -40 -46 -36 -52"></path>
		<path d="M46 -58 C61 -46 61 -26 51 -18 C45 -14 38 -18 40 -26 C43 -34 41 -44 37 -50"></path>
		<path d="M-37 -2 C-41 -14 -23 -19 -16 -7 C-14 0 -26 4 -37 -2 Z"></path>
		<path d="M37 -2 C41 -14 23 -19 16 -7 C14 0 26 4 37 -2 Z"></path>
		<path class="n thin" d="M-30 -4 l1 -4 M-24 -3 l1 -4 M30 -4 l-1 -4 M24 -3 l-1 -4"></path>
		<path class="n" d="M-23 -98 L-9 -96 M6 -98 L20 -100"></path>
		<path class="n" d="M-12 -70 C-6 -64 6 -64 12 -71"></path>
		<path d="M3 -66.5 L5.5 -60 L8 -67.5 Z"></path>
	{:else if kind === "kid"}
		<path d="M-15 -6 L-3 -6 C-3 8 -5 20 -6 30 L-15 30 C-15 18 -16 6 -15 -6 Z"></path>
		<path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z"></path>
		<path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" fill={hatch} stroke="none"></path>
		<path class="k" d="M-17 30 C-20 34 -20 40 -14 41 L-2 41 C2 40 0 34 -5 30 Z"></path>
		<path class="k" d="M11 29 C8 34 10 40 16 40 L26 38 C29 36 27 30 22 27 Z"></path>
		<path d="M-20 -4 C-22 -20 -18 -38 -10 -44 L10 -44 C18 -38 22 -20 20 -4 Z"></path>
		<path class="n thick" d="M-19.5 -14 L19.5 -14 M-18.5 -26 L18.5 -26 M-14 -36 L14 -36"></path>
		<path class="n" d="M-18 -36 C-28 -28 -30 -14 -26 -5"></path>
		<circle cx="-26" cy="-3" r="4"></circle>
		<path class="n" d="M18 -36 C27 -30 30 -18 28 -7"></path>
		<circle cx="28" cy="-4" r="4"></circle>
		<circle cx="-17" cy="-58" r="4"></circle>
		<circle cx="17" cy="-58" r="4"></circle>
		<circle cx="0" cy="-60" r="17"></circle>
		<path class="n thin" d="M-11 -52 l2 -2 M-8 -52 l2 -2 M8 -52 l2 -2 M11 -52 l2 -2"></path>
		<path class="n" d="M-5 -50 C-2 -47 2 -47 5 -50"></path>
		<path d="M-15 -70 C-14 -87 14 -87 15 -70 Z"></path>
		<path d="M-27 -68 C-16 -75 16 -75 27 -68 C18 -63 -18 -63 -27 -68 Z"></path>
		<path class="n thick" d="M-14.5 -74 C-6 -77 6 -77 14.5 -74"></path>
	{:else if kind === "bird"}
		<path class="n" d="M-5 0 L-5 -7 M-9 0 L-1 0 M5 0 L5 -7 M1 0 L9 0"></path>
		<path d="M-17 -16 C-26 -18 -31 -14 -33 -9 C-26 -10 -20 -8 -15 -10 Z"></path>
		<path d="M-18 -14 C-20 -30 -10 -40 2 -40 C16 -40 22 -28 20 -16 C18 -6 8 -4 0 -4 C-10 -4 -17 -8 -18 -14 Z"></path>
		<path d="M-11 -25 C-3 -26 1 -18 -3 -13 C-9 -12 -15 -17 -11 -25 Z" fill={hatch}></path>
		<path class="o" d="M19 -30 L29 -27 L19 -23 Z"></path>
		<path class="a" d="M-3 -38 L4 -59 L12 -37 Z"></path>
		<path class="n thin" d="M-1 -44 L10 -46 M1 -51 L8 -52"></path>
		<circle cx="4" cy="-60" r="2.8"></circle>
	{:else if kind === "cat"}
		<ellipse class="dcf-shadow" cx="4" cy="2" rx="32" ry="4"></ellipse>
		<g class="dcf-tail">
			<path d="M18 -4 C42 -4 52 -24 46 -44 C44 -51 36 -53 34 -46 C40 -30 34 -16 16 -14 Z"></path>
			<path class="n thin" d="M40 -16 l5 4 M45 -30 l6 1 M43 -42 l6 -3"></path>
		</g>
		<path d="M-22 0 C-28 -18 -24 -42 -14 -52 L14 -52 C24 -42 28 -18 22 0 C10 3 -10 3 -22 0 Z"></path>
		<path d="M14 -46 C24 -36 26 -16 22 0 C18 1 14 2 12 2 C16 -14 16 -32 10 -46 Z" fill={hatch} stroke="none"></path>
		<path class="n" d="M-8 -30 L-9 -1 M8 -30 L9 -1"></path>
		<path d="M-16 1 C-16 -5 -3 -5 -3 1 Z M3 1 C3 -5 16 -5 16 1 Z"></path>
		<path class="a" d="M-18 -55 C-6 -49 6 -49 18 -55 L17 -46 C6 -40 -6 -40 -17 -46 Z"></path>
		<path class="a" d="M9 -45 L18 -32 L6 -37 Z"></path>
		<path d="M-22 -86 L-25 -107 L-7 -96 Z"></path>
		<path d="M8 -96 L23 -108 L22 -86 Z"></path>
		<path class="n thin" d="M-20 -92 L-21 -101 M18 -101 L18 -92"></path>
		<path d="M-26 -70 C-28 -88 -16 -98 0 -98 C16 -98 28 -88 26 -70 C24 -56 12 -50 0 -50 C-12 -50 -24 -56 -26 -70 Z"></path>
		<path class="n thin" d="M-4 -97 L-3 -90 M3 -97 L3 -91"></path>
		<path class="n" d="M-26 -80 C-14 -83 4 -87 25 -93"></path>
		<ellipse class="k" cx="-10" cy="-76" rx="7.5" ry="6.5"></ellipse>
		<path class="k" d="M-2.5 -68 L2.5 -68 L0 -64.5 Z"></path>
		<path class="n" d="M0 -64.5 C-1 -60.5 -5 -60.5 -6 -62.5 M0 -64.5 C1 -60.5 5 -60.5 6 -62.5"></path>
		<path class="n thin" d="M-15 -66 L-29 -68 M-15 -63 L-28 -59 M15 -66 L29 -68 M15 -63 L28 -59"></path>
	{:else if kind === "ghost"}
		<path d="M-23 -14 L-23 -40 C-23 -59 -12 -67 0 -67 C12 -67 23 -59 23 -40 L23 -14 C12 -10 -12 -10 -23 -14 Z"></path>
		<path d="M13 -61 C21 -54 23 -46 23 -36 L23 -15 L15 -13 L15 -36 C15 -46 15 -54 13 -61 Z" fill={hatch} stroke="none"></path>
		<path class="n thin" d="M-16 -56 C-12 -61 -6 -63 -2 -63"></path>
		<path class="k" d="M-5 -33 C-3 -27 4 -27 6 -33 Z"></path>
		<path class="n thin" d="M-17 -35 l3 -2 M-14 -34 l3 -2 M14 -35 l3 -2 M17 -34 l3 -2"></path>
	{:else if kind === "mushroom"}
		<ellipse class="dcf-shadow" cx="0" cy="2" rx="18" ry="3"></ellipse>
		<path class="n" d="M-10 -15 L-17 -9 M10 -15 L17 -11"></path>
		<path d="M-10 0 C-12 -10 -10 -22 -8 -28 L8 -28 C10 -22 12 -10 10 0 C4 2 -4 2 -10 0 Z"></path>
		<path d="M5 -27 C9 -20 11 -10 10 0 C8 1 6 1.5 4 1.5 C6 -8 6 -18 2 -27 Z" fill={hatch} stroke="none"></path>
		<path class="r" d="M-25 -28 C-27 -45 -12 -55 0 -55 C12 -55 27 -45 25 -28 C14 -23 -14 -23 -25 -28 Z"></path>
		<circle cx="-12" cy="-40" r="4.2"></circle>
		<circle cx="6" cy="-46" r="3.4"></circle>
		<circle cx="15" cy="-34" r="3"></circle>
		<circle cx="-2" cy="-33" r="2.4"></circle>
		<path class="n" d="M-2 -10 C-1 -8 1 -8 2 -10"></path>
	{/if}
{:else if kind === "ghost"}
	<path d="M-25 -32 C-27 -38 -21 -42 -17 -38 C-15 -42 -10 -41 -10 -36 L-11 -30 C-15 -28 -22 -28 -25 -32 Z"></path>
	<path d="M25 -32 C27 -38 21 -42 17 -38 C15 -42 10 -41 10 -36 L11 -30 C15 -28 22 -28 25 -32 Z"></path>
{/if}
