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

### 两个完整例子：加法助手与"重试型"天气助手

**例子 1：用 `SystemMessage` 当系统提示词，看一次完整的工具调用链路。**

```python
from langchain.agents import create_agent
from langchain_core.messages import SystemMessage
from langchain_core.tools import tool
from rich import print as rprint

# 工具：实现两数相加
@tool
def add_numbers(a: int, b: int) -> str:
    """计算并返回两个数的和。"""
    return f"和为：{a + b}"

# 创建数学助手 Agent
agent = create_agent(
    model=model,
    tools=[add_numbers],                                                          # 工具列表
    # system_prompt="你是一个数学助手，解决日常的算术问题"                            # 写法一：字符串
    system_prompt=SystemMessage(content="你是一个数学助手，解决日常的算术问题")     # 写法二：SystemMessage
)

response = agent.invoke(
    {"messages": [
        {"role": "user", "content": "10加上20再加上30是多少？"}
    ]},
)

rprint(response)
# print(response["messages"][-1].content)
```

`rprint(response)` 的输出（只留消息骨架和关键字段）：

```text
{
 'messages': [
   HumanMessage(content='10加上20再加上30是多少？', ...),
   AIMessage(                          # ← 第 1 次工具调用
     content='',
     response_metadata={..., 'finish_reason': 'tool_calls'},
     tool_calls=[{'name': 'add_numbers', 'args': {'a': 10, 'b': 20},
                  'id': 'call_PWuscHI7NFdVbAV9wsMzOWKy', 'type': 'tool_call'}]
   ),
   ToolMessage(content='和为：30', name='add_numbers',
               tool_call_id='call_PWuscHI7NFdVbAV9wsMzOWKy'),      # ← id 对上了
   AIMessage(                          # ← 第 2 次工具调用：把 30 再和 30 相加
     content='',
     tool_calls=[{'name': 'add_numbers', 'args': {'a': 30, 'b': 30},
                  'id': 'call_dZDyMZS1BYRJHdW32uj4z8R8', 'type': 'tool_call'}]
   ),
   ToolMessage(content='和为：60', name='add_numbers',
               tool_call_id='call_dZDyMZS1BYRJHdW32uj4z8R8'),
   AIMessage(                          # ← 最终回答
     content='10加上20再加上30等于 **60**。',
     response_metadata={..., 'finish_reason': 'stop'},
     tool_calls=[]                     # ← 空了，说明任务结束
   )
 ]
}
```

> [!NOTE]
> 这段输出里有几件事特别值得看：
> 1. **工具只会算两个数，模型自己决定调两次**：先 `(10, 20)` 得 30，再 `(30, 30)` 得 60——"怎么拆解任务"是模型干的，不是我们写死的。
> 2. **发起工具调用时 `AIMessage.content` 是空字符串**——所以取最终回答不能图省事拿中间那条（第 18 篇的助手就是靠 `msg.content` 判空来避开这个坑）。
> 3. **`SystemMessage` 走 `system_prompt` 传进去时，不会出现在返回的消息列表里**——`response["messages"]` 的第一条就是 HumanMessage（对比第 14 篇的写法一：提示词写进 `messages` 列表时，它会作为第一条出现在返回值里）。本机实测也一致：用 `system_prompt` 建的 Agent，消息链是 `HumanMessage → AIMessage → ToolMessage → …`，全程没有 SystemMessage。
> 4. 两次调用的 `tool_call_id` 分别对上各自的 `tool_calls[].id`——这是"哪条结果配哪次请求"的唯一依据（第 14 篇细讲过）。

**例子 2：把"重试规则"写进 `system_prompt`，让天气助手自己重试。**

```python
from langchain.agents import create_agent
from langchain.tools import tool
from langchain.messages import SystemMessage, HumanMessage

flag = 0

@tool
def get_weather(city: str):
    """天气查询工具

    Args:
        city: 城市名称
    """
    global flag
    flag += 1
    if flag < 3:
        return "TEMP_UNAVAILABLE: 天气服务暂时不可用，请稍后重试"
    return f"{city}今天天气挺好"

messages = [
    HumanMessage("你好，杭州今天的天气如何？")     # ← 提示词这次不写在 messages 里
]

agent = create_agent(
    model=model,
    tools=[get_weather],
    system_prompt=SystemMessage(                    # ← 规则挂在 Agent 上，每次调用都生效
        "你是一个天气助手。"
        "当工具返回以 'TEMP_UNAVAILABLE:' 开头的结果时，"
        "说明是临时故障，不要立即放弃；"
        "你应再次调用同一个工具，最多重试 3 次。"
        "如果 3 次后仍失败，再向用户说明服务暂时不可用。"
    )
)

response = agent.invoke({"messages": messages})
for msg in response["messages"]:
    msg.pretty_print()
```

