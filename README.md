<img src="./docs/images/1131.png" width = "350" height = "500" alt="Firefly" align=right />

<div align="center">

# 团子和蛋糕的博客
> 一款清新美观的 Astro 静态博客主题模板
>
> ![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
![Astro](https://img.shields.io/badge/Astro-7.1.6-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
>
> ![GitHub License](https://img.shields.io/github/license/CuteLeaf/Firefly)

</div>


---
📖 README：
**[简体中文](README.md)** | **[English](README.en.md)**

🚀 快速指南：
[**🖥️在线站点**](https://blog.tsh520.cn/) 

⚡ 静态站点生成: 基于Astro的超快加载速度和SEO优化

🎨 现代化设计: 简洁美观的界面，支持自定义主题色

📱 移动友好: 完美的响应式体验，移动端专项优化

🔧 高度可配置: 大部分功能模块均可通过配置文件自定义

<img alt="firefly" src="./docs/images/1.webp" />
<!-- <img alt="Lighthouse" src="./docs/images/Lighthouse.png" /> -->

>[!TIP]
>
>这是一个基于 Firefly 主题模板的个人博客网站，构建于 Astro 框架之上。它具有现代设计、丰富的功能和出色的性能，是分享思想、知识和生活经验的理想平台。

## ✨ 功能特性

### 核心功能

- [x] **Astro + Tailwind CSS** - 基于现代技术栈的超快静态站点生成
- [x] **流畅动画** - Swup 页面过渡动画，提供丝滑的浏览体验
- [x] **响应式设计** - 完美适配桌面端、平板和移动设备
- [x] **多语言支持** - i18n 国际化，支持简体中文和英文
- [x] **全文搜索** - 基于 Pagefind 的客户端搜索，支持文章内容索引

### 个性化
- [x] **动态侧边栏** - 支持配置单侧边栏、双侧边栏
- [x] **文章布局** - 支持配置(单列)列表、网格(多列/瀑布流)布局
- [x] **字体管理** - 支持自定义字体，丰富的字体选择器
- [x] **页脚配置** - HTML 内容注入，完全自定义
- [x] **亮暗色模式** - 支持亮色/暗色/跟随系统三种模式
- [x] **导航栏自定义** - Logo、标题、链接全面自定义
- [x] **壁纸模式切换** - 横幅壁纸、全屏透明壁纸、纯色背景
- [x] **主题色自定义** - 360° 色相调节

### 页面组件
   
- [x] **留言板** - 支持留言页面
- [x] **公告栏** - 支持侧边栏公告提示
- [x] **看板娘** - 支持 Spine 和 Live2D 两种动画引擎
- [x] **站点统计** - 显示文章、分类、标签数目、文章总字数等数据
- [x] **站点日历** - 显示当月日历，以及当月的发布文章
- [x] **赞助页面** - 赞助链接跳转、收款码展示、赞助者列表、文章内赞助按钮
- [x] **分享海报** - 支持生成精美的文章分享海报
- [x] **樱花特效** - 支持樱花特效，全屏樱花效果
- [x] **友情链接** - 精美的友情链接展示页面
- [x] **番组计划** - 展示动漫、游戏、书籍和音乐收藏
- [x] **评论系统** - 集成 Waline 评论系统
- [x] **访问量统计** - 支持调用 Waline 自带的访问量追踪
- [x] **音乐播放器** - Material Design 3 设计风格的音乐播放器

### 内容增强
- [x] **图片灯箱** - Fancybox 图片预览功能
- [x] **浮动目录** - 动态显示文章目录，支持锚点跳转，在侧边栏目录隐藏后显示
- [x] **邮箱保护** - 让自动化爬虫程序无法直接爬到邮箱地址，被垃圾邮件骚扰
- [x] **侧边栏目录** - 动态显示文章目录，支持锚点跳转
- [x] **增强代码块** - 基于 Expressive Code，支持代码折叠、行号、语言标识
- [x] **数学公式支持** - KaTeX 渲染引擎，支持行内和块级公式
- [x] **文章随机封面图** - 支持通过 API 获取随机封面图
- [x] **Markdown扩展** - 更多的 Markdown 扩展语法

### SEO
- [x] **SEO 优化** - 完整的 meta 标签和结构化数据
- [x] **RSS 订阅** - 自动生成 RSS Feed
- [x] **站点地图** - 自动生成 XML Sitemap，支持页面过滤配置

## 🚀 快速开始

### 环境要求

- Node.js ≤ 22
- pnpm ≤ 9

### 本地开发部署

1. **克隆仓库：**
   ```bash
   git clone https://github.com/your-username/dumplingandcakeblog.git
   cd dumplingandcakeblog
   ```

2. **安装依赖：**
   ```bash
   # 如果没有安装 pnpm，先安装
   npm install -g pnpm
   
   # 安装项目依赖
   pnpm install
   ```

3. **配置博客：**
   - 编辑 `src/config/` 目录下的配置文件自定义博客设置

4. **启动开发服务器：**
   ```bash
   pnpm dev
   ```
   博客将在 `http://localhost:4321` 可用

### 平台托管部署
- **参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel, Netlify, GitHub Pages, Cloudflare Pages, EdgeOne Pages 等。**

   框架预设： `Astro`

   根目录： `./`

   输出目录： `dist`

   构建命令： `pnpm run build`

   安装命令： `pnpm install`

## 📖 配置说明

### 设置网站语言

要设置博客的默认语言，请编辑 `src/config/siteConfig.ts` 文件：

```typescript
// 定义站点语言
const SITE_LANG = "zh_CN";
```

**支持的语言代码：**
- `zh_CN` - 简体中文
- `en` - 英文

### 配置文件结构

```
src/
├── config/
│   ├── index.ts              # 配置索引文件
│   ├── siteConfig.ts         # 站点基础配置
│   ├── backgroundWallpaper.ts # 背景壁纸配置
│   ├── profileConfig.ts      # 用户资料配置
│   ├── commentConfig.ts      # 评论系统配置
│   ├── announcementConfig.ts # 公告配置
│   ├── licenseConfig.ts      # 许可证配置
│   ├── footerConfig.ts       # 手绘 Doodle Crew 页脚（巨型字/角色/链接/备案）
│   ├── expressiveCodeConfig.ts # 代码高亮配置
│   ├── sakuraConfig.ts       # 樱花特效配置
│   ├── fontConfig.ts         # 字体配置
│   ├── sidebarConfig.ts      # 侧边栏布局配置
│   ├── navBarConfig.ts       # 导航栏配置
│   ├── musicConfig.ts        # 音乐播放器配置
│   ├── pioConfig.ts          # 看板娘配置
│   ├── friendsConfig.ts      # 友链配置
│   ├── sponsorConfig.ts      # 赞助配置
│   └── coverImageConfig.ts  # 文章封面图配置
```

## ⚙️ 文章 Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg  # 或使用 "api" 来启用随机封面图
tags: [Foo, Bar]
category: Front-end
draft: false
lang: zh-CN      # 仅当文章语言与 `siteConfig.ts` 中的网站语言不同时需要设置
pinned: false    # 置顶
comment: true    # 是否允许评论
---
```

## 🧩 Markdown 扩展语法

除了 Astro 默认支持的 [GitHub Flavored Markdown](https://github.github.com/gfm/) 之外，还包含了一些额外的 Markdown 功能：

- 提醒块（Admonitions） - 支持 GitHub, Obsidian, VitePress 三种风格主题配置
- GitHub 仓库卡片
- 基于 Expressive Code 的增强代码块

## 🧞 指令

下列指令均需要在项目根目录执行：

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | 安装依赖                               |
| `pnpm dev`                 | 在 `localhost:4321` 启动本地开发服务器        |
| `pnpm build`               | 构建网站至 `./dist/`            |
| `pnpm preview`             | 本地预览已构建的网站        |
| `pnpm check`               | 检查代码中的错误                 |
| `pnpm format`              | 使用Biome格式化您的代码                        |
| `pnpm new-post <filename>` | 创建新文章                                   |
| `pnpm astro ...`           | 执行 `astro add`, `astro check` 等指令    |
| `pnpm astro --help`        | 显示 Astro CLI 帮助                        |

## 🙏 致谢

本博客基于 [Firefly](https://github.com/CuteLeaf/Firefly) 主题模板，该模板构建于 [Astro](https://astro.build) 框架和 [Tailwind CSS](https://tailwindcss.com) 之上。

### 技术栈

- [Astro](https://astro.build) 
- [Tailwind CSS](https://tailwindcss.com) 
- [Iconify](https://iconify.design)

## 📝 许可协议

本项目遵循 [MIT license](https://mit-license.org/) 开源协议，详细查看 [LICENSE](./LICENSE) 文件

最初基于 [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly)，该项目是从 [saicaca/fuwari](https://github.com/saicaca/fuwari)  fork 而来。感谢所有原始贡献者的宝贵工作。

**版权声明：**
- Copyright (c) 2024 [saicaca](https://github.com/saicaca) - [fuwari](https://github.com/saicaca/fuwari)
- Copyright (c) 2025 [CuteLeaf](https://github.com/CuteLeaf) - [Firefly](https://github.com/CuteLeaf/Firefly)
- Copyright (c) 2026 [团子和蛋糕](https://blog.tsh520.cn) - 个人博客

根据 MIT 开源协议，你可以自由使用、修改、分发代码，但需保留上述版权声明。
