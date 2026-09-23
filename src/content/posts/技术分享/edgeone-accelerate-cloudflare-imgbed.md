---
title: 手把手教你用 EdgeOne 加速 Cloudflare 图床，国内访问从 8 秒降到 0.15 秒
published: 2026-07-31
tags:
  - CDN
  - EdgeOne
  - Cloudflare
  - 图床
  - 性能优化
image: https://img.tsh520.cn/file/blog/post-covers/tech-14-edgeone-cf-imgbed.webp
description: 完整记录使用腾讯云 EdgeOne CDN 加速 Cloudflare Pages 图床的全过程，从零开始配置，包含踩坑排查和性能测试数据。
---

## 写在前面

如果你和我一样，把图床部署在 Cloudflare Pages 上，国内用户访问图片总是很慢，那这篇文章就是为你写的。

我花了大半天时间摸索配置，中间踩了好几个坑，最后成功把图片加载时间从 2-8 秒降到了 0.15 秒。这篇文章把整个过程记录下来，包括我踩过的每一个坑，希望能帮你少走弯路。

## 先看效果

| 指标 | 加速前 | 加速后 |
|------|--------|--------|
| 单张图片加载 | 2-8 秒 | 0.12-0.19 秒 |
| 图片上传（500KB） | 9 秒 | 7 秒 |
| 首页 TTFB | 1.0-1.9 秒 | 0.8-1.0 秒 |

缓存命中后，图片加载快了 **10-50 倍**。

## 原理说明

Cloudflare 的服务器主要在海外，国内用户访问要绕一大圈。EdgeOne 是腾讯云的 CDN 服务，在国内有大量节点。

加速的原理很简单：

```
没有加速：你的浏览器 → 海外服务器 → 返回图片（慢）
有加速：你的浏览器 → 国内节点（有缓存就直接返回）→ 没缓存才去海外取（快）
```

就像你在国内买进口商品，有保税仓就不用等国际快递了。

## 准备工作

开始之前，确认你有这些东西：

1. **一个已备案的域名** — EdgeOne 国内加速必须用备案域名
2. **腾讯云账号** — 注册 EdgeOne 需要
3. **Cloudflare 账号** — 你的图床已经部署在上面
4. **你的图床地址** — 类似 `xxx.pages.dev` 的格式

## 详细配置步骤

### 第一步：找到你的 Cloudflare Pages 地址

登录 Cloudflare Dashboard，进入你的 Pages 项目，在项目设置里找到「默认域名」或「Pages 域名」，格式类似：

```
你的项目名.pages.dev
```

记下这个地址，后面要用。

### 第二步：在 EdgeOne 创建加速域名

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 如果你还没有添加过域名，先点「添加域名」，输入你的一级域名（比如 `example.com`）
3. 进入你的一级域名 → 左侧菜单「域名管理」→「加速域名」→「添加域名」

填写以下信息：

- **加速域名**：`img.example.com`（你想用的子域名，随意取）
- **源站类型**：选「源站域名」
- **源站地址**：填你刚才记下的 Pages 地址（`xxx.pages.dev`）
- **回源 Host**：也填 Pages 地址（`xxx.pages.dev`）
- **回源协议**：HTTPS
- **回源端口**：443

往下找到「推荐模板」，选择「网站加速」。

加速区域选「中国大陆可用区」。

提交后，EdgeOne 会给你分配一个 CNAME 地址，类似：

```
img.example.com.eo.dnse2.com
```

记下这个地址。

### 第三步：让 Cloudflare Pages 认识你的加速域名

EdgeOne 回源时会告诉 Cloudflare Pages：「我是 `img.example.com`，给我图片」。但 Cloudflare Pages 不认识这个域名，会报错。

所以需要在 Cloudflare Pages 里添加自定义域名：

1. 进入你的 Pages 项目 → 设置 → Custom domains
2. 添加你在 EdgeOne 创建的加速域名（`img.example.com`）
3. Cloudflare 会要求你添加一条 DNS 验证记录，按提示操作
4. 等待验证通过（显示 Active）

**注意**：验证过程中，DNS 可能需要临时指向 Cloudflare。验证通过后再改回 EdgeOne。

### 第四步：把 DNS 指向 EdgeOne

验证通过后，去你的域名 DNS 管理，添加或修改 CNAME 记录：

```
类型：CNAME
主机记录：img（你的子域名前缀）
记录值：img.example.com.eo.dnse2.com（EdgeOne 给你的地址）
```

等 DNS 生效（通常 1-5 分钟）。

### 第五步：选择缓存策略

EdgeOne 会根据你选的「网站加速」模板自动配置缓存。你也可以手动调整：

- 图片文件：缓存 30 天
- HTML 页面：缓存 5 分钟
- API 请求：不缓存

### 第六步：替换项目中的旧域名

配置完成后，把项目中所有引用旧图床地址的地方替换为新地址：

```bash
find src/content -type f -name "*.md" \
  -exec sed -i 's|https://旧图床地址|https://img.example.com|g' {} +
```

别忘了：
- `.env` 文件中的图床地址
- 部署平台（Vercel 等）的环境变量

## 我踩过的 4 个坑

### 坑 1：HTTP 525 错误

配置完成后访问，显示 `HTTP ERROR 525`。

**原因**：EdgeOne 回源到 Cloudflare 时，SSL 握手失败。Cloudflare 不认识你的加速域名，没有对应的 SSL 证书。

**解决**：在 Cloudflare Pages 添加自定义域名（第三步），让 Cloudflare 为加速域名签发证书。

### 坑 2：重定向循环

访问时显示「此页面不能正确地重定向」。

**原因**：回源 Host 填了加速域名。Cloudflare Pages 收到请求后发现域名不匹配，重定向到加速域名，EdgeOne 又代理回去，无限循环。

**解决**：回源 Host 必须填 Pages 域名（`xxx.pages.dev`），不能填加速域名。

### 坑 3：Cloudflare Error 1001

显示 Cloudflare 的 DNS 解析错误页面。

**原因**：回源地址填了原来在 Cloudflare 代理后面的域名。Cloudflare 拦截了 EdgeOne 的请求。

**解决**：回源地址用 Pages 直连域名（`xxx.pages.dev`），不走 Cloudflare 代理。

### 坑 4：HTTP 回源也失败

改成 HTTP:80 回源仍然报错。

**原因**：Cloudflare Pages 强制 HTTPS，不接受 HTTP 回源。

**解决**：回源协议必须用 HTTPS:443。

## 容灾方案

如果 EdgeOne 出问题，只需改一条 DNS 记录：

把加速域名的 CNAME 从 EdgeOne 地址改成直接指向 Pages 域名。

不需要改代码，不需要重新部署，秒级恢复。

## 总结

整个配置大约 30 分钟，主要是等 DNS 生效和 Cloudflare 验证。配置完成后，国内用户访问图片的速度提升了一个数量级。

如果你也有类似的海外 CDN 加速需求，EdgeOne 是一个不错的选择。免费额度够个人博客使用，配置也不复杂，主要是把回源 Host 和 SSL 证书这两个点搞对就行了。
