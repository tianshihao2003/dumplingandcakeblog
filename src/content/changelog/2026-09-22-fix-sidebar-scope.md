---
version: "v1.40.5"
date: 2026-09-22
time: "16:35"
type: fix
description: 修正侧栏加宽的作用范围，分类页不再跟着文章列表页一起变宽
---

## 分类页侧栏恢复默认宽度

- 上一版给文章列表页加宽侧栏时，选择器写的是 `#main-grid:has(.article-list-page)`；但**分类页的 section 同样带 `.article-list-page`**，于是分类页的侧栏也被一起加宽了，与站长只要求列表页的意图不符。
- 改为用列表页独有的修饰类限定：`#main-grid:has(.article-list-page--compact)`。现在**只有文章列表页**的侧栏是 320px，分类页恢复默认 280px。
- 实测：列表页 `320px / 内容 561px`，分类页 `280px / 内容 641px`；归档页、文章详情页、导航页均保持 280px 不受影响。构建与 `pnpm check` 均通过。
