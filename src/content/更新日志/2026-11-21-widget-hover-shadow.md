---
version: "v1.66.2"
date: 2026-11-21
time: "19:05"
type: improvement
description: 去掉侧栏小组件悬浮时的阴影和位移
---

## 侧栏小组件悬浮效果

- 移除 `WidgetLayout.astro` 里 `widget-layout:hover` 的边框变色 + 外发光，以及 `widget-responsive.css` 里遗留的 `.widget-container:hover` 阴影/上移规则。
- 现在鼠标悬浮在两侧小组件上不会再有阴影、位移或边框变化。
