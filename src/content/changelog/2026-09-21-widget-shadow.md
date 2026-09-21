---
version: "v1.39.2"
date: 2026-09-21
time: "18:40"
type: improvement
description: 侧栏小组件去掉常驻阴影，改为悬停时才浮现
---

## 侧栏小组件去阴影

- 天气、抖音热搜、个人资料卡与所有走 `WidgetLayout` 的小组件，此前常驻一圈 `0 0 12px 2px` 的阴影；现在**静态不显示阴影**，只在鼠标悬停时浮起（hover 阴影保留）。
- 改动位置：`src/components/common/WidgetLayout.astro`（覆盖大多数小组件）、`src/components/widget/Profile.astro`、`src/styles/components/weather.css`、`src/styles/components/douyin-hot.css`、`src/styles/features/widget-responsive.css` 的 `.profile-widget-card`。这几处是同一个视觉语言，改一处就要同步其余，否则侧栏会出现有的有阴影、有的没有。
