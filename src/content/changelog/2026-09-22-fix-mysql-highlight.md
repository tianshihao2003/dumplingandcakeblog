---
version: "v1.41.1"
date: 2026-09-22
time: "17:30"
type: fix
description: 修复 mysql 代码块的高亮警告，把 mysql 语言映射到 SQL 语法
---

## 修掉 mysql 代码块的高亮警告

- 构建时 `astro-expressive-code` 会为 ` ```mysql ` 代码块刷一屏 `language could not be found` 警告，并把代码块降级成纯文本。原因是 **Shiki 根本没有 `mysql` 语法**——它的 722 个语言里只有 `sql`。
- 处理方式是在 `astro.config.mjs` 的 `expressiveCode` 里加语言别名：`shiki: { langAlias: { mysql: "sql" } }`。这样笔记里的 ` ```mysql ` 标记**不用改**（写 MySQL 比写 SQL 更贴合内容），构建时按 SQL 语法高亮，警告消失。
- 涉及 4 个历史笔记（`src/content/posts/已弃用/MySQL *.md`）共 32 处 ` ```mysql `，内容未改动。
- 同步在 `CLAUDE.md` 第 6 节记了这条：新增其它语言别名也加在这里。

> 验证：清空 `dist` 重新构建，mysql 相关警告从 32 条降到 **0 条**，构建 510 页通过；并用 shiki 直接验证 `mysql` 别名确实走了 SQL 高亮（不是降级纯文本）。
