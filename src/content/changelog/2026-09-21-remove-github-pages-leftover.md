---
version: "v1.40.4"
date: "2026-09-21"
time: "16:45"
type: removal
description: 删除 GitHub Pages 遗留的部署工作流与 CNAME，不再随 push 触发无效构建
---

## 清理 GitHub Pages 遗留配置

- 删除 `.github/workflows/pages.yml` 与 `public/CNAME`。这两项是 2026-09-04 从 GitHub Pages 迁移到 EdgeOne Pages 时**漏删**的遗留物：`pages.yml` 的触发条件是 `push: branches: [main]`，所以此后每次 push 都会额外跑一遍完整的 build + deploy，部署到没绑自定义域名的 `tianshihao2003.github.io/dumplingandcakeblog/`——一个没人访问的站点，纯消耗 Actions 时长。
- 生产链路不受影响：站点一直由 EdgeOne Pages 托管 `blog.tsh520.cn`。GitHub Pages 上已有的部署内容保留，只是不再自动更新。
- 同步更新文档：`CLAUDE.md`、`AGENTS.md` 里"仍留在仓库"的描述改为已删除；`docs/deploy-edgeone-pages.md` 的迁移记录补注了这次补删。
- 如需回滚：两个文件都在 git 历史中，随时可恢复。
