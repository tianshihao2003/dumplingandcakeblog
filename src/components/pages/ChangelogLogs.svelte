<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { Check, ChevronDown, Filter, Search } from "lucide-svelte";
import { slide } from "svelte/transition";
import type { ChangelogEntry, ChangelogType } from "@/utils/changelog";

let { entries }: { entries: ChangelogEntry[] } = $props();

const TYPE_ORDER: ChangelogType[] = [
	"feature",
	"improvement",
	"fix",
	"removal",
];

const typeLabels: Record<ChangelogType, string> = {
	feature: i18n(I18nKey.changelogFeature),
	improvement: i18n(I18nKey.changelogImprovement),
	fix: i18n(I18nKey.changelogFix),
	removal: i18n(I18nKey.changelogRemoval),
};

const typeCounts = entries.reduce<Partial<Record<ChangelogType, number>>>(
	(counts, entry) => {
		counts[entry.type] = (counts[entry.type] ?? 0) + 1;
		return counts;
	},
	{},
);

let query = $state("");
let openId = $state<string | null>(null);
let showFilters = $state(false);
let activeTypes = $state<ChangelogType[]>([]);

const filtered = $derived.by(() => {
	const keyword = query.trim().toLowerCase();
	return entries.filter((entry) => {
		if (activeTypes.length > 0 && !activeTypes.includes(entry.type)) {
			return false;
		}
		if (!keyword) return true;
		return [
			entry.description,
			entry.version,
			entry.date,
			entry.time ?? "",
			typeLabels[entry.type],
		].some((field) => field.toLowerCase().includes(keyword));
	});
});

const shownText = $derived(
	i18n(I18nKey.changelogShownCount)
		.replace("{shown}", String(filtered.length))
		.replace("{total}", String(entries.length)),
);

function toggleType(type: ChangelogType) {
	activeTypes = activeTypes.includes(type)
		? activeTypes.filter((item) => item !== type)
		: [...activeTypes, type];
}

function toggleRow(id: string) {
	openId = openId === id ? null : id;
}
</script>

<div class="clog" class:is-filtering={showFilters}>
	<div class="clog__bar">
		<p class="clog__count">{shownText}</p>
		<div class="clog__tools">
			<div class="clog__search">
				<Search size={16} aria-hidden="true" />
				<input
					type="search"
					bind:value={query}
					placeholder={i18n(I18nKey.changelogSearchPlaceholder)}
					aria-label={i18n(I18nKey.changelogSearchPlaceholder)}
				/>
			</div>
			<button
				type="button"
				class="clog__toggle"
				class:is-on={showFilters}
				aria-expanded={showFilters}
				aria-controls="changelog-filters"
				onclick={() => (showFilters = !showFilters)}
			>
				<Filter size={16} aria-hidden="true" />
				<span>{i18n(I18nKey.changelogFilter)}</span>
				{#if activeTypes.length > 0}
					<span class="clog__toggle-count">{activeTypes.length}</span>
				{/if}
			</button>
		</div>
	</div>

	<div class="clog__body">
		{#if showFilters}
			<aside id="changelog-filters" class="clog__filters">
				<div class="clog__filters-head">
					<span>{i18n(I18nKey.changelogTypeLabel)}</span>
					{#if activeTypes.length > 0}
						<button
							type="button"
							class="clog__clear"
							onclick={() => (activeTypes = [])}
						>
							{i18n(I18nKey.changelogClear)}
						</button>
					{/if}
				</div>
				<div class="clog__chips">
					{#each TYPE_ORDER as type (type)}
						<button
							type="button"
							class="clog-chip"
							class:is-on={activeTypes.includes(type)}
							data-type={type}
							aria-pressed={activeTypes.includes(type)}
							onclick={() => toggleType(type)}
						>
							<span>{typeLabels[type]}</span>
							<span class="clog-chip__count">{typeCounts[type] ?? 0}</span>
							{#if activeTypes.includes(type)}
								<Check size={13} aria-hidden="true" />
							{/if}
						</button>
					{/each}
				</div>
			</aside>
		{/if}

		{#if filtered.length === 0}
			<p class="clog__empty">{i18n(I18nKey.changelogNoData)}</p>
		{:else}
			<ol class="clog__list">
				{#each filtered as entry (entry.id)}
					<li class="clog-item" class:is-open={openId === entry.id}>
						<button
							type="button"
							class="clog-row"
							aria-expanded={openId === entry.id}
							aria-controls={`changelog-detail-${entry.id}`}
							onclick={() => toggleRow(entry.id)}
						>
							<ChevronDown class="clog-row__chev" size={16} aria-hidden="true" />
							<span class="clog-badge" data-type={entry.type}>
								{typeLabels[entry.type]}
							</span>
							<time
								class="clog-row__time"
								datetime={entry.time
									? `${entry.date}T${entry.time}`
									: entry.date}
							>
								{entry.date}{entry.time ? ` ${entry.time}` : ""}
							</time>
							<span class="clog-row__msg">{entry.description}</span>
							<span class="clog-row__ver">{entry.version}</span>
						</button>

						{#if openId === entry.id}
							<div
								id={`changelog-detail-${entry.id}`}
								class="clog-detail"
								transition:slide={{ duration: 180 }}
							>
								<span class="clog-detail__label">
									{i18n(I18nKey.changelogDescriptionLabel)}
								</span>
								<p class="clog-detail__text">{entry.description}</p>
								<dl class="clog-detail__grid">
									<div>
										<dt>{i18n(I18nKey.changelogVersionLabel)}</dt>
										<dd>{entry.version}</dd>
									</div>
									<div>
										<dt>{i18n(I18nKey.changelogDateLabel)}</dt>
										<dd>{entry.date}{entry.time ? ` ${entry.time}` : ""}</dd>
									</div>
									<div>
										<dt>{i18n(I18nKey.changelogTypeLabel)}</dt>
										<dd>{typeLabels[entry.type]}</dd>
									</div>
								</dl>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</div>
