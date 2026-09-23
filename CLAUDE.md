# CLAUDE.md — Firefly 博客工程规范

> 本文件是 AI 助手在本仓库中工作的唯一权威指令。所有开发行为必须遵守以下规范。

---

## 0. 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` / `pnpm start` | 本地开发（astro dev） |
| `pnpm build` | 生产构建：生成图标 → astro build → pagefind 索引（**提交前必跑**，见第 18 节） |
| `pnpm preview` | 预览构建产物 |
| `pnpm check` | astro check（类型 + 诊断） |
| `pnpm type-check` | tsc --noEmit 类型检查 |
| `pnpm lint` / `pnpm format` | Biome 检查自动修复 / 格式化（针对 ./src） |
| `pnpm new-post` | 交互式新建文章（scripts/新建文章） |
| `pnpm icons` | 重新生成图标（scripts/生成图标，build 自动前置执行） |
| `pnpm compress-images` | 压缩图片（`--dry-run` 预检）；另有 rename-images / import-wallpapers 图片脚本 |
| `pnpm cli` | 仓库工具 CLI（scripts/cli.js） |
| `pnpm cli cover [--dry-run] [--limit=N] [--force] [--only=分类] [--provider=dashscope\|gemini\|mock]` | AI 批量生成文章封面（scripts/生成封面，黑板粉笔手绘风，详见第 2 节「文章封面生成」） |
| `pnpm cli desc` | AI 批量补全文章摘要（scripts/生成摘要，需 `DASHSCOPE_API_KEY`） |
| `node scripts/友链截图/index.mjs [友链id] [--force]` | 站点截图（Playwright，伪装真实浏览器/字体+网络空闲等待/3 次尝试；产物 public/assets/friends-shots/{id小写}.webp；Action 每周日全量 + push friends 变化自动跑） |
| `node scripts/友链状态检测/index.mjs` | 友链延迟检测（产物 public/friends-status.json；Action 每天自动跑） |
| `bash "scripts/TTS服务/自测.sh"` | 服务器上自测朗读服务（见 `docs/deploy-edge-tts.md`） |

> 包管理器仅限 pnpm（preinstall 强制 `only-allow`）。本项目无测试框架，验证手段 = `pnpm build` + `pnpm check`。

---

## 1. 项目概览

| 项 | 值 |
|---|---|
| 名称 | Firefly v6.6.13 — "团子和蛋糕的博客" |
| 框架 | Astro 7.1.6 + Svelte 5 + Tailwind CSS v4 |
| 包管理 | pnpm 9.14.4 (ESM, `preinstall` 强制) |
| 运行时 | Node.js >= 22 |
| 部署 | **EdgeOne Pages**（GitHub 集成自动构建并托管 blog.tsh520.cn，2026-09-04 从 GitHub Pages 迁移，见 `docs/deploy-edgeone-pages.md`；GitHub Pages 的遗留配置 `pages.yml` 与 `public/CNAME` 已于 2026-09-21 删除，GitHub Pages 站点内容保留但不再更新） |
| 线上 | https://blog.tsh520.cn/ |
| 后台 | PagesCMS 自托管（Vercel + EdgeOne 加速）：https://cms.tsh520.cn/（配置见第 19 节） |
| 来源 | Fork 自 CuteLeaf/Firefly ← saicaca/fuwari，已深度定制为独立演化 |

> ⚠️ **Astro 版本已升级至 7.x**（`feat/astro-7-upgrade` 已合并），勿再按 6.4.x 文档操作。

---

## 2. 目录结构

```
src/
├── assets/images/       # 头像、封面等构建时图片
├── components/          # 按功能域组织的组件（147 个文件）
│   ├── analytics/       # GA, Clarity, Umami (3)
│   ├── comment/         # 评论系统：index + 5 种后端 + 3 个弹窗组件 + NotebookComment 笔记本列表页自研评论区（笔记引用 >>QUOTE>> 编码 + Waline 树形回复 pid/rid/at + 表情 :item: 标记，昵称/邮箱必填） (10)
│   ├── common/          # 跨域共享基础组件 (17)
│   ├── controls/        # 交互控件：搜索、归档（类型 Tab 筛选）、主题、Dock (8)
│   ├── features/        # 独立功能模块 (26, 含 music-visualizer/、ArticleTtsPlayer.svelte 文章朗读播放器)
│   ├── layout/          # 布局组件：Navbar, Footer, SideBar, HomeHero... (19)
│   ├── misc/            # License, RelatedPosts, SharePoster (3)
│   ├── moments/         # 动态卡片与评论弹窗
│   ├── bills/         # 账单/资金（7：Balance 年度结余横幅卡 + MonthlyFlow 月度流水（按日分组/月份筛选/分页）+ BillCalendar 账单日历（农历+每日收支）+ DailyTrend/ExpenseRank/IncomeCategory/MonthlySummary/YearlyFlow，按图两栏等比缩小）
│   ├── schedules/     # 日程（3：ScheduleCalendar/ScheduleList/SchedulesView 周视图默认 + 提醒 + 分页等高）
│   ├── pages/           # 页面级组件：bangumi, books（Bookshelf/BookCard：3D 书本卡片 + 影视页同款胶囊筛选（分类+读过/在读/想读）+ ClientPagination 分页 8/6 本每页，SSR 隐藏非首页防闪烁）, movies-games, music (10)
│   └── widget/          # 侧栏 Widget (27)
├── config/              # 站点配置（27 个 .ts，index.ts barrel export）
├── constants/           # 常量：页面尺寸、主题模式、图标、链接预设
├── content/             # Astro Content Collections（15 个集合：posts/spec/moments/bangumi/life/notebooks/album/daohang/ziyuan/friends/apps/tombstones/changelog/bills/schedules）
│   ├── album/ apps/ bangumi/ changelog/ daohang/
│   ├── friends/ life/ moments/ posts/ spec/ ziyuan/  # spec/about.mdx 为组件化 Q&A；更新日志图谱组件（ChangelogGraph）用于 /changelog/ 页（2026-08-30 起不再嵌入关于页）
│   └── life/notebooks/  # notebooks 集合物理位置（life 的子目录，2026-09-27 起归档改 card 流，支持 images 多图 12字展开 + 年份下拉联动热力图与列表）
├── i18n/                # 国际化（5 种语言，330 个翻译键）
│   └── languages/       # en.ts, zh_CN.ts, zh_TW.ts, ja.ts, ru.ts
├── layouts/             # Layout.astro (591行), MainGridLayout.astro (305行)
├── notes/               # Obsidian 笔记（不发布）
├── pages/               # 路由（38 个文件；admin 后台已删除，勿重建）
│   ├── api/             # JSON API (2)：calendar.json.ts, home-stats.json.ts
│   ├── album/ bangumi/ books/ categories/ life/ moments/ posts/ // moments/[slug] 已删除
│   └── 404, about, archive, apps, changelog, circle, debug-urls, friends,
│       guestbook, life/notebooks, movies-games/, music, projects, search,
│       sponsor, rss, robots.txt, og
├── plugins/             # 自定义 remark/rehype 插件 (10)
├── styles/              # CSS 样式（73 个文件，含 about 技术栈/时间线/更新日志图谱）
│   ├── tokens/          # 设计令牌：colors, breakpoints, animation, z-index
│   ├── base/            # reset, utilities
│   ├── components/      # 组件样式
│   ├── features/        # 功能样式（含 tts-player.css 文章朗读播放器）
│   ├── layout/          # 布局样式
│   ├── pages/           # 页面样式
│   ├── transitions/     # Swup 过渡动画
│   └── vendor/          # 第三方覆盖
├── types/               # TypeScript 类型：config.ts, bangumi.ts, guestbook-chat.ts
└── utils/               # 工具函数（41 个文件，含 changelog.ts / tag-graph 控制器 / tts-text 正文提取等）
    ├── 8 个控制器模块   # 见第 10 节
    └── 33 个业务工具    # content-utils, category-tree（文件夹即分类，多级 `a/b` 推导 + CategoryNode 树）, date-utils, image-utils, url-utils, tts-text（朗读正文提取）...

# 根目录其他重要文件
.pages.yml                # PagesCMS 后台配置（11 集合声明，见第 19 节）
.claude/settings.json     # 命令白名单（分类器不可用时不卡 Bash）
pagefind.yml              # Pagefind 索引排除配置（katex、搜索面板等）
scripts/                  # 开发脚本：12 个中文命名脚本目录（生成图标/新建文章/生成摘要/生成封面/转WebP/添加导航/下载影视/下载音乐/回填友链字段/友链截图/友链状态检测/TTS服务）+ cli.js、vision.mjs（图片识别）、compress-images.mjs、rename-images.mjs、import-wallpapers.mjs、check-svelte-warnings.mjs（脚本清单见第 0 节；生成封面 见第 2 节「文章封面生成」；TTS服务 为 edge-tts 朗读服务，部署产物，教程见 docs/deploy-edge-tts.md）
docs/                     # 部署文档（deploy-pagescms-vercel.md 等）
write_places.cjs          # 一次性脚本：生成 life/places 足迹页
```

