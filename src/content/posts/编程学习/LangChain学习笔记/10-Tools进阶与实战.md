---
title: Tools进阶与实战
published: 2026-09-21
description: 多工具调用、tool_choice 强制/禁止使用工具，以及 DeepSeek 思考模式 + 工具调用报 400 的排查与规避
tags:
  - LangChain
  - AI
order: 10
---

## 多工具调用

绑定多个工具后，**模型会自己挑**——根据用户问题判断该用哪个（甚至一次调用多个）：

```python
@tool
def get_weather(city: str) -> str:
    """获取指定城市的天气信息

    参数:
        city: 城市名称，如"北京"
    """
    return f"{city}天气晴朗，25℃"

@tool
def get_time(city: str) -> str:
    """获取指定城市的当前时间

    参数:
        city: 城市名称
    """
    return f"{city}当前时间 14:30"

model_with_tools = model.bind_tools([get_weather, get_time])

# 问天气 → 只调 get_weather；问"北京天气和现在几点" → 可能同时调两个
response = model_with_tools.invoke("北京今天天气怎么样？")
print(response.tool_calls)
```

**多工具场景下的注意点**：

| 注意点 | 说明 |
| --- | --- |
| 工具名要能区分 | `get_weather` / `get_time` 一目了然；叫 `func1`、`tool_a` 模型会选错 |
| description 要写清"什么时候用" | 模型只凭描述选择，两个工具描述雷同就会乱选 |
| 可能要循环多次 | 模型可能连续需要多个工具结果——**用循环直到它不再要求调用工具** |

```python
messages = [HumanMessage("北京今天天气怎么样，现在几点？")]

while True:
    response = model_with_tools.invoke(messages)
    messages.append(response)

    if not response.tool_calls:      # 不再要求调工具 → 已给出最终答案
        print("最终回复:", response.content)
        break

    for call in response.tool_calls:          # 一次可能多个工具调用
        tool_map = {"get_weather": get_weather, "get_time": get_time}
        result = tool_map[call["name"]].invoke(call["args"])
        messages.append(ToolMessage(content=result, tool_call_id=call["id"]))
```

## tool_choice：控制是否使用工具

`bind_tools` 可以传 `tool_choice` 参数，控制模型**是否强制使用工具**（最终作为请求体的 `tool_choice` 字段传给模型）：

| 取值 | 含义 |
| --- | --- |
| `"none"` | 模型**不会**调用任何工具 |
| `"auto"` | **默认值**：模型自主决定不调、或调任意数量 |
| `"required"` | 模型**必须**调用工具，数量不限 |
| `"any"` | 等价于 `required` |

```python
# 强制必须调用工具
model_with_tools = model.bind_tools([get_weather, get_time], tool_choice="required")

# 明确禁止调用工具（只让它直接回答）
model_with_tools = model.bind_tools([get_weather], tool_choice="none")
```

> [!TIP]
> `tool_choice="required"` 在"必须先查数据再回答"的场景很有用——比如客服系统里**必须**先查订单再给结论，不允许模型凭记忆瞎答。

## 常见坑：DeepSeek 思考模式 + 工具调用报 400

这是用 DeepSeek **官方 API** 时容易踩的坑，值得单独记一下。

### 现象

报错信息：

```text
BadRequestError: Error code: 400 - {'error': {'message': 'The `reasoning_content` in the
thinking mode must be passed back to the API.', 'type': 'invalid_request_error', ...}}
```

意思很直白：**思考模式下，必须把 `reasoning_content`（思考过程）传回 API**。

### 触发条件（关键）

**只有"思考模式 + 工具调用"同时出现时才会触发**：

| 场景 | 是否报错 |
| --- | --- |
| 非思考模式 + 工具调用 | ✅ 正常 |
| 思考模式 + 不用工具（普通问答） | ✅ 正常（此时官方不要求回传思维链） |
| **思考模式 + 工具调用** | ❌ 报 400 |

### 根因

1. DeepSeek 思考模式返回的思考内容，被 LangChain 保存在 `AIMessage.additional_kwargs` 的 `reasoning_content` 字段里
2. 但 LangChain 的标准序列化组件在发下一次请求时，**不会自动把这个思考内容提取并回传**
3. 于是模型收不到自己上一轮的思考过程 → 服务端直接 400

### 两种规避方案

**方案一（推荐）：工具调用时禁用思考模式**

```python
from langchain_deepseek import ChatDeepSeek

model = ChatDeepSeek(
    model="deepseek-v4-flash",
    extra_body={
        "thinking": {
            "type": "disabled"      # 把 enabled 改成 disabled
        }
    },
)
```

**方案二：换用 `deepseek-reasoner` 模型 ID**

按官方文档，`deepseek-reasoner` 等价于 `deepseek-v4-flash` 的思考模式；实测用它调用工具**不会报错**（调试发现它发出的请求体里不含 `reasoning_content`）。

> [!WARNING]
> 这个坑只针对 **DeepSeek 官方 API + 思考模式**。用第三方中转/兼容服务（如 OpenCode Go、CloseAI 等）时，是否触发取决于服务端如何实现思考内容的回传，遇到同类报错可以先用"关掉思考模式"验证。

