---
title: LangSmith的使用
published: 2026-09-21
description: 用 LangSmith 追踪、监控、评估智能体：四大功能板块、账号与 API Key、四个环境变量配置
tags:
  - LangChain
  - AI
order: 6
---

## LangSmith 是什么

当智能体系统逐渐复杂时，单靠 `print` 调试已经不够用了。**LangSmith 是 LangChain 官方推出的可视化监控与测试平台**，用于跟踪、记录和分析智能体运行过程中的**完整调用链路**，让内部运行过程变得透明、可评估。

核心目标：

| 目标 | 说明 |
| --- | --- |
| 全链路追踪 | 可视化追踪模型调用、提示词输入、结果输出、工具使用等行为 |
| 调试与优化 | 发现异常行为与性能瓶颈 |
| 评测与质量控制 | 支持人工与自动化评测 |
| 团队协作 | 多人共享测试集与调用记录 |

## 功能板块

按用途分三组：

### 一、开发与调试

| 功能 | 作用 |
| --- | --- |
| **Tracing（追踪）** | **最核心**。完整记录每一次调用的链路（Trace）：每一步的 Prompt 是什么、模型返回了什么、消耗多少 Token、每个节点耗时多久 |
| **Monitoring（监控）** | 生产环境看板：Token 消耗趋势、QPS、错误率、平均延迟、成本预估 |
| **Datasets & Experiments** | 管理测试数据集并运行对比实验 |
| **Evaluators（评估器）** | 自动评估输出质量 |
| **Annotation Queues（标注队列）** | 人工标注与复核 |

### 二、提示词工程

**Prompts**（提示词管理）、**Playground**（演练场，在线调提示词）、**Studio**（工作室，可视化调试）、**Context Hub**（上下文中心）。

### 三、部署运维

**Deployments**（部署）、**Sandboxes**（沙盒：轻量级在线运行与测试环境，不污染生产）。

> [!TIP]
> 新手的学习顺序建议：**现阶段重点看 Tracing（观察调用细节）和 Playground（快速调优提示词）**；等应用结构复杂了（复杂的 RAG 检索、多 Agent 协同），再引入 Datasets 做量化评估、用 Studio 做可视化调试。

## 准备账号与 API Key

1. 访问官网 https://smith.langchain.com/ 注册或登录
2. 进入设置 → 创建 API Key
3. **点 copy 保存好**：

> [!WARNING]
> API Key **只在创建弹窗里出现一次**，关掉弹窗后官网就再也看不到内容了（只能删除重建）。务必先复制保存。

## 配置四个环境变量

在项目 `.env` 里加上：

```text
# 是否启用 LangSmith 监控功能
LANGSMITH_TRACING=true

# LangSmith 监控 WebUI 地址
LANGSMITH_ENDPOINT=https://api.smith.langchain.com

# 创建的 API_KEY
LANGSMITH_API_KEY=<YOUR_API_KEY>

# 自定义项目名称（在 WebUI 里按这个名字查看运行记录）
LANGSMITH_PROJECT="pr-clear-harmony-32"
```

| 变量 | 作用 |
| --- | --- |
| `LANGSMITH_TRACING` | 总开关，`true` 才会自动上报 |
| `LANGSMITH_ENDPOINT` | 上报地址（官方云端；自建部署时改成自己的地址） |
| `LANGSMITH_API_KEY` | 身份凭证 |
| `LANGSMITH_PROJECT` | **项目名**，相当于"文件夹"，用来区分不同项目的运行记录 |

> [!IMPORTANT]
> 这四个变量只放在 `.env` 里即可，**代码一行都不用改**——LangChain 会自动读取它们并上报。这就是它的好用之处：**给现有程序装上"行车记录仪"，代码零侵入**。

## 查看监控指标

只要 `.env` 配好，跑**任意** LangChain 程序就会自动记录：

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv(override=True)      # 把 .env 里的变量加载为环境变量（override=True 表示 .env 优先）

model = init_chat_model(
    model="deepseek-v4-flash",
    model_provider="openai",
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
    api_key=os.getenv("DEEPSEEK_API_KEY"),
)