**禁止在 `components/` 根目录平铺组件文件，必须放入对应功能域子目录。**
**注意：`src/pages/admin/`、`src/utils/admin/`、`src/components/album|daily/` 等 admin/废弃目录已删除，勿再创建自研后台（后台用 PagesCMS）。**

### 图片资源目录规范（2026-08 重组）

**`public/assets/images/`**（构建直出、不优化）：
| 目录 | 用途 |
|------|------|
| `covers/` | 文章随机封面池（62 张，`coverImageConfig.randomCoverImage` 从中随机取，文件名 1.webp 起编号） |
| `post-covers/` | **每篇文章的专属封面**（`pnpm cli cover` 生成，见下方「文章封面生成」）；与上面的随机池分开，避免被随机逻辑抽中 |
| `home/main/`、`home/portrait/` | 首页套图（hero 数据图 / 竖版背景） |
| `emoji/` | 表情与小图标（openai-dark/light.png 等） |
| `icons/` | 组件图标（profile.png 等） |
| `notebooks/` | 笔记本照片（编号 webp） |
| `sponsors/` | 赞助二维码 |
| `loading/` | 页面加载图 |
| `moments-cover.jpg` | 说说页封面 |

**`src/assets/images/`**（需 Astro 优化的小图）：
- `avatars/` 首页头像池；`backgrounds/desktop|mobile/` 背景图池；`avatar.webp`/`avatar2.webp` 上/下班头像；`cover.avif` 封面兜底；`firefly.png` 导航 Logo

**硬性规则**：
- 目录英文小写 kebab-case 按功能分组；**禁止拼音/中文目录、顶层散放文件**
- 文件名英文小写+连字符，**禁止空格、括号、拼音**
- 转 webp 后删原始 png/jpg；新增图片必须进对应功能目录
- 移动/重命名图片必须同步改全部引用，grep 旧路径验证零残留

### 文章封面生成（2026-09-21）

`pnpm cli cover`（脚本 `scripts/生成封面/index.ts`，tsx 运行）批量给缺封面的文章生成「黑板粉笔手绘风」专属封面，并把 `image:` 写回 frontmatter。要点：

- **提示词**改自 tblog.mmzhiku.xyz 公开的「黑板封面」模板；风格集中在脚本顶部 `STYLE_TEMPLATE` 相关常量（`MASCOT` 是封面里的固定角色形象，换吉祥物改这里）
- **负向提示词里故意不含「文字」**：参考站原模板带了「文字」，会压制封面上的大标题，抄的时候必须删掉（脚本内已有注释标注）
- **provider**：`dashscope`（qwen-image，默认，走 `DASHSCOPE_API_KEY`，国内直连）/ `gemini`（Nano Banana，走 `GEMINI_API_KEY` + `HTTPS_PROXY`，Node 24 靠 `NODE_USE_ENV_PROXY=1` 让原生 fetch 认代理，cli.js 已自动设置）/ `mock`（不联网，生成纯色占位图，用于验证流水线）
- **文件名必须 ASCII**：脚本取相对路径的 ASCII 片段 + 8 位路径哈希（`makeOutName`）。中文标题会退化成 `cover-<hash>.webp`，这是为满足上文「禁止中文文件名」硬性规则；哈希跨平台稳定，重跑不会改名
- **安全**：`writeImageField` 只改 frontmatter 区间。仓库里有若干篇讲封面配置的教程，**正文示例里也含 `image:` 开头的行**，全文件正则替换会改坏正文（已用 `博客指南/博客使用指南.md` 实测验证：diff 必须恰好 1 行新增、0 删除）
- **`image` 字段**：`src/content.config.ts` 里是 `z.string()`，`processCoverImageSync` 原样返回，所以本地路径 `/assets/images/post-covers/x.webp` 与外部图床 URL 都可用
- 可反复中断续跑：已有 `image:` 的文章默认跳过，`--force` 才覆盖

---

## 3. 核心架构

### 3.1 布局继承链

```
Layout.astro          ← HTML 骨架：<html>, <head>, <body>, 全局组件, 主题初始化
  └─ MainGridLayout.astro  ← 页面结构：Navbar, 侧栏网格, Footer, 看板娘
       └─ 页面组件          ← 具体内容：首页、文章、分类...
```

- `Layout.astro`：负责 `<head>`、主题初始化（内联 `<script is:inline>`）、全局组件挂载（PageLoader, MusicManager, FancyboxManager, SearchModal, SakuraEffect）
- `MainGridLayout.astro`：负责导航栏、侧栏网格系统、Footer、SpineModel、Live2DWidget
- 页面组件：继承 `MainGridLayout`，通过 `<slot>` 注入内容

### 3.2 Swup 页面过渡

使用 `@swup/astro` 实现 SPA 式导航，5 个容器：
```
#banner-overlay-container, #banner-dim-container,
#swup-container, #left-sidebar-dynamic, #right-sidebar-dynamic
```

容器外的组件（FloatingDock, MobileDock, MusicManager, SearchModal）跨导航持久化。

### 3.3 主题系统

- 三种模式：light / dark / system
- OKLCH 色彩空间 + CSS 自定义属性
- 令牌定义在 `src/styles/tokens/colors.css`（`:root` 浅色 + `:root.dark` 深色）
- Hue 可配置（`siteConfig.themeColor.hue`），映射到 oklch 的 H 参数
- 切换主题时使用 View Transition API 保护动画

### 3.4 页面加密（已移除，2026-09-16）

`/bills/`、`/life/notebooks/`（列表+详情）、`/schedules/` 曾在构建时用 PBKDF2(250k)+AES-256-GCM 把敏感 HTML 加密成密文内联（EncryptGate / PasswordGate 毛玻璃密码门，密钥来自 `GATE_PASSWORD`）。**该功能已按站长要求彻底移除**：三个页面恢复明文直出，sitemap、pagefind 站内搜索、归档时间线（`content-utils.ts#getArchiveList`）与侧栏（`widget/RecentItems.astro`、`widget/LifeStats.astro`）重新收录/展示笔记本。如需恢复，见 git 历史中的 `src/components/security/`、`src/utils/encrypt-gate.ts`、`src/config/securityConfig.ts`、`src/styles/pages/encrypt-gate.css`，以及 changelog `2026-08-30-encrypt-gate.md`。

### 3.5 Content Collections

13 个集合定义在 `src/content.config.ts`，使用 Zod schema 校验：

