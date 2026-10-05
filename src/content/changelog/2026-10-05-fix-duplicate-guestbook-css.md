---
version: "v1.59.1"
date: 2026-10-05
time: "23:50"
type: fix
description: 修掉 guestbook-chat.css 的重复引入（文章页白背 37.7KB）
---

## guestbook-chat.css 被加载两遍

- 上一版把 `guestbook-chat.css` 挂到了 5 个组件上，其中 `GuestbookChatMessage.svelte`、
  `GuestbookChatComposer.svelte` 是**嵌套**在 `GuestbookChat` 里的，于是 Vite 把它们各自打成
  chunk、同一份 CSS 在文章页出现两次（`guestbook-chat.*.css` 与 `GuestbookChatMessage.*.css`，
  各 37.6KB）。
- 现在只保留三个最外层入口（`GuestbookChat` / `MomentCommentChat` / `NotebookCommentModal`）
  的引入，嵌套组件的 import 删除。
- 实测：文章页样式表 49 个 / 758.5KB → **48 个 / 720.8KB**（少 37.7KB），
  且页面 CSS 里 `.guestbook-chat` 规则仍在（只加载一次）。

> 顺带记录一个**尚未解决**的疑点：365 篇文章页都链接约 48 个样式表（其他页只有 9~12 个），
> 其中包含 `SchedulesView`（早已无人 import 的死组件）、`album` / `projects` / `notebooks` /
> `movies-games` / `moments` / `home-*` 等**别的页面**的样式 chunk。
> 已排除的原因：config/utils/types 没有 import 组件、侧栏 17 个 widget 的 import 都很轻、
> 全仓没有组件级 `import.meta.glob`、astro.config 没有自定义 CSS 注入插件、清空 dist 重建后依旧
> （不是陈旧产物）。有待下一次继续查（`src/pages/posts/[...slug].astro` 的依赖树或 Astro 的 CSS 链接行为）。
