---
title: Message与对话历史
published: 2026-09-21
description: LangChain 的四种消息类型与两种写法、content 与 content_blocks、"必须传完整历史"的规则与历史裁剪优化
tags:
  - LangChain
  - AI
order: 7
---

## 为什么需要 Message

大模型**没有记忆**，它的输出只和"输入的上下文"有关；很多大模型 API 服务也**不在服务端维护会话历史**（就是第 3 章学过的：无状态）。**如果应用需要"记住"对话，就得在程序里自己维护消息列表。**

在 LangChain 中，**Message（消息）是模型交互的最基本单元**：它既代表模型的**输入**，也代表模型生成的**输出**。每条消息不仅包含文字内容，还携带描述上下文状态的**元信息（metadata）**——这样模型才能理解"谁在说话""说了什么""属于哪一轮"。

LangChain 1.0 提供了**跨模型统一的 Message 标准**（OpenAI / Anthropic / Gemini / 本地模型行为一致），好处：

| 好处 | 说明 |
| --- | --- |
| 兼容性强 | 不同模型的消息格式自动对齐 |
| 可扩展性高 | 方便添加多模态内容或自定义字段 |
| 可追踪性好 | 为 LangSmith 等调试工具提供一致的上下文结构 |

## 消息的内部结构

| 字段 | 说明 |
| --- | --- |
| **Role** | 消息所属的角色或类型：`system`、`user`、`assistant`（还有 `tool`） |
| **Content** | 消息内容 |
| **Metadata** | （可选）元数据：消息 ID、响应时间、token 消耗量、消息标签等 |

## 四种消息类型

| 类型 | 角色 | 作用 | JSON 写法 |
| --- | --- | --- | --- |
| 系统消息 | `system` | 系统提示词：设定角色、行为准则、上下文背景（像给 AI 的"工作说明书"） | `{"role": "system", "content": "你是个精通编程的软件架构师"}` |
| 用户消息 | `user` | 用户的一次输入，可含多模态内容（图片、音频、文档等） | `{"role": "user", "content": "你好啊~"}` |
| 助手消息 | `assistant` | 模型的回复：文本、**工具调用**、元数据 | `{"role": "assistant", "content": "我也很高兴认识你"}` |
| 工具调用消息 | `tool` | 工具执行结果，回传给模型让它接着生成（第 5 章详解） | `{"role": "tool", "content": "今天天气很好", "tool_call_id": "call_00_..."}` |

助手消息里如果模型要调工具，长这样：

```json
{
  "role": "assistant",
  "content": "",
  "tool_calls": [
    {
      "name": "get_weather",
      "args": {"location": "北京"},
      "id": "call_00_nUD2NC9QRN5Cg1GaoIkBJQ4s"
    }
  ]
}
```

> [!NOTE]
> `ToolMessage` 里的 `tool_call_id` **必须和 AI 消息里那次调用的 `id` 匹配**，否则模型不知道"这个结果对应哪个请求"。

**为什么要区分消息类型？** ① 明确角色 ② 通过 system 精确控制 AI 行为 ③ 构建完整的多轮上下文 ④ 更容易追踪和调试。

### 两种格式：JSON 与对象

| 消息 | JSON 格式 | 对象格式 |
| --- | --- | --- |
| 系统 | `{"role": "system", "content": "..."}` | `SystemMessage(content="...")` |
| 用户 | `{"role": "user", "content": "..."}` | `HumanMessage(content="...")` |
| 助手 | `{"role": "assistant", "content": "..."}` | `AIMessage("...")` |
| 工具 | `{"role": "tool", "content": "...", "tool_call_id": "..."}` | `ToolMessage(content="...", tool_call_id="...")` |

> [!TIP]
> **JSON 字典格式**更通用（易序列化、易存文件、易走网络）；**对象格式**能携带更丰富的类型信息（如 `tool_calls`、`content_blocks`）。日常用字典就够了，需要精细控制时用对象。

## content 与 content_blocks

### content：弱类型

`content` 支持**字符串**和**列表**（列表元素通常是字典）：

```python
from langchain.messages import HumanMessage

msg1 = HumanMessage(content="你好啊")
msg2 = HumanMessage("你好啊")        # 只有纯字符串时，可以省略参数名

# 多模态（图片/音频）就用字典列表，具体格式遵循模型供应商的 API 规范
```

### content_blocks：1.x 的重大升级

在 LangChain 1.x 中，`content_blocks` 是消息对象的一项**重大升级**：提供跨模型供应商、**标准化的多模态数据结构**。

过去处理图片、音频甚至模型的"思维链（Reasoning）"时，各厂商格式各异，要写大量适配代码；`content_blocks` 终结了这种混乱。

