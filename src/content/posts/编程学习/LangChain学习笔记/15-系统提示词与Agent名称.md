---
title: 系统提示词与Agent名称
published: 2026-09-21
description: system_prompt 的两种写法（str / SystemMessage）与三条使用建议、让 Agent 记住工作流程和输出格式，以及 name 参数的用法与六个典型场景
tags:
  - LangChain
  - AI
order: 15
---

## 系统提示词：给 Agent 定规矩

创建 Agent 时，**模型和工具是必需的，系统提示词是可选的**——但提示词为 Agent 提供了**任务背景、行为准则和操作指南**，是让它"像个靠谱员工"的关键。

系统指令（SystemMessage）通过 `system_prompt` 参数设置，**这个参数可以是 `str`，也可以是 `SystemMessage` 类型**：

```python
agent = create_agent(
    model=model,
    tools=[get_weather],
    system_prompt="""你是天气助手。

工作流程：
1. 理解用户的城市查询
2. 使用 get_weather 工具获取数据
3. 简洁清晰地回答

输出格式：
- 天气状况
- 温度
- 注意事项（如有）
""",
)
```

### 三条使用建议

| 建议 | 说明 | 例子 |
| --- | --- | --- |
| **明确说明 Agent 的角色** | 一句话定人设，避免语气跑偏 | "你是一个天气助手" / "你是一个小学数学老师，耐心，幽默" |
| **定义输出格式** | 让回答结构稳定、方便阅读 | "输出：天气状况 / 温度 / 注意事项" |
| **说明何时使用工具** | 减少"该调工具却没调"或"乱调工具" | "查天气必须调用 get_weather 工具" |

> [!TIP]
> 系统提示词还有一个"隐性用途"：**兜底处理异常情况**。第 14 篇的自主重试就是靠提示词写的——"工具返回以 `TEMP_UNAVAILABLE:` 开头时说明是临时故障，最多重试 3 次"。框架不会替你处理这些，**规则得你写**。

### 两种设置方式：静态 vs 动态

| 方式 | 做法 | 什么时候用 |
| --- | --- | --- |
| **静态设置** | 创建 Agent 时把 `system_prompt` 写死 | 绝大多数场景 |
| **动态设置** | 运行时根据用户/环境拼不同的提示词 | 需要中间件（第 8 章），比如按用户权限给不同指令 |

### 传 str 还是传 SystemMessage？

```python
from langchain.messages import SystemMessage

# 写法一：直接给字符串（最常用）
agent = create_agent(model=model, tools=[get_weather],
                     system_prompt="你是一名天气助手，回答简洁清晰。")

# 写法二：给 SystemMessage 对象
agent = create_agent(model=model, tools=[get_weather],
                     system_prompt=SystemMessage(
                         "你是一个天气助手。"
                         "当工具返回以 'TEMP_UNAVAILABLE:' 开头的结果时，"
                         "说明是临时故障，不要立即放弃；"
                         "你应再次调用同一个工具，最多重试 3 次。"
                     ))
```

两种写法**效果一样**，`SystemMessage` 更适合把长指令拆成多段拼接（每段一个参数），可读性好一点。

> [!NOTE]
> 想在**某一次调用**里临时给指令，也可以不用 `system_prompt`，直接在 `invoke` 的 messages 列表开头塞一条 `{"role": "system", "content": ...}`（第 13 篇的 2-2 就是这么做的）。区别是：`system_prompt` 是**给整个 Agent** 的，写进 messages 的只影响这一次调用。

## Agent 名称：name 参数

创建 Agent 时可以用 `name` 指定名称：

```python
from langchain.agents import create_agent

agent = create_agent(
    model=model,
    name="chat_assistant",
)

response = agent.invoke({"messages": ["你好"]})
for msg in response["messages"]:
    msg.pretty_print()
```

**最直观的效果**：**AI 回复的消息会带上这个名字**。

```text
================================ Human Message =================================
你好
================================= Ai Message ==================================
Name: chat_assistant
你好！有什么我可以帮你的吗？
```

### 六个典型使用场景

| 场景 | 作用 |
| --- | --- |
| **流式输出归因** | 标识当前输出内容来自哪个 Agent（多 Agent 协作、嵌套调用时特别有用） |
| **消息身份标记** | 保存会话记录、回放执行过程、构建审计日志、前端展示消息角色时能认出生成者 |
| **调试与 trace 可读性** | 调试、日志分析、链路追踪时作为稳定标识，快速判断当前执行的是哪个 Agent |
| **组件化封装** | 把 Agent 封装成可复用模块（检索助手、SQL 助手、报告生成助手）时保持身份一致 |
| **前端展示与运行态可观测性** | 界面里显示"当前活跃 Agent""本轮输出来源""调用链路中的执行节点" |
| **稳定的运行时身份标识** | 相当于 Agent 的"运行时身份 ID"，方便日志检索、监控统计、链路分析与跨模块协作 |

> [!TIP]
> 官方建议：**生产环境要显式设置 name，不要依赖默认行为**。哪怕你现在只有一个 Agent，将来它被塞进更大的工作流时，一个规范的 name 能省掉很多排查时间。

## 相关

