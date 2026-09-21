---
title: Tools工具定义与调用
published: 2026-09-21
description: 工具让大模型从"认识世界"走向"改变世界"：工具的两种定义方式、docstring 规范、参数 Schema 与完整的调用流程
tags:
  - LangChain
  - AI
order: 9
---

## 为什么需要工具

只有"生成文本"这种**纸上谈兵**的能力，是构建不了强大 AI 应用的。**工具是赋予大语言模型与外部世界交互能力的关键组件**——借助它，模型才能执行搜索、计算、数据库查询、发邮件、调第三方 API 等。

> 有了工具，大模型才能从"**认识世界**"走向"**改变世界**"。

工具是构建智能体的**核心要素之一**（还记得那个公式吗：`Agent = LLM + Planning + **Tools** + Memory + Action）。

## 工具调用 = 函数调用

在 LangChain 中，**工具（Tools）实际上是指明确定义了输入和输出的可调用函数**。因此"工具调用（Tool Calling）"也被称为"**函数调用（Function Calling）**"。

两种调用方式：

| 方式 | 用法 | 适合 |
| --- | --- | --- |
| 直接调用 | `get_weather.invoke({"city": "北京"})` | 测试、单元验证 |
| 模型绑定调用 | `model.bind_tools([...])` 后由**模型决定**何时调、传什么参数 | 真正的智能体 |

## 工具调用的整体流程

```text
用户提问
   ↓
模型结合上下文判断：要不要调工具？调哪个？参数是什么？
   ↓
应用执行工具（真正去查天气、查数据库、发邮件…）
   ↓
把工具结果回传给模型
   ↓
模型基于结果生成最终回复
```

**大模型能根据对话上下文决定何时调用工具以及传递哪些参数**——这也是它比"硬编码 if-else"强的地方。我们写的 LangChain 应用，对应的就是图里的"AI 助手/应用"那一环。

### 从 Message 流转看

```python
# 1. 绑定工具（模型 + 工具列表 → 带工具能力的模型）
model_with_tools = model.bind_tools([get_weather])

messages = [HumanMessage("今天北京天气如何")]

# 2. 第一次调用：模型不直接回答，而是"要求调用工具"
response = model_with_tools.invoke(messages)
print(response.tool_calls)
# [{'name': 'get_weather', 'args': {'city': '北京'}, 'id': 'call_xxx'}]

# 3. 把这条 AI 消息追加进历史
messages.append(response)

# 4. 应用执行工具，把结果包成 ToolMessage（tool_call_id 必须对应）
tool_result = get_weather.invoke(response.tool_calls[0]["args"])
messages.append(ToolMessage(content=tool_result, tool_call_id=response.tool_calls[0]["id"]))

# 5. 再调一次模型：这次它拿着工具结果生成最终回复
final = model_with_tools.invoke(messages)
print(final.content)
```

> [!IMPORTANT]
> 关键点：**模型自己不执行工具**。它只是"提出调用请求（tool_calls）"，真正执行的是你的代码，执行完再以 `ToolMessage` 回传——**这个"请求→执行→回传"的循环，就是智能体的最小骨架**。

## 定义方式一：不用 @tool

直接把普通函数放进 `bind_tools()`，LangChain 会在内部把它转成工具描述（`convert_to_openai_tool`）：

```python
def get_weather(city: str):
    """获取天气的工具"""
    return f"{city}天气晴朗"

