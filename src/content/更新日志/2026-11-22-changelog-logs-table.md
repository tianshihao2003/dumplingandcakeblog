---
version: "v1.67.0"
date: 2026-11-22
time: "21:50"
type: feature
description: 更新日志页改成可搜索、可按类型筛选、逐行展开的日志表格
---

## 更新日志页改成日志表格

- 原蛇形网格卡片 + SVG 关联线换成日志表格：每行一条更新，依次是类型徽章、日期时间（等宽字体）、描述、版本号，点行展开详情（完整描述、版本、日期、类型）。
- 顶部工具栏带搜索框（匹配描述 / 版本 / 日期 / 类型名）和筛选按钮；筛选面板只列 4 种类型并带各自条数，支持多选与一键清除，移动端排在列表上方。
- 组件是 Svelte 5 单文件组件 `src/components/pages/ChangelogLogs.svelte`，数据在构建期由 `src/utils/changelog.ts` 从集合映射好再传入；不引入 React / shadcn / framer-motion，图标用已有的 `lucide-svelte`，展开动画用 `svelte/transition` 的 `slide`。
- 类型配色改用 `feature / improvement / fix / removal` 四色映射（旧 CSS 写的是 `feat / style / refactor / chore`，和集合实际枚举对不上，一直没生效），暗色单独一套更亮的色值。
- 样式在 `src/styles/pages/changelog-logs.css`，由页面 frontmatter 引入；删掉不再使用的 `src/components/about/ChangelogGraph.astro`、`src/styles/components/about-changelog.css`，以及 `src/utils/changelog.ts` 里的 `PAGE_META` / `buildChangelogLinks`。
- 排序在日期相同的情况下再按 `time` 倒序，同日多条更新按时间从晚到早。
