---
title: 网页解析与lxml
published: 2026-09-19
description: 用 lxml 库把 HTML 解析成文档对象，再用 Xpath 从标签里提取表头和行数据
tags:
  - Python
  - 爬虫
image: https://img.tsh520.cn/file/blog/post-covers/python-45-lxml.webp
order: 45
---

## 网页解析是什么

网页解析指的是**从原始 HTML 文档中提取数据**的过程，也是网络爬虫的关键步骤——从一堆标签文本中提取出需要的数据。

比如把这段 HTML：

```html
<html>
<head><title>仙逆人物志 - 修真世界</title></head>
<body>
  <h1>Python</h1>
  <p>一门简介、快速、易用的编程语言。</p>
  <a href="https://www.itcast.cn">传智教育-黑马程序员</a>
</body>
</html>
```

解析出：标题 `仙逆人物志 - 修真世界`、`Python`、`一门简介...`、链接文本与地址。

## lxml 库

lxml 是一个**高性能**的 HTML/XML 文档解析库，支持基于 **Xpath** 语法来解析和获取网页数据。

```bash
pip install lxml
```

## 入门程序：解析本地 HTML 文件

```python
from lxml import html

# 读取 html 文件
with open("resources/仙逆人物志.html", "r", encoding="utf-8") as f:
    html_text = f.read()

    # 解析 html 文本, 将其转换为一个文档对象
    document = html.fromstring(html_text)

    # 解析表头 - xpath 语法
    th_list = document.xpath("//table/thead/tr/th/text()")
    print(th_list)

    # 解析表格中的所有行数据
    tr_list = document.xpath("//table/tbody/tr")
    for tr in tr_list:
        td_list = tr.xpath("./td/text()")
        print(td_list)
```

## 逐段理解

| 代码 | 说明 |
| --- | --- |
| `from lxml import html` | 导入 lxml 的 html 模块 |
| `html.fromstring(html_text)` | 把 HTML 字符串解析成**文档对象**（之后才能用 Xpath 查询） |
| `document.xpath("//table/thead/tr/th/text()")` | 定位表头里每个 th，取它们的文本，返回**列表** |
| `document.xpath("//table/tbody/tr")` | 定位 tbody 下的所有 tr（行），返回元素列表 |
| `tr.xpath("./td/text()")` | 在**当前这一行**下找直接子元素 td 并取文本 |

> [!IMPORTANT]
> `./td` 和 `//td` 的区别：`./td` 是在**当前节点**下找直接子元素（只找这一行自己格子里的）；`//td` 是从**任意位置**找（会把整份文档里所有 td 都抓出来）。遍历行的时候必须用 `./`，否则每行拿到的都是全部数据。

## 相关

- [Xpath语法](/posts/编程学习/python学习笔记/46-xpath语法/)
- [CSV文件操作](/posts/编程学习/python学习笔记/47-csv文件操作/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 网页解析指的是从原始 ____ 文档中提取数据的过程，是爬虫的 ____ 步骤
2. lxml 是一个高性能的 ____ / XML 文档解析库，支持基于 ____ 语法获取数据
3. 安装命令：`pip ____ lxml`
4. 把 HTML 字符串解析成文档对象：`html.____(html_text)`
5. Xpath 表达式末尾加 `/text()` 的作用是 ____
6. `document.xpath("//table/tbody/tr")` 返回的是所有 ____ 元素的列表
7. 在遍历行时，取"这一行的格子"要用 `____/td/text()` 而不是 `//td/text()`

> [!TIP]- 填空答案（做完再点开）
> 1. HTML / 关键　2. HTML、Xpath　3. install　4. fromstring　5. 获取元素的文本内容　6. tr（行）　7. `./`

### 二、裸写题

- [ ] **2-1 解析表头**
  读取 `resources/仙逆人物志.html`，解析出表格的表头并打印。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：读文件 → 变文档对象 → Xpath 定位表头
  > **二级 · 方法**：`open(...)` / `html.fromstring` / `//table/thead/tr/th/text()`
  > **三级 · 骨架**：`document = html.____(html_text)`

- [ ] **2-2 解析所有行**
  把表格里**每一行**的数据都打印出来（每行是一个列表）。

  > [!TIP]- 提示
  > **一级 · 思路**：先拿到所有行，再一行一行往里取格子
  > **二级 · 方法**：`//table/tbody/tr` + 循环里 `./td/text()`
  > **三级 · 骨架**：`for tr in tr_list:\n    print(tr.xpath("____/td/text()"))`

- [ ] **2-3 只要第一行**
  只解析 tbody 的**第 2 行**（提示：Xpath 里序号从 1 开始），打印它的数据。

  > [!TIP]- 提示
  > **一级 · 思路**：用序号过滤
  > **二级 · 方法**：`//table/tbody/tr[2]/td/text()`
  > **三级 · 骨架**：`tr[____]`

> [!TIP]- 参考答案（做完再点开）
> ```python
> from lxml import html
>
> # 2-1
> with open("resources/仙逆人物志.html", "r", encoding="utf-8") as f:
>     html_text = f.read()
> document = html.fromstring(html_text)
> th_list = document.xpath("//table/thead/tr/th/text()")
> print(th_list)
>
> # 2-2
> tr_list = document.xpath("//table/tbody/tr")
> for tr in tr_list:
>     print(tr.xpath("./td/text()"))
>
> # 2-3（Xpath 序号从 1 开始，第 2 行就是 tr[2]）
> td_list = document.xpath("//table/tbody/tr[2]/td/text()")
> print(td_list)
> ```