输出以 `Human Message` 开头（**没有** System Message），之后是三次 `get_weather` 调用：

```text
================================ Human Message =================================
你好，杭州今天的天气如何？
================================== Ai Message ==================================
Tool Calls:
  get_weather (call_1NZMHHj1xByT0Zx7WhiK6AO1)
================================= Tool Message =================================
Name: get_weather

TEMP_UNAVAILABLE: 天气服务暂时不可用，请稍后重试
...（第 2 轮同样的调用与故障返回）
================================== Ai Message ==================================
杭州今天天气挺好。
```

> [!TIP]
> 两个写法怎么选？**"只影响这一次"用 messages，"整个 Agent 都该遵守"用 `system_prompt`**。
> 重试规则、人设、输出格式这类"规矩"都属于后者——写进 `system_prompt` 后，不管谁来 invoke 都带着它，不用每次自己拼 messages。

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

1. 创建 Agent 时模型和工具是____参数，系统提示词是____参数——但它为 Agent 提供了任务背景、行为准则和操作指南；它的类型可以是 `str`，也可以是 `____`
2. 系统提示词的三条使用建议：明确说明 Agent 的____（一句话定人设，避免语气跑偏）、定义____格式（让回答结构稳定）、说明何时使用____（减少"该调却没调"或"乱调"）
3. 系统提示词还有一个"隐性用途"：____处理异常情况——第 14 篇的自主重试就是靠提示词写的，框架不会替你处理这些规则
4. 提示词的设置方式分两种：创建 Agent 时把提示词写死的____设置，和运行时根据用户/环境拼不同提示词的____设置（后者需要中间件，比如按用户权限给不同指令）
5. `str` 和 `SystemMessage` 两种写法**效果一样**；`SystemMessage` 更适合把长指令____拼接（多个字符串直接相邻会____），可读性更好
6. 只想在**某一次调用**里临时给指令，可以不用 `system_prompt`，直接在 `invoke` 的消息列表开头塞一条 `{"role": "____", "content": ...}`；区别是 `system_prompt` 作用于____，而写在消息列表里的只影响____
7. 加法助手的例子里：工具只会算两个数，**模型自己决定调____次**（先 `(10, 20)` 得 30，再 `(30, 30)` 得 60）——"怎么拆解任务"是模型干的；发起工具调用时 `AIMessage.content` 是____，所以取最终回答不能图省事拿中间那条
8. 用 `system_prompt` 传进去的 `SystemMessage` **不会出现在返回的消息列表里**——`response["messages"]` 的第一条就是____；两次调用的 `____` 分别对上各自的 `tool_calls[].id`
9. Agent 的名称用 `____` 参数设置，最直观的效果是**AI 回复的消息带上这个名字**（打印时会显示 `Name: ____`）；六个典型场景包括流式输出____、消息身份标记、调试与 ____ 可读性、组件化封装、前端展示与可观测性、稳定的运行时身份标识；官方建议**生产环境要显式设置 name**，别依赖默认行为

> [!TIP]- 填空答案（做完再点开）
> 1. 必需 / 可选 / `SystemMessage`　2. 角色 / 输出 / 工具　3. 兜底　4. 静态 / 动态　5. 分段（拆成多段） / 自动拼接　6. `system` / 整个 Agent / 这一次调用　7. 两 / 空字符串（`''`）　8. HumanMessage / `tool_call_id`　9. `name` / 你设的名字 / 归因 / trace

### 二、裸写题

- [ ] **2-1 写一段"规范型"系统提示词**
  创建一个天气助手 Agent，系统提示词里同时写清三件事：**角色**、**工作流程**（理解查询 → 调用工具 → 简洁回答）、**输出格式**（天气状况 / 温度 / 注意事项）。然后用同一个问题分别问"有提示词的 Agent"和"没提示词的 Agent"，比较两次回答的**结构差异**。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：提示词的作用是让输出"可控"，所以重点看**格式是否稳定**
  > **二级 · 方法**：`system_prompt="""..."""` 用三引号写多行提示词
  > **三级 · 骨架**：把"输出格式"那几行写成列表（`- 天气状况`、`- 温度`），模型更容易照做

- [ ] **2-2 换个类型传提示词**
  把 2-1 的提示词改成"消息对象"的形式传进去（不再给字符串），确认效果一致；写的时候把长指令**一行一句**拆开。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：字符串和消息对象是同一件事的两种写法，后者可读性好一点
  > **二级 · 方法**：`from langchain.messages import SystemMessage` + `system_prompt=SystemMessage(...)`
  > **三级 · 骨架**：多个字符串直接相邻会**自动拼接**，长指令可以拆成一行一句