> [!TIP]
> 排查这类"模型返回 400"的问题时，LangSmith（第 6 章）是利器：直接看**实际发出去的请求体**——你就知道是不是少了某个字段。

## 相关

- [Tools工具定义与调用](/posts/编程学习/langchain学习笔记/09-tools工具定义与调用/)
- [结构化输出](/posts/编程学习/langchain学习笔记/11-结构化输出/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 绑定多个工具后，模型会自己判断该用____（甚至一次调用____）
2. 多工具场景要注意：工具名要能____、description 要写清____、可能要循环直到模型不再要求____
3. 循环处理工具调用的退出条件是：`if not response.____:` 就说明已给出最终答案
4. `tool_choice` 三个取值：____ 不调用、____ 默认自主决定、____ 必须调用（`any` 等价于它）
5. DeepSeek 思考模式 + 工具调用会报 ____ 错误，提示必须把 ____ 传回 API
6. 该问题的触发条件是____ 与 ____ 同时存在；根因是 LangChain 序列化时不会自动回传 ____ 里的思考内容
7. 两种规避方案：给 `ChatDeepSeek` 传 `extra_body={"thinking": {"type": "____"}}`，或换用 ____ 模型 ID

> [!TIP]- 填空答案（做完再点开）
> 1. 哪个 / 多个　2. 区分 / 什么时候用 / 调用工具　3. `tool_calls`　4. `"none"` / `"auto"` / `"required"`　5. 400 / `reasoning_content`　6. 思考模式 / 工具调用 / `additional_kwargs`　7. `disabled` / `deepseek-reasoner`

### 二、裸写题

- [ ] **2-1 两个工具让模型自己选**
  定义"查天气"和"查时间"两个工具并一起绑定，分别问"北京天气"和"北京现在几点"，观察 `tool_calls` 里选了哪个工具。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：模型凭什么选？凭工具的 name 和 description
  > **二级 · 方法**：`model.bind_tools([get_weather, get_time])`
  > **三级 · 骨架**：分别打印两次响应的 `tool_calls`

- [ ] **2-2 用循环处理多轮工具调用**
  写一个循环：调用模型 → 若有 `tool_calls` 就执行并回传 → 直到没有 `tool_calls` 时打印最终回复。

  > [!TIP]- 提示
  > **一级 · 思路**：这就是智能体的最小骨架
  > **二级 · 方法**：`while True` + `if not response.tool_calls: break`
  > **三级 · 骨架**：用字典 `{"工具名": 工具对象}` 做分发

- [ ] **2-3 强制使用工具**
  用 `tool_choice="required"` 绑定工具，问一个明显不需要工具的问题，观察模型仍然会调用工具。

  > [!TIP]- 提示
  > **一级 · 思路**：对比 `auto` 与 `required` 的表现差异
  > **二级 · 方法**：`model.bind_tools([...], tool_choice="required")`
  > **三级 · 骨架**：再试 `tool_choice="none"` 看看模型如何直接回答

> [!TIP]- 参考答案（做完再点开）
> ```python
> import os
> from dotenv import load_dotenv
> from langchain.chat_models import init_chat_model
> from langchain.tools import tool
> from langchain_core.messages import HumanMessage, ToolMessage
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
> @tool
> def get_weather(city: str) -> str:
>     """获取指定城市的天气信息
>
>     参数:
>         city: 城市名称，如"北京"
>     """
>     return f"{city}天气晴朗，25℃"
>
> @tool
> def get_time(city: str) -> str:
>     """获取指定城市的当前时间
>
>     参数:
>         city: 城市名称
>     """
>     return f"{city}当前时间 14:30"
>
> tools = [get_weather, get_time]
> tool_map = {t.name: t for t in tools}
>
> # 2-1 两个工具让模型自己选
> model_with_tools = model.bind_tools(tools)
> for q in ["北京今天天气怎么样？", "北京现在几点了？"]:
>     r = model_with_tools.invoke(q)
>     print(q, "→", [c["name"] for c in r.tool_calls])
>
> # 2-2 循环处理（智能体最小骨架）
> messages = [HumanMessage("北京今天天气怎么样，现在几点？")]
> while True:
>     response = model_with_tools.invoke(messages)
>     messages.append(response)
>     if not response.tool_calls:
>         print("最终回复:", response.content)
>         break
>     for call in response.tool_calls:
>         result = tool_map[call["name"]].invoke(call["args"])
>         messages.append(ToolMessage(content=result, tool_call_id=call["id"]))
>
> # 2-3 强制使用工具
> forced = model.bind_tools(tools, tool_choice="required")
> r = forced.invoke("你好呀")      # 明明不需要工具，也会被强制调用
> print("required →", [c["name"] for c in r.tool_calls])
>
> no_tool = model.bind_tools(tools, tool_choice="none")
> r = no_tool.invoke("北京今天天气怎么样？")
> print("none →", r.content[:40], "| tool_calls:", r.tool_calls)
> ```