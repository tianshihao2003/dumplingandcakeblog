---
title: JSON数据格式与json模块
published: 2026-09-18
description: JSON 的语法规则、Python 字典与 JSON 的对应关系，以及 json 模块的 dump/load 序列化与反序列化
tags:
  - Python
  - JSON
order: 31
---

## JSON 是什么

JSON（JavaScript Object Notation）是前端的一种对象表示方法，也是**软件开发中最常用的数据交换格式**。它的表示形式类似于 Python 中的字典，都是 `key: value` 这种形式，不过：

> [!IMPORTANT]
> JSON 中**所有的 key 都必须使用双引号引起来**，这一点和 Python 字典不同（Python 里 `'name'` 和 `"name"` 都可以）。

```json
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "stream": false
}
```

## JSON 支持的数据类型

| 类型 | 写法 | 示例 |
| --- | --- | --- |
| 数字 | 整数和小数都是数字 | `12`、`3.14` |
| 字符串 | 用 `""` 引起来 | `"jack"` |
| 布尔 | 两种值：`true` 或 `false` | `true` |
| 对象 | 用 `{}` 表示，`{}` 之间是键值对形式，键是字符串，值可以是任意其它类型 | `{"name": "涛哥"}` |
| 列表 | 用 `[]` 表示，`[]` 中是列表的元素，多个元素以 `,` 分割 | `["reading", "swimming"]` |

### JSON 与 Python 的对应关系

| JSON | Python |
| --- | --- |
| 对象 `{}` | 字典 `dict` |
| 列表 `[]` | 列表 `list` |
| 字符串 `"abc"` | 字符串 `str` |
| 数字 `12` / `3.14` | 整数 `int` / 浮点数 `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

## Python 处理 JSON：json 模块

为了简化 JSON 数据的处理，Python 标准库中提供了处理 JSON 数据的核心模块 `json`，不需要额外安装。

| 方法 | 作用 | 方向 |
| --- | --- | --- |
| `json.dump(obj, f)` | 将 Python 对象序列化为 json 格式字符串并写入文件 | Python → 文件 |
| `json.load(f)` | 从文件中读取 json 格式数据，并将其反序列化为 Python 对象 | 文件 → Python |

### 写入 json 数据（序列化）

```python
import json

user = {
    "name": "涛哥",
    "age": 18,
    "gender": "男",
    "hobbies": ["reading", "swimming"]
}

with open("resources/user.json", "w", encoding="utf-8") as f:
    # ensure_ascii: 默认为True, 确保所有输出的数据都是ascii编码(非ASCII码会进行转义);
    #               False, 非ASCII码保留原样输出
    # indent: 会在输出的json数据中添加缩进(格式化)
    json.dump(user, f, ensure_ascii=False, indent=2)
```

写出来的文件（`user.json`）：

```json
{
  "name": "涛哥",
  "age": 18,
  "gender": "男",
  "hobbies": [
    "reading",
    "swimming"
  ]
}
```

> [!WARNING]
> `ensure_ascii` 默认是 `True`，此时中文会被转义成 `\u6d9b\u54e5` 这种形式，文件里看不到中文（不影响程序读取，但**人没法检查内容**）。所以写中文必须加 `ensure_ascii=False`。

### 读取 json 数据（反序列化）

```python
import json

with open("resources/user.json", "r", encoding="utf-8") as f:
    user = json.load(f)
    print(user)        # {'name': '涛哥', 'age': 18, 'gender': '男', 'hobbies': ['reading', 'swimming']}
    print(type(user))  # <class 'dict'>
