# EdgeOne Pages 部署指南（GitHub 集成）

> 博客生产部署为 **EdgeOne Pages**：push 到 `main` 后 EdgeOne 拉取仓库自动构建并托管，线上地址 `https://blog.tsh520.cn/`。
> 本文档是控制台操作手册，2026-09 从 GitHub Pages 迁移而来（迁移记录见第四节）。

## 一、部署架构

```text
Push main（日常写作 / PagesCMS 后台 / 友链自动脚本）
    ↓ GitHub Webhook
EdgeOne Pages 项目（GitHub 集成，自动构建）
    ↓ pnpm build → dist/（生成图标 → astro build → pagefind）
EdgeOne Pages 托管（blog.tsh520.cn 直接绑定 Pages 项目）
    ↓ DNS（blog.tsh520.cn CNAME → Pages 分配的默认域名）
用户浏览器
```

- 无独立 CDN 加速层：EdgeOne Pages 托管本身即边缘分发
- 无 GitHub Actions 部署工作流（`pages.yml` 已删除）；`build.yml` 保留作 CI 质量门（`astro check` + `pnpm build`，与 EdgeOne 构建一致）
- 后台 PagesCMS 独立部署在 Vercel（`cms.tsh520.cn`），只写 git 仓库，与博客托管无关（见 `deploy-pagescms-vercel.md`）

## 二、EdgeOne 控制台配置（首次一次性）

### 1. 创建 Pages 项目

1. 打开 EdgeOne 控制台 → **Pages** → **新建项目**（或复用现有项目）
2. 选择 Git 提供商 **GitHub** → 关联仓库 `tianshihao2003/dumplingandcakeblog`
3. 分支：`main`

### 2. 构建设置

| 配置项 | 值 |
|---|---|
| 构建命令 | `pnpm build`（内部 = `node scripts/生成图标/index.js` → `astro build` → `pagefind --site dist`） |
| 输出目录 | `dist` |
| Node.js | 22.x |
| 包管理器 | pnpm（仓库 `.npmrc` 强制；`packageManager` 固定 `pnpm@9.14.4`） |

### 3. 环境变量（13 个，必填）

这些变量对应渲染期/构建期密钥，值从 GitHub 仓库 **Settings → Secrets and variables → Actions** 复制（两边必须保持同步；改任何一边都要同步另一边）：

| 变量名 | 用途 |
|---|---|
| `PUBLIC_AMAP_KEY` | 高德地图 |
| `PUBLIC_AMAP_KEY_PLACES` | 高德地点 |
| `PUBLIC_UMAMI_BASE` | Umami 统计地址 |
| `PUBLIC_UMAMI_USERNAME` | Umami 服务端代理账号 |
| `PUBLIC_UMAMI_PASSWORD` | Umami 服务端代理密码 |
| `PUBLIC_UMAMI_WEBSITE_ID` | Umami 站点 ID |
| `PUBLIC_UMAMI_SHARE_ID` | Umami 分享 ID（首页统计 fallback） |
| `PUBLIC_WALINE_SERVER` | Waline 评论后端地址 |
| `PUBLIC_IMAGEBED_URL` | 图床地址 |
| `PUBLIC_IMAGEBED_AUTH_CODE` | 图床上传鉴权码 |
| `PUBLIC_IMAGEBED_FOLDER` | 图床上传目录 |
| `PUBLIC_IMAGEBED_API_TOKEN` | 图床 API Token |
| `GATE_PASSWORD` | 加密页（/bills/、/life/notebooks/、/schedules/）的 AES 密钥，非 PUBLIC_ 前缀不会进客户端 |

> 缺失任何变量构建仍会成功，但对应功能静默降级（评论无后端、统计空白、加密页无法解锁），务必逐项核对。

### 4. 首次构建与预览验证

触发构建直到成功，用分配的预览域名（非正式域名）验证关键路径：

- 首页渲染、Swup 导航、主题切换
- 文章页、分类页、归档页
- 加密页 `/bills/` `/life/notebooks/` `/schedules/`（密码门能解锁）
- `/search/`（pagefind）、`sitemap.xml`、`robots.txt`、RSS
- 评论 / 首页统计 / 音乐 / 相册 / 朋友圈 /circle/ / 友链状态徽标
- 404 页、`trailingSlash` 尾斜杠路由

## 三、域名绑定与切换（零宕机）

1. 预览验证通过后，在 Pages 项目绑定 `blog.tsh520.cn`，按控制台指引完成域名校验
2. 修改 DNS：`blog.tsh520.cn` 的 CNAME 记录指向 Pages 项目分配的默认域名
3. **剥离旧配置**：EdgeOne 站点加速中 `blog.tsh520.cn` 的加速配置必须移除（同一域名不能同时挂在站点加速和 Pages 下，避免解析/回源冲突）；旧 GitHub Pages 站点随工作流删除自动停用
4. 验证：`nslookup blog.tsh520.cn` 确认 CNAME 指向 Pages 默认域名，浏览器实测关键路径，观察 1-2 天

## 四、迁移记录（2026-09-04：GitHub Pages → EdgeOne Pages）

**迁移前**（2026-08-22 ~ 09-04，提交 `a86280f`）：GitHub Actions（`pages.yml`）构建 → GitHub Pages 托管 → DNS → EdgeOne 站点加速（纯 CDN 回源）。
**迁移后**：EdgeOne Pages 直接拉仓库构建托管，链路缩短一跳。

代码侧变更：

- 删除 `.github/workflows/pages.yml`（GitHub Pages 部署）
- 删除 `public/CNAME`
- `build.yml` / `biome.yml` / `friend-status.yml` / `friend-screenshots.yml` 保留不动

注意事项：

- 友链状态检测每日 5:17 自动 commit `public/friends-status.json`、友链截图在 friends 内容变化时自动提交，都会触发 EdgeOne 构建（约每日 1 次 + 内容更新时），留意 EdgeOne Pages 构建配额
- PagesCMS 后台在后台编辑保存同样 push main → 触发构建，属正常
- 回滚：DNS 指回旧配置可秒级回滚；`pages.yml`/`CNAME` 在 git 历史中可随时恢复

## 五、常见问题

| 问题 | 排查 |
|---|---|
| 构建失败 | 先看 Node 版本是否 ≥ 22、pnpm 是否 9.14.x、构建命令是否为 `pnpm build`；与 `build.yml` 的 CI 行为对照 |
| 功能静默缺失（评论/统计/加密页打不开） | 检查 13 个环境变量是否逐项填齐（见第二节表） |
| 需要换域名 | 改 `src/config/siteConfig.ts:16` 的 `site_url`（sitemap/robots/RSS/canonical 自动跟随）+ 控制台重新绑定域名；注意 `src/config/musicConfig.ts` 等硬编码的 `*.tsh520.cn` 子域不受影响 |