---
version: "v1.66.3"
date: 2026-11-22
time: "21:28"
type: fix
description: 修复足迹页图片查看器切页后残留成裸图、滚动锁未解除
---

## 足迹页图片查看器残留

- 图片查看器是 append 到 `body` 上的，Swup 切页只替换 `#swup-container` 里的内容，查看器不会被一起带走；它的样式来自足迹页头部的 CSS，切页后样式被换掉，残留的 `<img>` 就以原始尺寸裸露在页面左侧。
- `PhotoViewer.close()` 现在会在淡出动画（300ms）结束后把查看器从 DOM 中摘掉，重新打开时再挂回 `body`（全屏时挂回全屏元素）。
- 新增 `cleanupPhotoViewer()`：在 `swup:content:replaced` 时兜底移除残留的 `.footprint-photo-viewer` 并清掉 `html` 上的 `footprint-photo-viewer-open` 滚动锁，覆盖「查看器开着直接切页」的情况。
