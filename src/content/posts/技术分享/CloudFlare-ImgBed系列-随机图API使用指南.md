---
title: CloudFlare-ImgBed系列-随机图API使用指南
published: 2026-08-13
tags:
  - CloudFlare-ImgBed
  - 图床
  - 随机图
  - 教程
image: https://img.tsh520.cn/file/blog/post-covers/tech-04-random-image-api.webp
description: 用大白话讲清楚自建图床随机图 API 怎么开启、怎么用、有哪些坑——官方文档看不懂的，看这篇就够了。
---

## 前言

给自己的图床开了随机图功能之后，对着官方文档研究半天，结果发现真正用起来就几行代码的事。官方文档写得太"文档化"了，这篇用大白话把随机图 API 讲明白，顺便记下我实测踩过的三个坑。

## 随机图 API 是什么

一句话：**一个网址，每打开一次，就从你图床的某个文件夹里随机抽一张图返回给你。**

你可以把它当"随机壁纸接口"用，也可以给网站当随机背景、给文章配随机封面。

## 前提：先把功能开起来

两个步骤：

1. 进入图床管理后台 → 系统设置 → 找到「随机图」开关，打开
2. 配置一个**允许随机访问的目录**，比如 `/blog/随机封面图`（填这个目录名，带不带开头的斜杠都行）

第二步很重要：不开目录，或者请求时乱指定目录，都会报 `Directory not allowed` 错误。

## 最简单的用法

浏览器直接打开：

```
https://img.tsh520.cn/random?dir=blog/随机封面图
```

每刷新一次，就会显示一张不同的图片。就这么简单。

> `dir` 后面填你图床里真实的目录路径，中文不需要手动转码，浏览器会自动处理。

## 常用参数（大白话版）

| 参数 | 作用 | 怎么填 |
|------|------|--------|
| `dir` | 从哪个文件夹随机 | 目录路径，如 `blog/随机封面图` |
| `type=img` | 直接返回图片 | 放 `<img>` 标签里用 |
| `type=url` | 返回图片链接 | 配合 `form=text` 拿纯文本链接，脚本里用 |
| `form=text` | 链接以纯文本返回 | 不写就是 JSON 格式 |
| `orientation` | 只要横图/竖图/方图 | `landscape` 横 / `portrait` 竖 / `square` 方 / `auto` 自适应设备 |
| `content` | 文件类型过滤 | 默认 `image`，视频用 `video` |

## 实战场景

### 1. 网页里放一张随机图

```html
<img src="https://img.tsh520.cn/random?type=img&dir=blog/随机封面图" alt="随机图">
```

### 2. 当 CSS 背景图

```css
.hero {
  background-image: url('https://img.tsh520.cn/random?type=img&dir=blog/随机封面图&orientation=landscape');
  background-size: cover;
}
```

### 3. 只要横图（做文章封面）

```
https://img.tsh520.cn/random?type=img&dir=blog/随机封面图&orientation=landscape
```

### 4. 脚本里拿链接

```
https://img.tsh520.cn/random?type=url&form=text&dir=blog/随机封面图
```

返回一行纯文本，比如：

```
https://img.tsh520.cn/file/blog/随机封面图/16.webp
```

用 `curl` 命令测试最方便：

```bash
curl "https://img.tsh520.cn/random?type=url&form=text&dir=blog/随机封面图"
```

## 我踩过的三个坑

### 坑一：不带 `dir` 报 `Directory not allowed`

图床开了目录白名单之后，**每次请求必须显式带上 `dir`**，且目录必须在后台配置的允许范围里。别指望"不传就默认整个图床随机"——会直接报错。

### 坑二：上传的图片"随机不到"

实测发现：如果上传文件时没带正确的文件类型（比如写脚本上传时 `Blob` 没设置 MIME 类型），图床会把文件记录成 `application/octet-stream`。文件本身没问题、直链也能访问，但**随机图 API 按"图片"筛选时直接跳过它**，表现就是：文件夹里明明有几十张图，随机接口却返回空。

排查方法：管理后台看该文件的类型是不是显示成 `application/octet-stream`。修复方法：删除后重新上传，上传时确保带正确类型（webp/png/jpg 等）。

### 坑三：多个地方用同一个 URL，显示的会是同一张图

随机接口本身每次都会随机，但**浏览器会缓存**：如果页面上十几个位置都写同一个 `/random?...` 地址，浏览器只会请求一次，然后全部位置显示同一张图。

解法：给每个使用位置加一个不同的参数，让 URL 不一样即可（图床不认识这个参数也没关系，它只是让浏览器认为"这是不同的网址"）：

```
https://img.tsh520.cn/random?type=img&dir=blog/随机封面图&v=文章ID
```

`v` 换成每篇文章独有的编号（文章 ID、slug、序号都行），这样每篇文章各请求一次、各拿到一张，同篇文章刷新后也不会变（URL 固定）。

### 补充提醒：加载速度

随机接口每次请求都要实时查数据库，比访问一张固定图片慢一些。**不适合放首屏关键位置**（比如首页 Hero、导航 Logo），适合做背景、封面这种"锦上添花"的场景。追求极致速度的话，还是用固定图片直链走 CDN 缓存。

## 总结

- 开随机图 = 后台开开关 + 配一个允许目录
- 用随机图 = 一个带 `dir` 的网址，加 `type=img` 直接出图
- 三个坑：必须带 `dir`、上传要带正确 MIME 类型、多个位置要用 `&v=xxx` 区分开

这套东西配置一次，之后所有需要"随机图片"的地方都能一键复用。
