---
title: Python调用大模型（openai库）
published: 2026-09-18
description: 用 pip 安装 openai 库并调用 DeepSeek：客户端创建、请求参数、返回值解析的完整流程
tags:
  - Python
  - DeepSeek
order: 33
---

## pip 与 PyPI

| 名称 | 作用 |
| --- | --- |
| PyPI | 全称为 Python Package Index，是由 Python 官方和社区共同维护的 Python 第三方软件包的官方仓库 |
| pip | Python 官方提供的 Python 包的管理工具，提供对 Python 包的查找、下载、安装、卸载等功能 |

`time`、`math`、`random`、`csv`、`re` 等是 Python **自带的标准库**，不用安装；而 `openai`、`requests`、`numpy`、`pandas`、`streamlit` 等是**第三方库**，需要单独安装。

### 常用 pip 命令

| 操作 | 命令 |
| --- | --- |
| 安装软件包（最新版本） | `pip install openai` |
| 安装软件包（指定版本） | `pip install openai==2.13.0` |
| 卸载软件包 | `pip uninstall openai` |
| 列出已安装的包 | `pip list` |
| 查看包详情 | `pip show openai` |

> [!WARNING]
> 指定版本必须用**双等号** `==`。写成单个 `=` 会直接报错：`ERROR: Invalid requirement: 'openai=2.13.0' ... Hint: = is not a valid operator. Did you mean == ?`（课程 PPT 上写的是单等号，是笔误，别照着抄）。

## 为什么调用 DeepSeek 却安装 openai

DeepSeek 的 API **兼容 OpenAI 的接口格式**，所以可以直接用 `openai` 这个第三方库来调用，只需要把 `base_url` 改成 DeepSeek 的地址：

| 参数 | 值 |
| --- | --- |
| `base_url` | `https://api.deepseek.com` |
| `model` | `deepseek-chat`（非思考模式）/ `deepseek-reasoner`（思考模式） |
| `api_key` | 在 DeepSeek 开放平台创建的 API Key |

官方文档"首次调用 API"页给出的就是这三个值：

