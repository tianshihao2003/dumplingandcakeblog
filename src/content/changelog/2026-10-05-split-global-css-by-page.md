---
version: "v1.59.0"
date: 2026-10-05
time: "23:28"
type: improvement
description: 页面/组件专属样式改为「谁用谁 import」，各页 CSS 少 150~193KB
---

## 全局 CSS 拆分：不再每页背所有页面的样式

- 根因：`src/styles/**` 全部被 `main.css` 全局导入，于是**每一页都加载所有页面的 CSS**
  （首页也要背动态页/影视页/留言板/笔记本的样式）。
- 现在：把只服务某一页或某几个组件的 16 个样式文件从 `main.css` 里摘掉，改由使用它的
  组件/页面前言 `import`——Astro/Vite 会把它们并进「渲染了该组件的页面」的 CSS 包，别处不再加载。

| 页面 | 改前 CSS | 改后 CSS | 省下 |
|---|---|---|---|
| 首页 | 510.0KB | 362.7KB | −147.3KB |
| 导航 /projects/ | 520.2KB | 327.1KB | −193.1KB |
| 文章页（样本） | 913.9KB | 758.5KB | −155.4KB |
| 动态 /moments/ | — | 371.4KB（gzip 69.3KB） | — |
| 影视游戏 /movies-games/ | — | 343.0KB | — |
| 文章列表 /posts/ | — | 345.5KB | — |
| 留言板 /guestbook/ | — | 392.2KB | — |
| 分类 /categories/ | — | 327.1KB | — |

- 搬走的文件：`pages/{moments-filter,categories,article-list,notebooks,music-visualizer}.css`、
  `features/movies-games.css`、`components/{home-hero,home-hero-dialogue,home-section,home-ticker,
  home-data-layer,home-display-layer,home-portfolio-shutter,post-hero,about-changelog,guestbook-chat}.css`
  （`features/article-toc-panel.css` 早就是组件自己引入，本次只补了覆盖）。

> 验证：`pnpm check` 0 错误；`pnpm build` 通过。
> ① **静态覆盖校验**：用每个被搬文件最常用的类名做探针，在 12 个页面里抽查 19 个「页面 × 样式」组合——
> 页面 HTML 用到该类名时（先剥掉 `<script>` 避免 JS 字符串误报），其外链 CSS + 内联 `<style>` 里都能找到该选择器，19/19 ✅。
> ② **浏览器指纹**：对首页 / 动态 / 影视游戏 / 分类 / 文章列表 / 文章页抓 `getComputedStyle` 逐项比对，
> 全部与改前一致（首页大标题字母字号 117.2→133.3px 是视口从 1440 变 1638 导致，117.2×1638/1440=133.3 正好吻合）。
> 过程中踩到并修掉：往多行 `import {` 中间插样式 import 会切断语句（`ChangelogGraph.astro`、`GuestbookChatComposer.svelte`）。