| 集合 | 用途 |
|------|------|
| posts | 博客文章 |
| spec | 特殊页面（about, friends, guestbook, privacy, user-agreement） |
| moments | 说说/动态 |
| bangumi | 番组/书籍/音乐/游戏追踪 |
| life | 生活记录 |
| notebooks | 笔记本（life 的子集） |
| album | 相册（2026-08 全量图床化：统一 `imgbedFolder: "blog/album/<相册名>"` 动态加载，photos 静态列表已废弃） |
| daohang | 导航链接 |
| ziyuan | 资源/公告 |
| friends | 友链（added 添加日期 + group 分组 friend\|other，2026-08 区块化改版：新朋友/我的朋友们/更多伙伴） |
| tombstones | 友链墓碑（title/avatar/note，2026-08 新增，纪念下线友链） |
| apps | 应用 |
| changelog | 更新日志 |

> 友链页支撑系统（2026-08）：`.github/workflows/friend-status.yml`（每天 5:17 检测友链延迟 → public/friends-status.json，四档 fast/ok/slow/down）与 `friend-screenshots.yml`（每周日 3:23 全量补漏 + push main 变更 `src/content/friends/**` 时自动触发，Playwright 截图 → public/assets/friends-shots/{contentId}.webp，伪装真实浏览器 + load 后等字体就绪、网络空闲（6s 超时兜底）与 2s 缓冲，失败 3 次尝试）。前端 fetch 状态 JSON 注入徽标，无 JSON/无截图时优雅降级（卡片退化为纯头像卡）。改 friends 集合结构时注意同步这两个脚本（正则读 frontmatter）。**截图文件名必须是全小写**（Astro glob loader 的 entry id 为全小写 slug，脚本已按 `md 文件名.toLowerCase()` 输出；含大写的 webp 在 Windows dev 误判存在导致 404，线上 Linux 则直接退化）。

> ⚠️ **朋友圈数据链路（强制提醒义务）**：友链朋友圈页（`/circle/`）的数据来自 `cir.tsh520.cn/data.json`，由独立仓库 `E:\GithubProgect\OtherRunProject\hexo-circle-of-friends`（GitHub: tianshihao2003/hexo-circle-of-friends）每 2 小时生成并提交。该程序的 firefly 主题解析器**依赖本博客友链页卡片结构**（`css_rules.yaml`）：名字=[`.friend-card`]`data-title`、链接=[`.friend-card`]`data-siteurl`、头像=[`.friend-card-avatar__img`]`data-src`。**凡是修改友链页卡片 HTML/friends 集合字段/友链 Card 组件结构，必须同步检查并提醒站长**：一是确认 `css_rules.yaml` 的 firefly 选择器仍匹配新结构（必要时同步修改并推送到 hexo-circle-of-friends 仓库）；二是验证「data.json 的 last_updated_time 与文章数」确实更新（抓一次页面或等下一轮 Action）。2026-08 曾因友链卡 class 从 `.friend-card-name/.friend-card-link` 改为 data 属性导致朋友圈停更 6 天，务必引以为戒。

> **分类系统（2026-08-20 文件夹即分类）**：`posts` 的 `category` 已从 `src/content.config.ts` 的 Zod schema 移除，分类 100% 由 `src/utils/category-tree.ts#getCategoryFromId(entry.id)` 的文件夹路径推导（`编程学习/Java学习` → `CategoryNode{fullPath, count, directCount, children}`），URL 分段编码 `src/utils/url-utils.ts#getCategoryUrl` + 路由 `src/pages/categories/[...category].astro`（catch-all，子树聚合 `startsWith(parent+"/")`），卡片 `src/components/widget/CategoryFolders.astro` 递归树（有子展开看子树/无子整卡跳转，已删右侧跳转按钮），`.pages.yml` 已删 `category` 字段，`scripts/新建文章/index.js` 不再写 `category`，Obsidian 插件 `plug-in/Obsidian/obsidian-category-autofill` 已废弃写入（`logic.ts#getTargetCategory` 恒返回 null，模板移除 `category`）。**禁止再写 `frontmatter.category`，分类只靠建文件夹**。

> **导航站分类（2026-09-21 文件夹即分类）**：`daohang` 同样移除了 `category`（schema 与 `.pages.yml` 都已删），改为按 `src/content/daohang/<分类>/xxx.md` 的**文件夹**归类，分类名 = 文件夹名。读取逻辑在 `src/pages/projects.astro`：`getFolderCategory(entry.id)` 取目录段，`getCategoryMeta()` 查 `CATEGORY_META` 表得到显示名/排序/图标。**Astro 生成 entry id 时会把大写转小写、空格转连字符**（文件夹 `AI 工具` → id `ai-工具`），所以查表统一走 `normalizeCatKey`（小写 + 空格转连字符）归一化——新增分类时在 `CATEGORY_META` 里按正常写法（`"AI 工具": {...}`）补一条即可，未登记的文件夹会原样显示并排在末尾。**导航条目只保留 `name` / `url` / `icon` / `description` 四个字段**（`tags`/`color`/`featured`/`order`/`image` 已全部删除，分类内按 `name` 拼音排序），新增条目不要再写这些字段。

### 3.6 文章排序规则（2026-09-21 统一）

排序优先级：**置顶 → `published` 降序 → 同日期内按目录（文件夹路径）分组 → 组内 `order` 降序**。

- **规则集中在 `src/utils/content-utils.ts`**：`comparePostsByOrderAndDate`（含置顶判断，供纯文章列表用）、`compareInSameDate`（同日期内的目录分组 + `order` 比较，供混排/已分组列表用）。三个消费点统一调用，**禁止在调用处另写排序**：`content-utils.ts#getRawSortedPosts`（→ 文章列表页 `/posts/`、RSS、上一篇/下一篇）、`src/pages/categories/[...category].astro`（分类页）、`src/components/widget/PostDirectoryList.astro`（左侧全站文章目录）。
- `order` **与日期同向（数字越大越靠前）**：这样跨日期分组的系列序号能连续递减、不跳号（68→51 接 50→42 接 41→27）。系列笔记（Python 学习笔记、LangChain 学习笔记等）的 `order` 就是学习序号，无需为"越新越大"做额外换算。
- `order` 只在**同一天发布**时才参与：日期不同就完全按日期倒序，`order` 不生效。`order` **未写（`undefined`）表示排在该目录最后**（不要再给它设 Zod `default(0)`，否则未写的文章会插到有编号的文章前面，表现为「order 又没生效」）。`.pages.yml` 的字段描述需与此同步。
- 组间按目录名排序而非「组内极值 order」——后者不满足传递性，排序结果会依赖比较顺序，**改动此处务必保持比较函数传递**。
- 首页「最新更新」（`home-guide-grid.js`，只取前 4 篇）与侧栏「最近更新」（`widget/RecentItems.astro`）不参与此规则，按日期取最新即可。
- **侧栏小组件默认无阴影（2026-09-21 起）**：`.profile-card`、`.weather-widget`、`.douyin-hot-widget`、`.profile-widget-card` 以及所有走 `WidgetLayout`（`src/components/common/WidgetLayout.astro` 内的 `widget-layout` 选择器）的小组件，静态 `box-shadow: none`，只在 `:hover` 才浮起（`0 0 20px 4px`）。这五处是同一套视觉语言，**改一处必须同步其余**，否则侧栏会出现有的带阴影、有的干净。
- **侧栏宽度全局默认 280px**，定义在四处且必须保持同步：`src/utils/responsive-utils.ts`（`17.5rem` 列宽 + `md:max-w-70`）、`src/utils/grid-layout-utils.ts`、`src/utils/swup-lifecycle-controller.ts`、`src/pages/guestbook.astro`（移除 grid 类的清单）。**改这几个值等于全站每页侧栏一起变宽、中间内容被挤窄**——2026-09-21 曾误改全局导致所有页面布局变化。只想让某类页面变宽时写**页面级覆盖**：`src/styles/pages/article-list.css` 顶部用 `#main-grid:has(.article-list-page--compact)` 只给**文章列表页**侧栏 320px。注意选择器必须用列表页独有的 `--compact` 修饰类——分类页同样带 `.article-list-page`，用它会让分类页一起变宽（2026-09-22 修过一次）。
- **左侧「全部文章」目录（`PostDirectoryList.astro`）每行不显示日期**，只留标题；标题过长会被省略号截断，侧栏宽度直接决定可读性。目录行的垂直排序仍用 `publishedAt` + `order`，与显示无关。

