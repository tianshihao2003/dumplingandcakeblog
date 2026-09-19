---
title: Python日期时间与os模块
published: 2026-09-18
description: datetime 生成时间戳与会话标识，os 模块读写环境变量、判断与创建目录、遍历删除文件
tags:
  - Python
order: 40
---

## datetime：生成唯一的时间标识

会话管理里需要一个"唯一的名字"来区分每个会话，用当前时间是最省事的做法。

```python
from datetime import datetime

# %Y-%m-%d_%H-%M-%S: %Y - 年 , %m - 月, %d - 日, %H - 小时, %M - 分钟, %S - 秒
print(datetime.now().strftime("%Y-%m-%d_%H-%M-%S"))
```

输出示例：`2026-01-11_18-00-05`

### strftime 常用占位符

| 占位符 | 含义 | 示例 |
| --- | --- | --- |
| `%Y` | 年（4 位） | 2026 |
| `%m` | 月（2 位） | 01 |
| `%d` | 日（2 位） | 11 |
| `%H` | 小时（24 小时制） | 18 |
| `%M` | 分钟 | 00 |
| `%S` | 秒 | 05 |

> [!TIP]
> 格式串 `"%Y-%m-%d_%H-%M-%S"` 里把**日期用 `-`、时间用 `-`、中间用 `_` 分隔**，是为了让文件名既好读、又不会包含非法字符（Windows 文件名不允许 `:` `/` 等符号）。

> [!NOTE]
> 用时间做标识的前提是**格式化精确到秒**。同一秒内点了两次"新建会话"会得到重名——课程项目里靠"聊天记录为空时不重复新建"来规避（见 [会话管理](/posts/编程学习/python学习笔记/41-实战-ai智能伴侣-会话管理/)）。

## os 模块

`os` 是 Python 的标准库，用来和操作系统打交道。本章项目用到了五处：

| 用法 | 作用 | 项目中的场景 |
| --- | --- | --- |
| `os.environ.get('DEEPSEEK_API_KEY')` | 读取环境变量 | 取 API Key，避免硬编码 |
| `os.path.exists("sessions")` | 判断路径是否存在 | 存盘前判断目录要不要创建、加载前判断文件在不在 |
| `os.mkdir("sessions")` | 创建目录（单级） | 第一次保存会话时创建 sessions 目录 |
| `os.listdir("sessions")` | 列出目录下所有文件名 | 展示历史会话列表 |
| `os.remove(path)` | 删除文件 | 删除指定的历史会话 |

```python
import os

# 判断目录是否存在, 不存在则创建
if not os.path.exists("sessions"):
    os.mkdir("sessions")

# 列出目录下的所有文件
file_list = os.listdir("sessions")
for filename in file_list:
    if filename.endswith(".json"):
        print(filename[:-5])       # 切片去掉结尾的 .json

# 删除文件
if os.path.exists("sessions/2026-01-11_18-00-05.json"):
    os.remove("sessions/2026-01-11_18-00-05.json")
```

> [!WARNING]
> `os.mkdir()` 只能创建**一级**目录，而且目录已存在时会抛 `FileExistsError`；要一次创建多级目录用 `os.makedirs(path, exist_ok=True)`。

> [!NOTE]
> `filename[:-5]` 是字符串切片：`-5` 表示从末尾往前数 5 个字符，正好去掉 `.json` 这 5 个字符。更直观的写法是 `filename.removesuffix(".json")`（Python 3.9+）。

## 环境变量怎么设置

代码里用 `os.environ.get(...)` 读，值要靠环境变量传进去：

| 环境 | 设置方式 |
| --- | --- |
| Windows CMD | `set DEEPSEEK_API_KEY=sk-xxxx` |
| Windows PowerShell | `$env:DEEPSEEK_API_KEY="sk-xxxx"` |
| macOS / Linux | `export DEEPSEEK_API_KEY=sk-xxxx` |
| PyCharm | 运行配置 → Environment variables 里添加 |

> [!IMPORTANT]
> API Key 属于密钥，**不能写死在代码里**。一旦写死又提交到 Git 仓库，就等于公开泄露（密钥会被扫描器批量收割）。放环境变量是最基本的做法。

## 相关

- [Python 调用大模型（openai 库）](/posts/编程学习/python学习笔记/33-python调用大模型-openai库/)
- [实战-AI智能伴侣-会话管理](/posts/编程学习/python学习笔记/41-实战-ai智能伴侣-会话管理/)