print(model.invoke("你好"))
```

运行后到 LangSmith 官网，进入 `LANGSMITH_PROJECT` 指定的项目，就能看到这次调用的完整链路（输入提示词、模型返回、Token 消耗、耗时）。

> [!TIP]
> 有了它，"模型为什么答错了"这类问题就不用靠猜了：点开那条 trace，能直接看到**实际发出去的完整提示词**——八成问题都出在你以为发了什么、实际发了什么不一样。

## 相关

- [模型的创建](/posts/编程学习/langchain学习笔记/04-模型的创建/)
- [Message与提示词模板](/posts/编程学习/langchain学习笔记/07-message与提示词模板/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. LangSmith 是 LangChain 官方的可视化 ____ 与 ____ 平台，用于跟踪分析智能体的完整 ____
2. 最核心的功能是 ____：能看到每一步的 ____ 是什么、模型返回了什么、消耗多少 ____、每个节点 ____
3. Monitoring 是生产环境看板，能看 ____ 消耗趋势、____、错误率、平均延迟和成本
4. 四个环境变量：____（总开关）、____（上报地址）、____（凭证）、____（项目名）
5. 这四个变量配在 ____ 文件里，代码 ____（需要/不需要）改动
6. 创建 API Key 后要注意：Key 只在弹窗里出现 ____ 次，必须立即保存
7. 新手阶段建议重点用 ____ 和 ____；应用复杂后再上 Datasets 和 Studio

> [!TIP]- 填空答案（做完再点开）
> 1. 监控 / 测试 / 调用链路（Trace）　2. Tracing / Prompt（提示词）/ Token / 耗时　3. Token / QPS　4. `LANGSMITH_TRACING` / `LANGSMITH_ENDPOINT` / `LANGSMITH_API_KEY` / `LANGSMITH_PROJECT`　5. `.env` / 不需要　6. 一　7. Tracing / Playground

### 二、动手题

- [ ] **2-1 接通 LangSmith**
  注册 LangSmith 账号并创建 API Key，在项目 `.env` 里补齐四个 `LANGSMITH_*` 变量。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：开关 + 地址 + 钥匙 + 项目名，四样齐活
  > **二级 · 方法**：`LANGSMITH_TRACING=true` / `LANGSMITH_ENDPOINT=https://api.smith.langchain.com` / `LANGSMITH_API_KEY=...` / `LANGSMITH_PROJECT="你的项目名"`
  > **三级 · 骨架**：`LANGSMITH_PROJECT` 里的值就是官网看到的"项目文件夹名"

- [ ] **2-2 跑一次并去官网看记录**
  运行一次模型调用（如 `model.invoke("你好")`），然后到 LangSmith 官网对应项目里查看这次 Trace。

  > [!TIP]- 提示
  > **一级 · 思路**：代码不用改，靠 `.env` 自动上报
  > **二级 · 方法**：`load_dotenv(override=True)` 必须先执行
  > **三级 · 骨架**：看不清记录时先确认 `LANGSMITH_TRACING=true` 与项目名拼写

- [ ] **2-3 关掉再试一次**
  把 `LANGSMITH_TRACING` 改成 `false` 再跑一次，观察官网是否还有新记录，理解"开关"的作用。

  > [!TIP]- 提示
  > **一级 · 思路**：这个变量就是总开关
  > **二级 · 方法**：改 `.env` 后重新运行即可（记得改回来）
  > **三级 · 骨架**：对比两次运行在官网的记录数量

> [!TIP]- 参考答案（做完再点开）
> ```text
> # 2-1 .env 里补上这四行
> LANGSMITH_TRACING=true
> LANGSMITH_ENDPOINT=https://api.smith.langchain.com
> LANGSMITH_API_KEY=<你复制的 API Key>
> LANGSMITH_PROJECT="langchain-study"
> ```
>
> ```python
> # 2-2 运行这段，然后去官网看 Trace（代码不用管 LangSmith）
> import os
> from dotenv import load_dotenv
> from langchain.chat_models import init_chat_model
>
> load_dotenv(override=True)
>
> model = init_chat_model(
>     model="deepseek-v4-flash",
>     model_provider="openai",
>     base_url=os.getenv("DEEPSEEK_BASE_URL"),
>     api_key=os.getenv("DEEPSEEK_API_KEY"),
> )
>
> print(model.invoke("你好，用一句话回答").content)
> # 打开 https://smith.langchain.com/ → 进入 LANGSMITH_PROJECT 指定的项目 → 能看到本次调用
>
> # 2-3 把 LANGSMITH_TRACING 改成 false 再跑，官网不会新增记录
> ```