- 数据结构：`list[TypedDict]`
- 统一格式：**每个 block 都有 `type` 字段**区分内容类型
- 支持类型：`text`、`image`、`audio`、`video`、`tool_call`、`reasoning`

> [!IMPORTANT]
> 1.2 里 `content` 依然存在（向前兼容），但新增了 `content_blocks`，把 `content` 解析为**标准、类型安全**的表示。**带图片或工具结果的复杂对话，建议用 `content_blocks` 构建**——一套标准代码无缝切换不同厂商的模型。

## 对话历史管理（关键规则）

> **每次调用必须传递完整的对话历史！**

```text
第 1 轮：[system, user] → AI 回复 → 保存回复
第 2 轮：[system, user, assistant, user] → AI 回复 → 保存回复
第 3 轮：[system, user, assistant, user, assistant, user] → AI 回复
```

注意：每轮都要在**原有的消息列表上追加**，**不可重新创建新列表**。

三种常见错误：

| 错误 | 写法 | 后果 |
| --- | --- | --- |
| ❌ 没传历史 | 每轮都 `model.invoke("新问题")` | AI 完全不记得之前说过什么 |
| ❌ 重新创建列表 | 每轮 `conversation = [{"role": "user", ...}]` | 历史被清空 |
| ❌ 忘记保存 AI 回复 | 只 append 用户消息 | AI 不知道自己的回答，前后逻辑断裂 |

正确做法：

```python
conversation = []

# 第一次
conversation.append({"role": "user", "content": "我叫张三"})
response1 = model.invoke(conversation)

# 关键：保存 AI 回复
conversation.append({"role": "assistant", "content": response1.content})

# 第二次（传递完整历史）
conversation.append({"role": "user", "content": "我叫什么？"})
response2 = model.invoke(conversation)      # AI 记得！
```

## 对话历史优化：只保留最近 N 轮

问题：历史越来越长，**消耗大量 token 和成本**。

解决方案：**总是保留 system 消息；只保留最近 N 轮对话，丢弃更早的历史**。思路是先分离 system 与对话，再对对话列表做切片：

```python
def keep_recent_messages(messages, max_pairs=3):
    """保留最近的 N 轮对话（每轮 = user + assistant）"""
    system_msgs = [m for m in messages if m["role"] == "system"]
    dialog_msgs = [m for m in messages if m["role"] != "system"]

    # 每轮 2 条消息，保留最近 max_pairs 轮
    recent_msgs = dialog_msgs[-max_pairs * 2:]

    return system_msgs + recent_msgs
```

> [!TIP]
> 这就是最简单的"上下文工程"：**system 不能丢**（丢了 AI 就换了个人），历史可以截断。第 8 章的 SummarizationMiddleware 是更聪明的做法——不是直接丢弃，而是把旧对话**压缩成摘要**。

## 多轮对话聊天机器人（实战）

把前面学的拼起来：初始化模型 → 维护消息列表 → 循环输入 → 流式输出 → 追加历史（并裁剪）。

```python
from langchain.chat_models import init_chat_model
import os
from dotenv import load_dotenv

load_dotenv(override=True)

MODEL_NAME = "deepseek-v4-flash"
MAX_PAIRS_HISTORY = 10       # 最多保留 10 轮对话
EXIT_WORD = "quit"

model = init_chat_model(
    model=MODEL_NAME,
    model_provider="openai",
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url=os.getenv("DEEPSEEK_BASE_URL"),
)

messages = [
    {"role": "system", "content": "你是小谷姐姐，一名耐心、友好的智能助手。"},
]

while True:
    user_input = input("\n你：")
    if user_input.strip().lower() == EXIT_WORD:
        print("再见！")
        break

    messages.append({"role": "user", "content": user_input})

    # 调用前裁剪历史（system 必须保留）
    messages = keep_recent_messages(messages, MAX_PAIRS_HISTORY)

    print("AI：", end="")
    full = ""
    for chunk in model.stream(messages):
        print(chunk.content, end="", flush=True)
        full += chunk.content
    print()

    messages.append({"role": "assistant", "content": full})
```

## 相关

