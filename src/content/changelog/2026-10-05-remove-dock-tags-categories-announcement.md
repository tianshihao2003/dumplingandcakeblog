---
version: "v1.58.0"
date: 2026-10-05
time: "23:08"
type: removal
description: 悬浮坞去掉标签/分类/公告三个按钮（桌面+移动），连带清掉三个抽屉与死样式
---

## 悬浮坞：去掉「标签 / 分类 / 公告」

- 站长要求：桌面端与移动端右下角的**公告、标签、分类**三个按钮不再需要。
- 删除内容（都在 `src/components/layout/UnifiedDock.astro`）：堆叠里的三个按钮、
  三个抽屉（`#dock-drawer-tags` / `#dock-drawer-categories` / `#dock-drawer-announcement`）、
  按钮→抽屉映射，以及只服务它们的数据抓取（`getTagList` / `getCategoryList` / ziyuan 的公告条目）。
- 顺带清掉变成死代码的样式：`src/styles/components/floating-dock.css` 里的
  `.dock-tags-list` / `.dock-tag-item` / `.dock-tag-count`（含移动端媒体查询里那两条）。
- **展开列（`#ud-stack`）现在只剩音乐 + 主题**；音乐抽屉、目录抽屉、全部文章抽屉都不受影响。
  标签/分类走导航栏入口，公告仍由 `Announcement` 小组件承担（数据源没动）。

> 验证：pnpm check 0 错误；pnpm build 通过。产物断言：首页 HTML 里
> `dock-drawer-tags` / `dock-drawer-categories` / `dock-drawer-announcement` / `dock-tag-item` /
> `ud-tags-btn` 出现次数均为 0，`ud-music-btn` 仍为 1。
> 浏览器实测（生产预览 4322）：堆叠内只剩 `ud-music-btn` + `ud-theme-btn`，
> 点「展开」后点音乐能正常打开 `[ 音乐 ]` 抽屉，且是唯一打开的抽屉。
