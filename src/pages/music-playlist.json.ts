import type { APIRoute } from "astro";
import { getMusicPlaylist } from "@/utils/music-playlist";

/** 播放列表数据：播放器按需拉取（站长 2026-10-05 起不再内联进每一页 HTML） */
export const GET: APIRoute = async () => {
	const tracks = await getMusicPlaylist();
	return new Response(JSON.stringify(tracks), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
