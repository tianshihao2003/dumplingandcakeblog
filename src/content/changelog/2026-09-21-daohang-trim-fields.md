---
version: "v1.40.3"
date: 2026-09-21
time: "22:30"
type: improvement
description: 导航条目精简为四个字段，分类内改按名称排序
---

## 导航条目只保留四个字段

- `src/content/daohang/` 下的条目现在只有 `name`、`url`、`icon`、`description` 四个字段，`tags` / `color` / `featured` / `order` / `image` 全部删除（共清理 45 个文件）。
- 这几个字段此前就没有任何代码读取（分类由文件夹决定、卡片配色按分类名自动生成），留着只会让人误以为能生效。**新增导航条目不要再写它们。**
- 失去 `order` 后，分类内的排序改为**按名称拼音升序**（`name.localeCompare(..., "zh-CN")`）。
- 同步清理了 `src/content.config.ts` 的 schema、`.pages.yml` 的表单字段，以及页面里对已删除 `image` 字段的兜底分支；顺带把一个遗留在 `daohang/` 根目录的文件归入 `未分类/`。

> 验证：`pnpm check` 0 错误、构建 508 页通过；导航页 13 个分类、52 张卡片显示正常，卡片高度统一 153px。
