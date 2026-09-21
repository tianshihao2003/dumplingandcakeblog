---
version: "v1.40.0"
date: 2026-09-21
time: "21:40"
type: feature
description: 新增 pnpm cli cover，用 AI 批量给文章生成黑板粉笔手绘风专属封面
---

## 文章封面批量生成（`pnpm cli cover`）

博客 249 篇文章里只有 2 篇配了专属封面，其余走的是 62 张随机封面池。现在新增 `scripts/生成封面/index.ts`，调用文生图 API 批量生成「黑板粉笔手绘风」封面（左侧超大粗体中文标题 + 右侧固定角色形象 + 文章相关图标），并把 `image` 字段写回 frontmatter。

**怎么用**

```bash
pnpm cli cover --dry-run          # 先看提示词长什么样，不调 API
pnpm cli cover --limit=3          # 试做 3 张
pnpm cli cover                    # 全部补齐
pnpm cli cover --only=AI使用      # 只做某个分类
pnpm cli cover --force            # 覆盖已生成的封面
```

已有 `image` 字段的文章默认跳过，所以可以随时中断续跑。

**说明**

- 提示词模板改自 [tblog.mmzhiku.xyz 的公开提示词合集](https://tblog.mmzhiku.xyz/posts/ai-prompt-collection/)，风格集中在脚本顶部常量，换风格/换吉祥物改 `MASCOT` 即可。
- 负向提示词里**故意去掉了「文字」**——原模板带这一项，会压制封面上的大标题。
- 支持三种 provider：`dashscope`（千问 qwen-image，国内直连，默认）、`gemini`（Nano Banana，需 `GEMINI_API_KEY` + 代理）、`mock`（不联网，出纯色占位图，用来验证流水线）。
- 封面产物落在 `public/assets/images/post-covers/`，与随机封面池 `covers/` 分开，不会被随机逻辑抽中。文件名走 ASCII（路径哈希），满足第 2 节「禁止中文文件名」的硬性规则。
- 写回 frontmatter 时**只改 frontmatter 区间**：仓库里有几篇讲封面配置的教程，正文示例里也有 `image:` 开头的行，全文件替换会改坏正文。

**注意**：当前阿里云百炼账户欠费（`Arrearage`），DashScope 这条路要充值后才能用；Gemini 那条路需要在 `.env` 补 `GEMINI_API_KEY`。

修改文件：`scripts/生成封面/index.ts`（新增，`makeOutName` 见 `:152`、`writeImageField` 见 `:358`）、`scripts/cli.js:124`、`CLAUDE.md`（第 0 / 2 节）
