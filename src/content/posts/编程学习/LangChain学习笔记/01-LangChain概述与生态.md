---
title: LangChain概述与生态
published: 2026-09-21
description: 为什么需要 LangChain、v0.3 到 v1.2 的架构演进，以及 LangChain/LangGraph/Deep Agent/LangSmith 四大支柱
tags:
  - LangChain
  - AI
order: 1
---

## 为什么需要 LangChain

### 单一的大模型有局限

一个大模型自己做不到这些事：

- **没有实时数据**：训练数据是"冻结"的，问"现在的热门影片"它答不准
- **会幻觉**：遇到训练时没学过的内容，它会编造答案
- **不能操作外部系统**：查数据库、调 API、读文件都不行
- **没有记忆**：每次对话都是独立的（第 3 章学过：模型是无状态的）

所以要构建真正实用的 AI 应用，必须把大模型与**外部工具、数据源和记忆机制**有机结合——这正是 LangChain 要解决的问题。

### LangChain 的定位

LangChain 是大模型与应用之间的**中间层**，可统一调用各类大模型、管理提示词与上下文，还能集成外部工具和数据源。核心定位三点：

1. **打通大模型与外部资源**：统一接口对接数据库、检索引擎、API、文件系统等
2. **封装底层复杂逻辑**：抽象工具调用、记忆等能力，降低智能体开发难度
3. **支撑多智能体协作**：依托 LangGraph 等生态，从单智能体拓展至多智能体协作

### 六类典型应用场景

| 场景 | 解决什么痛点 | 怎么做 |
| --- | --- | --- |
| 检索增强生成（RAG） | 知识滞后、幻觉 | 检索外部知识库并向量化，让模型基于最新资料回答 |
| Agent 智能体 | LLM 无法直接执行复杂任务 | 把模型当"推理引擎"，自主规划并调用外部工具 |
| 对话系统与聊天机器人 | 多轮对话的"记忆"流失 | 集成记忆管理，记住用户偏好和历史交互 |
| 多模态应用 | 只有文本 | 融合图像识别、语音转文字等能力 |
| 自动化写作与格式化生成 | 格式不标准、质量不稳定 | 配合提示词模板与输出解析器 |
| 数据连接与结构化处理 | 非结构化数据难利用 | 从 PDF/Excel 提取信息、自然语言转 SQL |

## LangChain 是什么

### 发展时间线（五个阶段）

| 阶段 | 时间 | 标志 |
| --- | --- | --- |
| 诞生 | 2022-10 | Harrison Chase 创建；名字来自 **Language + Chain**（链接语言模型与各类资源） |
| 探索期 | 2022Q4–2023Q1 | 初版聚焦 PromptTemplate、LLMChain，社区迅速走红 |
| 体系化 | 2023Q2–Q4 | 引入 Tool、Agent、Retrieval；推出 LangChain Hub 与 LangSmith |
| 平台化 | 2024–2025 上半年 | LangGraph 与 LangServe 发布，从框架走向平台 |
| 深层智能体 | 2025 下半年至今 | 推出 Deep Agent（定位 Agent Harness，智能体执行框架） |

### 两个重要版本：v0.3 的痛与 v1.x 的重构

LangChain 长期因 API 变动频繁被戏称为"版本碎钞机"。2024 年起团队把链和智能体标记为弃用，转向基于 LangGraph 的统一智能体抽象；同时 GPT-4 之后"工具调用、结构化输出、系统提示词"都成了模型自带能力，再包一层显得多此一举——**这一阶段开发者大规模流失**。

2025-10-20 发布 **LangChain v1.0.0 + LangGraph v1.0.0**，是里程碑事件：官方首次明确 **API 稳定保证（2.0 前无破坏性变更）**。

