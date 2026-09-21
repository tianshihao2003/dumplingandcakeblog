---
title: Agent的结构化输出
published: 2026-09-21
description: Agent 用 response_format 做结构化输出：四种策略（ProviderStrategy/ToolStrategy/自动/None）的区别与实测请求体、ToolStrategy 的三个参数与伪 ToolMessage，以及 handle_errors 的五种取值
tags:
  - LangChain
  - AI
order: 16
---

第 6 章学过**模型**的结构化输出（`with_structured_output`）。**Agent** 也能做结构化输出，但用法和时机都不一样——这一篇讲清楚区别，以及四种策略怎么选。

## 模型 vs Agent 的结构化输出

| 维度 | 模型的结构化输出 | Agent 的结构化输出 |
| --- | --- | --- |
| **操作对象** | 大模型对象 | Agent |
| **解析时机** | 每次模型调用生成 `AIMessage` 时都会解析 | **仅在 Agent 决定"任务结束"并输出最终答案时**解析 |
| **数据流转** | 模型 → 结构化对象 | 模型 → 工具 → 反思 → …… → 结构化对象 |
| **绑定方式** | `with_structured_output` | `response_format` 参数 |
| **适用场景** | 单次、确定性的任务（提取字段、翻译、分类） | 多步、复杂推理的任务（查文档后汇总报表） |

一句话：**模型的结构化输出是"一问一答的格式约束"，Agent 的结构化输出是"整段任务结束时的交付格式"**。

## 四种策略

`create_agent()` 通过 `response_format` 参数设置期望的输出模式，支持四类取值：

```python
response_format: Union[
    ToolStrategy[StructuredResponseT],
    ProviderStrategy[StructuredResponseT],
    type[StructuredResponseT],     # 直接给类型（自动选择）
    None,
]
```

模型生成结构化数据后，系统会自动捕获、验证，并把结果存进 **Agent 状态的 `structured_response` 键**：

```python
if "structured_response" in result:
    analysis = result["structured_response"]
```

### ① ProviderStrategy：用模型厂商的原生能力

"原生结构化输出"指大模型提供商通过 API 直接在**响应阶段强制保证**输出格式符合规范的能力（比如 OpenAI 的 strict json_schema）。**只适用于支持原生结构化输出的模型**，如 OpenAI、Anthropic Claude、xAI Grok 等。

```python
from langchain.agents.structured_output import ProviderStrategy
from pydantic import BaseModel, Field

class ContactInfo(BaseModel):
    """个人联系信息"""
    name: str = Field(description="姓名")
    email: str = Field(description="电子邮箱")
    phone: str = Field(description="手机号")

agent = create_agent(model=model, response_format=ProviderStrategy(ContactInfo))
```

> [!NOTE]
> **实测看看它到底发了什么请求**（用假服务端抓包）：
> - 请求体里**没有 tools**，而是多了一个 `response_format` 字段：
>   ```text
>   {'response_format': {'type': 'json_schema',
>                        'json_schema': {'name': 'ContactInfo', 'strict': False,
>                                        'schema': {'properties': {'name': {'description': '姓名', ...}}}}}}
>   ```
> - 模型按原生 JSON Schema 返回内容（不是工具调用），LangChain 再解析成 Pydantic 对象。
>
> 这也解释了为什么它**只认支持原生结构化输出的模型**：换到不支持的模型上，这个字段会被忽略或报错。

### ② ToolStrategy：用工具调用实现（推荐）

对于**不支持原生结构化输出**的模型，LangChain 用"工具调用"的方式实现结构化输出——**把 Schema 当成一个工具传给模型**，模型"调用"它，参数就是结构化数据。

```python
from langchain.agents.structured_output import ToolStrategy

agent = create_agent(model=model, response_format=ToolStrategy(ContactInfo))
response = agent.invoke({
    "messages": [HumanMessage("从这段话中抽取结构化信息：小明的邮箱地址为：songhk@atguigu.com，手机号：12345678912")]
})
print(response["structured_response"])
# name='小明' email='songhk@atguigu.com' phone='12345678912'
```

> [!IMPORTANT]
> **ToolStrategy 会往消息列表末尾追加一条"伪 ToolMessage"**——让链路完整（模型发了工具调用，总要有工具响应），但**实际上没有执行任何工具**。
>
> 实测一次调用的完整消息流：
>
> ```text
> HumanMessage    content='从这段话中抽取结构化信息：小明的邮箱 songhk@atguigu.com…'
> AIMessage       content=''             ← 发起工具调用（工具名就是 Schema 类名 ContactInfo）
> ToolMessage     name='ContactInfo'     ← 伪消息，内容是 "Returning structured response: name='小明' …"
> ```
>
> 而返回的字典里有两个键：`['messages', 'structured_response']`，`structured_response` 就是 **Pydantic 对象**（`type(...)` 是 `ContactInfo`）。

