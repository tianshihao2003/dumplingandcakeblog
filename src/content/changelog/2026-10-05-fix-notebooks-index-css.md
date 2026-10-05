---
version: "v1.59.2"
date: 2026-10-05
time: "23:59"
type: fix
description: 修复笔记本列表页样式丢失（notebooks.css 只挂到了子页）
---

## 笔记本列表页样式丢失

- 站长发现 `/life/notebooks/` 样式没了。原因：上一版把 `notebooks.css` 从 `main.css` 摘出来时，
  只挂到了 `src/pages/life/notebooks/[...slug].astro`（子页），**列表页 `index.astro` 漏挂了** ——
  实测该页用到的 49 个 `notebooks.css` 类名里有 **48 个没有对应规则**。
- 现在 `index.astro` 也 import 了它：样式表 8 → 9 个，`.diary-header` / `.diary-random-note` /
  `.diary-stats` / `.diary-list` / `.shelf-head` / `.shelf-title` 等类名全部恢复规则。
- 顺带做了一次**全量漏网扫描**（按「样式表签名」把 618 个产物页面分成 21 组，每组抽查一页，
  比对「页面用到的类名」与「页面 CSS 里的规则」）：除本页外未发现其他缺失。

> 教训（已补进 CLAUDE.md §4.3）：搬迁样式后，**验证必须覆盖所有用到该类名的页面**，
> 不能只挑一个探针类名抽查——本次就是因为探针选的是子页才用的 `nb-archive-images`，
> 列表页（用的是 `diary-*` / `shelf-*`）才漏掉了。