### 3.7 文章列表卡片布局与浏览量（2026-09-21）

`ArticleVirtualList.svelte` 的**网格视图**（`.article-list-card`，封面在上、多列排布）与**列表视图**（`.article-list-row-pinned`）卡片，元数据一律用**两行固定布局**：第一行 = 分类 + 浏览量（靠该行最右），第二行 = 日期、字数（列表视图另有标签）。

- **两种视图的 meta 都必须保持 `flex-direction: column` + 两个 `__meta-row`**（样式在 `src/styles/pages/article-list.css`：`.article-list-card__meta`、`.article-list-pinned-item__meta`）。不要改回单行 `flex-wrap`——分类名长度随机，单行会随机折行，同屏卡片高度就会参差（2026-09-21 站长反馈的问题）。
- **浏览量**走 Waline 轻量入口 `@waline/client/pageview`（不加载完整评论客户端）：卡片里每个 `.article-views > .waline-pageview-count` 带 `data-path="/posts/<entry.id>"`（格式必须与 `src/pages/posts/[...slug].astro` 的 `data-path` 一致，否则命不中同一份计数）；`pageviewCount()` 自动收集页面上所有该选择器元素**一次性批量查询**。`update: false` 是关键——列表页只读浏览量，不能把列表页访问记成文章浏览。脚本挂在组件 `onMount` 与 `swup:content:replaced`（视图切换/分页后重建 DOM 需重跑）。无评论服务、无 `PUBLIC_WALINE_SERVER` 或请求失败时，`.article-views:has(.waline-pageview-count:empty)` 让整块隐藏不占位。

### 3.8 文章朗读（TTS，2026-09-15 新增）

文章页提取正文（自动跳过代码块/表格/公式）→ `POST PUBLIC_TTS_SERVER/tts` 流式合成 mp3 → `<audio>` 播放（倍速 0.8x~2x + 7 种音色，选择记忆），服务不可用时降级浏览器 Web Speech 系统语音。服务端代码与部署见 `docs/deploy-edge-tts.md`（`scripts/TTS服务/`，CORS 白名单含 blog.tsh520.cn 与本地 4321）；开关在 `src/config/ttsConfig.ts`。

---

## 4. 样式规范

### 4.1 入口文件

`src/styles/main.css` 是唯一合法入口，结构：

```css
@import 'tailwindcss';        /* Tailwind v4 核心 */
@plugin '@tailwindcss/typography';
@custom-variant dark (&:where(.dark, .dark *));

/* 设计令牌 */
@import './tokens/colors.css';
@import './tokens/breakpoints.css';
@import './tokens/animation.css';
@import './tokens/z-index.css';

/* 基础 */
@import './base/reset.css';
@import './base/utilities.css';

/* 组件 → 功能 → 布局 → 过渡 → 第三方 */
```

### 4.2 硬性规则

- **禁止**在组件外新建独立 CSS 文件，所有样式必须通过 `main.css` 导入
- **禁止**使用 Stylus（已迁移完毕），统一用纯 CSS
- **禁止**新建 `!important`（现有 465 处是历史遗留，新代码不得增加）
- **禁止**使用 `#000`/`#fff` 硬编码颜色，必须用 `var(--*)` 令牌
- 暗色模式选择器统一使用 `:root.dark`（不要用 `.dark`、`html.dark`、`@media (prefers-color-scheme)`）
- `@apply` 仅在无法用 Tailwind class 实现时使用（如 CSS 伪元素）

### 4.3 颜色令牌速查

| 令牌 | 用途 |
|------|------|
| `--page-bg` | 页面背景 |
| `--card-bg` | 卡片背景 |
| `--deep-text` | 主要文字 |
| `--content-meta` | 次要文字 |
| `--primary` | 主题色 |
| `--btn-regular-bg` | 按钮背景 |
| `--btn-content` | 按钮文字 |
| `--line-divider` | 分割线 |
| `--float-panel-bg` | 浮动面板背景 |
| `--border` | 边框色 |

---

## 5. 组件开发规范

### 5.1 文件命名

- Astro 组件：PascalCase（`HomeHero.astro`）
- Svelte 组件：PascalCase（`SearchModal.svelte`）
- 工具函数：kebab-case（`scroll-handler.ts`）
- 样式文件：kebab-case（`home-hero.css`）
- 配置文件：camelCase（`siteConfig.ts`）

### 5.2 Astro vs Svelte 选择

| 场景 | 选择 |
|------|------|
| 纯静态 HTML + 服务端数据 | Astro |
| 简单交互（折叠、切换） | Astro + `<script>` |
| 复杂状态管理、响应式更新 | Svelte (`client:load` 或 `client:visible`) |

### 5.3 Hydration 指令

| 指令 | 用途 | 注意 |
|------|------|------|
| `client:load` | 立即水合 | 仅用于首屏必须交互的组件（如 SearchModal） |
| `client:visible` | 进入视口时水合 | 推荐用于非首屏组件 |
| `client:idle` | 浏览器空闲时水合 | 低优先级组件 |
| `client:only="svelte"` | 跳过 SSR | 需要浏览器 API 的组件 |

**Swup 容器内（`#swup-container`）的组件避免 `client:load`，因为每次导航都会重新挂载。**

### 5.4 Svelte 5 编码规范（避免编译器警告）

**可交互元素（a11y）**：
- 可点击元素优先用 `<button>` / `<a>`；必须用 `<div>` 时，加 `role="button"` + `tabindex="0"` + `onkeydown`（Enter/Space 触发相同处理）
- 无文本内容的按钮/链接必须加 `aria-label`
- slider 类元素：`role="slider"` + `tabindex="0"` + `aria-valuenow`
- `mouseover`/`mouseenter` 需配 `focus`/`focusin` 键盘事件
- 确因设计需要忽略检查时，用行注释说明原因：
  ```svelte
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  ```

**runes（Svelte 5 响应式）**：
- 所有响应式变量必须用 `$state(...)` 声明（包括 DOM ref：`let el = $state<HTMLDivElement>()`），禁止裸 `let` + 后续赋值
- 派生值用 `$derived(...)`，副作用用 `$effect(...)`

**模板**：
- 非 void 标签禁止自闭合：`<div></div>`（不要 `<div />`），`<span></span>` 同理

**样式**：
- 不用到的 CSS 选择器及时删除（`<style>` 内未引用选择器会警告）

**验证**：修改 Svelte 组件后跑 `pnpm build` 或 dev，确认无 `vite-plugin-svelte` 警告输出。

---

## 6. 配置系统

27 个配置文件，通过 `src/config/index.ts` barrel export（29 个具名导出）。

### 核心配置