**官方推荐用 ToolStrategy**：它适用于**任何支持工具调用的现代模型**，兼容性最好。

### ③ 直接传类型 / AutoStrategy：自动选择

把类型直接给 `response_format`，LangChain 会自动包装成 `AutoStrategy`，**自动选择策略**：支持原生结构化输出的模型优先用 ProviderStrategy，否则用 ToolStrategy。

```python
agent = create_agent(
    model=model,
    response_format=ContactInfo,     # Auto-selects ProviderStrategy/ToolStrategy
)
print(result["structured_response"])
# name='John Doe' email='john@atguigu.com' phone='(010) 56253825'
```

> [!WARNING]
> 课程提到：**LangChain 1.0 及以上版本不再支持直接传类型**，必须显式写 `ToolStrategy` 或 `ProviderStrategy`（但经测试 **1.2 版本还能用**）。
> **建议**：新代码一律显式写策略，别依赖这种"自动"——将来版本收紧时会直接报错。

### ④ None（默认）

`response_format=None` 是默认配置，表示**不做结构化输出**，Agent 用自然语言回答。

## ToolStrategy 详解

```python
class ToolStrategy(Generic[SchemaT]):
    schema: type[SchemaT]                                    # 必需
    tool_message_content: str | None                          # 可选
    handle_errors: Union[bool, str, type[Exception], tuple[type[Exception], ...], Callable[[Exception], str]]   # 可选，默认 True
```

### 参数1：schema（支持哪些 Schema）

与模型结构化输出一致，支持 **Pydantic 模型、TypedDict、JSON Schema、数据类（@dataclass）**，另外还支持**联合类型** `Union[类型1, 类型2]`——允许模型根据输入内容选择最匹配的数据结构：

```python
agent = create_agent(
    model=model,
    response_format=ToolStrategy(Union[ContactInfo, EventDetails]),
)
```

> [!NOTE]
> **TypedDict 当 Schema 的三条要点**（第 12 篇实测过它不做运行时校验）：
> 1. 字段写成 `Annotated[类型, 默认值, "描述"]` 格式
> 2. 可选字段用 `Optional` 包装，默认值也写在 `Annotated` 里
> 3. **TypedDict 不支持运行时验证**——写错了不会报错，只会悄悄出错

### 参数2：tool_message_content（自定义伪消息）

既然那条 ToolMessage 是"假的"，它的内容就可以自己定：**默认用展示输出数据的标准语句**（`Returning structured response: ...`），也可以换成更自然的说法。

```python
agent = create_agent(
    model=model,
    response_format=ToolStrategy(
        ContactInfo,
        tool_message_content="提取完成！",
    ),
)
```

有什么用？两个场景：

1. 在最终用户可见的对话流里，**用更自然的消息替代原始数据**（不然用户会看到一大串字段）
2. 用简短的确认信息替代很长的数据块，**减少 token 消耗**

> [!TIP]
> 无论 `tool_message_content` 怎么设，**结构化数据最终都会正确存进 `result["structured_response"]`**——自定义消息只影响对话历史里的那一条记录。

### 参数3：handle_errors（校验失败怎么办）

受限于模型能力，输出**可能不符合格式要求**。`handle_errors` 决定这时候怎么办：

| 取值 | 行为 | 适用场景 |
| --- | --- | --- |
| `True`（默认） | 捕获所有异常，用 LangChain **内置的错误消息模板**提示模型重试 | 大多数通用场景 |
| `False` | **关闭重试**，任何异常直接抛出、中断程序 | 需要自己处理异常 / 调试 |
| `"自定义字符串"` | 捕获所有异常，但把**固定字符串**当错误消息回给模型 | 需要统一、友好的提示或业务引导 |
| `ExceptionType` | **只捕获指定类型**（如 `ValueError`）的异常并重试，其他直接抛出 | 精准控制，只重试特定错误 |
| `callable` | 用**自定义函数**处理异常，可按异常类型返回不同提示 | 复杂、精细化的错误处理 |

**最典型的错误**是"多结构化输出错误"：模型本该输出**一个**结构化结果，却发起了**多个**工具调用请求。

```python
agent = create_agent(
    model=model,
    response_format=ToolStrategy(
        Union[ContactInfo, EventDetails],
        tool_message_content="提取完成！",
        handle_errors=True,
        # handle_errors="请检查输入数据"
    ),
)
```

