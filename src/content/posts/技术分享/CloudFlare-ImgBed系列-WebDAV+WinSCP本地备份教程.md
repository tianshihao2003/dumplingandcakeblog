---
title: CloudFlare-ImgBed 系列：WebDAV + WinSCP 本地备份 Telegram 图片
published: 2026-08-08
tags:
  - CloudFlare
  - WebDAV
  - WinSCP
  - Telegram
  - 图床
  - 备份
image: https://img.tsh520.cn/file/blog/post-covers/tech-02-webdav-winscp-backup.webp
description: 图片都存在 Telegram 里，但 Telegram 并不承诺永久保存数据。本教程教你用图床自带的 WebDAV 接口 + WinSCP，把 Telegram 上的图片文件（带目录树）同步回本地硬盘，手动拖一次全量备份，再配一个每周自动同步的计划任务，从此 Telegram 数据丢了也不怕。
---

> 图床系列配套篇：给 CloudFlare-ImgBed 加一道本地保险，Telegram 数据丢了也不怕。

---

# 背景

我的图床（[CloudFlare-ImgBed](/posts/正式版-CloudFlare-ImgBed-博客教程)）把图片全部存在 Telegram 上，靠 Cloudflare 做 CDN 加速访问。好处是零服务器成本、全链路可控，但有一个隐患：

- Telegram 不是存储服务，不承诺永久保存文件
- 账号被封、频道被删、Telegram 服务器清理，图片可能直接消失
- 图片一旦没了，所有引用它的博客文章全部 404，几年的内容瞬间作废

「鸡蛋不能全放在一个篮子里」，所以我把图床上传到 Telegram 的文件定期备份到本地硬盘，实现永久存储。

图床项目自带 WebDAV 接口，把 Telegram 上的文件按目录树暴露出来，目录结构和图片链接完全一致。这意味着我可以用 WinSCP 像访问本地文件夹一样浏览图床文件，然后整个拉回本地。

最终方案：

✅ 手动拖一次，完成全量备份  
✅ 每周自动同步新增文件  
✅ 目录树结构完整保留，恢复方便  
✅ 不删除本地任何文件，备份只会越来越多

---

# 整体架构

```mermaid
flowchart LR
    A[日常上传图片] --> B[Telegram 存储]
    B --> C[图床 WebDAV 接口<br>暴露目录树]
    C -->|WinSCP 手动全量备份| D[本地硬盘]
    C -->|计划任务每周自动同步| D
    D --> E[Telegram 数据丢失也不怕]
```

工作原理：

- 图片上传后存在 Telegram，链接长这样：`https://imgbed.xxx.com/2026/08/08/xxx.jpg`
- WebDAV 接口把存储暴露成同样的目录结构：`/2026/08/08/xxx.jpg`
- 通过 WebDAV 协议，任何支持它的客户端（WinSCP、Windows 资源管理器）都能像浏览文件夹一样浏览和下载

---

# 一、开启图床 WebDAV

