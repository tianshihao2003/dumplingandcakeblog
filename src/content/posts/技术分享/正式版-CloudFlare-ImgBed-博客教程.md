---
title: CloudFlare-ImgBed + Telegram 图床 + PicGo + Obsidian 自动上传全流程教程
published: 2026-05-12
tags:
  - CloudFlare
  - PicGo
  - Obsidian
  - Telegram
  - 图床
image: /assets/images/posts/tech-20-cfbed-picgo-obsidian.png
description: 最近终于把 Markdown 写作的图片管理痛点彻底解决了——不用再手动传图、不用愁换电脑丢图、也不用担心博客迁移后满屏红叉。现在只要在 Obsidian 里 Ctrl+V 粘贴一张图，它就会自动走 Telegram 存储 → Cloudflare CDN 加速 → 返回外链 → 原地替换 Markdown 链接，整个过程安静又丝滑。整套方案零服务器成本、全链路可控，连 PicGo 和 Obsidian 的配置细节我都给你理清楚了，照着做就能跑起来。
descriptionSource: ai
---


> 一套真正适合 Markdown 写作者、Obsidian 用户、博客作者的自动化图床方案。

---

# 前言

以前写博客时，我经常会遇到这些问题：

- 本地 Markdown 图片路径混乱
- 换电脑后图片丢失
- 博客迁移时图片全部失效
- Typora / Obsidian / VSCode 各种编辑器图床不统一
- Git 仓库越来越大

后来我开始折腾：

- Cloudflare
- Telegram
- PicGo
- Obsidian

最终整理出了现在这套方案：

```text
Obsidian
↓
Image Auto Upload
↓
PicGo
↓
CloudFlare-ImgBed
↓
Telegram
```

效果就是：

✅ 在 Obsidian 中直接粘贴图片  
✅ 自动上传图床  
✅ 自动替换 Markdown 图片链接  
✅ Telegram 作为底层存储  
✅ Cloudflare 提供 CDN 与访问加速

整个过程几乎完全自动化。

---

# 整体架构

```mermaid
flowchart LR
    A[Obsidian 写文章] --> B[Image Auto Upload]
    B --> C[PicGo Server]
    C --> D[CloudFlare-ImgBed]
    D --> E[Telegram 存储]
    E --> F[返回图片 URL]
    F --> G[自动写回 Markdown]
```

---

# 一、部署 CloudFlare-ImgBed

项目地址：

- https://github.com/MarSeventh/CloudFlare-ImgBed

部署方式推荐：

- Cloudflare Pages

## 1. Fork 仓库

先 Fork 官方仓库到自己的 GitHub。

---

## 2. 创建 Cloudflare Pages

进入：

```text
Cloudflare Dashboard
→ Workers & Pages
→ Create Application
→ Pages
→ Connect to Git
```

选择你 Fork 的仓库。

---

## 3. 构建设置（非常重要）

保持默认即可：

| 配置项 | 内容 |
|---|---|
| Framework preset | None |
| Build command | 留空 |
| Build output directory | 留空 |

⚠️ 不要填写：

```text
dist
build
out
```

否则 Functions 不会部署成功。

---

# 二、配置 Telegram 存储

CloudFlare-ImgBed 最新版默认支持 Telegram 作为上传通道。

## 1. 创建 Telegram Bot

打开：

- @BotFather

发送：

```text
/newbot
```

创建完成后获取：

```text
TG_BOT_TOKEN
```

---

## 2. 获取 Chat ID

方法：

把 Bot 拉进频道或群组。

然后访问：

```text
https://api.telegram.org/bot你的BOT_TOKEN/getUpdates
```

找到：

```json
"chat": {
  "id": xxxxxxxxx
}
```

这个就是：

```text
TG_CHAT_ID
```

---

# 三、配置 Cloudflare 环境变量

进入：

```text
Cloudflare Pages
→ Settings
→ Environment Variables
```

添加：

| Key | Value |
|---|---|
| TG_BOT_TOKEN | Telegram Bot Token |
| TG_CHAT_ID | Telegram Chat ID |
| AUTH_CODE | 你自己的上传密码 |

例如：

```text
AUTH_CODE=123456
```

保存后重新部署。

---

# 四、测试上传接口

部署完成后访问：

```text
https://你的域名/upload
```

如果出现：

```text
Unauthorized
```

说明：

✅ 上传接口正常  
✅ 认证生效  
✅ 可以开始接入 PicGo

---

# 五、安装与配置 PicGo

PicGo：

- https://github.com/Molunerfinn/PicGo

## 1. 安装  [](https://github.com/Nahuimi) [picgo-plugin-cfbed-uploader](https://github.com/Nahuimi/picgo-plugin-cfbed-uploader) 插件

打开：

```text
PicGo
→ 插件设置
```

搜索：（搜不到就去github下载导入）

```text
picgo-plugin-cfbed-uploader
```

安装：

```text
picgo-plugin-cfbed-uploader
```

安装完成后重启 PicGo。


---

# 六、PicGo 图床配置

进入：

```text
PicGo
→ 图床设置
→ picgo-plugin-cfbed-uploader
```

填写：
## 图床配置名

```text
随意
```

## 站点地址

```text
https://你的域名/upload
```

---

## API令牌

```text
图床后台安全设置里添加
```

---

## 上传渠道

```text
自己的渠道
```

---

## 命名方式

```text
按自己的需求
```

---

## 返回格式

```yaml
默认
```

---

# 七、测试 PicGo 是否成功

拖一张图片进入 PicGo。

如果成功：

PicGo 会自动复制图片链接。

例如：

```text
https://你的域名/file/xxxxx.webp
```

---

# 八、Obsidian 自动上传配置

插件：

```text
Image Auto Upload
```

## 安装方式

```text
设置
→ 社区插件
→ 搜索 Image Auto Upload
```

安装并启用。

---

# 九、开启 PicGo Server

进入：

```text
PicGo
→ 设置
→ Server
```

开启：

```text
Enable PicGo Server
```

记住端口。

例如：

```text
36677
```

---

# 十、配置 Obsidian 插件

进入：

```text
Image Auto Upload 设置
```

填写：

```text
http://127.0.0.1:36677/upload
```

---

# 十一、最终效果

现在：

1. 在 Obsidian 粘贴图片
2. 自动触发上传
3. PicGo 调用图床接口
4. CloudFlare-ImgBed 存入 Telegram
5. 返回 CDN 外链
6. 自动替换 Markdown 图片

最终 Markdown：

```markdown
![](https://你的域名/file/xxxxx.webp)
```

---

# 十二、推荐开启的功能

## CloudFlare-ImgBed

建议开启：

- WebP 转换
- 自动压缩
- 随机文件名

---

## Obsidian

建议配合：

- Git 插件
- Excalidraw
- Dataview

一起使用。

---

# 十三、常见问题

## 1. `/upload` 显示 404

说明：

- Functions 没部署成功
- Build output 配错

重新部署即可。

---

## 2. 上传提示 Unauthorized

说明：

- authCode 不匹配
- PicGo Header 配置错误

---

## 3. Obsidian 不自动上传

检查：

- PicGo Server 是否开启
- 端口是否正确
- 防火墙是否拦截

---

# 十四、总结

这套方案最大的优点：

- 完全 Markdown 化
- 低成本
- 可迁移
- 自动化程度高
- 不依赖第三方图床

非常适合：

- 博客作者
- Obsidian 用户
- 技术写作者
- 长期知识管理

尤其是：

```text
Obsidian + PicGo + Cloudflare
```

这一套组合，真的非常舒服。

---