| 配置文件 | 导出名 | 用途 |
|----------|--------|------|
| `siteConfig.ts` | `siteConfig` | 标题、URL、语言、主题色、页面开关、分析、图片优化 |
| `profileConfig.ts` | `profileConfig` | 个人信息：头像、昵称、职业、简介 |
| `navBarConfig.ts` | `navBarConfig`, `navBarSearchConfig` | 导航栏链接（根据页面开关动态生成） |
| `sidebarConfig.ts` | `sidebarLayoutConfig` | 侧栏布局：左/右/双侧栏、组件列表 |
| `commentConfig.ts` | `commentConfig` | 评论系统选择（Waline/Twikoo/Giscus/Disqus/Artalk） |
| `musicConfig.ts` | `musicPlayerConfig` | 音乐播放器：Meting API 或本地播放列表 |
| `backgroundWallpaper.ts` | `backgroundWallpaper` | 背景图配置（当前 mode: "none"，不渲染 banner） |
| `homePortfolioShutterConfig.ts` | `homePortfolioShutterConfig` | 首页作品集百叶窗配置 |
| `homeConfig.ts` | `homeConfig` | 首页配置（2026 新增，文档曾遗漏） |

### 其他配置

`adConfig`, `announcementConfig`, `circleConfig`, `coverImageConfig`, `expressiveCodeConfig`, `fontConfig`, `footerConfig`, `friendsConfig`, `guestbookConfig`, `licenseConfig`, `momentConfig`(动态评论配置), `pioConfig`(Live2D/Spine), `relationshipConfig`, `sakuraConfig`, `skillsConfig`, `sponsorConfig`, `ttsConfig`(文章朗读)

### 外部配置（直接导入，不经 barrel）

仅剩 `externalBangumiConfig`（供 bangumi / movies-games 页面使用）。其余 `externalFriendsConfig` 等 4 个已随 fc8599f 删除。

---

## 7. i18n 国际化

### 结构

```
src/i18n/
├── i18nKey.ts       # 330 个翻译键枚举
├── translation.ts   # 翻译加载器（回退链：当前语言 → zh_CN → en）
└── languages/       # en.ts, zh_CN.ts, zh_TW.ts, ja.ts, ru.ts
```

### 使用

```typescript
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
// 使用
{i18n(I18nKey.someKey)}
```

### 硬性规则

添加新 i18n 键时，**必须在所有 5 个语言文件中添加翻译**。缺失翻译会回退到中文，对非中文用户是 bug。

---

## 8. 事件监听器规范（关键）

### 8.1 必须清理的场景

| 场景 | 清理方式 |
|------|---------|
| Svelte `onMount` 中的 `addEventListener` | 返回清理函数 |
| Swup 容器内组件的事件 | `AbortController`，导航时 abort |
| `setInterval` | cleanup 中 `clearInterval` |
| `requestAnimationFrame` 循环 | cleanup 中 `cancelAnimationFrame` |
| `MutationObserver` / `ResizeObserver` | cleanup 中 `disconnect()` |

### 8.2 AbortController 模式

```typescript
let abortCtrl: AbortController | null = null;

function bindEvents() {
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();
    const signal = abortCtrl.signal;
    document.addEventListener("click", handler, { signal });
    window.addEventListener("resize", handler, { signal });
}

document.addEventListener("swup:content:replaced", bindEvents);
```

### 8.3 禁止的模式

```javascript
// ❌ 匿名函数监听器（无法移除）
window.addEventListener("scroll", () => { ... });

// ❌ inline script 中注册监听器但不清理
<script is:inline>
window.addEventListener("resize", handleResize); // 永远不移除
</script>

// ❌ Swup 钩子重复注册无 guard
window.swup.hooks.on("content:replace", myHandler); // 每次导航都注册新的
```

---

## 9. 单例与 Guard 变量

### 9.1 全局单例模式

跨 Swup 导航持久化的功能必须使用 `window.__xxx` guard：

```javascript
<script is:inline data-swup-ignore-script>
(function() {
    if (window.__fireflyMusic) return;  // 单例 guard
    // ... 初始化 ...
    window.__fireflyMusic = { /* API */ };
})();
</script>
```

### 9.2 已注册的 Guard 变量

| Guard | 功能 | 文件 |
|-------|------|------|
| `window.__fireflyMusic` | 音乐管理器单例 | MusicManager.astro |
| `window.__fireflyPageLoader` | 页面加载器单例 | page-loader-controller.js |
| `window.__fireflySearchModalController` | 搜索模态框控制器 | search-modal-controller.ts |
| `window.__backToTopInited` | 返回顶部按钮 guard | BackToTop.astro |
| `window.__typewriterHooksBound` | 打字机 Swup 钩子 guard | TypewriterText.astro |
| `window.__fireflySakuraInited` | 樱花特效 guard | SakuraEffect.astro |

### 9.3 禁止的模式

```javascript
// ❌ 每次 Swup 导航都创建新实例
document.addEventListener("DOMContentLoaded", () => {
    new BackToTopManager();  // scroll 监听器累积
});

// ✅ guard 防重复
if (!window.__backToTopInited) {
    window.__backToTopInited = true;
    window.addEventListener("scroll", updateVisibility, { passive: true });
}
```

---

## 10. 控制器模块（Layout.astro 分解产物）

Layout.astro 已从 1492 行分解为 591 行 + 8 个独立控制器模块。**修改页面过渡、滚动、布局逻辑时，必须改对应的控制器，禁止回退到 Layout.astro 内联脚本。**

| 模块 | 文件 | 职责 |
|------|------|------|
| Swup 生命周期 | `swup-lifecycle-controller.ts` | 5 个钩子：link:click, content:replace, visit:start, page:view, visit:end |
| 滚动处理 | `scroll-handler.ts` | back-to-top, TOC 可见性, navbar 自动隐藏 |
| 网格布局 | `grid-layout-utils.ts` | `updateMainGridCols()`, `isCurrentPagePost()` |
| 侧边栏 | `sidebar-utils.ts` | `updateSidebarComponentsVisibility()` |
| Banner | `banner-utils.ts` | `calculateBannerHeightExtend()`, `showBanner()` |
| 面板关闭 | `panel-utils.ts` | `setClickOutsideToClose()`, `initPanelCloseHandlers()` |
| 滚动条 | `scrollbar-utils.ts` | `initCustomScrollbar()` — KaTeX 滚动容器 |
| 标签页标题 | `tab-title-controller.ts` | `initTabTitleInteraction()` — visibilitychange |

**初始化顺序**（Layout.astro DOMContentLoaded 中）：
```
initSwupLifecycle → initScrollHandler → initPanelCloseHandlers → initTabTitleInteraction → initPageLoader
```

---

## 11. Swup 生命周期管理（核心）

### 11.1 钩子职责

| 钩子 | 允许做 | 禁止做 |
|------|--------|--------|
| `link:click` | 添加过渡保护类、隐藏 navbar | 切换布局类、修改网格 |
| `visit:start` | 进度条、移动端 banner 动画、特殊页面重载 | 切换 `lg:is-home` |
| `content:replace` | 切换布局类、更新网格、同步侧栏、重初始化组件、派发事件 | 滚动、启动动画 |
| `page:view` | 滚动到顶部、同步主题、触发评论初始化 | 重复 content:replace |
| `visit:end` | 完成进度条、移除过渡保护 | 修改布局 |

### 11.2 硬性规则

```javascript
// ❌ 禁止：setTimeout 延迟派发
setTimeout(() => window.dispatchEvent(new CustomEvent("swup:content:replaced")), 200);
// ✅ 同步派发（content:replace 时 DOM 已完成替换）
window.dispatchEvent(new CustomEvent("swup:content:replaced"));

// ❌ 禁止：smooth scroll
window.scrollTo({ top: 0, behavior: "smooth" });
// ✅ auto 避免过渡抖动
window.scrollTo({ top: 0, behavior: "auto" });

// ❌ 禁止：location.href 强制重载
window.location.href = visit.to.url;
// ✅ Swup 原生重载
visit.abort();
window.swup.loadPage(visit.to.url, { animate: false });

// ❌ 禁止：裸 new URL() 无保护
const toPath = new URL(visit.to.url, window.location.origin).pathname;
// ✅ try-catch 保护
let toPath;
try { toPath = new URL(visit.to.url, window.location.origin).pathname; }
catch { toPath = visit.to.url || ""; }
```

