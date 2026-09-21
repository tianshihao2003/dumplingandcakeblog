---
version: "v1.39.7"
date: 2026-09-21
time: "19:20"
type: improvement
description: 导航页卡片高度统一固定为两行描述文案的高度
---

## 导航页卡片高度统一

- 卡片高度此前随描述文案长短浮动（实测 135 / 156 / 176px 三档），现在**统一固定为两行描述的高度（156px）**：描述区改为 `-webkit-line-clamp: 2` 且 `min-height` / `max-height` 都锁在 `3.2em`——短描述留白、长描述截断，同排卡片始终等高。
- 改动在 `src/pages/projects.astro` 的 `.tools-card-desc`。
