import type { CollectionEntry } from "astro:content";

export type ChangelogType = "feature" | "improvement" | "fix" | "removal";

export interface ChangelogEntry {
	id: string;
	version: string;
	date: string;
	time?: string;
	type: ChangelogType;
	description: string;
}

export function changelogEntriesFromCollection(
	entries: CollectionEntry<"changelog">[],
): ChangelogEntry[] {
	return entries
		.map((entry) => ({
			id: entry.id,
			version: entry.data.version,
			date: entry.data.date.toISOString().slice(0, 10),
			time: entry.data.time,
			type: entry.data.type,
			description: entry.data.description,
		}))
		.sort((a, b) =>
			`${b.date}${b.time ?? ""}`.localeCompare(`${a.date}${a.time ?? ""}`),
		);
}