- [ ] **2-3 给 Agent 起名字，并确认名字进了消息**
  创建一个带名字的 Agent（比如叫 `chat_assistant`），调用后遍历消息，找出哪条消息带有"名字"属性、值是什么；也可以打印那条消息，看输出里的 `Name:` 那一行。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：名字会写进 Agent 产出的 AI 回复上，用户消息上没有
  > **二级 · 方法**：`create_agent(model=model, name="chat_assistant")` + `getattr(msg, "name", None)`
  > **三级 · 骨架**：`msg.pretty_print()` 的输出里会显示 `Name: chat_assistant`

- [ ] **2-4 加法助手：看模型自己拆解任务**
  写一个只会把两个数相加的工具，创建一个数学助手 Agent（系统提示词用消息对象的形式传），问"10 加上 20 再加上 30 是多少？"。然后检查四件事：
  ① 模型一共发起了几次工具调用 ② 每次调用请求的正文内容是什么 ③ 两次请求的编号与两条结果的配对编号是否各自对上 ④ 返回的消息列表第一条是什么类型（系统消息去哪了）。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：工具只会算两个数，"怎么拆成两步"完全是模型自己决定的；系统消息的"消失"是 `system_prompt` 路线的特征
  > **二级 · 方法**：`@tool` + `f"和为：{a + b}"`；`system_prompt=SystemMessage(content="你是一个数学助手，解决日常的算术问题")`
  > **三级 · 骨架**：数调用次数可以用 `getattr(msg, "tool_calls", None)` 过滤；配对编号看 `msg.tool_call_id` 和第 1、2 次请求的 `tool_calls[0]["id"]`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import os
>
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
> # ---------- 2-1 有提示词 vs 没提示词 ----------
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
> agent_with = create_agent(model=model, tools=[get_weather], system_prompt=PROMPT)
> agent_without = create_agent(model=model, tools=[get_weather])
>
> q = "北京的天气怎么样？"
> print("【有提示词】", agent_with.invoke({"messages": [q]})["messages"][-1].content)
> print("【无提示词】", agent_without.invoke({"messages": [q]})["messages"][-1].content)
> # 有提示词的版本会按"天气状况 / 温度 / 注意事项"分点回答，格式稳定
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
>
> # ---------- 2-4 加法助手 ----------
> @tool
> def add_numbers(a: int, b: int) -> str:
>     """计算并返回两个数的和。"""
>     return f"和为：{a + b}"
>
> agent_math = create_agent(
>     model=model,
>     tools=[add_numbers],
>     # system_prompt="你是一个数学助手，解决日常的算术问题",                       # 写法一：字符串
>     system_prompt=SystemMessage(content="你是一个数学助手，解决日常的算术问题"),   # 写法二：SystemMessage
> )
>
> resp2 = agent_math.invoke({"messages": [{"role": "user", "content": "10加上20再加上30是多少？"}]})
>
> for msg in resp2["messages"]:
>     print(type(msg).__name__, "| content =", repr(msg.content[:20]),
>           "| tool_calls =", len(getattr(msg, "tool_calls", []) or []))
> # HumanMessage | content = '10加上20再加上30是多少？'  | tool_calls = 0
> # AIMessage    | content = ''                        | tool_calls = 1   ← 第 1 次调用 (10, 20)
> # ToolMessage  | content = '和为：30'                 | tool_calls = 0
> # AIMessage    | content = ''                        | tool_calls = 1   ← 第 2 次调用 (30, 30)
> # ToolMessage  | content = '和为：60'                 | tool_calls = 0
> # AIMessage    | content = '10加上20再加上30等于 **60**。' | tool_calls = 0  ← 最终回答
>
> print("工具一共被调了几次:",
>       len([m for m in resp2["messages"] if getattr(m, "tool_calls", None)]))   # 2
> print("第一条消息的类型:", type(resp2["messages"][0]).__name__)   # HumanMessage：SystemMessage 不在列表里
>
> for msg in resp2["messages"]:
>     if type(msg).__name__ == "ToolMessage":
>         print("结果", msg.content, "的配对编号:", msg.tool_call_id)
> # 和为：30 的配对编号: call_add1    ← 和第 1 次请求的 tool_calls[0]["id"] 一致
> # 和为：60 的配对编号: call_add2    ← 和第 2 次请求的 tool_calls[0]["id"] 一致
> ```
