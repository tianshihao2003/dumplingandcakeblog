---
title: Waline 部署教程：云服务器篇
published: 2026-07-27
image: https://img.tsh520.cn/file/blog/post-covers/tech-13-waline-deploy-baota.webp
order: 2
tags:
  - 宝塔面板
  - Waline
  - 教程
description: 介绍Waline如何从 Vercel 迁移到腾讯云服务器。
---


> 本教程记录了将 Waline 评论系统从 Vercel 迁移到腾讯云服务器的完整过程，使用宝塔面板 + Docker 部署，基于 SQLite 数据库。
>
> 适用场景：Vercel 数据库额度用完、想自建服务、需要更灵活的配置。

---

## 目录

- [一、环境准备](#一环境准备)
- [二、安装宝塔面板](#二安装宝塔面板)
- [三、安装 Docker](#三安装-docker)
- [四、部署 Waline](#四部署-waline)
- [五、手动创建数据库表](#五手动创建数据库表)
- [六、配置 Nginx 反向代理](#六配置-nginx-反向代理)
- [七、配置 SSL 证书（HTTPS）](#七配置-ssl-证书https)
- [八、注册管理员账号](#八注册管理员账号)
- [九、配置邮件服务（可选）](#九配置邮件服务可选)
- [十、环境变量参考](#十环境变量参考)
- [十一、常用维护命令](#十一常用维护命令)
- [十二、常见问题排查](#十二常见问题排查)

---

## 一、环境准备

### 1.1 服务器要求

| 项目 | 最低要求 |
|------|---------|
| CPU | 1 核 |
| 内存 | 1 GB |
| 带宽 | 1 Mbps（评论系统数据量小，够用） |
| 系统 | Ubuntu 22.04 / CentOS 7+ / OpenCloudOS |

### 1.2 腾讯云安全组 / 防火墙放行端口

在腾讯云控制台 → 防火墙 / 安全组，放行以下端口：

| 端口 | 用途 |
|------|------|
| 22 | SSH 远程连接 |
| 80 | HTTP |
| 443 | HTTPS |
| 8888 | 宝塔面板 |

> ⚠️ Waline 服务端口 8360 不需要对外开放，通过 Nginx 反向代理即可。

### 1.3 域名解析

将你的域名（如 `waline.tsh520.cn`）A 记录指向服务器公网 IP。

---

## 二、安装宝塔面板

SSH 连接服务器后执行：

```bash
# Ubuntu / Debian
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# CentOS
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh

# OpenCloudOS（与 CentOS 兼容）
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh
```

安装完成后会显示：

- **面板地址**：`http://你的公网IP:8888/安全入口`
- **用户名** 和 **密码**

> ⚠️ 务必保存好用户名和密码！

首次登录面板后，会提示安装 LNMP 环境套件，**点击「跳过」**——Waline 是 Node.js 项目，不需要 PHP。

---

## 三、安装 Docker

### 方式一：宝塔面板安装（推荐）

宝塔面板 → **软件商店** → 搜索 **Docker管理器** → 安装

### 方式二：手动安装

```bash
# Ubuntu / Debian
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# CentOS / OpenCloudOS
yum install -y docker
systemctl start docker
systemctl enable docker
```

验证安装：

```bash
docker --version
```

---

## 四、部署 Waline

### 4.1 创建目录

```bash
mkdir -p /opt/waline/data
```

### 4.2 创建 docker-compose.yml

```bash
cat > /opt/waline/docker-compose.yml << 'EOF'
version: '3'

services:
  waline:
    container_name: waline
    image: lizheming/waline:latest
    restart: always
    ports:
      - "127.0.0.1:8360:8360"
    volumes:
      - ./data:/app/data
    environment:
      TZ: 'Asia/Shanghai'
      SQLITE_PATH: '/app/data'
      JWT_TOKEN: '替换为你的密钥'
      SITE_NAME: '你的网站名称'
      SITE_URL: 'https://你的域名'
      SECURE_DOMAINS: '你的域名'
      AUTHOR_EMAIL: '你的邮箱'
EOF
```

> ⚠️ 请将以上 `JWT_TOKEN`、`SITE_NAME`、`SITE_URL`、`SECURE_DOMAINS`、`AUTHOR_EMAIL` 替换为你自己的值。

**配置说明：**

| 变量 | 说明 | 示例 |
|------|------|------|
| `JWT_TOKEN` | JWT 密钥，用于加密 token，建议用复杂字符串 | `mySecretKey123!@#` |
| `SITE_NAME` | 网站名称 | `团子和蛋糕` |
| `SITE_URL` | 网站地址（带 https） | `https://waline.tsh520.cn` |
| `SECURE_DOMAINS` | 允许的域名（防止跨站请求） | `waline.tsh520.cn` | 
<!-- SECURE_DOMAINS: 'waline.tsh520.cn,blog.tsh520.cn' -->
| `AUTHOR_EMAIL` | 博主邮箱（用于接收评论通知） | `your@email.com` |
| `SQLITE_PATH` | SQLite 数据库存储路径 | `/app/data` |

### 4.3 启动容器

```bash
cd /opt/waline && docker compose up -d
```

### 4.4 验证运行

```bash
# 查看容器状态
docker ps

# 测试服务是否响应
curl http://127.0.0.1:8360
```

正常情况下应返回 HTML 页面内容。

---

## 五、手动创建数据库表

Waline 使用 SQLite 数据库时，表可能不会自动创建，需要手动建表。

### 5.1 进入容器

```bash
docker exec -it waline sh
```

### 5.2 安装 sqlite3

容器基于 Debian 系统，使用 apt 安装：

```bash
apt-get update && apt-get install -y sqlite3
```

### 5.3 创建数据表

```bash
sqlite3 /app/data/waline.sqlite "
CREATE TABLE IF NOT EXISTS wl_comment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT NULL,
  comment TEXT,
  insertedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip TEXT DEFAULT '',
  link TEXT DEFAULT NULL,
  mail TEXT DEFAULT NULL,
  nick TEXT DEFAULT NULL,
  pid INTEGER DEFAULT NULL,
  rid INTEGER DEFAULT NULL,
  sticky INTEGER DEFAULT NULL,
  status TEXT NOT NULL DEFAULT '',
  \"like\" INTEGER DEFAULT NULL,
  ua TEXT,
  url TEXT DEFAULT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wl_counter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time INTEGER DEFAULT NULL,
  reaction0 INTEGER DEFAULT NULL,
  reaction1 INTEGER DEFAULT NULL,
  reaction2 INTEGER DEFAULT NULL,
  reaction3 INTEGER DEFAULT NULL,
  reaction4 INTEGER DEFAULT NULL,
  reaction5 INTEGER DEFAULT NULL,
  reaction6 INTEGER DEFAULT NULL,
  reaction7 INTEGER DEFAULT NULL,
  reaction8 INTEGER DEFAULT NULL,
  url TEXT NOT NULL DEFAULT '',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wl_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  label TEXT DEFAULT NULL,
  url TEXT DEFAULT NULL,
  avatar TEXT DEFAULT NULL,
  github TEXT DEFAULT NULL,
  twitter TEXT DEFAULT NULL,
  facebook TEXT DEFAULT NULL,
  google TEXT DEFAULT NULL,
  weibo TEXT DEFAULT NULL,
  qq TEXT DEFAULT NULL,
  oidc TEXT DEFAULT NULL,
  huawei TEXT DEFAULT NULL,
  \"2fa\" TEXT DEFAULT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
"
```

### 5.4 退出容器并重启

```bash
exit
docker restart waline
```

> **关于这三张表：**
> - `wl_comment`：存储评论数据
> - `wl_counter`：存储文章访问计数
> - `wl_users`：存储用户信息（管理员、评论者）
>
> 表名必须是小写：`wl_comment`、`wl_counter`、`wl_users`，不能写成 `wl_Comment` 或 `wl_User`。

---

## 六、配置 Nginx 反向代理

### 6.1 安装 Nginx

宝塔面板 → **软件商店** → 搜索 **Nginx** → 安装

### 6.2 添加站点

宝塔面板 → **网站** → **添加站点**

- **域名**：填你的域名，如 `waline.tsh520.cn`
- **PHP 版本**：选择 **纯静态**

### 6.3 配置反向代理

点击站点 → **设置** → **反向代理** → **添加反向代理**

| 配置项 | 值 |
|--------|-----|
| 代理名称 | `waline` |
| 目标URL | `http://127.0.0.1:8360` |
| 发送域名 | `$host` |

### 6.4 编辑反向代理配置

点击反向代理的 **编辑** 按钮，将配置替换为以下内容：

```nginx
#PROXY-START/

location ^~ /
{
    # CORS 预检请求处理
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Methods' 'GET,POST,PUT,DELETE,OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type' always;
        add_header 'Access-Control-Max-Age' 1728000 always;
        add_header 'Content-Length' 0;
        return 204;
    }

    proxy_pass http://127.0.0.1:8360;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_http_version 1.1;

    add_header X-Cache $upstream_cache_status;
    add_header 'Access-Control-Allow-Origin' '$http_origin' always;
    add_header 'Access-Control-Allow-Methods' 'GET,POST,PUT,DELETE,OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type' always;

    set $static_filew6OwwKmG 0;
    if ( $uri ~* "\.(gif|png|jpg|css|js|woff|woff2)$" )
    {
        set $static_filew6OwwKmG 1;
        expires 1m;
    }
    if ( $static_filew6OwwKmG = 0 )
    {
        add_header Cache-Control no-cache;
    }
}

#PROXY-END/
```

> **为什么要加 CORS 配置？**
>
> Waline 管理后台（`/ui/register`、`/ui/login`）会通过 JavaScript 发送 POST 请求到 API 接口。浏览器会先发送 `OPTIONS` 预检请求，如果 Nginx 没有正确处理 CORS，浏览器会拦截请求，导致注册/登录时提示 "NetworkError when attempting to fetch resource" 或 "Failed to fetch"。

保存后在服务器上重载 Nginx：

```bash
nginx -t && nginx -s reload
```

---

## 七、配置 SSL 证书（HTTPS）

### 7.1 申请免费证书

站点设置 → **SSL** → **Let's Encrypt**

- 选择 **文件验证**
- 点击 **申请**

### 7.2 开启强制 HTTPS

申请成功后，勾选 **强制 HTTPS**。

---

## 八、注册管理员账号

### 8.1 方式一：浏览器注册

访问 `https://你的域名/ui/register`，填写邮箱和密码注册。

第一个注册的用户自动成为 **管理员**。

### 8.2 方式二：命令行注册（如果浏览器注册失败）

```bash
curl -X POST https://你的域名/api/user \
  -H "Content-Type: application/json" \
  -H "Referer: https://你的域名/ui/register" \
  -H "Origin: https://你的域名" \
  -d '{"email":"你的邮箱","password":"你的密码","display_name":"你的昵称"}'
```

返回 `{"errno":0,"errmsg":"","data":""}` 表示注册成功。

### 8.3 登录管理后台

访问 `https://你的域名/ui/login`，用刚才注册的邮箱和密码登录。

---

## 九、配置邮件服务（可选）

配置邮件服务后可以实现：
- 用户注册时发送验证邮件
- 评论通知博主
- 忘记密码时重置密码

### 9.1 以 QQ 邮箱为例

**第一步：获取 QQ 邮箱授权码**

1. 登录 [QQ 邮箱](https://mail.qq.com)
2. **设置** → **账户** → 往下翻找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
3. 开启 **IMAP/SMTP服务**
4. 按提示用手机发短信验证，获取一个 **16位授权码**

> ⚠️ 授权码不是 QQ 密码！务必保存好。

**第二步：修改 docker-compose.yml**

编辑 `/opt/waline/docker-compose.yml`，在 `environment` 中添加：

```yaml
      # 邮件配置
      SMTP_SERVICE: 'QQ'
      SMTP_USER: '你的QQ邮箱'
      SMTP_PASS: '你的16位授权码'
      SENDER_EMAIL: '你的QQ邮箱'
      SENDER_NAME: '你的网站名称'
```

**第三步：重启容器**

```bash
cd /opt/waline && docker compose up -d
```

### 9.2 其他邮箱服务商

| 服务商 | SMTP_SERVICE | SMTP_HOST | SMTP_PORT |
|--------|-------------|-----------|-----------|
| QQ 邮箱 | `QQ` | `smtp.qq.com` | 465 |
| 163 邮箱 | `163` | `smtp.163.com` | 465 |
| Gmail | `Gmail` | `smtp.gmail.com` | 465 |
| Outlook | `Outlook` | `smtp.office365.com` | 587 |

如果服务商不在预设列表中，使用 `SMTP_HOST` + `SMTP_PORT` + `SMTP_SECURE` 代替 `SMTP_SERVICE`：

```yaml
      SMTP_HOST: 'smtp.example.com'
      SMTP_PORT: '465'
      SMTP_SECURE: 'true'
      SMTP_USER: 'your@email.com'
      SMTP_PASS: 'your-password'
```

---

## 十、环境变量参考

### 基础配置

| 变量 | 说明 | 必填 |
|------|------|------|
| `JWT_TOKEN` | JWT 加密密钥 | ✅ |
| `SITE_NAME` | 网站名称 | ✅ |
| `SITE_URL` | 网站地址 | ✅ |
| `SECURE_DOMAINS` | 允许的域名 | ❌ |
| `AUTHOR_EMAIL` | 博主邮箱 | ❌ |
| `SQLITE_PATH` | SQLite 存储路径 | ✅（SQLite 模式） |

### 数据库配置

Waline 支持多种数据库，按优先级（环境变量存在即启用）：

| 数据库 | 环境变量 |
|--------|---------|
| LeanCloud | `LEAN_KEY` |
| MongoDB | `MONGO_DB` / `MONGO_HOST` |
| PostgreSQL | `PG_DB` / `PG_HOST` |
| SQLite | `SQLITE_PATH` |
| MySQL | `MYSQL_DB` / `MYSQL_HOST` |
| TiDB | `TIDB_DB` / `TIDB_HOST` |
| GitHub | `GITHUB_TOKEN` |
| 腾讯云 CloudBase | `TCB_ENV` |

### 邮件配置

| 变量 | 说明 |
|------|------|
| `SMTP_SERVICE` | 邮箱服务商（自动配置 host/port） |
| `SMTP_HOST` | SMTP 服务器地址 |
| `SMTP_PORT` | SMTP 端口 |
| `SMTP_SECURE` | 是否 SSL（`true`/`false`） |
| `SMTP_USER` | 登录用户名 |
| `SMTP_PASS` | 密码或授权码 |
| `SENDER_EMAIL` | 发件人地址 |
| `SENDER_NAME` | 发件人名称 |

### 通知服务

| 变量 | 说明 |
|------|------|
| `SC_KEY` | Server酱（微信通知） |
| `TG_BOT_TOKEN` | Telegram Bot Token |
| `TG_CHAT_ID` | Telegram Chat ID |
| `QYWX_AM` | 企业微信应用 |
| `PUSH_PLUS_KEY` | PushPlus（微信通知） |
| `DISCORD_WEBHOOK` | Discord Webhook |
| `LARK_WEBHOOK` | 飞书 Webhook |
| `LARK_SECRET` | 飞书签名密钥 |
| `QMSG_KEY` | QQ 消息推送 |

### 安全配置

| 变量 | 说明 |
|------|------|
| `RECAPTCHA_V3_SECRET` | Google reCAPTCHA V3 |
| `TURNSTILE_SECRET` | Cloudflare Turnstile |

### 其他配置

| 变量 | 说明 |
|------|------|
| `DISABLE_AUTHOR_NOTIFY` | 禁用博主通知 |
| `AVATAR_PROXY` | 头像代理地址 |

---

## 十一、常用维护命令

### 容器管理

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs waline
docker logs waline --tail 100       # 最近 100 行

# 重启容器
docker restart waline

# 停止容器
docker stop waline

# 启动容器
docker start waline
```

### 更新 Waline 版本

```bash
cd /opt/waline
docker compose pull                  # 拉取最新镜像
docker compose up -d                 # 重建容器
```

### 数据备份

```bash
# 备份 SQLite 数据库
cp /opt/waline/data/waline.sqlite /opt/waline/backup/waline-$(date +%Y%m%d).sqlite

# 创建自动备份脚本
cat > /opt/waline/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/waline/backup"
mkdir -p $BACKUP_DIR
cp /opt/waline/data/waline.sqlite $BACKUP_DIR/waline-$(date +%Y%m%d_%H%M%S).sqlite
# 保留最近 30 天的备份
find $BACKUP_DIR -name "*.sqlite" -mtime +30 -delete
EOF

chmod +x /opt/waline/backup.sh

# 添加定时任务（每天凌晨 3 点备份）
echo "0 3 * * * /opt/waline/backup.sh" | crontab -
```

### Nginx 管理

```bash
# 测试配置
nginx -t

# 重载配置
nginx -s reload

# 查看错误日志
tail -f /www/wwwlogs/waline.tsh520.cn.error.log
```

### 添加 / 修改环境变量

```bash
# 1. 编辑配置文件
vi /opt/waline/docker-compose.yml

# 2. 在 environment 下添加新变量
#    格式：变量名: '值'

# 3. 重启容器
cd /opt/waline && docker compose up -d

# 4. 验证变量是否生效
docker exec waline env | grep 变量名
```

---

## 十二、常见问题排查

### 12.1 评论时提示 "no such table: wl_Comment"

**原因**：数据库表未创建或表名大小写不对。

**解决**：按本文第五节手动创建数据库表。注意表名必须是小写：`wl_comment`、`wl_users`、`wl_counter`。

### 12.2 注册时提示 "NetworkError when attempting to fetch resource" 或 "Failed to fetch"

**原因**：Nginx 反向代理没有正确处理 CORS（跨域请求）。

**解决**：按本文第六节编辑反向代理配置，添加 CORS 处理。

### 12.3 注册时返回 `{"errno":403,"errmsg":"Forbidden"}`

**原因**：请求缺少 `Referer` 或 `Origin` 头，Waline 的安全检查拒绝了请求。

**解决**：
- 浏览器访问应该自动带 Referer，检查是否被浏览器插件拦截
- 命令行注册需要手动添加头：
  ```bash
  -H "Referer: https://你的域名/ui/register"
  -H "Origin: https://你的域名"
  ```

### 12.4 重置密码邮件发送失败

**原因**：未配置邮件服务。

**解决**：按本文第九节配置 SMTP 环境变量。

### 12.5 容器启动失败

```bash
# 查看详细错误
docker logs waline

# 检查端口是否被占用
netstat -tlnp | grep 8360
```

### 12.6 如何切换到 MySQL / PostgreSQL

修改 `docker-compose.yml`，去掉 `SQLITE_PATH`，添加数据库连接信息：

**MySQL 示例：**
```yaml
      MYSQL_HOST: '你的数据库地址'
      MYSQL_PORT: '3306'
      MYSQL_DB: 'waline'
      MYSQL_USER: '用户名'
      MYSQL_PASSWORD: '密码'
```

**PostgreSQL 示例：**
```yaml
      PG_HOST: '你的数据库地址'
      PG_PORT: '5432'
      PG_DB: 'waline'
      PG_USER: '用户名'
      PG_PASSWORD: '密码'
```

> ⚠️ 切换数据库后，评论数据不会自动迁移。需要手动导出再导入。

---

## 完整 docker-compose.yml 示例

```yaml
version: '3'

services:
  waline:
    container_name: waline
    image: lizheming/waline:latest
    restart: always
    ports:
      - "127.0.0.1:8360:8360"
    volumes:
      - ./data:/app/data
    environment:
      TZ: 'Asia/Shanghai'
      SQLITE_PATH: '/app/data'
      JWT_TOKEN: '你的JWT密钥'
      SITE_NAME: '你的网站名称'
      SITE_URL: 'https://你的域名'
      SECURE_DOMAINS: '你的域名'
      AUTHOR_EMAIL: '你的邮箱'
      # 邮件通知（可选）
      SMTP_SERVICE: 'QQ'
      SMTP_USER: '你的QQ邮箱'
      SMTP_PASS: '你的16位授权码'
      SENDER_EMAIL: '你的QQ邮箱'
      SENDER_NAME: '你的网站名称'
      # 微信通知（可选，二选一）
      # SC_KEY: '你的Server酱Key'
      # PUSH_PLUS_KEY: '你的PushPlus Key'
      # Telegram 通知（可选）
      # TG_BOT_TOKEN: '你的Bot Token'
      # TG_CHAT_ID: '你的Chat ID'
```

---

## 参考链接

- [Waline 官方文档](https://waline.js.org/)
- [Waline GitHub 仓库](https://github.com/walinejs/waline)
- [Waline 环境变量说明](https://waline.js.org/en/guide/deploy/env.html)
- [宝塔面板官网](https://www.bt.cn/)