这种情况下：

1. 用 `Union[ContactInfo, EventDetails]` 指定多个类型时，**最终只会转换成一种**结构化类型输出
2. 内部生成结构化类型的工具会报错，此时 `handle_errors=True`（默认）开始发挥作用：系统生成一条 ToolMessage，明确告诉模型
   `Error: Model incorrectly returned multiple structured responses (ContactInfo, EventDetails) when only one is expected.`
   模型收到这个精准反馈后会**重新推理**，最终选一个最符合要求的 Schema
3. 如果 `handle_errors=False`，程序**直接报错**

常见的两个异常类型：`MultipleStructuredOutputsError`（输出多个结构化结果）、`StructuredOutputValidationError`（结果不符合 Schema）。

> [!WARNING]
> 格式化输出出错时，Agent 内部会**反复重试**直到输出符合要求——可能要重试多次。这意味着**错误处理是有成本的**（额外的模型调用）。

## 写 Agent 结构化输出时的四个注意点

课程踩坑总结，值得贴在手边：

1. **结构化输出的要求写在系统提示词的最后**。如果提示词里"先"要求输出结构化结果（Agent 以为任务已完成），**可能会导致一些工具不再被调用**。
2. 系统提示词里要**最后加上"未找到用户"时的处理提示**，避免程序一直调用工具反复查找不存在的用户信息（死循环）。
3. TypedDict 那三条（`Annotated[类型, 默认值, "描述"]` / `Optional` 包装可选字段 / 不支持运行时验证）。
4. `Union` 多类型最终只输出一种；靠 `handle_errors` 兜底重试。

## 相关

