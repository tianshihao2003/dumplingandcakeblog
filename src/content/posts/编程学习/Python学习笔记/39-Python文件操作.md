---
title: Python文件操作
published: 2026-09-18
description: 文件读写三步法（打开/读写/关闭）、r/w/a 三种模式、相对路径与绝对路径，以及资源释放的最佳实践
tags:
  - Python
  - 文件操作
image: https://img.tsh520.cn/file/blog/post-covers/python-39-file.webp
order: 39
---

## 三步法：打开 → 读/写 → 关闭

日常我们操作文件时，基本分为三步操作：打开、读/写、关闭。

### 读文件

```python
# 1. 打开文件
f = open("resources/望庐山瀑布.txt", "r", encoding="utf-8")

# 2. 读取文件
content = f.read()
print(content)

# 3. 关闭文件
f.close()
```

### 写文件

```python
# 1. 打开文件
f = open("resources/静夜思.txt", "w", encoding="utf-8")

# 2. 写入文件
f.write("窗前明月光，\n")
f.write("疑是地上霜。\n")
f.write("举头望明月，\n")
f.write("低头思故乡。\n")

# 3. 关闭文件
f.close()
```

> [!WARNING]
> 如果操作完文件并未调用 `close` 方法关闭文件，同时程序没有停止运行，那么这个文件将一直被 Python 程序占用，无法操作（比如在资源管理器里删除或改名会失败；写入的内容也可能还没真正落盘）。

## 编码是什么

编码：是将字符（文字、数字、符号）转换为计算机能够存储和处理的数字代码的规则系统，如：ASCII、GBK、UTF-8。

写中文文本时必须指定 `encoding="utf-8"`，否则在 Windows 上会按系统默认编码（GBK）读写，容易出现乱码或 `UnicodeDecodeError`。

## 路径写法

| 写法   | 含义                      | 示例                                |
| ---- | ----------------------- | --------------------------------- |
| 相对路径 | 相对于当前工作目录的路径            | `resources/静夜思.txt`               |
| 绝对路径 | 从文件系统的目录开始，完整地描述文件位置的路径 | `D:/python/第3章/resources/静夜思.txt` |

> [!TIP]
> 在项目开发中，推荐使用**相对路径**写法：可移植性更好、路径简洁、易于阅读。（换台电脑、换个目录，绝对路径就失效了）

## 操作模式

| 模式 | 含义 |
| --- | --- |
| `r` | 只读的方式打开文件，指针放在文件的开头（默认模式） |
| `w` | 只写入模式，从头编辑，**原有内容会被删除**；文件不存在则创建新文件 |
| `a` | 追加模式，新内容会被追加在原有内容之后；文件不存在则创建新文件 |

> [!WARNING]
> `w` 模式最危险的地方是**打开的一瞬间原内容就没了**，即使后面一个字都没写。只想在末尾加内容就用 `a`。

补充（本章未涉及但常用的模式）：`r+` 读写、`w+` 清空后读写、`a+` 追加读写；加 `b` 表示二进制模式（如 `rb`、`wb` 用于图片、音频）。

## 常用的读/写方法

| 方法 | 作用 |
| --- | --- |
| `f.read()` | 读取**所有**内容，返回一个字符串 |
| `f.readlines()` | 按行读取全部内容，返回一个**列表**（每行末尾带 `\n`） |
| `f.write("...")` | 写入字符串（不会自动换行，需要手动写 `\n`） |

```python
f = open("resources/望庐山瀑布.txt", "r", encoding="utf-8")
content_list = f.readlines()
for line in content_list:
    print(line.strip())    # strip() 去掉每行末尾的换行符
f.close()
```

## 资源释放：两种方案

问题：如果操作文件过程中出现了异常，程序就跳过了 `close`，文件无法关闭了，怎么解决？

### 方式一：try...finally

```python
# 1. 打开文件
f = open("resources/静夜思.txt", "w", encoding="utf-8")
try:
    # 2. 写入文件内容
    f.write("静夜思(李白)\n")
    f.write("窗前明月光，\n")
    i = 1 / 0                      # 这里抛异常
    f.write("疑是地上霜。\n")
finally:
    print("关闭文件")
    # 3. 关闭文件
    f.close()
```

不管 try 里面是否出错，`finally` 里的代码都会执行，所以文件一定会被关闭。

### 方式二：with open（推荐，最佳实践）

```python
# 写文件
with open("resources/静夜思.txt", "w", encoding="utf-8") as f:
    f.write("静夜思(李白)\n\n")
    f.write("窗前明月光，\n")
    f.write("疑是地上霜。\n")
    f.write("举头望明月，\n")
    f.write("低头思故乡。\n")
```

