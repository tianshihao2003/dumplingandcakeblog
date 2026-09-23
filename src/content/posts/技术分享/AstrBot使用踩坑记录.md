---
title: AstrBot 使用踩坑记录
published: 2026-08-12
tags:
  - AstrBot
  - Docker
  - NapCat
  - 故障排除
image: https://img.tsh520.cn/file/blog/post-covers/tech-01-astrbot-pitfalls.webp
description: 使用 AstrBot + NapCat 部署个人微信/QQ 机器人过程中遇到的各种问题及解决方案，持续更新。
---

> 踩坑不可怕，可怕的是同一个坑踩两遍。记录下来，下次秒查。

---

# 前言

之前写了 [AstrBot + NapCat 部署教程](/posts/技术分享/使用宝塔面板部署AstrBot与NapCat实现QQ机器人)，部署完成后进入插件开发阶段。过程中遇到了一些问题，有些折腾了很久，因此把它们都记下来，方便以后快速定位。

---

# 问题一：发送视频失败——文件存在但容器找不到

## 现象

给机器人发视频链接，视频下载到服务器上了（目录里看得到文件），但机器人发不出来：

```text
ENOENT: no such file or directory, open
'/AstrBot/data/plugin_data/astrbot_plugin_parser/cache/26bb248950ba2bda.mp4'
```

图片发送正常，只有视频出错。

## 原因

AstrBot 和 NapCat 是两个独立的 Docker 容器，运行在同一个 `astrbot-napcat` 网络中。

- AstrBot 容器有挂载 `/root/astrbot_data → /AstrBot/data`
- NapCat 容器没有挂载这个路径

NapCat 发送视频时，需要在**自己的容器里**读取 `file:///AstrBot/data/...` 这个文件，但 NapCat 容器根本看不到这个路径——文件只存在于 AstrBot 容器里，NapCat 容器的文件系统是隔离的。

图片能发是因为图片走了另一条代码路径（不是 file:/// 绝对路径），不依赖容器内路径。

## 解决方案

给 NapCat 容器加一条挂载，指向 AstrBot 的数据目录：

```text
宿主机 /root/astrbot_data → NapCat 容器 /AstrBot/data
```

### 操作步骤

**1. 确认 AstrBot 数据在宿主机的实际路径：**

```bash
docker inspect astrbot --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{end}}'
# 输出示例：/root/astrbot_data -> /AstrBot/data
```

**2. 保存 NapCat 当前状态，然后重建加挂载：**

```bash
# 先查 NapCat 的端口和挂载（重建时需要还原）
docker inspect napcat --format '{{json .HostConfig.PortBindings}}'
docker inspect napcat --format '{{json .Mounts}}'

# 保存当前状态（包括已安装的依赖）
docker commit napcat napcat_backup

# 停止并删除旧容器
docker stop napcat && docker rm napcat

# 重建容器，新增 AstrBot 数据挂载
docker run -d \
  --name napcat \
  --restart unless-stopped \
  --network astrbot-napcat \
  -p 3000:3000 -p 3001:3001 -p 6099:6099 \
  -v <原配置目录1>:/app/napcat/config \
  -v <原配置目录2>:/app/.config/QQ \
  -v /root/astrbot_data:/AstrBot/data \
  napcat_backup
```

> ⚠️ 不能直接用宝塔面板「编辑容器 → 添加挂载」——面板重建容器时不会继承原容器的 entrypoint/cmd，会报 `no command specified` 错误。必须用 `docker commit` + `docker run` 方式。

**3. 验证：**

```bash
# 确认 NapCat 能看到 AstrBot 的文件
docker exec napcat ls /AstrBot/data/plugin_data/astrbot_plugin_parser/cache/
```

看到文件列表就说明路径通了，再发一次视频测试。

## 根本原理

Docker 容器的文件系统是隔离的。容器 A 里下载的文件，容器 B 默认看不到。只有把同一块宿主机目录挂载到两个容器，才能共享文件。视频发送走的是 `file:///` 路径读取，NapCat 必须能在自己的容器里找到这个文件。

---

# （后续问题持续更新中……）

---

# 附：问题速查索引

| 问题 | 关键词 | 解决思路 |
|---|---|---|
| 视频发送失败：文件不存在 | `ENOENT`、`file:///AstrBot/data`、容器挂载 | NapCat 容器加 AstrBot 数据挂载 |
---