- [结构化输出](/posts/编程学习/langchain学习笔记/11-结构化输出/)
- [另外三种模式与类型校验](/posts/编程学习/langchain学习笔记/12-另外三种模式与类型校验/)
- [系统提示词与Agent名称](/posts/编程学习/langchain学习笔记/15-系统提示词与agent名称/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 模型的结构化输出绑在____上（用 `with_structured_output`），Agent 的结构化输出绑在 Agent 上（用 `____` 参数）
2. 模型的结构化输出**每次**模型调用都会解析；Agent 的**仅在**它决定"____"并输出最终答案时解析
3. 四种策略：____用模型厂商的原生结构化输出；____用工具调用实现（推荐，兼容性最好）；直接传类型会包装成 ____ 自动选择；____（默认）表示不做结构化输出
4. 结构化结果存放在 Agent 状态的 `____` 键里；判断方式：`if "____" in result`
5. ToolStrategy 会在消息列表末尾追加一条____的 ToolMessage，实际并没有执行工具
6. ToolStrategy 的三个参数：`schema`（必需）、`____`（自定义伪消息内容）、`____`（校验失败的重试策略，默认 True）
7. `handle_errors=False` 表示____重试，异常直接____；传字符串则用这个____作为错误消息回给模型
8. 最典型的错误是____错误：模型本该输出一个结构化结果，却发起了____个工具调用
9. 注意点：结构化输出的要求写在系统提示词的____，否则可能导致部分工具____

> [!TIP]- 填空答案（做完再点开）
> 1. 大模型（模型对象） / `response_format`　2. 任务结束　3. ProviderStrategy / ToolStrategy / AutoStrategy / None　4. `structured_response` / `structured_response`　5. 伪（假的）　6. `tool_message_content` / `handle_errors`　7. 关闭 / 抛出　8. 多结构化输出 / 多（几个）　9. 最后 / 不被调用

### 二、裸写题

- [ ] **2-1 用 ToolStrategy 抽取联系人信息**
  定义 `ContactInfo`（name / email / phone 三个字段，都带中文描述），用 `response_format=ToolStrategy(ContactInfo)` 创建 Agent，从"小明的邮箱地址为：songhk@atguigu.com，手机号：12345678912"里抽取，打印 `structured_response`。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：Schema 写在 Pydantic 类里，策略写在 response_format 里
  > **二级 · 方法**：`from langchain.agents.structured_output import ToolStrategy`
  > **三级 · 骨架**：打印时先判断 `if "structured_response" in response:`，否则可能 KeyError

- [ ] **2-2 观察那条"伪 ToolMessage"**
  在 2-1 的基础上遍历 `response["messages"]`，打印每条消息的类型、`name`、`content`，找出哪一条是伪消息、它的 `name` 是什么。

  > [!TIP]- 提示
  > **一级 · 思路**：伪消息用来"补链路"，不代表真调用了工具
  > **二级 · 方法**：`type(msg).__name__` + `getattr(msg, "name", None)`
  > **三级 · 骨架**：对比一下：请求里模型"调用"的工具名，和这条 ToolMessage 的 name 一样吗？

- [ ] **2-3 自定义伪消息内容**
  用 `tool_message_content="提取完成！"` 再跑一次 2-1，对比消息列表里那条 ToolMessage 的 content 变化，同时确认 `structured_response` 没受影响。

  > [!TIP]- 提示
  > **一级 · 思路**：自定义消息只影响"对话历史里的一条记录"
  > **二级 · 方法**：`ToolStrategy(ContactInfo, tool_message_content="提取完成！")`
  > **三级 · 骨架**：顺便想想这有什么实用价值（让用户看到的对话更自然、少占 token）

### 三、综合题

- [ ] **3-1 Union 多类型 + handle_errors 三种取值**
  定义 `ContactInfo` 和 `EventDetails` 两个模型，用 `ToolStrategy(Union[ContactInfo, EventDetails])` 创建 Agent，分别用两段不同的文本调用（一段是联系人信息、一段是活动信息），看它选出哪个 Schema。然后把 `handle_errors` 依次设为 `True`、`False`、`"请检查输入数据"`，观察失败时的不同表现。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：Union 让模型"选一个"，handle_errors 决定"选错/选多"时怎么办
  > **二级 · 方法**：`response_format=ToolStrategy(Union[ContactInfo, EventDetails], handle_errors=True)`
  > **三级 · 骨架**：想看错误信息就去翻消息列表里的 ToolMessage 内容——`handle_errors=True` 时里面是 LangChain 内置的错误模板

> [!TIP]- 参考答案（做完再点开）
> ```python
> import os
> from typing import Union
>
> from dotenv import load_dotenv
> from langchain.agents import create_agent
> from langchain.agents.structured_output import ToolStrategy
> from langchain.chat_models import init_chat_model
> from langchain.messages import HumanMessage
> from pydantic import BaseModel, Field
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
> class ContactInfo(BaseModel):
>     """个人联系信息"""
>     name: str = Field(description="姓名")
>     email: str = Field(description="电子邮箱")
>     phone: str = Field(description="手机号")
>
> # ---------- 2-1 最简 ToolStrategy ----------
> agent = create_agent(model=model, response_format=ToolStrategy(ContactInfo))
> response = agent.invoke({
>     "messages": [HumanMessage("从这段话中抽取结构化信息：小明的邮箱地址为：songhk@atguigu.com，手机号：12345678912")]
> })
> if "structured_response" in response:
>     print(response["structured_response"])      # name='小明' email='songhk@atguigu.com' phone='12345678912'
>     print(type(response["structured_response"]))  # <class '__main__.ContactInfo'>
>
> # ---------- 2-2 观察伪 ToolMessage ----------
> for msg in response["messages"]:
>     print(type(msg).__name__, "| name =", getattr(msg, "name", None), "| content =", str(msg.content)[:60])
> # HumanMessage | name = None
> # AIMessage    | name = None                 ← 发起工具调用，工具名 = Schema 类名
> # ToolMessage  | name = 'ContactInfo'       ← 伪消息
>
> # ---------- 2-3 自定义伪消息 ----------
> agent2 = create_agent(
>     model=model,
>     response_format=ToolStrategy(ContactInfo, tool_message_content="提取完成！"),
> )
> response2 = agent2.invoke({
>     "messages": [HumanMessage("从这段话中抽取结构化信息：小明的邮箱地址为：songhk@atguigu.com，手机号：12345678912")]
> })
> print(response2["messages"][-1].content)     # 提取完成！
> print(response2["structured_response"])      # 结构化结果不受影响
>
> # ---------- 3-1 Union 多类型 + handle_errors ----------
> class EventDetails(BaseModel):
>     """活动详情"""
>     event_name: str = Field(description="活动名称")
>     date: str = Field(description="活动日期")
>
> agent3 = create_agent(
>     model=model,
>     response_format=ToolStrategy(
>         Union[ContactInfo, EventDetails],
>         tool_message_content="提取完成！",
>         handle_errors=True,          # 可改成 False 或 "请检查输入数据" 对比
>     ),
> )
>
> for text in [
>     "从这段话中抽取结构化信息：小明的邮箱地址为：songhk@atguigu.com，手机号：12345678912",
>     "从这段话中抽取结构化信息：2026年高考报名人数突破1200万",
> ]:
>     r = agent3.invoke({"messages": [HumanMessage(text)]})
>     if "structured_response" in r:
>         print(type(r["structured_response"]).__name__, r["structured_response"])
>     else:
>         print("没有拿到结构化结果")
> ```
