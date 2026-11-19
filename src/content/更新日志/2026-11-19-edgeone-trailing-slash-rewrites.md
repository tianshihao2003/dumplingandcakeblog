---
version: "v1.65.4"
date: 2026-11-19
time: "12:00"
type: fix
description: 修复线上带尾斜杠的页面全部 404（EdgeOne 不再自动把 /xxx/ 映射到 xxx/index.html）
---

## 修复线上尾斜杠页面 404

- 2026-11-18 起 EdgeOne Pages 在自定义域名层不再把 `/xxx/` 解析到 `xxx/index.html`，导致站内所有带尾斜杠的链接（文章、分类、归档、友链等）返回 404；`/xxx` 与 `/xxx/index.html` 仍正常，构建产物本身没有问题。
- 仓库根目录新增 `edgeone.json`，用 `rewrites` 逐层把 `/:levelN/` 重写到 `/:levelN/index.html`（1～5 级），随构建部署生效。
- 部署与排查说明见 `docs/deploy-edgeone-pages.md` 第六节。
