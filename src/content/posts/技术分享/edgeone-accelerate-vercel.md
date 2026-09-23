---
title: 手把手教你用 EdgeOne 加速 Vercel 部署的项目（源站域名分离法）
published: 2026-08-10
tags:
  - CDN
  - EdgeOne
  - Vercel
  - 性能优化
  - 教程
image: https://img.tsh520.cn/file/blog/post-covers/tech-15-edgeone-vercel-cdn.webp
description: Vercel 部署的网站国内访问慢？用源站域名分离法给 Vercel 套上 EdgeOne 加速，配置详解 + 踩坑记录。
descriptionSource: manual
---

## 写在前面

Vercel 部署网站很方便，但**国内访问速度一直是个老大难问题**——Vercel 的节点在海外，国内用户访问动不动几秒甚至超时。

能不能给 Vercel 套一个国内 CDN（EdgeOne）加速？**能**，但有一个坑：**Vercel 的自定义域名验证机制**要求域名的 DNS 必须指向 `xxx.vercel.app`，否则拒绝服务——和 CDN 要求的"DNS 指向 CDN"冲突。

这篇文章分享我实际验证可行的方案：**源站域名分离法**——给 Vercel 一个"源站域名"，用户访问的域名走 EdgeOne 加速。

先看加速前后的效果对比：
![572](https://img.tsh520.cn/file/blog/article/file-20260810012722787.png)
📷 插图 1：加速前的加载速度截图（Vercel 直连） 
![568](https://img.tsh520.cn/file/blog/article/file-20260810012736464.png)
📷 插图 2：加速后的加载速度截图（EdgeOne 加速） 

## 原理：为什么不能直接套

Vercel 对自定义域名是**持续监控 DNS** 的：

- 域名 CNAME 指向 `xxx.vercel.app` → Vercel 显示 **Valid**（正常服务）
- 域名指向其他（比如 CDN）→ Vercel 显示 **Invalid**（**拒绝服务**，访问报错）

一个域名只有一条 CNAME——**不可能同时指向 Vercel 和 CDN**。所以"直接套"是走不通的（我一开始就踩了这个坑，访问一直报 522）。

## 方案：源站域名分离

核心思路：**给 Vercel 绑定一个专门的"源站域名"，CDN 回源到它；用户访问的域名走 CDN**：

```text
用户访问 cms.tsh520.cn
    ↓ DNS 解析（指向 EdgeOne）
EdgeOne 边缘节点（国内加速/缓存）
    ↓ 回源（Host: cms-origin.tsh520.cn）
Vercel（绑定了 cms-origin.tsh520.cn）✅ Valid
```

- Vercel 绑定 `cms-origin.tsh520.cn`（DNS 指向 vercel.app → Valid）
- EdgeOne 加速 `cms.tsh520.cn`（用户访问的域名）
- EdgeOne 回源到 `cms-origin.tsh520.cn`（Vercel 认它）

## 配置步骤

### ① Vercel：添加源站域名

1. Vercel 项目 → **Settings → Domains** → 添加 `cms-origin.tsh520.cn`
2. 按提示在 DNS 加记录：`cms-origin` → `cms.vercel.app`（CNAME）
3. 等状态变 **Valid**（绿色）
4. **删除**原来的 `cms.tsh520.cn` 绑定（它交给 EdgeOne，留着会一直显示 Invalid）

### ② EdgeOne：添加加速站点

1. EdgeOne 控制台 → **站点加速** → 添加站点 `cms.tsh520.cn`
2. 源站配置（**关键**）：

| 配置项 | 填什么 |
|---|---|
| 源站类型 | IP/域名 |
| 源站地址 | `cms-origin.tsh520.cn` |
| 回源协议 | HTTPS |
| 回源端口 | 443 |
| **回源 HOST 头** | **使用源站域名**（`cms-origin.tsh520.cn`）|

> ⚠️ **回源 HOST 头是最容易错的地方**：必须填源站域名（`cms-origin.tsh520.cn`），不能选"使用加速域名"——否则 Vercel 收到的是加速域名（没绑定）会拒绝请求。

### ③ DNS：切换解析

把 `cms.tsh520.cn` 的 CNAME **从 `cms.vercel.app` 改成 EdgeOne 给的加速地址**（EdgeOne 站点详情页会显示，类似 `cms.tsh520.cn.eo.dnse2.com`）。

> ⚠️ 是**修改**这条记录，不是新增第二条（一个域名只能有一条 CNAME）。

### ④ 应用侧配置（如果你的应用有）

如果应用配置了回调域名/BASE_URL（比如后台系统的 OAuth 回调），**统一用用户访问的加速域名**：

- `BASE_URL = https://cms.tsh520.cn`（不是 cms-origin）
- GitHub App / OAuth 回调地址：`https://cms.tsh520.cn/api/auth/callback`

这样登录、回调都走加速域名，EdgeOne 会正确回源。

## 踩坑记录

| 坑 | 现象 | 解决 |
|---|---|---|
| 直接套 CDN | 访问报 **522**（Vercel 拒绝）| 源站域名分离 |
| 回源 HOST 头用加速域名 | Vercel 不认，回源失败 | 改成源站域名 |
| DNS 加了两条 CNAME | 解析冲突 | 修改旧记录，不新增 |
| Vercel 域名验证时序 | 先指向 vercel.app 等 Valid，再切 CDN | 按步骤①→④ 顺序 |

## 验证

1. 等 EdgeOne 状态从"部署中"变"已部署"（几分钟）
2. 浏览器访问 `https://cms.tsh520.cn` → 正常打开
3. **登录功能测试**（重要）：如果应用有登录，确认登录态正常——Cookie 的域名取决于应用配置的 BASE_URL（用加速域名就不会有问题）
4. 速度对比：F12 → Network 看加载时间（国内应该明显提升）

## 总结

| 要点 | 说明 |
|---|---|
| 核心思路 | 源站域名（Vercel 绑定）与访问域名（CDN）分离 |
| 关键配置 | 回源 HOST 头 = 源站域名 |
| 应用配置 | BASE_URL/回调地址用加速域名 |
| 适用场景 | Vercel / Netlify 等托管平台 + 国内 CDN |

这套方案我实测跑通了：Vercel 托管的博客后台，套上 EdgeOne 后国内访问流畅，登录、编辑全部正常。如果国内访问 Vercel 应用慢，值得一试。
