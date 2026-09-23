---
title: Obsidian 插件：Category Autofill——自动维护文章分类
published: 2026-08-15
tags:
  - Obsidian
  - 插件
  - 效率工具
  - 博客工作流
image: https://img.tsh520.cn/file/blog/post-covers/tech-07-category-autofill.webp
description: 一个自动维护文章分类的 Obsidian 插件：category 自动等于所在文件夹名，新建文章自动带齐属性，只处理你指定的目录，安全可控。
---

> 现在我在 Obsidian 里新建笔记，title、published、tags、category、description 会自动带好，写完直接同步到博客，从来不用回头补属性。

# 前言

我的博客文章一直在 Obsidian 里写，写完同步到仓库。文章多了之后有个很头疼的问题：**分类（category）全靠手填**。

忘了填？文章进了博客就缺分类；填错了？和目录结构对不上；改目录结构？所有文章的分类都要跟着改一遍……

于是我给 Obsidian 写了一个小插件——**Category Autofill**，让分类这件事彻底自动化。

# 它做了什么

一句话：**把文章的 category 自动填充为它所在文件夹的名字**。

- `技术分享/xxx.md` → `category: 技术分享`
- 把文章拖到别的文件夹 → category 自动跟着变
- 重命名文件夹 → 里面所有文章的 category 一次性更新

除了自动填充，新建文章时它还会自动带上博客需要的属性：

```yaml
---
title: 文件名
published: 2026-08-15
tags: []
category: 所在文件夹名
description: ""
---
```

这些属性全部可以在设置里改：可以加你自己的字段（比如 `author`），也可以改默认值，比如把 `description` 设成固定的开头。

# 为什么要用

## 1. 分类永远和目录一致

目录结构就是分类结构：改目录 = 改分类，不会再出现「文章在 A 文件夹但分类写着 B」的情况。

## 2. 新建文章零准备

在 Obsidian 里新建一篇笔记，几秒内就自动带齐了博客需要的所有属性。写完直接同步，不用回头补 frontmatter。

## 3. 批量修复历史文件

命令面板执行「自动填充 category（全库）」，所有历史文章一次修完，结束后提示更新了多少、跳过了多少、失败了多少。命令幂等，重复执行无害。

## 4. 安全设计

- **只处理你指定的「文章根目录」**（默认 `content/posts`），目录外的文件一律不碰
- 新建文章时只补**缺失**的属性，已有内容不会被覆盖
- 隐藏目录（`.obsidian` 等）、非 md 文件自动跳过
- `category` 已经等于文件夹名时不写入，文件零改动

# 安装

目前是个人维护的小工具，还没上 Obsidian 社区插件市场，手动装也就三步：

1. 从 [GitHub 仓库](https://github.com/tianshihao2003/obsidian-category-autofill) 获取 `main.js` 和 `manifest.json`
2. 拷贝到库目录 `.obsidian/plugins/category-autofill/`
3. 重启 Obsidian（或「重新加载应用」），在「设置 → 第三方插件」里启用

设置页有四个选项：「文章根目录」「覆盖已有的 category 值」「新建文章时自动添加属性」「新建文章属性模板」。

# 开发背后的故事

这个插件一开始并没有「文章根目录」限制——第一版是全库生效的。结果在真实库里跑了一次批量修复，把相册、书评、changelog 全加上了分类，误改了 275 个文件，最后靠 git 回退才救回来。

这个教训直接变成了插件的核心设计：**默认只处理 `content/posts`，其他目录一概不碰**。自动化工具的第一原则是别帮倒忙——现在它很「胆小」，但这种胆小正是写博客的人需要的。

代码层面也值得一提：frontmatter 读写全部走 Obsidian 官方 API（`processFrontMatter`），没有手写任何 YAML 解析；纯逻辑部分带 22 个单元测试；零运行时依赖。

# 最后

仓库地址：[github.com/tianshihao2003/obsidian-category-autofill](https://github.com/tianshihao2003/obsidian-category-autofill)

如果你也有「文章分类靠手填」的困扰，或者对自动化的博客工作流感兴趣，欢迎试试，也欢迎提 issue 反馈想法。

毕竟，**写文章的时间应该花在内容上，而不是花在填表格上**。
