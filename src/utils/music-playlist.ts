import { getCollection } from "astro:content";

/** 播放列表里的单曲（客户端只用这几个字段，构建期的 published 只在排序时用） */
export interface MusicTrack {
	name: string;
	artist: string;
	url: string;
	pic: string;
	lrc: string;
	metingServer: string;
	metingId: string;
}

/**
 * 构建期取出音乐播放列表（bangumi 集合里 category=music 的条目）。
 *
 * 站长 2026-10-05：这份数据原先被内联进每一页 HTML（UnifiedDock / MusicManager /
 * 侧栏小组件各自一份，约 45KB × 2~3），现改为只在 /music-playlist.json 输出一次，
 * 由音乐管理器在 init 时按需拉取。
 */
export async function getMusicPlaylist(): Promise<MusicTrack[]> {
	const entries = await getCollection("bangumi");
	return entries
		.filter((item) => item.data.category === "music")
		.map((item) => {
			const { data } = item;
			const imageSrc =
				typeof data.image === "string" ? data.image : data.image.src;
			return {
				name: data.title,
				artist: data.artist || "",
				url: data.audioUrl || "",
				pic: imageSrc,
				lrc: data.lrcUrl || "",
				metingServer: data.metingServer || "",
				metingId: data.metingId || "",
				published: data.published,
			};
		})
		.filter((item) => item.url || item.metingId)
		.sort(
			(a, b) =>
				new Date(b.published || 0).getTime() -
				new Date(a.published || 0).getTime(),
		)
		.map((item) => ({
			name: item.name,
			artist: item.artist,
			url: item.url,
			pic: item.pic,
			lrc: item.lrc,
			metingServer: item.metingServer,
			metingId: item.metingId,
		}));
}
