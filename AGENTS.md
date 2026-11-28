# AGENTS.md

**全程用中文回复**（用户不读英文）。

本仓库唯一权威工程规范是根目录 **CLAUDE.md**（§0–§23：命令、目录、样式、组件、i18n、Swup、反模式、验证分级、PagesCMS、更新日志、双仓库模型）。本文件只是入口 + 最高频事实，**不要扩写成第二份 CLAUDE.md**；边界细节一律查 CLAUDE.md，改完项目按 §20 同步更新它。

## 开工前

- 写/改内容（文章、动态、友链、更新日志、导航……）先读库根的 **`B:\Obsidian Vault Collection\Obsidian Vault content\AGENTS.md`**：那里的 schema / 字段坑比代码坑更容易静默搞坏页面。⚠️ 该文件只在本地库（备份仓）里，**主仓不跟踪**，新 clone 可能没有。
- `src/content` 是指向 `B:\…\Obsidian Vault content\blog` 的 **junction**；博客内容实际住在库里的 `blog/`，不再等于库根（2026-11-28 解耦，见 CLAUDE.md §23.1）。
- 在 `src/content/` 里跑的 `pnpm` 一定失败（没有 package.json）；所有命令回仓库根执行。
- 技术栈：Astro 7.1.6 + Svelte 5（runes）+ Tailwind v4，**无 `tailwind.config.js`**，勿照 Astro 6 / Tailwind 3 文档操作。
- pnpm 9.14 是唯一包管理器（`preinstall` only-allow 强制），Node ≥ 22。
- 部署：push main → EdgeOne Pages 自动 `pnpm build` → blog.tsh520.cn。`.github/workflows/build.yml` 只是质量门（astro check + build），不是发布器。

## 数据结构

- 内容集合共 **11 个**，定义在 `src/content.config.ts`：`posts` `spec` `moments` `bangumi` `places` `album` `daohang` `ziyuan` `friends` `tombstones` `changelog`。**集合键名是英文、磁盘目录是中文，两边都不许改名**，代码里一律 `getCollection("posts")`。
- 分类 = 文件夹路径（`文章/技术分享/x.md` → 分类「技术分享」）；frontmatter `category` 已废弃，写了也会被忽略。
- 新增公开集合要三处一起改：`src/content.config.ts` + 根 `.gitignore` 加 `!src/content/目录/` + `.pages.yml`（后台字段必须与 zod 对齐，未声明字段在后台保存时被丢弃）。
- 组件按功能域放 `src/components/<域>/`（about / analytics / comment / common / controls / features / layout / misc / moments / pages / seo / widget），**禁止根目录平铺**；样式只能经 `src/styles/main.css` 引入。
- i18n 只剩中文一份：新键同时加到 `src/i18n/i18nKey.ts` 与 `src/i18n/languages/zh_CN.ts`。
- 排序只认 frontmatter 业务字段（如 `published`、`order`、friends 的 `added`），**别用文件 mtime**——CI 每次全新 clone，mtime 全一样。

## 命令（真实脚本，别猜）

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 开发；日常小改看一眼就够 |
| `pnpm check` | `astro check`（类型 + 诊断，比 build 快） |
| `pnpm type-check` | `tsc --noEmit --isolatedDeclarations` |
| `pnpm build` | 生成图标 → `astro build` → pagefind 索引 |
| `pnpm exec biome ci ./src --reporter=github` | 只检查、与 CI 完全一致的 Biome 口径 |

- `pnpm lint` / `pnpm format` **会直接改写** `./src`；想确认 CI 会不会红，用上面那条 `biome ci`。
- Biome 配置排除了 `src/**/*.css`，样式问题只能靠 `pnpm dev` / `pnpm build` 发现。
- **build 前先关 dev server**：两者抢 `node_modules/.astro/data-store.json` 锁，报 `EPERM ... data-store.json.tmp` 不是代码错误。
- **日常小改不必 build**，只有推送 main 前 / 完成模块才跑（三档分级见 CLAUDE §18.1；改集合、schema、`src/config/`、`main.css` 即使看起来小也算高档）。
- 无测试框架：验证 = dev 实测 + 结构性改动 `pnpm check` + 推送前 `pnpm build`。
- 没 `.env` 也能跑，但 `PUBLIC_*`（Waline、Umami、高德、图床、TTS）缺失会**静默降级**，照 `.env.example` 建。
- 其它：`pnpm new-post`、`pnpm cli cover|desc`、`pnpm icons`、`pnpm compress-images`（`--dry-run` 预检）。
- `pnpm cli media` / `music` 本身是 Python 脚本，那是正常工具；但**禁止用 Python 脚本读写/替换仓库文件**（曾改坏文件），要写脚本用 Node。

