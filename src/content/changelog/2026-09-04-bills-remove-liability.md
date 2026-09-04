---
version: "v1.33.0"
date: 2026-09-04
type: removal
description: 账单页去掉负债功能，只保留支出与收入两种类型（对齐妙蛙记账的纯收支模型）
---

## 账单去负债：只留支出/收入

参考妙蛙记账的模型（账单类型只有 `expense`/`income` 两种，配合分类、备注、日期记账），把博客账单里的「负债」「转账」类型整体下线，统计口径回归纯收支结余。

- **类型只剩支出/收入**：`src/content.config.ts` 的 bills schema 枚举从 4 种收紧为 `income | expense`，PagesCMS 后台（`.pages.yml`）的类型下拉同步只留「支出/收入」。
- **顶部「净资产」卡改为「累计结余」卡**：主数字 = 累计收入 − 累计支出，副行改为「总收入 | 总支出」，奶牛壁纸视觉不变；组件由 `NetAssetCard.astro` 重命名为 `BalanceCard.astro`（`src/components/bills/BalanceCard.astro`）。
- **统计逻辑简化**：`src/utils/bill-adapter.ts` 删除负债关键词匹配（花呗/白条/信用卡账户的消费不再被排除出统计，正常计入支出），`calcBillStats` 只返回收入/支出/结余；顺带删除未被引用的 `monthlyTrend`、`memberMonthlyStats` 与 5 个无引用旧组件（BillStats/BillList/BillCategoryDonut/BillTrendLine/PeriodSummaryCard）。
- **历史负债数据清理**：删除 4 条欠款快照（京东白条/微信分付/抖音月付/花呗）与 2 条负数还款记录（还款已有对应的「补还款支出」条目，不丢数据）；「花呗消费 3.8 元洗衣服」改为普通支出保留。
- **AstrBot 插件同步**（`plug-in/AstrBot/AstrBot BlogWriter`）：QQ 记账不再支持「负债/借款/欠款」（命中即提示下线）；「还款」自动记为支出、分类「还款」；向导类型只剩支出/收入，「信用购一键拆两笔」与还债资金来源追问一并移除；全部 169 个测试通过。插件侧改动需重新发布插件版本才会生效。