| 维度 | v0.3（过渡版） | **v1.2（生产级稳定版）** |
| --- | --- | --- |
| 核心架构 | 以"链（Chain）"为核心 | 从"链式调用"转向**智能体框架** |
| Agent 构建 | `initialize_agent` 等旧 API + AgentExecutor | 官方标准入口 **`create_agent`**，底层基于 LangGraph |
| 工具定义 | `@tool` / Tool 类，类型安全较弱 | 支持 **Pydantic Schema** 定义工具，类型安全 |
| 结构化输出 | JSON Parser + 正则，稳定性差 | **一等公民**，直接绑定 Pydantic 类，由模型底层保证 |
| 输出解析 | 纯文本 + 手动解析 | 标准化 `content_blocks`（推理/文本/工具调用统一为对象） |
| 扩展机制 | 缺乏系统性扩展方式 | **Middleware 中间件**系统，可拦截各生命周期 |
| 异步性能 | 一般 | 优化后响应速度提升 30%+ |
| 包结构 | 较混乱、耦合高 | 主 `langchain` 包保持轻量，旧功能迁至 `langchain-classic` |
| Python 要求 | >= 3.9 | **>= 3.10** |

> [!IMPORTANT]
> 学习与新建项目**一律用 v1.x**（本课程就是 1.2）。看到网上老教程里的 `initialize_agent`、`LLMChain`、`AgentExecutor`，要知道那是 v0.3 的写法，在 1.x 里已经移除或迁到 `langchain-classic`。

### v1.2 的主要模块

| 包 | 作用 |
| --- | --- |
| `langchain-core` | 核心 API：Runnable、BaseMessage 等 |
| `langchain` | 主包（轻量）：`create_agent`、`init_chat_model` 等 |
| `langchain-classic` | 冗余/不推荐使用的经典 API（0.x 常用、1.x 移除的都在这） |
| `langchain-community` | 第三方集成（合作伙伴包如 langchain-openai、langchain-anthropic，按需安装） |
| `langgraph` | 深度整合 LangGraph 1.0，协调多个 Chain/Agent/Tools，支持循环调用 |

> [!TIP]
> 官方原话的意思：**不要试图学完 LangChain 的所有 API**，那是不可能的。搞懂核心逻辑与核心模块，其它用到再查——把它当**工具箱**，不是教科书。

文档地址：

- 中文文档：https://docs.langchain.org.cn/oss/python/langchain/overview
- 英文文档：https://docs.langchain.com/oss/python/langchain/overview
- API 查询（最常查）：https://reference.langchain.com/python/langchain/

## LangChain 家族四大支柱

截至 2025-11，LangChain 已从一个框架成长为覆盖智能体全生命周期的技术生态，四大支柱分别对应四个层次：

| 支柱 | 层次 | 一句话 |
| --- | --- | --- |
| **LangChain** | 基础能力层 | 智能体开发的基石（模型调用、工具与中间件集成、智能体构建） |
| **LangGraph** | 运行时编排层 | 复杂工作流的编排引擎（把智能体抽象成有向图） |
| **Deep Agent** | 智能体抽象层 | 智能体执行框架（Agent Harness），自带规划/文件系统/子智能体 |
| **LangSmith** | 监控与评估层 | 可视化监控与测试平台（追踪调用链路） |

### LangGraph：把智能体变成一张图

把智能体内部抽象为一张**有向图**：

- **节点（Node）**：代表独立的功能单元或决策点
- **边（Edge）**：定义节点之间的流转条件与路径
- **状态（State）**：共享上下文，在节点间传递并持久化

通俗理解：**LangChain = 能力抽象层（有什么能力）**，**LangGraph = 执行与编排层（怎么跑）**。官方强调"快速起步用 LangChain，复杂控制用 LangGraph，二者并行协同"。

### Deep Agent：执行框架

构建于 LangChain 与 LangGraph 之上，增加了规划能力、文件系统、子 Agent 等高级功能。核心能力：

- **显式规划**：自主生成、执行并动态调整多步任务计划
- **虚拟文件系统**：为智能体提供结构化的中间结果与知识存储
- **子智能体**：支持任务在多个智能体之间分解与协作
- **长期记忆**：结合 LangGraph 状态存储，跨对话积累经验
- **可扩展中间件**：嵌入安全审计、性能监控或自定义业务逻辑

> [!NOTE]
> 三者**不是竞争关系**：从 LangChain 快速搭建，用 LangGraph 打磨生产稳定性，再用 Deep Agent 赋予更强的自主能力——这才是完整的生态玩法。