- [创建第一个智能体](/posts/编程学习/langchain学习笔记/13-创建第一个智能体/)
- [给智能体绑定工具与运行机制](/posts/编程学习/langchain学习笔记/14-给智能体绑定工具与运行机制/)
- [Agent的结构化输出](/posts/编程学习/langchain学习笔记/16-agent的结构化输出/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. `create_agent` 里模型和工具是____参数，系统提示词是____参数；它的类型可以是 str 或 `____`
2. 提示词的三条使用建议：明确说明 Agent 的____、定义____格式、说明何时使用____
3. 提示词设置分两种：创建时写死的____设置，和运行时按条件拼的____设置（要中间件）
4. 只想影响**这一次调用**时，可以在 invoke 的 messages 开头加一条 `{"role": "____", ...}` 消息
5. Agent 的名称用 `____` 参数设置；设置后 AI 回复的消息会带上 `Name: ____` 信息
6. name 在**多 Agent 场景**里最常用来区分不同 Agent，官方建议生产环境应该____设置它，而不是依赖默认行为
7. 六个典型场景中的前三个：____归因、消息____标记、调试与 ____ 可读性

> [!TIP]- 填空答案（做完再点开）
> 1. 必需 / 可选 / `SystemMessage`　2. 角色 / 输出 / 工具　3. 静态 / 动态　4. `system`　5. `name` / 名称（你设的名字）　6. 显式　7. 流式输出 / 身份 / trace

### 二、裸写题

- [ ] **2-1 写一段"规范型"系统提示词**
  创建一个天气助手 Agent，系统提示词里同时写清三件事：角色、工作流程（理解查询 → 调用工具 → 简洁回答）、输出格式（天气状况 / 温度 / 注意事项）。然后用同一个问题分别问"有提示词的 Agent"和"没提示词的 Agent"，比较回答的**结构差异**。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：提示词的作用是让输出"可控"，所以要看**格式是否稳定**
  > **二级 · 方法**：`system_prompt="""..."""` 三引号写多行提示词
  > **三级 · 骨架**：把"输出格式"那几行写成列表（`- 天气状况`），模型更容易照做

- [ ] **2-2 用 SystemMessage 类型传提示词**
  把 2-1 的提示词改成 `SystemMessage(...)` 对象传入，确认效果一致。

  > [!TIP]- 提示
  > **一级 · 思路**：str 和 SystemMessage 是同一件事的两种写法
  > **二级 · 方法**：`from langchain.messages import SystemMessage`
  > **三级 · 骨架**：多个字符串直接相邻会**自动拼接**，长指令可以拆成一行一句

- [ ] **2-3 给 Agent 起名字，并确认名字进入了消息**
  用 `name="chat_assistant"` 创建 Agent，调用后遍历消息，找出哪条消息带有 `name` 属性、值是什么。

  > [!TIP]- 提示
  > **一级 · 思路**：name 会写进 Agent 产出的 AIMessage 上
  > **二级 · 方法**：`create_agent(model=model, name="chat_assistant")`
  > **三级 · 骨架**：`msg.pretty_print()` 的输出里会显示 `Name:` 那一行；也可以直接 `getattr(msg, "name", None)`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import os
> from dotenv import load_dotenv
> from langchain.agents import create_agent
> from langchain.chat_models import init_chat_model
> from langchain.messages import SystemMessage
> from langchain.tools import tool
>
> load_dotenv(override=True)
>
> model = init_chat_model(
>     model="deepseek-v4-flash",
>     model_provider="openai",
>     api_key=os.getenv("DEEPSEEK_API_KEY"),
>     base_url=os.getenv("DEEPSEEK_BASE_URL"),
> )
>
> @tool(parse_docstring=True)
> def get_weather(city: str) -> str:
>     """天气查询工具
>
>     Args:
>         city: 城市名称
>     """
>     return f"{city}的天气为晴朗，25°C。"
>
> PROMPT = """你是天气助手。
>
> 工作流程：
> 1. 理解用户的城市查询
> 2. 使用 get_weather 工具获取数据
> 3. 简洁清晰地回答
>
> 输出格式：
> - 天气状况
> - 温度
> - 注意事项（如有）
> """
>
> # ---------- 2-1 有提示词 vs 没提示词 ----------
> agent_with = create_agent(model=model, tools=[get_weather], system_prompt=PROMPT)
> agent_without = create_agent(model=model, tools=[get_weather])
>
> q = "北京的天气怎么样？"
> print("【有提示词】", agent_with.invoke({"messages": [q]})["messages"][-1].content)
> print("【无提示词】", agent_without.invoke({"messages": [q]})["messages"][-1].content)
>
> # ---------- 2-2 用 SystemMessage 传入 ----------
> agent_msg = create_agent(
>     model=model,
>     tools=[get_weather],
>     system_prompt=SystemMessage(
>         "你是天气助手。"
>         "工作流程：1. 理解用户的城市查询 2. 使用 get_weather 工具获取数据 3. 简洁清晰地回答。"
>         "输出格式：天气状况 / 温度 / 注意事项（如有）。"
>     ),
> )
> print("【SystemMessage】", agent_msg.invoke({"messages": [q]})["messages"][-1].content)
>
> # ---------- 2-3 设置 name ----------
> agent_named = create_agent(model=model, tools=[get_weather], name="chat_assistant")
> resp = agent_named.invoke({"messages": ["你好"]})
> for msg in resp["messages"]:
>     print(type(msg).__name__, "| name =", getattr(msg, "name", None))
> # HumanMessage | name = None
> # AIMessage    | name = 'chat_assistant'   ← 名字写在了 AI 回复上
> resp["messages"][-1].pretty_print()      # 输出里能看到 Name: chat_assistant
> ```
