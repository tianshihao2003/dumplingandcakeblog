import type { CollectionEntry } from "astro:content";

export type BillEntry = CollectionEntry<"bills">;

function toDateKey(d: Date): string {
	return d.toISOString().slice(0, 10);
}

export function groupBillsByDay(
	entries: BillEntry[],
): Map<string, BillEntry[]> {
	const map = new Map<string, BillEntry[]>();
	const sorted = [...entries].sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
	for (const e of sorted) {
		const k = toDateKey(e.data.date);
		if (!map.has(k)) map.set(k, []);
		map.get(k)?.push(e);
	}
	return map;
}

export function calcBillStats(entries: BillEntry[]): {
	income: number;
	expense: number;
	balance: number;
} {
	let income = 0;
	let expense = 0;
	for (const e of entries) {
		const { type, amount } = e.data;
		if (type === "income") {
			income += amount;
		} else {
			expense += Math.abs(amount);
		}
	}
	return { income, expense, balance: income - expense };
}

export function billsByCategory(entries: BillEntry[]): Map<string, number> {
	const map = new Map<string, number>();
	for (const e of entries) {
		const k = e.data.category || "其他";
		map.set(k, (map.get(k) || 0) + Math.abs(e.data.amount));
	}
	return map;
}

export function calcPeriodIncomeExpense(
	entries: BillEntry[],
	start: Date,
	end: Date,
): { income: number; expense: number; count: number } {
	let income = 0;
	let expense = 0;
	let count = 0;
	for (const e of entries) {
		const d = e.data.date;
		if (d >= start && d <= end) {
			count++;
			if (e.data.type === "income") income += e.data.amount;
			else expense += Math.abs(e.data.amount);
		}
	}
	return { income, expense, count };
}

export function getTodayMonthYearStats(
	entries: BillEntry[],
	now: Date = new Date(),
): {
	today: { income: number; expense: number; count: number; label: string };
	month: { income: number; expense: number; count: number; label: string };
	year: { income: number; expense: number; count: number; label: string };
} {
	const y = now.getFullYear();
	const m = now.getMonth();
	const d = now.getDate();
	const todayStart = new Date(y, m, d, 0, 0, 0);
	const todayEnd = new Date(y, m, d, 23, 59, 59);
	const monthStart = new Date(y, m, 1, 0, 0, 0);
	const monthEnd = new Date(y, m + 1, 0, 23, 59, 59);
	const yearStart = new Date(y, 0, 1, 0, 0, 0);
	const yearEnd = new Date(y, 11, 31, 23, 59, 59);
	const fmtMonth = `${String(m + 1).padStart(2, "0")}月01日-${String(m + 1).padStart(2, "0")}月${String(new Date(y, m + 1, 0).getDate()).padStart(2, "0")}日`;
	return {
		today: {
			...calcPeriodIncomeExpense(entries, todayStart, todayEnd),
			label: `${y}年${String(m + 1).padStart(2, "0")}月${String(d).padStart(2, "0")}日`,
		},
		month: {
			...calcPeriodIncomeExpense(entries, monthStart, monthEnd),
			label: fmtMonth,
		},
		year: {
			...calcPeriodIncomeExpense(entries, yearStart, yearEnd),
			label: `${y}年`,
		},
	};
}

export function yearlyMonthlyFlow(
	entries: BillEntry[],
	year: number,
): { month: string; income: number; expense: number; balance: number }[] {
	const result: {
		month: string;
		income: number;
		expense: number;
		balance: number;
	}[] = [];
	for (let m = 1; m <= 12; m++) {
		const start = new Date(year, m - 1, 1, 0, 0, 0);
		const end = new Date(year, m, 0, 23, 59, 59);
		const { income, expense } = calcPeriodIncomeExpense(entries, start, end);
		result.push({
			month: `${String(m).padStart(2, "0")}月`,
			income,
			expense,
			balance: income - expense,
		});
	}
	return result;
}

export function dailyIncomeExpense(
	entries: BillEntry[],
	year: number,
	month: number,
): { day: string; income: number; expense: number }[] {
	const days = new Date(year, month, 0).getDate();
	const result: { day: string; income: number; expense: number }[] = [];
	for (let d = 1; d <= days; d++) {
		const start = new Date(year, month - 1, d, 0, 0, 0);
		const end = new Date(year, month - 1, d, 23, 59, 59);
		const { income, expense } = calcPeriodIncomeExpense(entries, start, end);
		result.push({
			day: `${String(month).padStart(2, "0")}.${String(d).padStart(2, "0")}`,
			income,
			expense,
		});
	}
	return result;
}

export function categoryExpenseRank(
	entries: BillEntry[],
	year: number,
	month: number,
	limit = 100,
): { category: string; amount: number; count: number }[] {
	const start = new Date(year, month - 1, 1, 0, 0, 0);
	const end = new Date(year, month, 0, 23, 59, 59);
	const map = new Map<string, { amount: number; count: number }>();
	for (const e of entries) {
		if (e.data.date < start || e.data.date > end) continue;
		if (e.data.type !== "expense") continue;
		const k = e.data.category || "其他";
		const cur = map.get(k) || { amount: 0, count: 0 };
		cur.amount += Math.abs(e.data.amount);
		cur.count++;
		map.set(k, cur);
	}
	return [...map.entries()]
		.map(([category, v]) => ({ category, ...v }))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, limit);
}

export function categoryIncomeList(
	entries: BillEntry[],
	year: number,
	month: number,
	limit = 100,
): { category: string; amount: number; count: number }[] {
	const start = new Date(year, month - 1, 1, 0, 0, 0);
	const end = new Date(year, month, 0, 23, 59, 59);
	const map = new Map<string, { amount: number; count: number }>();
	for (const e of entries) {
		if (e.data.date < start || e.data.date > end) continue;
		if (e.data.type !== "income") continue;
		const k = e.data.category || "其他";
		const cur = map.get(k) || { amount: 0, count: 0 };
		cur.amount += e.data.amount;
		cur.count++;
		map.set(k, cur);
	}
	// 兼容“工资”归入职业收入（旧数据分类）
	const wage = map.get("工资");
	if (wage) {
		const cur = map.get("职业收入") || { amount: 0, count: 0 };
		cur.amount += wage.amount;
		cur.count += wage.count;
		map.set("职业收入", cur);
		map.delete("工资");
	}
	// 按金额降序取前 limit 收入分类，工资已合并
	const sorted = [...map.entries()]
		.map(([category, v]) => ({ category, ...v }))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, limit);
	// 若不足 3，用固定占位补齐（保持卡片不少于 3 行，避免过空）
	if (sorted.length < 3) {
		const fixed = ["职业收入", "人情收礼", "其他收入"];
		for (const cat of fixed) {
			if (sorted.length >= 3) break;
			if (!sorted.find((r) => r.category === cat)) {
				const v = map.get(cat) || { amount: 0, count: 0 };
				sorted.push({ category: cat, ...v });
			}
		}
	}
	return sorted.slice(0, limit);
}