| 对比 | try...finally | with open |
| --- | --- | --- |
| 代码量 | 需要手动写 try/finally 和 close | 不用写 close |
| 可读性 | 繁琐 | 简洁 |
| 是否自动释放 | 手动释放 | **即使发生异常，也会被正确释放** |

> [!IMPORTANT]
> `with` 语句（上下文管理器）的核心作用就是确保资源**总是被正确获取和释放**，也是项目开发中的推荐方式。本章项目里的文件读写全部用的是 `with open(...)`。

## 小结（复习自测）

| 题目 | 答案 |
| --- | --- |
| 文件的操作（读/写）分为哪几步 | 打开：`open()` 函数；读/写：`read()`、`write()` 方法；关闭：`close()` 方法 |
| 文件资源释放的最佳实践 | `try...finally` 或 `with open()`（推荐，最佳实践） |

## 相关

- [JSON 数据格式与 json 模块](/posts/编程学习/python学习笔记/31-json数据格式与json模块/)
- [实战-AI智能伴侣-会话管理](/posts/编程学习/python学习笔记/41-实战-ai智能伴侣-会话管理/)（用文件持久化会话）

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 文件操作三步：____、读/写、____
2. 打开文件：`open("resources/静夜思.txt", "____", encoding="____")`
3. 读取全部内容：`f.____()`；按行读取返回列表：`f.____()`
4. 写入内容：`f.____("窗前明月光，\n")`（不会自动换行，要自己写 ____）
5. 三种模式：`r` 只读、`w` 从头编辑会 ____ 原有内容、`a` 是 ____ 模式
6. 资源释放最推荐的方式：____ `open(...)` as `f`（即使异常也会正确释放）
7. try...finally 里的 `finally` 作用是：不管是否出异常，____ 都会执行
8. 编码的作用是把字符转换成计算机能存储的 ____，中文一般用 ____ 编码

> [!TIP]- 填空答案（做完再点开）
> 1. 打开、关闭　2. r / utf-8　3. read / readlines　4. write / `\n`　5. 清空（删除）/ 追加　6. `with`　7. 代码　8. 数字代码 / UTF-8

### 二、裸写题



- [ ] **2-1 写文件**
  把《静夜思》四句诗写进 `poem.txt`（每句一行，标题单独一行），写完关闭文件。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：打开 → 写 → 关闭；每行末尾要自己加换行符
  > **二级 · 方法**：`open(..., "w", encoding="utf-8")` / `f.write(...)` / `f.close()`
  > **三级 · 骨架**：`f.write("疑是地上霜。\____")`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > # 1. 打开文件
  > f = open("poem.txt", "w", encoding="utf-8")
  > 
  > # 2. 写入内容（每行末尾要自己写 \n）
  > f.write("静夜思(李白)\n")
  > f.write("窗前明月光，\n")
  > f.write("疑是地上霜。\n")
  > f.write("举头望明月，\n")
  > f.write("低头思故乡。\n")
  > 
  > # 3. 关闭文件
  > f.close()
  > ```

- [ ] **2-2 读文件**
  把上一步写出的 `poem.txt` 读出来，**逐行**打印（每行末尾不要多出空行）。

  > [!TIP]- 提示
  > **一级 · 思路**：按行读会得到带换行符的列表，打印前先把换行符去掉
  > **二级 · 方法**：`f.readlines()` + `line.strip()`
  > **三级 · 骨架**：`for line in f.readlines(): print(line.____())`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > f = open("poem.txt", "r", encoding="utf-8")
  > 
  > content_list = f.readlines()
  > for line in content_list:
  >     print(line.strip())        # strip() 去掉每行末尾的换行符
  > 
  > print(f"共 {len(content_list)} 行")
  > 
  > f.close()
  > ```

- [ ] **2-3 with 与三种模式**
  用 `with open(...)` 重写写文件；然后对比 `w` 和 `a`：先用 `w` 写一次，再用 `a` 追加一次，观察原内容有没有被保留。

  > [!TIP]- 提示
  > **一级 · 思路**：`w` 打开的一瞬间原内容就没了，`a` 是在末尾接着写
  > **二级 · 方法**：`with open(..., "a", encoding="utf-8") as f:`
  > **三级 · 骨架**：跑两次程序，观察文件内容的变化

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > # with open：不用手动 close，出异常也会正确释放
  > with open("poem.txt", "w", encoding="utf-8") as f:
  >     f.write("第一行\n")
  >     f.write("第二行\n")
  > 
  > # a 模式：追加，原内容保留
  > with open("poem.txt", "a", encoding="utf-8") as f:
  >     f.write("第三行（追加的）\n")
  > 
  > with open("poem.txt", "r", encoding="utf-8") as f:
  >     print(f.read())
  > 
  > # 如果第二步也用 "w"，原内容会被清空，最后只剩"第三行"
  > # 再试 "r" 模式写入会报错：io.UnsupportedOperation: not writable
  > ```