```

读进来直接就是 Python 的字典，可以继续用 `["key"]` 取值。

## 补充：四个方法的区别

`json` 模块里除了操作文件的两个方法，还有直接操作字符串的两个方法：

| 方法                  | 输入               | 输出              |
| ------------------- | ---------------- | --------------- |
| `json.dump(obj, f)` | Python 对象 + 文件对象 | 写入文件            |
| `json.dumps(obj)`   | Python 对象        | JSON 格式的**字符串** |
| `json.load(f)`      | 文件对象             | Python 对象       |
| `json.loads(s)`     | JSON 格式的**字符串**  | Python 对象       |

> [!TIP]
> 记忆技巧：**带 s 的是操作字符串（string）**。

> [!NOTE]
> JSON 语法比 Python 严格：不支持单引号、不支持注释、最后一个元素后面不能有多余的逗号。手写请求体时最容易在这三处出错。

## 相关

- [Python 文件操作](/posts/编程学习/python学习笔记/39-python文件操作/)
- [实战-AI智能伴侣-会话管理](/posts/编程学习/python学习笔记/41-实战-ai智能伴侣-会话管理/)（用 JSON 文件保存会话）

## 练习题

### 一、回忆填空（写完再展开对答案）

1. JSON 里所有的 key 都必须用 ____ 引起来
2. 把 Python 对象写进文件：`json.____(obj, f)`
3. 从文件读取并变成 Python 对象：`json.____(f)`
4. 另外两个操作字符串（不落文件）的方法：`json.____()` 和 `json.____()`
5. 写中文时必须加 `ensure_ascii=____`，否则中文会变成 ____ 形式
6. `indent=2` 的作用是给输出的 JSON 加 ____
7. 对应关系：JSON 对象 ↔ Python ____；JSON 列表 ↔ Python ____；`true/false` ↔ ____；`null` ↔ ____
8. JSON 语法比 Python 严格：不支持 ____ 引号、不支持 ____、最后不能有多余的逗号

> [!TIP]- 填空答案（做完再点开）
> 1. 双引号（`""`）　2. `dump`　3. `load`　4. `dumps`、`loads`（带 s 的操作字符串）　5. `False`、`\uXXXX` 转义　6. 缩进（格式化）　7. 字典 dict、列表 list、`True/False`、`None`　8. 单引号、注释

### 二、裸写题



- [ ] **2-1 把字典写进 JSON 文件**
  把一个包含姓名、年龄、性别、爱好的字典写进 `user.json`，要求文件里能看到中文、并且有缩进方便阅读。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：写文件要先能打开文件，再用 json 模块提供的方法把对象"倒"进去；中文别被转义，格式要好看
  > **二级 · 方法**：`with open(...)` + `json.dump(obj, f, ensure_ascii=..., indent=...)`
  > **三级 · 骨架**：`with open("user.json", "w", encoding="utf-8") as f:\n    json.____(user, f, ensure_ascii=____, indent=____)`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import json
  > 
  > user = {
  >     "name": "涛哥",
  >     "age": 18,
  >     "gender": "男",
  >     "hobbies": ["reading", "swimming"]
  > }
  > 
  > with open("user.json", "w", encoding="utf-8") as f:
  >     json.dump(user, f, ensure_ascii=False, indent=2)
  > ```

- [ ] **2-2 读回 JSON 文件**
  读取上一步写出的 `user.json`，打印内容并打印它的类型。

  > [!TIP]- 提示
  > **一级 · 思路**：读文件 + 把 JSON 文本变回 Python 对象
  > **二级 · 方法**：`json.load(f)`、`type()`
  > **三级 · 骨架**：`with open("user.json", "r", encoding="utf-8") as f:\n    user = json.____(f)`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import json
  > 
  > with open("user.json", "r", encoding="utf-8") as f:
  >     user = json.load(f)
  > 
  > print(user)
  > print(type(user))   # <class 'dict'>
  > ```

- [ ] **2-3 不落文件的字符串互转**
  把一个字典转成 JSON 字符串打印出来，再把这个字符串转回字典并取出其中一个值。

  > [!TIP]- 提示
  > **一级 · 思路**：想想哪两个方法名带 `s`（string）
  > **二级 · 方法**：`json.dumps()` / `json.loads()`
  > **三级 · 骨架**：`s = json.____(obj)` ／ `obj2 = json.____(s)`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import json
  > 
  > obj = {"name": "张三", "age": 18, "hobbies": ["reading", "swimming"]}
  > 
  > s = json.dumps(obj, ensure_ascii=False)
  > print(s)          # {"name": "张三", ...}  —— 字符串
  > 
  > obj2 = json.loads(s)
  > print(obj2["name"])   # 张三
  > ```
