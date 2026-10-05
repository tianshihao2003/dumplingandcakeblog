---
version: "v1.57.0"
date: 2026-10-03
time: "14:40"
type: feature
description: 下线日历/账单/应用展示/音乐四个页面，导航栏的「我的」分组一并去掉
---

## 下线四个页面

- 删除路由：/schedules/（日历）、/bills/（账单）、/apps/（应用展示）、/music/（音乐页面）。
- 导航栏与移动端菜单里的「我的」分组（含日历/账单/应用展示/音乐四个入口）一并去掉；
  navBarConfig 里「记录」分组的默认跳转从已删的 /music/ 改到 /archive/。
- **音乐功能全部保留**：右下角悬浮坞的音乐按钮与抽屉、musicConfig、bangumi 里的音乐条目都没动
  （音乐页面只是入口之一，与组件无依赖）。同理，四个页面用到的集合定义（bills/schedules/apps）
  与内容文件（117+7+1 篇）**都没删**，页面先下线、数据留着，等你确认后再清理。

> 验证：pnpm check 0 错误；pnpm build 通过；产物断言：dist 下不再有 bills/schedules/apps/music 目录，
> 首页 HTML 里 /schedules//bills//apps//music/ 链接数为 0，而 dock-drawer-music 与 ud-music-btn 仍在。
