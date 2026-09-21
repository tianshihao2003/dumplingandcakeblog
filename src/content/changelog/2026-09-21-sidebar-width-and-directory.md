---
version: "v1.39.1"
date: 2026-09-21
time: "18:20"
type: improvement
description: 左侧「全部文章」目录去掉日期、文章列表页侧栏加宽，标题不再被截断
---

## 左侧文章目录去掉日期（仅文章列表页/分类页侧栏加宽）

- 「全部文章」目录的每一行**去掉发布日期**（日期在文章卡片上已有），把空间让给标题。标题可用宽度从 **71px 提升到 178px**，实测文章标题已全部完整显示、不再截断。
- 文章列表页与分类页的侧栏**加宽到 320px**（默认 280px）。这是**页面级覆盖**，写在 `src/styles/pages/article-list.css` 的 `#main-grid:has(.article-list-page)` 规则里——侧栏宽度的全局定义在 `responsive-utils.ts` / `grid-layout-utils.ts` / `swup-lifecycle-controller.ts` / `guestbook.astro`（`17.5rem` + `max-w-70`），**不要改那几个全局值**，否则全站每一页的侧栏都会变宽、中间内容被挤窄（本次改动第一版就是这样，已回滚）。
