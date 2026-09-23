---
title: Waline 评论系统自动备份到 GitHub
published: 2026-07-27
image: https://img.tsh520.cn/file/blog/post-covers/tech-11-waline-backup.webp
order: 1
tags:
  - Waline
  - 脚本
description: 介绍如何给 Waline 评论系统加一个自动备份到 GitHub 的脚本
---

> 数据库只有一个 SQLite 文件，丢了就真没了。写个脚本每天自动备份到 GitHub 私有仓库，安心。

## 背景

Waline 默认使用 SQLite 存储数据，整个数据库就是一个 `waline.sqlite` 文件。好处是轻量、不需要额外装数据库；坏处是文件丢了就什么都没了。

虽然服务器有快照功能，但快照是整个系统的，恢复起来太重。不如写个脚本，每天把关键文件打包推到 GitHub，恢复的时候一条命令搞定。

## 思路

1. 把 `data/` 目录（SQLite 数据库）和 `docker-compose.yml` 打包成 `.tar.gz`
2. 推送到 GitHub 私有仓库
3. 用 crontab 每天凌晨 3 点自动执行
4. 本地只保留最近 7 份，GitHub 保留 30 天

## 准备工作

### 创建 GitHub 私有仓库

去 [GitHub](https://github.com/new) 新建一个仓库，**一定要选 Private**。名字随意，比如 `waline-backup`。

### 生成 GitHub Token

1. 打开 [GitHub Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. 点 **Generate new token**
3. Repository access 选 **Only select repositories**，勾选刚创建的仓库
4. Repository permissions → **Contents** → 选 **Read and write**
5. 生成并保存 Token

> ⚠️ Token 只会显示一次，务必保存好。如果泄露了，立刻去 GitHub 撤销。

## 备份脚本

```bash
#!/bin/bash
WALINE_DIR="/opt/waline"
BACKUP_DIR="/opt/waline/backup"
GITHUB_USER="你的GitHub用户名"
GITHUB_REPO="waline-backup"
GITHUB_TOKEN="你的GitHub Token"
KEEP_DAYS=30

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "========== Waline 备份开始 =========="
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

# 首次运行：初始化 Git 仓库
if [ ! -d ".git" ]; then
    git init
    git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git"
    git config user.email "backup@waline.local"
    git config user.name "Waline Backup"
    git branch -m master main
fi

# 拉取远程最新
git fetch origin main 2>/dev/null
git reset --soft origin/main 2>/dev/null

# 打包
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="waline-backup-${TIMESTAMP}.tar.gz"

log "正在打包..."
tar czf "$BACKUP_FILE" -C "$WALINE_DIR" data docker-compose.yml 2>/dev/null

if [ $? -ne 0 ]; then
    log "打包失败！"
    exit 1
fi

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log "打包完成：${BACKUP_FILE} (${FILE_SIZE})"

# 清理旧备份
find "$BACKUP_DIR" -name "waline-backup-*.tar.gz" -mtime +${KEEP_DAYS} -delete

# 推送到 GitHub
git add -A
git commit -m "backup: ${TIMESTAMP}"
log "正在推送到 GitHub..."
git push origin main 2>&1

if [ $? -eq 0 ]; then
    log "推送成功！"
else
    log "推送失败！"
    exit 1
fi

# 本地只保留最近 7 个
ls -t waline-backup-*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm -f

log "========== Waline 备份完成 =========="
```

把 `GITHUB_USER` 和 `GITHUB_TOKEN` 换成你自己的，保存为 `/opt/waline/backup.sh`。

## 部署

```bash
# 保存脚本
vi /opt/waline/backup.sh
# 粘贴上面的脚本内容，保存退出

# 设置执行权限
chmod +x /opt/waline/backup.sh

# 手动测试一次
/opt/waline/backup.sh
```

看到 `推送成功！` 就说明没问题了。然后添加定时任务：

```bash
# 添加到 crontab（每天凌晨 3 点执行）
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/waline/backup.sh >> /opt/waline/backup/backup.log 2>&1") | crontab -

# 确认
crontab -l
```

## 在新服务器上恢复部署

服务器到期、迁移、或者挂了，都需要在新机器上恢复。下面是完整的恢复流程。

### 前提条件

- 一台新的服务器（腾讯云、阿里云都行）
- 域名 DNS 已指向新服务器 IP
- GitHub 备份仓库中有最近的备份

### 第一步：安装宝塔面板

```bash
# Ubuntu / Debian
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# CentOS
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh
```

登录宝塔面板，跳过 LNMP 套件安装。

### 第二步：安装 Docker

宝塔面板 → 软件商店 → 搜索「Docker管理器」→ 安装。

或者手动安装：

```bash
curl -fsSL https://get.docker.com | sh
systemctl start docker && systemctl enable docker
```

### 第三步：拉取备份并恢复

```bash
# 克隆备份仓库
mkdir -p /opt/waline
git clone https://你的Token@github.com/你的用户名/waline-backup.git /opt/waline/backup

# 找到最新的备份文件
ls -t /opt/waline/backup/waline-backup-*.tar.gz | head -1

# 解压到 /opt/waline
cd /opt/waline
tar xzf backup/waline-backup-$(date +%Y%m%d)*.tar.gz
# 如果上面找不到文件，用这个（自动选最新的）：
# tar xzf backup/$(ls -t backup/waline-backup-*.tar.gz | head -1)
```

解压后目录结构应该是：

```
/opt/waline/
├── data/
│   └── waline.sqlite        # 数据库（所有评论、用户数据都在这里）
├── docker-compose.yml        # 容器配置
└── backup/                   # 备份目录
```

### 第四步：启动 Waline

```bash
cd /opt/waline
docker compose up -d
```

验证：

```bash
docker ps                                    # 容器应该在运行
curl http://127.0.0.1:8360                   # 应该返回 HTML
```

### 第五步：配置 Nginx 反向代理

1. 宝塔 → 软件商店 → 安装 Nginx
2. 网站 → 添加站点 → 填域名（如 `waline.你的域名`），PHP 选「纯静态」
3. 点击站点 → 设置 → 反向代理 → 添加反向代理：
   - 代理名称：`waline`
   - 目标 URL：`http://127.0.0.1:8360`
   - 发送域名：`$host`
4. 编辑反向代理配置，加上 CORS 处理（否则浏览器注册/登录会报错）：

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

保存后重载 Nginx：

```bash
nginx -t && nginx -s reload
```

### 第六步：申请 SSL 证书

站点设置 → SSL → Let's Encrypt → 申请 → 勾选「强制 HTTPS」。

### 第七步：验证评论系统正常

访问 `https://waline.你的域名`，确认：

- 页面能正常加载
- 能看到之前的评论数据（因为 SQLite 数据库恢复了）
- 能发新评论

### 第八步：重新配置自动备份

```bash
# 把备份脚本也恢复过去
chmod +x /opt/waline/backup.sh

# 替换 GitHub Token（如果需要）
vi /opt/waline/backup.sh

# 测试备份
/opt/waline/backup.sh

# 添加定时任务
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/waline/backup.sh >> /opt/waline/backup/backup.log 2>&1") | crontab -
```

### 完整恢复命令汇总

如果你对 Linux 比较熟悉，可以把上面的步骤浓缩成几条命令：

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl start docker && systemctl enable docker

# 2. 拉取备份
mkdir -p /opt/waline
git clone https://TOKEN@github.com/USER/waline-backup.git /opt/waline/backup

# 3. 解压
cd /opt/waline
tar xzf backup/$(ls -t backup/waline-backup-*.tar.gz | head -1)

# 4. 启动
docker compose up -d

# 5. 恢复备份脚本和定时任务
chmod +x /opt/waline/backup.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/waline/backup.sh >> /opt/waline/backup/backup.log 2>&1") | crontab -
```

然后去宝塔配 Nginx 和 SSL 就行。

> 💡 整个恢复过程大概 10-15 分钟，其中大部分时间花在等宝塔和 Docker 安装上。数据恢复本身只需要几秒钟。

## 踩坑记录

### Git 默认分支是 master

服务器上的 Git 默认创建 `master` 分支，但 GitHub 新仓库默认是 `main`。脚本里加了 `git branch -m master main` 解决。如果已经初始化了 master，手动执行一下：

```bash
cd /opt/waline/backup
git branch -m master main
git push -u origin main
```

### Token 安全

Token 直接写在脚本里不是最佳实践，但因为脚本在自己服务器上、仓库是私有的，风险可控。如果介意，可以用环境变量或者 GitHub App 的方式认证。

## 备份策略

| 位置 | 保留数量 | 说明 |
|------|---------|------|
| 服务器本地 | 最近 7 份 | 节省磁盘空间 |
| GitHub 私有仓库 | 30 天 | 主备份，自动清理旧文件 |
| 手动备份 | 不定期 | 重大更新前手动备份一次 |

## 最后

Waline 的数据就是一个 SQLite 文件，备份起来非常简单。与其依赖外部服务的免费额度，不如花 5 分钟写个脚本，数据掌握在自己手里才踏实。

脚本写好之后基本不用管，每天自动跑。偶尔去 GitHub 看一眼，确认备份在正常推送就行。