## 新增踩坑：日程“2分钟后”提醒时间错乱 + 微信不推送（2026-08-22）

**现象**：`/日程 3分钟后在会议室A开周会 高优 提前1分钟` 在 02:14 发，机器人回 `周会 时间2026-08-22 02:25:00` 看似对，但日志显示 `18:14` 调度 `02:25`，`/提醒 列表` 显示 `提前10分`，到点 `02:39` 日志 `到点提醒` 有但微信没收到，且 `MessageChain` 报错 `Timeout context manager should be used inside a task` / `'list' object has no attribute 'chain'`。

**根因 1 - 时区**：`datetime.now()` 在你本机（Windows CST）是 `02:xx`，在 AstrBot 容器（OpenCloudOS 默认 UTC）是 `18:xx`，差 8 小时。`SCHEDULE_PROMPT` 没写时区，LLM 按 UTC 猜成 `18:17`，`allDay` 误判不进提醒。

**根因 2 - 标题残留**：LLM 回 `2分钟后周会`，`_normalize` 未去掉 `2分钟后` 前缀。

**根因 3 - 调度**：`BackgroundScheduler()` 默认 UTC，`remind_at` 用 naive 的 `02:24` 被当 UTC 调度，到点不触发；且 `origin` 硬编码 `weixin_oc` 而实际是 `weixin_personal_bglh:FriendMessage:...`，`send_message` 拿不到平台。

**根因 4 - 推送**：`MessageChain().message()` 在 APScheduler 线程里会触发 `asyncio.timeout` 必须在 task 内用的校验；且 `hasattr(MessageChain, 'chain')` 判 `list` 别名误判，导致 `Plain`/`str` 直接丢给 `send_message` 报 `no attribute chain`。

**修复（v1.0.20 → v1.0.28）**

1.  **统一上海时区**：`blog_writer_core.py:12` + `main.py:27` 新增 `SHANGHAI_TZ = timezone(timedelta(hours=8))` + `now_shanghai()`，全量 `datetime.now()`→`now_shanghai()`（13+10 处），`SCHEDULE_PROMPT` 加 `时区为 Asia/Shanghai` + `时间基准：{now}` 动态填入，`2分钟后=基准+2分钟` 明确规则。

2.  **标题与相对时间兜底**：`_parse_schedule_time` 新增 `(\d+分钟后|半小时后)` 相对分支（基准用传入的 now），`parse_schedule` 清洗标题去掉 `2分钟后/半小时后`，`main.py:564` `_normalize_schedule_data` 对 LLM 仍错的 `00:00:00` 或 `17:57` 用本地正则重算覆盖（>120秒偏差即覆盖）。

3.  **调度持久化**：`BackgroundScheduler(timezone=SHANGHAI_TZ)`，`REMINDER_FILE = data/schedules_reminder.json` 存 `remind_before` + `origin`，`_restore_reminders` 按上海解释，`_schedule_remind` 存 `origin`（`event.unified_msg_origin`）并 `DateTrigger(run_date=remind_at_tz)`，`_handle_remind` 按条显示实际 `1分` 而非默认 `10分`。

4.  **推送兼容**：`_send_remind` 改 `def _make_chain` 优先 `MessageChain(chain=[Plain])` / `MessageChain([Plain])`，不调 ` .message()`（避 timeout），`_send_remind_sync` 存 `self._loop = get_running_loop()` 并 `run_coroutine_threadsafe(..., self._loop)`，`send_message` 先试 `origin` 纯文本/`Plain`/`[Plain]`，再按 `origin` 解析平台名 `weixin_personal_bglh` 兜底。

**验证**：`02:22` 发 `3分钟后…提前1分钟` → 回 `02:25:00`，`/提醒 列表` 显示 `02:24:00 (提前1分)`，`02:24:00.002` 日志 `到点提醒` 后 `主动推送 via origin 成功`，微信收到 `🔔 日程提醒：周会 时间到了`。`103` 单测 OK，打包 `v1.0.28`（` main.py:291` 日志可定位）。

**教训**：系统时区、LLM 时区、调度器时区三处必须同一 `Asia/Shanghai`；相对时间必须本地正则兜底；`MessageChain` 构造与 `send_message(origin, chain)` 必须按官方文档 `from astrbot.core.message.message_event_result import MessageChain` + `MessageChain().message()` / `chain=[Plain]` 双试，且调度线程不能直接 `asyncio.timeout`。