### 11.3 content:replace 错误边界

```javascript
window.swup.hooks.on("content:replace", () => {
    try { syncHomeLayout(); } catch (e) { console.error("[swup]", e); }
    try { updateMainGridCols(); } catch (e) { console.error("[swup]", e); }
    try { updateSidebarComponentsVisibility(); } catch (e) { console.error("[swup]", e); }
    try { initCustomScrollbar(); } catch (e) { console.error("[swup]", e); }
    window.dispatchEvent(new CustomEvent("swup:content:replaced"));
});
```

### 11.4 新增 Swup 功能的方式

**禁止**在 `swup-lifecycle-controller.ts` 中添加代码。使用事件自注册：

```typescript
// src/utils/my-feature.ts
export function initMyFeature() {
    document.addEventListener("swup:content:replaced", () => {
        // Swup 导航后重新初始化
    });
}
// Layout.astro DOMContentLoaded 中调用一次即可
```

---

## 12. PageLoader 集成规范

### 12.1 行为（当前状态：加载动画已关闭）

- **所有情况**：立即隐藏（`PageLoader.astro` 默认 `hidden` + `page-loader--hidden`，`page-loader-controller.js` 立即派发 `LOADER_HIDDEN_EVENT`）
- **恢复加载动画**：将 `PageLoader.astro` 的 class 改回 `page-loader page-loader--visible`，移除 `hidden` 属性，恢复 `page-loader-controller.js` 中的条件逻辑。注意：2026-08 死代码清理已删除 `return controller` 后的 `bindSwup`（Swup 钩子绑定显示动画）及辅助函数 `isHomeUrl`/`getVisitUrl`/`isInternalPageVisit`/`isMobile`，恢复动画时需一并重写这些逻辑

### 12.2 关键：LOADER_HIDDEN_EVENT 必须派发

`HomeHero.astro` 在 `await waitForPageLoaderHidden()` 后才启动 GSAP 动画。如果立即隐藏时不派发事件，动画永远不运行，首页内容 `opacity: 0` 不可见。

```javascript
// 立即隐藏时必须派发（当前所有情况都走此路径）
loader.hidden = true;
loader.classList.add("page-loader--hidden");
loader.classList.remove("page-loader--visible");
documentRef.documentElement.classList.remove("is-page-loading");
documentRef.body?.removeAttribute("aria-busy");
dispatchDomEvent(documentRef, LOADER_HIDDEN_EVENT, { timestamp: Date.now() });
return controller;
```

### 12.3 禁止

- 在 Layout.astro 中重复注册 PageLoader 的 Swup 钩子
- 在 PageLoader 外部调用 `controller.show()`（由 PageLoader 自己管理生命周期）

---

## 13. 内存泄漏检查清单

每次修改以下组件时必须检查：

| 组件 | 检查项 |
|------|--------|
| SpineModel | `setInterval` 是否在 cleanup 中 `clearInterval`？ |
| Live2DWidget | `resize` 监听器是否先移除再注册？ |
| SakuraEffect | `requestAnimationFrame` 是否在 Swup 导航时停止？ |
| BackToTop | scroll 监听器是否有 `__backToTopInited` guard？ |
| TypewriterText | Swup 钩子是否有 `__typewriterHooksBound` guard？ |
| FancyboxManager | MutationObserver 是否有 5s 超时兜底？动态导入是否有 try-catch？ |
| MusicManager | audio 元素是否用 `data-swup-ignore-script` 防重复？ |

---

## 14. 添加功能的操作清单

### 14.1 添加新页面

1. 创建 `src/pages/myPage.astro`，继承 `MainGridLayout`
2. 可选：`src/styles/pages/myPage.css` + `main.css` 导入
3. 可选：`src/config/navBarConfig.ts` 添加导航链接
4. 可选：`src/i18n/i18nKey.ts` + 5 个语言文件添加翻译

### 14.2 添加新侧栏组件

1. 创建 `src/components/widget/MyWidget.astro`
2. `src/types/config.ts` 的 `WidgetComponentType` 添加类型
3. `src/components/layout/SideBar.astro` 的 `componentMap` 注册
4. `src/config/sidebarConfig.ts` 添加配置

### 14.3 添加新内容集合

1. `src/content.config.ts` 添加 `defineCollection`
2. 创建 `src/content/myCollection/` 目录
3. 在 `export const collections` 中注册

### 14.4 删除功能

1. `grep -rn "ComponentName" src/` 确认无引用
2. 删除组件文件
3. 从 `main.css` 移除样式导入
4. 从 `config/index.ts` 移除配置导出
5. 从 5 个语言文件移除 i18n 键
6. 从 `types/config.ts` 移除类型
7. `pnpm build` 验证

### 14.5 万能原则：先参考，后编写（禁止盲猜）

新增/修改任何功能前，**先做参考调研，再动手写代码**：

1. **优先参考本仓库已有的相似功能**（最贴近项目现状，少走弯路）：
   - 评论/留言 → `src/components/features/GuestbookChat.svelte`（就是本仓库读写 Waline 评论数据的最佳范本，别自创调用方式）
   - 组件交互 → 看 `src/components/*` 里已正常工作的 Svelte 组件怎么组织
2. 仓库没有时，**参考官方文档 / 官方示例 / 网上成熟开源项目**，照其写法落地，不要凭印象自由发挥
3. 如果实现过程中反复卡壳排查不出，**回到参考源逐行对照**，找出差异——不要靠猜验证
4. 改完跑 `pnpm check` / `pnpm build` 确认无编译错误，并浏览器实测功能

---

## 15. 反模式清单（禁止）