### LangSmith：让智能体的运行过程可见

单靠 print 调试已经不够用了。LangSmith 是官方的**可视化监控与测试平台**，跟踪、记录、分析智能体运行时的完整调用链路：

| 能力 | 说明 |
| --- | --- |
| 全链路追踪 | 可视化每一步的提示词、模型输出、工具使用 |
| 调试与优化 | 发现异常行为与性能瓶颈 |
| 评测与质量控制 | 支持人工与自动化评测 |
| 团队协作 | 共享测试集与调用记录 |

## 开发前的前置知识

| 方向 | 需要掌握 |
| --- | --- |
| Python 基础 | 变量、流程控制、函数与参数机制、**类与对象、装饰器**；常用容器、JSON、异常处理；模块导入、包管理、线程与协程 |
| 大模型基础 | LLM、Token、Prompt、Embedding 的概念；用过豆包/千问/DeepSeek 等；了解 OpenAI/Anthropic/阿里云百炼/DeepSeek 等平台 |

> [!TIP]
> 这两块正是前面几章的内容——装饰器（函数进阶）、异常处理、JSON、面向对象（第 6 章）都会在 LangChain 里反复用到。

## 相关

- [大模型应用场景与技术选型](/posts/编程学习/langchain学习笔记/02-大模型应用场景与技术选型/)
- [开发环境搭建（conda）](/posts/编程学习/langchain学习笔记/03-开发环境搭建-conda/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. LangChain 的名字来自 ____（语言模型）和 ____（链式连接）的组合
2. 单一的大模型有四个局限：没有 ____、会 ____、不能操作外部系统、没有 ____
3. LangChain 的定位是大模型与应用之间的 ____，核心定位三点：打通 ____、封装 ____、支撑 ____
4. LangChain 1.0/1.2 发布时间是 ____；官方承诺 ____ 版本之前无破坏性变更
5. v1.x 的 Agent 标准构建入口是 ____，底层基于 ____
6. v1.x 把旧功能迁移到 ____ 包，主 langchain 包保持轻量
7. 四大支柱：____（基础能力层）、____（运行时编排层）、____（智能体抽象层）、____（监控与评估层）
8. LangGraph 把智能体抽象成有向图：____ 是功能单元、____ 定义流转、____ 是共享上下文
9. LangChain 1.2 要求 Python 版本 ____ 以上

> [!TIP]- 填空答案（做完再点开）
> 1. Language / Chain　2. 实时数据 / 幻觉 / 记忆　3. 中间层 / 大模型与外部资源、底层复杂逻辑、多智能体协作　4. 2025-10-20 / 2.0　5. `create_agent` / LangGraph　6. `langchain-classic`　7. LangChain、LangGraph、Deep Agent、LangSmith　8. 节点 / 边 / 状态　9. 3.10

### 二、概念自测

- [ ] **2-1** 用自己的话说清楚：为什么"只调大模型 API"做不出实用的 AI 应用？
- [ ] **2-2** LangChain 和 LangGraph 的分工是什么？（用"有什么能力"和"怎么跑"来回答）
- [ ] **2-3** 网上看到一段代码用了 `initialize_agent` 和 `AgentExecutor`，你怎么判断它的版本？在 1.x 里应该用什么替代？

> [!TIP]- 参考答案（做完再点开）
> **2-1** 因为大模型本身无状态、知识冻结、会幻觉、也碰不到外部系统。要做出实用应用，必须给它接上**外部数据**（RAG）、**工具**（调用 API/数据库）、**记忆**（多轮上下文）——这些"胶水"工作就是 LangChain 的活。
> **2-2** LangChain 是**能力抽象层**，负责"有什么能力"（把 LLM、Tool、Message 标准化）；LangGraph 是**执行与编排层**，负责"怎么跑"（状态机、工作流、多 Agent 协作）。简单场景只用 LangChain，需要多步骤/有状态编排时上 LangGraph。
> **2-3** `initialize_agent`、`AgentExecutor` 是 **v0.3** 的旧 API（1.x 里已移除，迁移到 `langchain-classic`）。1.x 里用 **`create_agent`** 构建智能体。