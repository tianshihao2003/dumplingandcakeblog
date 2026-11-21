<img src="./docs/images/1131.png" width = "350" height = "500" alt="Firefly" align=right />

<div align="center">

# 团子和蛋糕的博客
> A Fresh and Beautiful Astro Static Blog Theme Template
>
> ![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)
![Astro](https://img.shields.io/badge/Astro-7.1.6-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
>
> ![GitHub License](https://img.shields.io/github/license/CuteLeaf/Firefly)
</div>


---
📖 README:
**[简体中文](README.zh.md)** | **[English](README.md)**

🚀 Quick Guide:
[**🖥️Live Site**](https://blog.tsh520.cn/) 

⚡ Static Site Generation: Ultra-fast loading speed and SEO optimization based on Astro

🎨 Modern Design: Clean and beautiful interface with customizable theme colors

📱 Mobile-Friendly: Perfect responsive experience with mobile-specific optimizations

🔧 Highly Configurable: Most features can be customized through configuration files

<img alt="firefly" src="./docs/images/1.webp" />
<img alt="Lighthouse" src="./docs/images/Lighthouse.png" />

>[!TIP]
>This is a personal blog website based on the Firefly theme template, which is built on the Astro framework. It features a modern design, rich functionality, and excellent performance, making it an ideal platform for sharing thoughts, knowledge, and life experiences.

## ✨ Features

### Core Features

- [x] **Astro + Tailwind CSS** - Ultra-fast static site generation based on modern tech stack
- [x] **Smooth Animations** - Swup page transition animations for silky smooth browsing experience
- [x] **Responsive Design** - Perfect adaptation for desktop, tablet and mobile devices
- [x] **Multi-language Support** - i18n internationalization, supports Simplified Chinese and English
- [x] **Full-text Search** - Client-side search based on Pagefind, supports article content indexing

### Personalization
- [x] **Dynamic Sidebar** - Supports single sidebar, dual sidebar configuration
- [x] **Article Layout** - Supports list (single column) and grid (multi-column/masonry) layout
- [x] **Font Management** - Custom font support with rich font selector
- [x] **Footer Configuration** - HTML content injection, fully customizable
- [x] **Light/Dark Mode** - Supports light/dark/system three modes
- [x] **Navbar Customization** - Logo, title, links fully customizable
- [x] **Wallpaper Mode Switching** - Banner wallpaper, fullscreen wallpaper, solid background
- [x] **Theme Color Customization** - 360° hue adjustment

### Page Components
- [x] **Guestbook** - Supports guestbook page
- [x] **Announcement Bar** - Supports sidebar announcement notification
- [x] **Mascot** - Supports both Spine and Live2D animation engines
- [x] **Site Statistics** - Displays article, category, tag counts, total word count, etc.
- [x] **Site Calendar** - Displays current month calendar and published articles for the month
- [x] **Sponsor Page** - Sponsor link redirection, payment QR codes display, sponsor list, in-article sponsor button
- [x] **Share Poster** - Supports generating beautiful article share posters
- [x] **Sakura Effect** - Supports sakura effect, fullscreen sakura animation
- [x] **Friend Links** - Beautiful friend links display page
- [x] **Bangumi** - Display anime, games, books and music collection
- [x] **Comment System** - Integrates Waline comment system
- [x] **Visit Counter** - Supports calling Waline built-in visit tracking
- [x] **Music Player** - Material Design 3 style music player

### Content Enhancement
- [x] **Image Lightbox** - Fancybox image preview functionality
- [x] **Floating TOC** - Dynamically displays article table of contents, supports anchor jumping, shown when sidebar TOC is hidden
- [x] **Email Protection** - Prevent automated crawlers from directly scraping email addresses to avoid spam
- [x] **Sidebar TOC** - Dynamically displays article table of contents, supports anchor jumping
- [x] **Enhanced Code Blocks** - Based on Expressive Code, supports code folding, line numbers, language identification
- [x] **Math Formula Support** - KaTeX rendering engine, supports inline and block formulas
- [x] **Random Cover Images** - Supports fetching random cover images via API
- [x] **Markdown Extensions** - More Markdown extension syntax support

### SEO
- [x] **SEO Optimization** - Complete meta tags and structured data
- [x] **RSS Feed** - Automatically generates RSS Feed
- [x] **Sitemap** - Automatically generates XML Sitemap with page filtering configuration

## 🚀 Quick Start

### Requirements

- Node.js ≤ 22
- pnpm ≤ 9

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/dumplingandcakeblog.git
   cd dumplingandcakeblog
   ```

2. **Install dependencies:**
   ```bash
   # Install pnpm if not installed
   npm install -g pnpm
   
   # Install project dependencies
   pnpm install
   ```

3. **Configure blog:**
   - Edit configuration files in `src/config/` directory to customize blog settings

4. **Start development server:**
   ```bash
   pnpm dev
   ```
   Blog will be available at `http://localhost:4321`

### Platform Hosting Deployment
- **Refer to the [official guide](https://docs.astro.build/en/guides/deploy/) to deploy your blog to Vercel, Netlify, GitHub Pages, Cloudflare Pages, EdgeOne Pages, etc.**

   Framework Preset: `Astro`

   Root Directory: `./`

   Output Directory: `dist`

   Build Command: `pnpm run build`

   Install Command: `pnpm install`

## 📖 Configuration

### Setting Website Language

To set the default language for your blog, edit the `src/config/siteConfig.ts` file:

```typescript
// Define site language
const SITE_LANG = "zh_CN";
```

**Supported language codes:**
- `zh_CN` - Simplified Chinese
- `en` - English

### Configuration File Structure

```
src/
├── config/
│   ├── index.ts              # Configuration index file
│   ├── siteConfig.ts         # Site basic configuration
│   ├── backgroundWallpaper.ts # Background wallpaper configuration
│   ├── profileConfig.ts      # User profile configuration
│   ├── commentConfig.ts      # Comment system configuration
│   ├── announcementConfig.ts # Announcement configuration
│   ├── licenseConfig.ts      # License configuration
│   ├── footerConfig.ts       # Doodle Crew footer (wordmark, crew, links, filings)
│   ├── expressiveCodeConfig.ts # Code highlighting configuration
│   ├── sakuraConfig.ts       # Sakura effect configuration
│   ├── fontConfig.ts         # Font configuration
│   ├── sidebarConfig.ts      # Sidebar layout configuration
│   ├── navBarConfig.ts       # Navbar configuration
│   ├── musicConfig.ts        # Music player configuration
│   ├── pioConfig.ts          # Mascot configuration
│   ├── friendsConfig.ts      # Friend links configuration
│   ├── sponsorConfig.ts      # Sponsor configuration
│   └── coverImageConfig.ts   # Article cover image configuration
```


## ⚙️ Article Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg  # Or use "api" to enable random cover images
tags: [Foo, Bar]
category: Front-end
draft: false
lang: zh-CN      # Only set when article language differs from site language in `siteConfig.ts`
pinned: false    # Pin article
comment: true    # Enable comments
---
```

## 📖 Markdown Extensions

In addition to the default [GitHub Flavored Markdown](https://github.github.com/gfm/) support in Astro, there are some additional Markdown features:

- Admonitions - Supports configuration for GitHub, Obsidian, and VitePress themes
- GitHub Repository Cards
- Enhanced Code Blocks based on Expressive Code

## 🧞 Commands

All commands need to be executed in the project root directory:

| Command                    | Action                                              |
|:---------------------------|:----------------------------------------------------|
| `pnpm install`             | Install dependencies                                |
| `pnpm dev`                 | Start local development server at `localhost:4321`  |
| `pnpm build`               | Build site to `./dist/`                             |
| `pnpm preview`             | Preview built site locally                          |
| `pnpm check`               | Check for errors in code                            |
| `pnpm format`              | Format your code using Biome                        |
| `pnpm new-post <filename>` | Create new article                                  |
| `pnpm astro ...`           | Execute `astro add`, `astro check` and other commands |
| `pnpm astro --help`        | Display Astro CLI help                              |

## 🙏 Acknowledgments

This blog is based on the [Firefly](https://github.com/CuteLeaf/Firefly) theme template, which is built on the [Astro](https://astro.build) framework and [Tailwind CSS](https://tailwindcss.com).

### Tech Stack

- [Astro](https://astro.build) 
- [Tailwind CSS](https://tailwindcss.com) 
- [Iconify](https://iconify.design)

## 📝 License

This project is licensed under the [MIT license](https://mit-license.org/). See the [LICENSE](./LICENSE) file for details.

Originally based on [CuteLeaf/Firefly](https://github.com/CuteLeaf/Firefly), which was forked from [saicaca/fuwari](https://github.com/saicaca/fuwari). Thanks to all the original contributors for their valuable work.

**Copyright Notice:**
- Copyright (c) 2024 [saicaca](https://github.com/saicaca) - [fuwari](https://github.com/saicaca/fuwari)
- Copyright (c) 2025 [CuteLeaf](https://github.com/CuteLeaf) - [Firefly](https://github.com/CuteLeaf/Firefly)
- Copyright (c) 2026 [团子和蛋糕](https://blog.tsh520.cn) - Personal Blog

Under the MIT license, you are free to use, modify, and distribute the code, but you must retain the above copyright notice.