model_with_tools = model.bind_tools([get_weather])
```

`convert_to_openai_tool(get_weather)` 的输出包含 `type` 和 `function` 两部分——这就是最终发给模型的"工具说明书"。

## 定义方式二：@tool 装饰器（推荐）

用 `@tool` 装饰器修饰，可以**自动把普通 Python 函数转化为智能体可调用的工具**。这是最直接、代码量最少的方式。

```python
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取指定城市的天气信息

    参数:
        city: 城市名称，如"北京"、"上海"

    返回:
        天气信息字符串
    """
    return f"{city}天气晴朗"
```

`@tool` 会从 **docstring** 生成工具描述，所以**必须遵循 Google docstring 规范**。没有 docstring 会直接报错：

```text
ValueError: Function must have a docstring if description not provided.
```

### docstring 为什么这么重要

**模型只能通过 description 判断"这个工具是干什么的、什么时候该用"**。写得含糊，模型就选错工具或该调不调。所以：

| 要素 | 说明 |
| --- | --- |
| 一句话功能说明 | 说清"做什么"，最好说清"什么时候用" |
| 参数说明 | 每个参数的含义、格式、取值范围 |
| 返回值说明 | 返回什么，方便模型解读结果 |

### 工具对象的属性（核对过真实行为）

```python
print(get_weather.name)         # get_weather（默认取函数名）
print(get_weather.description)  # 从 docstring 提取
print(get_weather.args)         # {'city': {'title': 'City', 'type': 'string'}}
print(get_weather.invoke({"city": "北京"}))   # 北京天气晴朗
```

- 改名字：`@tool("查天气")` 或 `@tool(name_or_callable="查天气")`
- 参数类型注解（`city: str`）、默认值都会被转成 JSON Schema 的一部分，告诉模型"该传什么"

## 用 Pydantic 定义参数结构：args_schema

参数多、需要校验时，用 Pydantic 模型定义 `args_schema`：

```python
from pydantic import BaseModel, Field
from langchain.tools import tool

class WeatherArgs(BaseModel):
    city: str = Field(description="城市名称，如北京")
    unit: str = Field(default="celsius", description="温度单位：celsius 或 fahrenheit")

@tool(args_schema=WeatherArgs)
def get_weather(city: str, unit: str = "celsius") -> str:
    """获取指定城市的天气信息"""
    return f"{city} 的天气：25 ({unit})"
```

> [!TIP]
> 用 Pydantic 的好处：**类型安全 + 参数校验**。模型传参前，Pydantic 会先验证类型与有效性，参数写错能立刻发现，而不是让模型拿到一个莫名的报错。

## 相关

- [Message与对话历史](/posts/编程学习/langchain学习笔记/07-message与对话历史/)
- [Tools进阶与实战](/posts/编程学习/langchain学习笔记/10-tools进阶与实战/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 工具是赋予大模型与 ____ 交互能力的关键组件，让模型从"认识世界"走向"____"
2. 工具实际上是指明确定义了 ____ 和 ____ 的可调用函数，所以工具调用也叫 ____
3. 工具的两种调用方式：____（测试用）与 ____（由模型决定何时调）
4. 用 `@tool` 时工具描述来自 ____，因此必须遵循 ____ docstring 规范；没有 docstring 会报 ____
5. 工具对象的三个属性：`name`（名字）、`description`（描述）、`____`（参数结构）
6. 定义方式一不用 @tool，直接把函数传给 `model.____()`；内部会用 `____` 生成工具描述
7. 模型决定调用工具时，返回的 AI 消息里带着 ____（含 name/args/id）
8. 应用执行完工具后要用 ____ 消息把结果回传，其中的 ____ 必须和请求里的 id 对应
9. 参数复杂时用 Pydantic 定义 `____`，好处是类型安全与参数 ____

> [!TIP]- 填空答案（做完再点开）
> 1. 外部世界 / 改变世界　2. 输入 / 输出 / 函数调用（Function Calling）　3. 直接调用 / 模型绑定调用　4. docstring / Google / ValueError　5. `args`　6. `bind_tools` / `convert_to_openai_tool`　7. `tool_calls`　8. `ToolMessage` / `tool_call_id`　9. `args_schema` / 校验

### 二、裸写题

- [ ] **2-1 写一个工具并直接调用**
  用 `@tool` 定义一个 `add(a: int, b: int)` 工具（带规范 docstring），打印它的 name/description/args，并直接 invoke 一次。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：先定义再观察它的三个属性，最后手动调用
  > **二级 · 方法**：`@tool` / `add.name` / `add.invoke({"a": 1, "b": 2})`
  > **三级 · 骨架**：docstring 里写清功能、参数、返回

- [ ] **2-2 绑定工具让模型自己决定**
  定义一个查天气工具，用 `model.bind_tools([...])` 绑定，问"今天北京天气如何"，打印返回消息里的 `tool_calls`。

  > [!TIP]- 提示
  > **一级 · 思路**：模型不会直接回答，而是"申请调用工具"
  > **二级 · 方法**：`model_with_tools = model.bind_tools([get_weather])`
  > **三级 · 骨架**：`print(response.tool_calls)` 看 name/args/id

- [ ] **2-3 走完"请求→执行→回传"的完整循环**
  在第 2-2 基础上：执行工具 → 构造 `ToolMessage`（tool_call_id 对应）→ 再调一次模型，拿到最终回复。

  > [!TIP]- 提示
  > **一级 · 思路**：这是智能体的最小骨架
  > **二级 · 方法**：`messages.append(response)` → 执行 → `ToolMessage(content=..., tool_call_id=...)` → `model_with_tools.invoke(messages)`
  > **三级 · 骨架**：注意顺序：先追加 AI 消息，再追加工具结果

- [ ] **2-4 用 Pydantic 定义参数**
  用 `args_schema`（Pydantic 模型 + Field 描述）重新定义查天气工具，给 `unit` 参数一个默认值。

  > [!TIP]- 提示
  > **一级 · 思路**：把参数结构写成一个类
  > **二级 · 方法**：`class WeatherArgs(BaseModel)` + `@tool(args_schema=WeatherArgs)`
  > **三级 · 骨架**：`Field(default="celsius", description="温度单位")`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import os
> from dotenv import load_dotenv
> from langchain.chat_models import init_chat_model
> from langchain.tools import tool
> from langchain_core.messages import HumanMessage, ToolMessage
> from pydantic import BaseModel, Field
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
> # 2-1 定义并直接调用
> @tool
> def add(a: int, b: int) -> int:
>     """把两个整数相加
>
>     参数:
>         a: 第一个整数
>         b: 第二个整数
>
>     返回:
>         两数之和
>     """
>     return a + b
>
> print(add.name, "|", add.description.split("\n")[0], "|", add.args)
> print("直接调用:", add.invoke({"a": 1, "b": 2}))
>
> # 2-2 / 2-3 绑定工具 + 完整循环
> @tool
> def get_weather(city: str) -> str:
>     """获取指定城市的天气信息
>
>     参数:
>         city: 城市名称，如"北京"
>     """
>     return f"{city}天气晴朗，25℃"
>
> model_with_tools = model.bind_tools([get_weather])
>
> messages = [HumanMessage("今天北京天气如何")]
> response = model_with_tools.invoke(messages)
> print("模型要求调用的工具:", response.tool_calls)
>
> if response.tool_calls:
>     messages.append(response)                                  # 追加 AI 消息
>     call = response.tool_calls[0]
>     result = get_weather.invoke(call["args"])                  # 执行工具
>     messages.append(ToolMessage(content=result, tool_call_id=call["id"]))  # 回传结果
>     final = model_with_tools.invoke(messages)
>     print("最终回复:", final.content)
>
> # 2-4 用 Pydantic 定义参数
> class WeatherArgs(BaseModel):
>     city: str = Field(description="城市名称，如北京")
>     unit: str = Field(default="celsius", description="温度单位：celsius 或 fahrenheit")
>
> @tool(args_schema=WeatherArgs)
> def get_weather_v2(city: str, unit: str = "celsius") -> str:
>     """获取指定城市的天气信息"""
>     return f"{city} 的天气：25 ({unit})"
>
> print(get_weather_v2.args)
> ```