- [模型的调用](/posts/编程学习/langchain学习笔记/05-模型的调用/)
- [提示词模板](/posts/编程学习/langchain学习笔记/08-提示词模板/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 大模型没有 ____，且很多 API 不在服务端维护会话历史（____ 的），所以要在程序里维护 ____
2. Message 的三个字段：____（角色）、____（内容）、____（元数据）
3. 四种消息类型：____ 设定角色规则、____ 用户输入、____ 模型回复、____ 工具结果
4. 工具消息里的 `tool_call_id` 必须和 AI 消息里那次调用的 ____ 匹配
5. content 是弱类型的，支持 ____ 和 ____；多模态内容用 ____ 形式
6. `content_blocks` 的每个块都有 ____ 字段区分类型，支持 text/image/audio/video/____/____
7. 对话历史的关键规则：每次调用必须传 ____；每轮要在原列表上 ____，不可重新创建列表
8. 历史太长会消耗大量 ____；优化方案是保留 ____ + 最近 ____ 轮对话
9. 助手消息要调工具时，`tool_calls` 里包含 name、args 和 ____

> [!TIP]- 填空答案（做完再点开）
> 1. 记忆 / 无状态 / 消息列表　2. Role / Content / Metadata　3. system / user / assistant / tool　4. id　5. 字符串 / 列表（字典列表）　6. type / tool_call / reasoning　7. 完整的对话历史 / 追加　8. token（成本）/ system 消息 / N　9. id

### 二、裸写题

- [ ] **2-1 手动维护对话历史**
  用一个列表维护对话：先告诉模型"我叫张三"，第二轮问"我叫什么？"，确认它答得出。**关键是每轮把 AI 回复也追加进去**。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：一个列表贯穿全程，追加用户消息 → 调用 → 追加 AI 回复
  > **二级 · 方法**：`conversation.append({"role": "assistant", "content": response.content})`
  > **三级 · 骨架**：别犯"每轮重新创建列表"的错误

- [ ] **2-2 故意不传历史**
  把上面改成"每次只传当前这一句"，观察第二轮模型还能不能答对，解释原因。

  > [!TIP]- 提示
  > **一级 · 思路**：这是复现"AI 没有记忆"的实验
  > **二级 · 方法**：`model.invoke("我叫什么？")`（不带历史）
  > **三级 · 骨架**：结论要落到"模型是无状态的，记忆靠客户端维护"

- [ ] **2-3 给历史做裁剪**
  写一个 `keep_recent_messages(messages, max_pairs=2)`，保留 system 消息 + 最近 2 轮对话，并打印裁剪前后的消息条数。

  > [!TIP]- 提示
  > **一级 · 思路**：先分离 system，再对对话部分切片
  > **二级 · 方法**：列表推导 + `dialog_msgs[-max_pairs * 2:]`
  > **三级 · 骨架**：`return system_msgs + recent_msgs`

- [ ] **2-4 多轮聊天机器人（综合）**
  写一个循环：输入 → 流式输出 → 追加历史 → 输入 `quit` 退出。要求最多保留 10 轮历史。

  > [!TIP]- 提示
  > **一级 · 思路**：把前 3 题拼起来 + 流式 + 退出判断
  > **二级 · 方法**：`while True` + `model.stream(messages)` + `input()`
  > **三级 · 骨架**：裁剪要放在"调用模型之前"

> [!TIP]- 参考答案（做完再点开）
> ```python
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
> def keep_recent_messages(messages, max_pairs=2):
>     """保留 system + 最近 N 轮对话"""
>     system_msgs = [m for m in messages if m["role"] == "system"]
>     dialog_msgs = [m for m in messages if m["role"] != "system"]
>     return system_msgs + dialog_msgs[-max_pairs * 2:]
>
> # 2-1 正确维护历史
> conversation = [{"role": "system", "content": "你是简洁的助手，回答不超过一句话"}]
> conversation.append({"role": "user", "content": "我叫张三"})
> r1 = model.invoke(conversation)
> conversation.append({"role": "assistant", "content": r1.content})
> conversation.append({"role": "user", "content": "我叫什么？"})
> r2 = model.invoke(conversation)
> print("[记得历史]", r2.content)
>
> # 2-2 不传历史（AI 会答不出来）
> r3 = model.invoke("我叫什么？")
> print("[没传历史]", r3.content)
>
> # 2-3 / 2-4 带裁剪的多轮机器人
> messages = [{"role": "system", "content": "你是耐心友好的智能助手"}]
> while True:
>     user_input = input("\n你：")
>     if user_input.strip().lower() == "quit":
>         print("再见！")
>         break
>
>     messages.append({"role": "user", "content": user_input})
>     before = len(messages)
>     messages = keep_recent_messages(messages, 2)
>     print(f"（历史 {before} 条 → 裁剪后 {len(messages)} 条）")
>
>     print("AI：", end="")
>     full = ""
>     for chunk in model.stream(messages):
>         print(chunk.content, end="", flush=True)
>         full += chunk.content
>     print()
>     messages.append({"role": "assistant", "content": full})
> ```