| 反模式 | 后果 |
|--------|------|
| 将 `enableBanner` 设为 `true` | 非首页出现 35vh 空白 |
| 将 `isBannerMode` 设为 `true` | 渲染 wallpaper-wrapper，破坏无 banner 布局 |
| 移除 PageLoader 的 `LOADER_HIDDEN_EVENT` 派发 | HomeHero 动画不运行，首页不可见 |
| `content:replace` 中 `setTimeout` 延迟派发事件 | Svelte 组件重初始化时序不确定 |
| `page:view` 中 `behavior: "smooth"` | 过渡动画期间页面抖动 |
| Swup 容器内用 `client:load` | 每次导航重新挂载 |
| 新建 Stylus 文件 | 已迁移完毕，统一用 CSS |
| 新增 `!important` | 现有 465 处是历史遗留 |
| 组件外新建 CSS 文件 | 必须通过 `main.css` 导入 |
| `main.css` 中 `@import` 位置错误 | 会破坏样式优先级 |
| 删除 `tokens/colors.css` | 主题系统失效 |
| 修改 `backgroundWallpaper.ts` 的 `mode` | 已移除壁纸切换功能 |
| 删除 `swup-lifecycle-controller.ts` | 所有页面过渡逻辑丢失 |
| 使用 Python 脚本操作/修改文件 | 曾因字符串替换逻辑破坏文件内容，一律用 Node 脚本处理 |
| 页面交互内联脚本放在 Swup 容器（MainGridLayout slot）外 | 从其它页面 SPA 导航进入时脚本不会执行，事件委托/初始化失效（2026-08 笔记本评论按钮教训：脚本必须在容器内，配合 `window.__xxx` guard 防重复注册） | 见 §11.4 |
| dev 下 Astro island hydrate 报 `504 (Outdated Optimize Dep)` | 组件 onMount 永不执行，UI 卡初始状态（如评论"加载中…"、按钮无反应），SSR 输出却正常，极具迷惑性 | 删除 `node_modules/.vite` 后重启 `pnpm dev` |
| 不做参考调研就盲猜写代码 / 排查问题 | 反复试错浪费大量时间（2026-08 评论功能教训） | 见 §14.5「先参考，后编写」 |
| 验收通过后仍过度验证（`pnpm check`/`pnpm build` 通过且浏览器实测关键路径正常后，还继续用多种方式重复验证同一数据链路，如抓网络日志逐请求对比第三方 API） | 大量时间产出零新增价值（2026-08 笔记本评论回复验证教训：UI 已正确显示回复关系即证明 Waline 数据正确，无需再深挖服务端返回结构） | 验收标准达成即停；仅当出现新的错误证据（新报错、行为异常）时才继续排查 |
| 改友链页 `friend-card` 卡片结构/友链 Card 组件，未同步 `hexo-circle-of-friends` 的 `css_rules.yaml` firefly 选择器 | 朋友圈（/circle/）数据停更（2026-08 曾停更 6 天） | 见 §3.4「朋友圈数据链路（强制提醒义务）」 |
| CI 中 Biome 用 `version: latest` 或版本与 package.json 不一致 | 规则漂移导致"本地绿 CI 红"（2026-08 实测：2.3 vs 2.5 的 useAltText 升级为 error） | setup-biome action 不指定 version，自动读取 package.json 版本 |
| 手写 `frontmatter.category` 或用 Obsidian 插件再写 category | 2026-08-20 后分类已改为文件夹即分类（`category-tree.ts`），frontmatter 再写会被忽略且 `.pages.yml` 未声明字段保存时丢弃 | 分类只靠 `src/content/posts/父/子/xxx.md` 建文件夹，勿写 frontmatter |
| 修改博客各功能 frontmatter 字段（`src/content.config.ts` 的 zod schema / `.pages.yml` / 页面 `normalizeImages`/`getGridCols` 等展示逻辑）未同步 AstrBot 插件 `plug-in/AstrBot/AstrBot BlogWriter` 的 `build_*_md` 生成逻辑 | 插件写入的旧格式导致页面 `images` 为空、归档卡片/灯箱不显示或 zod 校验失败（如 2026-09-27 笔记从正文 `![](url)` 改为 `images` 数组，前端已用 `images` 宫格展示） | 凡改动 moments/bangumi/life/notebooks/album/daohang/bills/schedules 等集合的字段名、类型或渲染约定，必须立即检查并同步更新插件的 `blog_writer_core.py:build_*_md` 与 `tests/test_core.py`，并提醒站长同步发布插件新版本 |
| 把 API Key / Token / 密码硬编码进任何被 git 跟踪的文件（scripts/、注释、markdown 都算），或轻信注释里"会被 .gitignore 保护"的声明而不实测 | 公开仓库全历史可读，GitGuardian 告警、密钥被扫描器批量收割滥用（2026-08-30 GitGuardian 事故：DashScope Key 硬编码在 `scripts/生成摘要/index.ts` 长期公开，声明受 .gitignore 保护但实际从未生效） | 密钥一律放 `.env`（已 gitignore）+ `process.env.XXX` 读取，脚本调用带 `--env-file=.env`，`.env.example` 只留空模板；新增任何疑似含密钥的文件，提交前必须实测 `git check-ignore <path>` 与 `git ls-files <path>` 确认未被跟踪；一旦泄露：**先去对应控制台吊销重发（唯一根治）**，再从代码清除，git 历史清理通常不必要且代价大 |
| 用文件 mtime 做集合排序/展示的兜底依据 | CI（EdgeOne/GitHub Actions）每次全新 clone，所有文件 mtime 都等于构建时刻、比任何业务日期都新——缺字段的旧条目会永远霸占"最新"区块（2026-09 友链页"新朋友"事故） | 排序只认 frontmatter 业务字段（如 friends 的 `added`）；字段缺失时构建期 `console.warn` 并让条目落到最后 |
| 拿 Astro content 集合的 `item.id` 拼磁盘路径 / 匹配 public 静态文件 | id 是 github-slugger 规则（小写 + 移除标点、空格转连字符），与磁盘文件名不一致（`39-胡超，作品集.md` → id `39-胡超作品集`、`33-RAGNote.md` → `33-ragnote`），Linux CI 大小写敏感必失配 | 文件名 ↔ id 换算必须走同一 slug 规则（截图脚本 `scripts/友链截图/index.mjs` 已内置 github-slugger）；新增含大写/标点文件名的友链后核对 `public/assets/friends-shots/` 截图命名 |

---

## 16. 技术栈版本

| 依赖 | 版本 | 说明 |
|------|------|------|
| Astro | 7.1.x | **已升级 7.x**（勿按 6.x 文档操作）|
| Svelte | 5.x | runes API（`$props`, `$state`, `$derived`, `$effect`） |
| Tailwind CSS | 4.x | CSS-first 配置，无 `tailwind.config.js` |
| Swup | @swup/astro | 不迁移到 View Transitions |
| Biome | 2.5.7 | 唯一 linter/formatter，版本需与 package.json 一致（见第 15 节） |
| pnpm | 9.14.x | 唯一包管理器 |
| Node.js | >= 22 | 运行时要求 |
| Playwright | devDep（2026-08） | 友链截图脚本用（scripts/友链截图，chromium） |
| github-slugger | devDep（2026-09） | 友链截图脚本生成与 Astro 一致的 entry id（scripts/友链截图） |
| edge-tts | Python ≥3.12（服务端 Docker） | 博客朗读服务（scripts/TTS服务/），非 Node 依赖 |

> ⚠️ `stylus` 依赖已于 2026-08 移除（实测 Astro 7 构建不依赖它）——**勿新建 Stylus 文件**，统一用纯 CSS。

---

## 17. 已知架构债务（不阻塞开发）

| 问题 | 影响 | 建议 |
|------|------|------|
| ~~build.yml / deploy.yml 监听 master~~ | 已处理（2026-08）：deploy.yml 删除（不用 GitHub Pages），build.yml 改 `main` + action 升级 Node 24，首次运行发现的 6 个 astro check 类型错误已修复（ba9e712） | CI 应全绿；未来改类型时注意 TS 闭包内不保留 const 窄化（用 `?.` 判空） |
| `swup-lifecycle-controller.ts` ~540 行 | 添加 Swup 功能需改此文件 | 需要时顺手拆分 |
| Waline 代码散布 3 处 | 改配置需改 3 个文件 | 需要时合并 |
| Layout.astro 内联脚本含 moments 评论 | 布局包含功能逻辑 | 需要时提取 |
| `page-loader-controller.js` 是纯 JS | 类型不一致 | 需要时转 TS |
| 465 个 `!important` | 与 Tailwind 冲突的必要覆盖 | 逐步清理 |
| 52 个 `window.*` 全局变量 | 模块间隐式耦合 | 长期目标 |
| PageLoader 加载动画已关闭 | 首页无 loading 过渡 | 恢复方法见第 12 节 |
| HomeHero GSAP 入口动画已跳过 | 首页元素直接显示，无逐个动画 | 恢复需重写 `initHeroOpening()` |
| `stylus` 依赖 | 已移除（2026-08） | — |
| 空目录残留（album/daily/admin 等） | 已清理（2026-08） | — |
| `public/admin/`、`cloud-functions/`（Decap 遗留） | 均已删除（2026-08，oauth 端点无消费者） | — |
| AGENTS.md | 已改为指向 CLAUDE.md 的入口（勿复制内容，避免双重维护） | — |
| `satteri` / `@astrojs/markdown-satteri` 依赖 | 源码零引用（grep 仅命中 package.json），疑似实验残留 | 确认后移除 |
| `.wrangler/` 误提交 | 已取消跟踪 + 加入 .gitignore | — |

---

## 18. Git 提交规范

```
<type>(<scope>): <description>

type: feat | fix | refactor | style | docs | chore | perf
scope: layout | config | i18n | styles | utils | components | content
```