WebDAV 是图床项目自带的功能，默认关闭，需要先在后台开启。
![500](https://img.tsh520.cn/file/blog/article/file-20260808143459416.png)

## 1. 登录图床后台

进入：

```text
图床后台
→ 设置
→ WebDAV
```

## 2. 开启开关并设置账号密码

| 配置项 | 内容 |
|---|---|
| 启用 WebDAV | 打开 |
| 用户名 | 自己设置，比如 `backup` |
| 密码 | 自己设置，务必用强密码 |

保存后，WebDAV 地址就是：

```text
https://imgbed.xxx.com/dav
```

> ⚠️ 把 `imgbed.xxx.com` 换成你自己的图床域名。账号密码自己保管好，谁拿到它就能读取你图床的全部文件。

---

# 二、WinSCP 手动连接（首次全量备份）

## 1. 下载安装 WinSCP

到官网下载并安装：

- https://winscp.net

## 2. 新建站点

![528](https://img.tsh520.cn/file/blog/article/file-20260808143709804.png)
打开 WinSCP，点击「新建站点」，填写：

| 配置项 | 内容 |
|---|---|
| 文件协议 | WebDAV/HTTPS |
| 主机名 | `imgbed.xxx.com` |
| 端口号 | `443` |
| 用户名 | 图床后台设置的 WebDAV 用户名 |
| 密码 | 图床后台设置的 WebDAV 密码 |

远程路径填：

```text
/dav
```

点击「保存」，站点名随便起一个，比如 `imgbed-backup`（后面自动化要用的就是这个名字）。

## 3. 登录

点击「登录」，看到的就是图床文件的目录树：
![551](https://img.tsh520.cn/file/blog/article/file-20260808143857196.png)
目录结构和你图片链接的路径完全一致，按日期归类。

## 4. 全量同步到本地

在本地建一个备份目录，比如：

```text
C:\backup\imgbed
```

回到 WinSCP，选中远程根目录 `/`，点菜单「命令 → 同步远程目录」，设置：

| 配置项 | 内容 |
|---|---|
| 方向 | 本地 |
| 本地目录 | `C:\backup\imgbed` |
| 删除文件 | 不要勾选 |

点击「同步」，WinSCP 会把所有文件下载到本地。首次是全量，之后只同步新增的。

> ✅ 至此你就有了一份完整的本地备份。但这只是手动版，接下来配成每周自动跑。

---

# 三、每周自动同步

用 WinSCP 自带的命令行工具 `winscp.com` + Windows 计划任务，实现每周自动备份。

## 1. 确认站点已保存凭据

站点在保存时勾选了「保存密码」，密码会加密存储在 WinSCP 本地（以你的 Windows 账户加密），脚本里不会出现任何明文密码。

## 2. 编写 WinSCP 脚本

新建文件：

```text
C:\backup\winscp-backup.txt
```

内容：

```text
option batch abort
option confirm off
open "imgbed-backup"
synchronize local "C:\backup\imgbed" "/dav"
exit
```

解释一下每一行：

| 命令 | 作用 |
|---|---|
| `option batch abort` | 出错时立即中止脚本，避免静默失败 |
| `option confirm off` | 关闭所有确认弹窗（计划任务里没法点确认） |
| `open "imgbed-backup"` | 打开之前保存的站点，自动使用已保存的凭据 |
| `synchronize local "C:\backup\imgbed" "/dav"` | 把远程 `/dav` 下新增/变更的文件下载到本地 |
| `exit` | 退出 |

> ⚠️ `synchronize` 默认**只下载新增和变更的文件，不会删除本地任何东西**。千万不要加 `-delete` 或 `-mirror` 参数——那两个参数会删除本地不存在的文件，备份目录只增不减才是正确的行为。

## 3. 手动运行一次验证

先手动跑一次，确认脚本没问题：

```text
"C:\Program Files (x86)\WinSCP\WinSCP.com" /script="C:\backup\winscp-backup.txt" /log="C:\backup\winscp-backup.log"
```

> 如果安装的是 64 位版，路径改为 `C:\Program Files\WinSCP\WinSCP.com`，以实际安装路径为准。

运行后检查日志文件：

```text
C:\backup\winscp-backup.log
```

看到 `File or folder ... was transferred successfully` 之类的记录就说明同步成功。

## 4. 创建计划任务

按 `Win + R` 输入 `taskschd.msc` 打开「任务计划程序」，右侧点「创建任务」：

**常规**：

| 配置项 | 内容 |
|---|---|
| 名称 | `ImgBed WebDAV 备份` |
| 使用以下账户运行 | 当前账户（必须是保存 WinSCP 站点的同一个 Windows 账户） |
| 不管用户是否登录都要运行 | 勾选 |

**触发器**：点「新建」，设置：

| 配置项 | 内容 |
|---|---|
| 开始任务 | 按计划 |
| 设置 | 每周 |
| 每周 | 勾选周日 |
| 开始时间 | `03:00` |

**操作**：点「新建」，设置：

| 配置项 | 内容 |
|---|---|
| 操作 | 启动程序 |
| 程序或脚本 | `"C:\Program Files (x86)\WinSCP\WinSCP.com"` |
| 添加参数 | `/script="C:\backup\winscp-backup.txt" /log="C:\backup\winscp-backup.log"` |

**设置**：勾选「如果错过计划的启动时间，则尽快启动任务」。

确定后，计划任务就建好了。之后每周日凌晨 3 点，系统会自动运行备份脚本。

> ⚠️ 「不管用户是否登录都要运行」需要输入账户密码；如果不想输密码，也可以保持默认「只在用户登录时运行」，但电脑关机或没登录时备份不会执行，备份可能不稳定。定时备份建议让电脑保持开机。

---

# 四、验证备份

## 1. 对比文件数量

在 WinSCP 里看远程文件总数，再对比本地：

```text
C:\backup\imgbed
```

两者应一致（或本地略多，因为本地只增不减）。

## 2. 抽查目录结构

随便打开本地一个子目录，和图片链接对照：

```text
https://imgbed.xxx.com/2026/08/08/xxx.jpg
→ C:\backup\imgbed\2026\08\08\xxx.jpg
```

路径一致就说明备份完整。

## 3. 看同步日志

每周日跑完后扫一眼日志开头结尾，确认没有报错：

```text
C:\backup\winscp-backup.log
```

如果哪次没跑，先检查计划任务状态，再手动执行一次脚本排查。

---

# 五、注意事项

- ⚠️ **只下载，不删除**：`synchronize` 不要加 `-delete` / `-mirror` 参数，本地备份只增不减。
- ⚠️ **账号密码安全**：脚本文件里不要出现明文密码，用 WinSCP 保存的站点凭据。WebDAV 账号泄露 = 图床文件全部可读，不要分享给任何人。
- ⚠️ **计划任务和站点同一账户**：WinSCP 的密码以 Windows 账户加密保存，任务用别的账户跑会登录失败。
- ⚠️ **备份盘注意容量**：图片会越积越多，本地备份盘要留足空间，重要数据最好再往移动硬盘或网盘同步一份。
- ✅ **Telegram 数据丢失后的恢复**：本地备份是最后的保险，文件还在本地，重新上传即可恢复，博客文章不会变成 404。

---

# 结语

这套方案不花一分钱，就用图床自带的 WebDAV 接口和 Windows 自带的计划任务，把「存在 Telegram 里的图」变成「存在自己硬盘里的图」。手动全量一次，之后每周自动增量，目录结构和图片链接一一对应，恢复起来也非常直观。

备份是存储方案的兜底，有了它，图床上的图片才算真正安心。
