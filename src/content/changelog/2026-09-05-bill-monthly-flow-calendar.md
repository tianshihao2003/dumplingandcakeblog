---
version: "v1.36.0"
date: 2026-09-05
type: feature
description: 账单页新增月度流水卡（按日分组+月份筛选+分页）与账单日历（农历+每日收支）；修复加密页脚本不执行导致筛选/分页失效
---

## 月度流水 + 账单日历

- **「今日流水」升级为「月度流水」**：按日期分组展示整月流水——每天一个分组头（如「9月4日(周五)」+ 当日「支/收」小计），逐笔显示 emoji 图标、分类·备注、时刻与金额（`src/components/bills/MonthlyFlowCard.astro`）。
- **月份筛选**：卡片右上角下拉框切换年月（有账单的月份 + 当前月），标题同步变化（选历史月显示「2026年8月流水」），切月后分页自动回到第 1 页。
- **按天分页**：每页 2 天，底部 ‹ 页码 › 翻页，长月份不再拉长页面。
- **新增「账单日历」**：整月日历视图，每格显示公历日期 + 农历（初一显示农历月名、节日优先）+ 当日支出（青）/收入（红）；今天绿色高亮；上下月补位灰显。日历与流水卡共享月份筛选联动（`src/components/bills/BillCalendarCard.astro`，农历换算复用 `lunar-javascript` 与 `src/utils/lunar.ts`）。
- **修复加密页脚本失效**（本次筛选不生效的根因）：`PasswordGate` 此前用 `innerHTML` 注入解密内容，浏览器不会执行其中的 `<script>`，导致筛选、分页（以及之前支出/收入排行卡的翻页）全部无效；现注入后重建 script 元素激活执行，脚本自身的 dataset guard 保证重复注入幂等（`src/components/security/PasswordGate.svelte`）。
