---
version: "v1.56.0"
date: 2026-10-03
time: "10:30"
type: feature
description: 自用系列笔记不再进文章列表页与 RSS（按文件夹配置，一处开关）
---

## 自用系列笔记：不进文章列表与 RSS

站长的课程笔记（JavaWeb / Python / LangChain / MySQL 学习笔记、JavaWebAI、Java笔记本、学习路线）是自己看的，不想占公开的文章列表和 RSS 订阅。

- 新增配置 src/config/notesConfig.ts：notesHiddenFromLists 里列分类文件夹路径（支持多级，前缀匹配整棵子树）。
- 匹配按「路径段」并做归一化（去扩展名/小写/空格转连字符），所以 Java笔记本 不会误伤 Java笔记本2。
- 生效点只有三处：文章列表页 src/pages/posts/[...page].astro、RSS 输出 src/pages/rss.xml.ts、RSS 预览页 src/pages/rss.astro；
  统一走 utils/content-utils 新增的 excludeHiddenNotes（纯过滤函数，不改 getSortedPosts 签名，避免波及 20 多个调用点）。
- **分类详情页 /categories/... 照常显示这些笔记**；首页最新文章/置顶、归档页、站内搜索、统计与热力图计数、sitemap 都保持原样。
- 与 draft 的分工：draft 是「全站隐藏（dev 可见）」，本机制是「只从列表与 RSS 里拿掉，详情页与分类页照常」。

> 验证：pnpm check 0 错误、biome 干净、pnpm build 通过（886 篇普通文章仍在列表页、分类详情页仍列出笔记）。
> 说明：HTML 层面的「字面量断言」不可靠 —— 笔记标题/链接也会出现在别的文章正文里（比如学习路线帖），所以最终效果建议在前台抽查：打开 /posts/ 搜一个笔记标题应搜不到，RSS 里也不应有。