## 双仓库：`src/content/`

- `src/content/` 自身是独立 git 仓库（私有备份 `content-backup`，obsidian-git 每 30 分钟自动 commit）。在它里面 `git status` / `commit` 操作的是备份仓，**不会发布**；发布要回仓库根提交推送。
- 主仓 `.gitignore` 先 `src/content/*` 全忽略，再逐条 `!src/content/xx/` 放行。**新增公开集合必须补一行放行**，否则本地 dev 正常、线上永远缺内容。
- **绝不在 `src/content/` 下新建 `.gitignore`**：主仓会一并读取，把整个集合目录忽略掉，新文章静默提交不上去。备份仓规则只能写 `.git/info/exclude`。
- 验证：`git check-ignore -v --no-index "src/content/文章/某分类/x.md"`（无输出 = 会跟踪）；新建目录应为「有输出 = 忽略」。
- 主仓里 `文章/**` 常有一批 `M` 但 `git diff` 为空 = Windows CRLF 噪声，别提交、也别顺手「修」。

## 高频坑（完整清单见 CLAUDE §15）

- Swup SPA：容器内组件禁用 `client:load`；监听器用 AbortController 清理；跨导航单例用 `window.__xxx` guard；新增 Swup 功能**不要**改 `swup-lifecycle-controller.ts`，监听 `swup:content:replaced` 自注册。
- 页面交互脚本必须写在 `MainGridLayout` 的 slot 内，否则从别的页面 SPA 进来时不执行。
- dev 下组件卡「加载中…」/按钮没反应：先看控制台是否 `504 Outdated Optimize Dep`，删 `node_modules/.vite` 重启 dev。
- 样式：禁止新建 Stylus 文件、禁止新增 `!important`、禁止硬编码 `#000/#fff`；暗色选择器统一 `:root.dark`。
- Svelte 5：响应式变量（含 DOM ref）必须 `$state`；非 void 标签禁止自闭合。
- 密钥只放 `.env` + `process.env`，提交前用 `git check-ignore` / `git ls-files` 实测（曾把 DashScope Key 公开在脚本里）。
- 改 `src/content.config.ts` 字段后要同步 `.pages.yml` **和** `plug-in/AstrBot/AstrBot BlogWriter` 的 `build_*_md`，否则插件写入的旧格式会让页面渲染空/校验失败。
- 页面交互内联脚本放 Swup 容器外、用 mtime 排序、拿 entry `id` 拼磁盘路径——都是踩过的坑，详见 §15。

## 本地插件（`plug-in/`，整体 gitignore）

- 每个子目录都是独立 git 仓库，改动不进博客仓。**改完必须 `pnpm build`**（把 `main.js` / `manifest.json` 拷进 Obsidian 库，否则库里还是旧版），再在插件仓 commit & push，并提醒用户在 Obsidian 里 Ctrl+P 重载。
- 各插件目录有自己的 `AGENTS.md`；`obsidian-image-manager` 没有，规范在 CLAUDE §20（升 manifest + package 版本、`gh release create`、**绝不提交 `data.json`**）。

## 收尾（CLAUDE §21–§22）

- 每完成一个功能/修复**立即**写 `src/content/changelog/YYYY-MM-DD-kebab.md`，别攒批：`type` ∈ `feature|improvement|fix|removal`；版本号 feature→minor、fix/improvement→patch、removal→minor。
- 提交信息 `<type>(<scope>): <描述>`（feat|fix|refactor|style|docs|chore|perf）。
- 推送前 C 档全绿：`pnpm build` + `pnpm check` + `pnpm exec biome ci ./src --reporter=github`，并浏览器实测关键路径。
