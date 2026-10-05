import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { url } from "@/utils/url-utils";

type MiniPost = { title: string; url: string; date: string };

/**
 * 资料面板「点格子看当月文章」的数据：今年的文章按月份分组。
 * 站长 2026-10-05：原先内联在每一页的 data-posts（约 51KB），改为点格子时才拉。
 */
export const GET: APIRoute = async () => {
	const posts = await getCollection("posts");
	const year = new Date().getFullYear();
	const postsByMonth: MiniPost[][] = Array.from({ length: 12 }, () => []);
	for (const post of posts) {
		const date = post.data.published;
		if (date.getFullYear() !== year) continue;
		postsByMonth[date.getMonth()].push({
			title: post.data.title,
			url: url(`/posts/${post.id}/`),
			date: `${date.getMonth() + 1}/${date.getDate()}`,
		});
	}
	for (const list of postsByMonth) {
		list.sort(
			(a, b) => Number.parseInt(b.date, 10) - Number.parseInt(a.date, 10),
		);
	}
	return new Response(JSON.stringify(postsByMonth), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
