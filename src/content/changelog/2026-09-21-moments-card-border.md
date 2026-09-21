---
version: "v1.39.6"
date: 2026-09-21
time: "19:10"
type: improvement
description: 说说页卡片外框的粗线改为细边
---

## 说说页卡片线条改细

- `/moments/`（说说）与 `/moments/pinned/`（置顶说说）的卡片外框由 `2px` 纯黑实线改为 `1px` 细边（`oklch(0.25 0 0)` / 深色下 `oklch(0.85 0 0)`），与导航页、归档页统一。
- 同一份卡片样式存在**三处定义**，本次全部同步：`src/components/moments/MomentCard.astro`（组件内 scoped 样式，实际渲染生效的是这份）、`src/styles/features/moments.css` 的 `#moments-feed .moment-card` 与 `#pinned-feed .moment-card`（供 JS 动态插入的卡片使用）。只改其中一处会出现"静态卡片细了、动态插入的还是粗的"。
