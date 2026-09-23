---
title: Meting-API 部署服务器指南
published: 2026-07-26
image: https://img.tsh520.cn/file/blog/post-covers/tech-06-meting-api-deploy.webp
order: 2
tags:
  - 宝塔面板
  - 音乐
  - 教程
description: 介绍如何利用 宝塔面板 Docker 部署Meting-API。
---


> 基于 [@meting/core](https://www.npmjs.com/package/@meting/core) 的多平台音乐 API 代理服务，支持网易云、QQ音乐、酷狗、百度、酷我。

## 前置条件

- Linux 服务器（本文以 OpenCloudOS 为例）
- 宝塔面板已安装
- Docker 已安装（宝塔面板 → 软件商店 → Docker管理器）
- 域名（可选，用于绑定域名访问）

## 一、克隆项目

SSH 连接服务器，执行以下命令：

```bash
# 进入网站目录
cd /www/wwwroot

# 克隆项目
git clone https://github.com/tianshihao2003/Meting-API.git
# 进入项目目录
cd Meting-API
```

## 二、构建 Docker 镜像

```bash
docker build -t meting-api .
```

构建成功会显示：

```
=> => naming to docker.io/library/meting-api
```

## 三、运行容器

```bash
docker run -d \
  --name meting-api \
  -p 3003:80 \
  -e METING_URL=http://你的服务器IP:3003 \
  -e METING_TOKEN=你的密钥 \
  --restart always \
  meting-api
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `-d` | 后台运行 |
| `--name meting-api` | 容器名称 |
| `-p 3003:80` | 端口映射（宿主机:容器） |
| `-e METING_URL` | API 服务地址 |
| `-e METING_TOKEN` | 鉴权密钥 |
| `--restart always` | 服务器重启后自动启动容器 |

> **注意：** 如果端口被占用，换一个端口即可（如 3001、3002、3003 等）。

## 四、验证部署

```bash
# 检查容器状态
docker ps | grep meting-api

# 测试 API
curl http://localhost:3003/
```

浏览器访问：

```
http://你的服务器IP:3003/
```

测试搜索功能：

```
http://你的服务器IP:3003/api?server=netease&type=search&id=周杰伦
```

## 五、防火墙放行端口

### 宝塔面板防火墙

宝塔面板 → 安全 → 防火墙 → 添加规则：

- 端口：`3003`
- 协议：`TCP`
- 策略：`允许`

### 腾讯云安全组（如果使用腾讯云）

腾讯云控制台 → 云服务器 → 安全组 → 入站规则 → 添加规则：

- 类型：自定义
- 来源：0.0.0.0/0
- 协议端口：TCP:3003
- 策略：允许

## 六、绑定域名（可选）

### 1. DNS 解析配置

在域名管理平台添加 A 记录：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| A | api | 你的服务器IP |

### 2. 宝塔面板配置反向代理

1. 宝塔面板 → 网站 → 添加站点
2. 填写域名：`api.你的域名.com`，PHP版本选 **纯静态**
3. 点击站点名称 → 反向代理 → 添加反向代理

```
代理名称：meting-api
目标URL：http://127.0.0.1:3003
发送域名：$host
```

### 3. 配置 HTTPS

1. 点击站点名称 → SSL
2. 选择 Let's Encrypt → 申请证书
3. 开启 **强制 HTTPS**

## 七、API 使用说明

### 基础地址

```
http://你的服务器IP:3003/api
# 或绑定域名后
https://api.你的域名.com/api
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `server` | string | 是 | 音乐平台：`netease`/`tencent`/`kugou`/`baidu`/`kuwo` |
| `type` | string | 是 | 操作类型：`search`/`song`/`album`/`artist`/`playlist`/`lrc`/`url`/`pic` |
| `id` | string | 是 | 资源 ID 或搜索关键词 |
| `auth` | string | 条件 | 鉴权令牌（`lrc`/`url`/`pic` 类型需要） |

### 功能示例

**搜索歌曲：**

```bash
curl "http://你的IP:3003/api?server=netease&type=search&id=周杰伦"
```

**获取歌词：**

```bash
curl "http://你的IP:3003/api?server=netease&type=lrc&id=歌曲ID&auth=token"
```

**获取播放链接（302 重定向）：**

```bash
curl -L "http://你的IP:3003/api?server=netease&type=url&id=歌曲ID&auth=token"
```

### 响应格式

**搜索结果示例：**

```json
[
  {
    "title": "歌曲名称",
    "author": "艺术家",
    "url": "http://你的IP:3003/api?server=netease&type=url&id=xxx&auth=xxx",
    "pic": "http://你的IP:3003/api?server=netease&type=pic&id=xxx&auth=xxx",
    "lrc": "http://你的IP:3003/api?server=netease&type=lrc&id=xxx&auth=xxx"
  }
]
```

**歌词格式（LRC）：**

```
[00:00.000] 歌词第一行
[00:05.123] 歌词第二行
```

## 八、常用运维命令

```bash
# 查看容器状态
docker ps | grep meting-api

# 查看实时日志
docker logs -f meting-api

# 重启容器
docker restart meting-api

# 停止容器
docker stop meting-api

# 启动容器
docker start meting-api

# 进入容器终端
docker exec -it meting-api sh

# 删除容器（需先停止）
docker stop meting-api && docker rm meting-api

# 强制删除容器
docker rm -f meting-api
```

## 九、更新版本

```bash
# 进入项目目录
cd /www/wwwroot/Meting-API

# 拉取最新代码
git pull

# 重新构建镜像
docker build -t meting-api .

# 停止并删除旧容器
docker stop meting-api && docker rm meting-api

# 重新运行容器
docker run -d \
  --name meting-api \
  -p 3003:80 \
  -e METING_URL=http://你的服务器IP:3003 \
  -e METING_TOKEN=你的密钥 \
  --restart always \
  meting-api
```

## 十、常见问题

### Q1：端口被占用怎么办？

```bash
# 查看端口占用
netstat -tlnp | grep 3003

# 或者直接换一个端口（如 3001、3002、3004）
```

### Q2：容器删除失败？

```bash
# 强制删除
docker rm -f meting-api

# 如果还是失败，先停止再删除
docker stop meting-api && docker rm meting-api
```

### Q3：API 返回空或错误？

1. 检查容器日志：`docker logs meting-api`
2. 确认防火墙端口已放行
3. 检查环境变量是否正确

### Q4：如何配置 Cookie 提高成功率？

```bash
# 运行容器时添加 Cookie 环境变量
docker run -d \
  --name meting-api \
  -p 3003:80 \
  -e METING_URL=http://你的IP:3003 \
  -e METING_TOKEN=你的密钥 \
  -e METING_COOKIE_NETEASE=你的网易云Cookie \
  -e METING_COOKIE_TENCENT=你的QQ音乐Cookie \
  --restart always \
  meting-api
```

## 参考链接

- [Meting-API GitHub](https://github.com/metowolf/Meting-API)
- [@meting/core](https://www.npmjs.com/package/@meting/core)
- [Hono.js](https://hono.dev/)
- [Docker 官方文档](https://docs.docker.com/)

## 许可证

MIT License
