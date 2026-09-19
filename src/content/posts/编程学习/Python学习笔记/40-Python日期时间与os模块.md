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

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 生成当前时间的会话标识：`datetime.____().strftime("%Y-%m-%d_%H-%M-%S")`
2. 占位符含义：`%Y` = ____、`%m` = ____、`%d` = ____、`%H` = ____、`%M` = ____、`%S` = ____
3. 读环境变量：`os.____.get("DEEPSEEK_API_KEY")`
4. 判断路径是否存在：`os.path.____("sessions")`
5. 创建一级目录：`os.____("sessions")`（目录已存在会抛 ____ 错误）
6. 列出目录下所有文件名：`os.____("sessions")`
7. 删除文件：`os.____(path)`
8. 切片 `filename[:-5]` 的作用是去掉结尾的 ____

> [!TIP]- 填空答案（做完再点开）
> 1. now　2. 年 / 月 / 日 / 小时 / 分钟 / 秒　3. environ　4. exists　5. mkdir / FileExistsError　6. listdir　7. remove　8. `.json`（5 个字符）

### 二、裸写题



- [ ] **2-1 生成会话标识**
  打印一个形如 `2026-01-11_18-00-05` 的时间字符串；再打印一个中文格式的日期，如 `2026年01月11日`。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：取当前时间 → 用格式化字符串拼成想要的样式
  > **二级 · 方法**：`datetime.now().strftime("格式串")`
  > **三级 · 骨架**：中文格式就是格式串里直接写中文：`"%Y年%m月%d日"`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > from datetime import datetime
  > 
  > # 会话标识格式
  > print(datetime.now().strftime("%Y-%m-%d_%H-%M-%S"))
  > 
  > # 中文日期格式（格式串里可以直接写中文）
  > print(datetime.now().strftime("%Y年%m月%d日"))
  > 
  > # 连续运行两次，秒数不同（同一个脚本里两次 now() 也会不同）
  > ```

- [ ] **2-2 目录准备与列目录**
  写一个函数：如果 `sessions` 目录不存在就创建；然后列出该目录下所有 `.json` 文件名（去掉扩展名后打印）。

  > [!TIP]- 提示
  > **一级 · 思路**：先判断再创建；列出来的文件名要筛一遍再切掉后缀
  > **二级 · 方法**：`os.path.exists` / `os.mkdir` / `os.listdir` / `endswith(".json")`
  > **三级 · 骨架**：`if not os.path.____("sessions"):`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import os
  > 
  > # 1. 目录不存在就创建
  > if not os.path.exists("sessions"):
  >     os.mkdir("sessions")
  > 
  > # 2. 造两个 json 文件
  > with open("sessions/2026-01-11_18-00-05.json", "w", encoding="utf-8") as f:
  >     f.write("{}")
  > with open("sessions/2026-01-11_18-04-42.json", "w", encoding="utf-8") as f:
  >     f.write("{}")
  > 
  > # 3. 列出 .json 文件并去掉后缀
  > session_list = []
  > for filename in os.listdir("sessions"):
  >     if filename.endswith(".json"):
  >         session_list.append(filename[:-5])
  > session_list.sort(reverse=True)
  > print(session_list)
  > ```

- [ ] **2-3 安全地删除文件**
  写一个函数：先创建一个临时文件（如 `temp_demo.txt`）并写入内容，再判断它存在后删除它，最后再列一次目录确认删掉了。

  > [!TIP]- 提示
  > **一级 · 思路**：删除前一定先判断存在，否则会抛异常
  > **二级 · 方法**：`os.path.exists` / `os.remove`
  > **三级 · 骨架**：`if os.path.____(path): os.____(path)`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import os
  > 
  > # 1. 创建临时文件
  > with open("temp_demo.txt", "w", encoding="utf-8") as f:
  >     f.write("删除我\n")
  > 
  > # 2. 判断存在后删除
  > if os.path.exists("temp_demo.txt"):
  >     os.remove("temp_demo.txt")
  >     print("已删除")
  > 
  > # 3. 确认
  > print("temp_demo.txt" in os.listdir("."))
  > 
  > # 如果不判断存在就删，会抛：FileNotFoundError
  > ```