**每次修改后必须 `pnpm build` + `pnpm check` + `pnpm exec biome ci ./src` 全绿再提交**（`--reporter=github` 与 CI 完全一致，2026-02 CI 曾因 `useTemplate` 与 `.superpowers` 误跟踪红过）**。**

> 本仓库 `biome ci` 仅覆盖 `./src`（package.json 固定 `2.5.7`），但 **任何修改后都必须跑**；新增目录（非 `src`）需提前加入 `.gitignore`。

---

## 19. PagesCMS 后台（2026-08 接入）

博客后台使用 **PagesCMS 自托管**（Vercel 部署 + EdgeOne 加速），后台地址 `https://cms.tsh520.cn/`。

### 架构

```text
用户访问 cms.tsh520.cn（DNS → EdgeOne 加速）
    ↓ EdgeOne 回源（Host: cms-origin.tsh520.cn）
Vercel（PagesCMS 实例，绑定 cms-origin.tsh520.cn）
    ↓ GitHub API 写回
仓库 main 分支（内容文件）
    ↓ GitHub Webhook
EdgeOne Pages（GitHub 集成自动构建：pnpm build → dist/，需配 13 个构建环境变量）
    ↓
博客站点（EdgeOne Pages 托管，https://blog.tsh520.cn）
```

- **源站域名分离**：Vercel 绑定 `cms-origin.tsh520.cn`（DNS → vercel.app），用户域名 `cms.tsh520.cn` 走 EdgeOne（回源 Host = cms-origin）——Vercel 的域名验证机制要求 DNS 持续指向它，不能直接套 CDN
- **配置声明**：仓库根目录 `.pages.yml` 声明 12 个内容集合（posts 按分类拆 13 个集合、moments/friends/apps/daohang/album/ziyuan 拆 2/life 拆 3、tombstones 2026-08 新增），字段与 `src/content.config.ts` 的 zod 对齐
- **自定义字段**：imgbed（图床上传，走服务端代理）+ amap-geocode（高德坐标，保存时展开为 lat/lng）——在 pagescms 仓库（`E:\GithubProgect\MyRunProject\pagescms`）的 `fields/custom/` 定义，注册在 `fields/registry.ts`
- **凭证**：Vercel 环境变量（GITHUB_APP_*、IMAGEBED_*、AMAP_KEY 等）；图床/高德代理路由在 pagescms 的 `app/api/` 下（凭证服务端持有）
- **朗读服务**：EdgeOne Pages 构建环境变量新增 `PUBLIC_TTS_SERVER`（第 13 个，指向自建 edge-tts 服务，部署见 `docs/deploy-edge-tts.md`）；留空时文章朗读自动降级浏览器系统语音
- **修改 .pages.yml 后**：字段必须与 zod 对齐（merge: false，未声明字段保存时被丢弃）；校验脚本已随 Decap 遗留一并删除——**当前 .pages.yml 的字段对齐靠手动检查 + 构建验证**

> ⚠️ 曾使用 Decap CMS（public/admin/ 目录 + config.yml）；该遗留已随 `validate-sveltia-config.mjs` 等脚本于 2026-08 删除，现统一用 PagesCMS。

---

## 20. 文档同步规范（强制）

**修改项目时，必须同步更新 CLAUDE.md**，保证文档与项目实时一致：

1. **修改代码前**：先读 CLAUDE.md，遵守其中的规范与反模式清单
2. **修改代码后**（提交前）：
   - 新增/删除/重命名了文件或目录 → 更新第 2 节目录结构（数量、路径）
   - 新增/删除配置、i18n 键、组件、页面、集合 → 更新对应章节的数字和清单
   - 升级/降级依赖 → 更新第 16 节技术栈版本
   - 发现新的坑/规范/反模式 → 写入对应章节（或第 15 节反模式清单）
   - 完成模块/功能 → 按第 21 节更新 `changelog`，按第 22 节做收尾
   - **Obsidian 插件 `plug-in/Obsidian/obsidian-image-manager/` 功能变更 → 必须同步更新博客文章 `src/content/posts/技术分享/Obsidian插件系列-ImageManager图床上传管理指南.md`（功能说明/设置项/操作步骤），并在文末"版本历史"加一行；同时升插件 manifest.json 版本号并重新 `pnpm build`**
3. **新增规范**（本次添加）：文档不准确时（数字过时、功能删除等），及时修正，禁止"文档写的和实际不一致还照着做"
4. **验证**：提交前跑 `pnpm build`；文档修改与代码修改在同一提交或相邻提交

---

## 21. 更新日志规范（新增 2026-08-20）

`src/content/changelog/` 是面向用户的版本历史，**每完成一个模块/功能必须新增一条**，禁止攒到最后。

**文件命名**：`YYYY-MM-DD-<kebab-case>.md`（如 `2026-08-20-folder-as-category.md`）

**frontmatter**（`src/content.config.ts:281` `changelogCollection`）：
```yaml
---
version: "v1.23.0"  # 递增：feature → minor，fix/improvement → patch，removal → minor
date: 2026-08-20
time: "16:30"       # 可选，同一天多条时区分
type: feature       # feature | improvement | fix | removal
description: 一句话概括（显示在列表页）
---
```

**正文**：`## 标题` + bullet 列表，按“用户视角”写改了什么、怎么用，关联关键文件 `路径:行号`（如 `src/utils/category-tree.ts:17`）。

**流程**：功能验证通过（`pnpm build` + `pnpm check`）→ 立即写 changelog → 与代码同提交或紧后提交 → `changelog` 页自动按 `date` 倒序展示。

**反例**：功能已上线数周但 `changelog` 仍停留在旧版本（本次 audit 发现 2026-08-13 后无更新）。

---

## 22. 收尾工作规范（新增 2026-08-20）

模块/功能完成后，必须做收尾，**不确定就问**（问站长“怎么做”）。

**必做清单**：
1. **该清的清理**：删一次性脚本/临时文件（如 `scripts/migrate/*.mjs`、`write_places.cjs` 残留）、`node_modules/.vite` 缓存验证、未用到的 `*.test.mjs`、废弃的 `category` frontmatter 残留 `grep -rn "category:" src/content/posts` 验证 0 命中；新增的本地目录（`.superpowers/` 等）不在 `src` 则应进 `.gitignore`（2026-02 bills/schedules 教训）；**涉密检查**：新增/改动的密钥、Token、密码一律放 `.env`（已 gitignore），提交前用 `grep -rnE "sk-[a-zA-Z0-9]{20,}|AKID[a-zA-Z0-9]+" <改动文件>` 与 `git ls-files` 复核零硬编码、零误跟踪（2026-08-30 GitGuardian 密钥泄露教训，见 §15 反模式清单）
2. **该保留的保留**：保留可复用工具（如 `src/utils/category-tree.ts`）、保留 `docs/superpowers/plans/*.md` 计划文档、保留 `plug-in/` 插件的独立 git 历史
3. **该问的就问**：删/留边界模糊时（如 `plug-in/Obsidian` 是否彻底废弃还是保留 no-op）、是否需要数据迁移二次校验、是否需要提醒用户 `Obsidian Ctrl+P 重载` / `FlClash 代理` 等，**不知道就问，不要猜**
4. **文档同步**：同步 `CLAUDE.md` 第 2/16/18/21 节、`.pages.yml` 与 `src/content.config.ts` 对齐校验、`README` 涉及变动的
5. **验证**：`pnpm build` + `pnpm check` + `pnpm exec biome ci ./src --reporter=github` 全绿（与 CI 完全一致，勿仅跑本地默认 reporter），浏览器实测关键路径（分类页展开/叶子跳转、文章页面包屑、归档过滤）

**禁止**：做完功能不写 changelog、不清临时文件、静默推断用户意图。
