---
version: "v1.39.5"
date: 2026-09-21
time: "19:00"
type: improvement
description: 归档页类型筛选栏的粗边框改为细边
---

## 归档页筛选栏线条改细

- 归档页顶部「全部 / 文章 / 动态 / 记录 / 生活」筛选栏（`.ap-tabs`）的外框由 `2px` 纯黑/纯白实线改为 `1px` 细边（`oklch(0.25 0 0)` / 深色下 `oklch(0.85 0 0)`），与导航页筛选栏改成同一规格。
- 样式在 `src/styles/components/archive-panel.css`（归档面板专用，放在全局 CSS 是为了不受 Svelte scoped 影响）。