![DeepSeek 官方文档-首次调用 API](https://img.tsh520.cn/file/blog/article/deepseek-api-docs.png)

> [!NOTE]
> 官方文档说明：出于与 OpenAI 兼容考虑，`base_url` 也可以设置成 `https://api.deepseek.com/v1` 来使用，但此处的 `v1` 与模型版本无关。

## 完整调用示例

```python
import os
from openai import OpenAI

# 创建与AI大模型交互的客户端对象 (DEEPSEEK_API_KEY 环境变量的名字, 值就是DeepSeek的API_KEY的)
client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")

# 与AI大模型进行交互(参数)
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "你是一名非常可爱的AI助理, 你的名字叫小甜甜, 请你使用温柔可爱的语气回答用户的问题"},
        {"role": "user", "content": "你是谁, 你能帮我做什么?"},
    ],
    stream=False
)

# 输出大模型返回的结果
print(response.choices[0].message.content)
```

### 逐段理解

| 代码 | 说明 |
| --- | --- |
| `os.environ.get('DEEPSEEK_API_KEY')` | 从**环境变量**读 API Key，避免把密钥写死在代码里 |
| `OpenAI(api_key=..., base_url=...)` | 创建客户端对象，`base_url` 决定请求发给谁 |
| `client.chat.completions.create(...)` | 发起一次对话请求（对应 HTTP POST `/chat/completions`） |
| `stream=False` | 非流式：一次性拿到完整回答 |
| `response.choices[0].message.content` | 取出模型回复的文本。`choices` 是列表，取第一个候选，再取 `message.content` |

> [!TIP]
> 环境变量的设置方式（Windows PowerShell）：`$env:DEEPSEEK_API_KEY="sk-xxxx"`；CMD：`set DEEPSEEK_API_KEY=sk-xxxx`。在 PyCharm 里也可以直接配置到运行配置的 Environment variables 中。

> [!WARNING]
> 调用可能失败（网络断开、余额不足、Key 失效）。写正式程序时建议用 `try...except` 包住，例如 `except Exception as e: print("调用失败:", e)`，避免程序直接崩溃。

## 下一步

| 想解决 | 看 |
| --- | --- |
| 让回复逐字蹦出来（打字机效果） | [实战-AI智能伴侣-流式输出](/posts/编程学习/python学习笔记/37-实战-ai智能伴侣-流式输出/) |
| 让 AI 记住之前的对话 | [实战-AI智能伴侣-会话记忆](/posts/编程学习/python学习笔记/38-实战-ai智能伴侣-会话记忆/) |
| 让 AI 按指定身份和风格回答 | [提示词工程](/posts/编程学习/python学习笔记/34-提示词工程/) |

## 练习题

### 一、回忆填空（写完再展开对答案）

1. Python 第三方软件包的官方仓库叫 ____，包管理工具叫 ____
2. 安装指定版本的**正确**写法：`pip install openai____2.13.0`（写出符号）
3. 卸载：`pip ____ openai`；列出已安装：`pip ____`；查看详情：`pip ____ openai`
4. DeepSeek 的 API 兼容 ____ 的接口格式，所以可以直接用 `openai` 这个库调用
5. 创建客户端：`client = ____(api_key=os.____.get("DEEPSEEK_API_KEY"), base_url="____")`
6. 发起对话请求：`client.____.____.create(model="deepseek-chat", messages=[...], stream=False)`
7. 非流式取回复文本：`response.____[0].____.content`
8. 用环境变量存 API Key 是为了避免把密钥 ____

> [!TIP]- 填空答案（做完再点开）
> 1. PyPI、pip　2. `==`（双等号，单个 `=` 会报错）　3. uninstall、list、show　4. OpenAI　5. OpenAI / environ / https://api.deepseek.com　6. chat.completions　7. choices、message　8. 写死在代码里（泄露）

### 二、裸写题



- [ ] **2-1 最小调用程序**
  写一个程序：从环境变量读 API Key，向 deepseek-chat 提一个问题，把回复打印出来。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：先建"打电话的客户端"，再用它发消息，最后从返回结果里挖出文本
  > **二级 · 方法**：`OpenAI(...)` / `client.chat.completions.create(...)` / `response.choices[0].message.content`
  > **三级 · 骨架**：`client = OpenAI(api_key=os.environ.get("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import os
  > from openai import OpenAI
  > 
  > client = OpenAI(api_key=os.environ.get("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
  > 
  > response = client.chat.completions.create(
  >     model="deepseek-chat",
  >     messages=[{"role": "user", "content": "你是谁, 你能帮我做什么?"}],
  >     stream=False,
  > )
  > 
  > print(response.choices[0].message.content)
  > ```

- [ ] **2-2 流式输出**
  把上面的调用改成流式，把回复**逐段**打印到控制台（不是一次性打印）。

  > [!TIP]- 提示
  > **一级 · 思路**：让接口一段一段给，而不是等全部生成完
  > **二级 · 方法**：`stream=True` + `for chunk in response:`
  > **三级 · 骨架**：`if chunk.choices[0].____.content is not None:`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import os
  > from openai import OpenAI
  > 
  > client = OpenAI(api_key=os.environ.get("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
  > 
  > response = client.chat.completions.create(
  >     model="deepseek-chat",
  >     messages=[{"role": "user", "content": "用一句话介绍 Python"}],
  >     stream=True,
  > )
  > 
  > for chunk in response:
  >     if chunk.choices[0].delta.content is not None:
  >         print(chunk.choices[0].delta.content, end="", flush=True)
  > print()
  > ```

- [ ] **2-3 用 system 设定身份**
  给 AI 设定身份"你是一名非常可爱的AI助理，名字叫小甜甜"，再问"你是谁"，对比不设身份时的回答有什么不同。

  > [!TIP]- 提示
  > **一级 · 思路**：身份写在 messages 的第一条，角色不是 user
  > **二级 · 方法**：`{"role": "system", "content": "..."}`
  > **三级 · 骨架**：`messages=[{"role": "____", "content": 身份}, {"role": "user", "content": "你是谁"}]`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import os
  > from openai import OpenAI
  > 
  > client = OpenAI(api_key=os.environ.get("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
  > 
  > system_prompt = "你是一名非常可爱的AI助理, 你的名字叫小甜甜, 请你使用温柔可爱的语气回答用户的问题"
  > 
  > response = client.chat.completions.create(
  >     model="deepseek-chat",
  >     messages=[
  >         {"role": "system", "content": system_prompt},
  >         {"role": "user", "content": "你是谁"},
  >     ],
  >     stream=False,
  > )
  > 
  > print(response.choices[0].message.content)
  > # 对比实验：把 system 那条删掉再跑一次，回复就变成通用的助手口吻
  > ```
