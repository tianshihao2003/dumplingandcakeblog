---
title: 使用宝塔面板部署 AstrBot 与 NapCat 实现 QQ 机器人
published: 2026-07-25
tags:
  - 总结
  - 转载
image: https://img.tsh520.cn/file/blog/post-covers/tech-17-bt-astrbot-napcat-qq.webp
description: ""
---
此文章转载为这位大佬：[THW](https://blog.tianhw.top/posts/bt-astrbot-napcat/#%E7%99%BB%E5%BD%95-astrbot)
![697](https://img.tsh520.cn/file/blog/article/astrbot.webp)

> [!note] Note
> NOTE
> 
> 本文是特指在宝塔面板 11，使用 Docker 容器部署 AstrBot 和 NapCat 以实现接入个人 QQ 号的教程。

> [!note] Note
> WARNING
> 
> 您在部署前应该知晓通过 NapCat 接入 QQ 存在触发腾讯风控机制的风险，请谨慎操作。

## 介绍

### AstrBot

[AstrBot](https://github.com/Soulter/AstrBot) 是一个开源、模块化的一站式 Agentic 聊天机器人平台，支持灵活构建 AI 伴侣、智能客服或企业知识库系统。其核心特性包括：

- **强大的 Agentic 能力** ：支持多轮工具调用、沙盒代码执行、实时网页搜索，可处理复杂任务；
- **多模型 LLM 引擎** ：兼容主流大语言模型，支持多模态输入、人设定制与原生知识库；
- **跨平台部署** ：一键接入 QQ、微信公众号、飞书、Telegram、Discord 等主流消息平台；
- **可视化管理界面** ：提供 WebUI 用于插件管理、对话监控与系统配置。

### NapCat

[NapCat](https://github.com/mlikiowa/napcat-docker) 是一个基于 TypeScript 开发的 OneBot 协议实现框架，通过调用 QQ 客户端底层接口，将 HTTP/WebSocket 请求标准化为 OneBot v11 协议格式，从而实现 Bot 功能。它本身不包含业务逻辑，仅作为消息通道层。

### 协作关系

AstrBot 与 NapCat 通过 **OneBot v11 协议** 协同工作：

- **NapCat** 负责与 QQ 客户端通信，充当“耳朵”（接收消息）和“嘴巴”（发送消息）；
- **AstrBot** 作为智能中枢，处理消息逻辑、调用 AI 模型并生成回复，是机器人的“大脑”。

二者通过 WebSocket 建立连接，方可实现完整功能闭环。

![](https://img.tsh520.cn/file/blog/article/file-20260725030657784.png)

## 部署

### AstrBot

1. 登录你的宝塔面板，进入 **Docker → 容器** 页面；
2. 点击 **创建容器** ，填写以下参数：
	| 参数 | 值 |
	| --- | --- |
	| 容器名称 | `astrbot` （可自定义） |
	| 镜像 | `soulter/astrbot:latest` |
	| 端口映射 | `6199:6199` （反向 WS） `6185:6185` （WebUI） |
3. 点击 **创建** ，等待容器启动完成。

![AstrBot 容器创建](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_22-37-39.webp)

### NapCat

1. 返回容器列表，再次点击 **创建容器** ；
2. 填写参数如下：
	| 参数 | 值 |
	| --- | --- |
	| 容器名称 | `napcat` |
	| 镜像 | `mlikiowa/napcat-docker:latest` |
	| 端口映射 | `3000:3000` `3001:3001` `6099:6099` （WebUI） |
3. 再次点击创建并等待启动。

## 配置

### 配置 NapCat 并登录 QQ

1. 在容器列表中找到 `napcat` ，点击 **更多 → 日志** ；
	![查看 NapCat 日志](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_22-48-22.webp)
2. 查找日志中的 `WebUI Token` ；
	![获取 WebUI Token](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_22-50-11.webp)
3. 浏览器访问 `http://<服务器IP>:6099` ，输入 Token 登录；
4. 使用手机 QQ 或 TIM 扫描二维码完成账号登录。
	![NapCat WebUI 登录](https://img.tsh520.cn/file/blog/article/1.webp)

### 登录 AstrBot

1. 浏览器访问 `http://<服务器IP>:6185` ，会来到 AstrBot 的登录页面，默认密码账户均为 “astrbot”；
2. 登录后会提示修改密码，设置好后须使用新账户密码重新登录一次。

### 建立容器间网络互通

由于 AstrBot 与 NapCat 分属独立容器，默认网络隔离，无法直接通信。需将其加入同一自定义 Docker 网络：

1. 进入 **Docker → 网络** ，点击 **添加网络** ；
	- 网络名称： `astrbot-napcat`
	![添加自定义网络](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_22-57-03.webp)
2. 返回 **容器** 页面，对 `napcat` 和 `astrbot` 容器分别执行：
	- 点击 **管理 → 容器网络 → 加入网络**
		- 选择 `astrbot-napcat`
		- **退出默认网络**
	![加入网络](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_22-59-54.webp)
3. 记录 `astrbot` 容器在 `astrbot-napcat` 网络中的 IPv4 地址。
	![获取 AstrBot IP](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_23-01-11.webp)

### 配置 NapCat 的 WebSocket 客户端

1. 在 NapCat WebUI 中，进入 **网络配置 → 新建 → WebSocket 客户端** ；
2. 填写如下参数：
	| 字段 | 值 |
	| --- | --- |
	| 启用 | ✅ 勾选 |
	| URL | `ws://<astrbot容器IP>:6199/ws` |
	| 消息格式 | `Array` |
	| 心跳间隔 (ms) | `5000` |
	| 重连间隔 (ms) | `5000` |
	| Token | （可选，若 AstrBot 设置了则需一致） |
	![新建 WebSocket 客户端](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_23-02-34.webp)
3. 点击 **保存** 。

### 配置 AstrBot 的 OneBot 适配器

1. 访问 AstrBot WebUI（ `http://<服务器IP>:6185` ）；
2. 进入左侧 **机器人 → 创建机器人** ；
3. 选择 **OneBot v11** 类型；
4. 填写配置：
	| 字段 | 值 |
	| --- | --- |
	| ID | 随意 |
	| 启用 | ✅ 勾选 |
	| 反向 WebSocket 主机地址 | `<astrbot容器IP>` |
	| 反向 WebSocket 端口 | `6199` |
	| Token | （如果没有设置就不用填） |
	![配置 OneBot v11](https://img.tsh520.cn/file/blog/article/Snipaste_2026-01-24_23-06-31.webp)
5. 点击 **保存** 。

## 大功告成

在 AstrBot WebUI 的 **机器人** 页面下方的“平台日志”中，若出现以下日志：

```plaintext
aiocqhttp(OneBot v11) 适配器已连接。
```

则表明 AstrBot 与 NapCat 已成功建立通信，即可开始在 AstrBot 上配置你的 QQ 机器人了。