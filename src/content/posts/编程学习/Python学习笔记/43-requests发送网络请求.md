---
title: requests发送网络请求
published: 2026-09-19
description: 用 requests 库发送 HTTP 请求：TIOBE 编程语言排行榜入门程序，请求、解析、遍历数据的完整流程
tags:
  - Python
  - 爬虫
order: 43
---

## requests 是什么

Requests 库是 Python 中**最流行、最优雅的 HTTP 客户端库**，让 Python 代码发送 HTTP 请求变得极其简单。

在爬虫五步流程里，它负责第一步"发送 HTTP 请求"。

安装：

```bash
pip install requests
```

## 入门程序：获取 TIOBE 编程语言排行榜

目标：抓取 https://www.tiobe.com/tiobe-index/ 的编程语言排行榜。

动手前先做三件事：

1. **查看网站的 `robots.txt`**（https://www.tiobe.com/robots.txt），明确哪些资源允许抓取
2. 安装 requests 库
3. 编写代码，访问网站获取数据

```python
import requests
from lxml import html

# 定义 url
target_url = "https://www.tiobe.com/tiobe-index/"

# 发送请求, 获取数据
response = requests.get(target_url)

# response.text 就是服务器返回的 HTML 源码（字符串）
document = html.fromstring(response.text)

# 解析表头（Xpath 语法，下一节细讲）
th_list = document.xpath("//*[@id='top20']/thead/tr/th/text()")
print(th_list)

# 解析表格中的数据（遍历每一行）
tr_list = document.xpath("//table[@id='top20']/tbody/tr")
for tr in tr_list:
    td_list = tr.xpath("./td/text()")
    print(td_list)
```

## 逐段理解

| 代码 | 说明 |
| --- | --- |
| `requests.get(target_url)` | 向目标网址发 GET 请求，返回一个 Response 对象 |
| `response.text` | 服务器返回的 HTML 源码（字符串） |
| `html.fromstring(response.text)` | 把 HTML 字符串解析成"文档对象"，之后才能用 Xpath 查询（来自 lxml 库） |
| `document.xpath("...")` | 用 Xpath 表达式在文档里定位元素、取文本 |
| `//table[@id='top20']` | 任意位置找 id 为 top20 的 table（`[@属性='值']` 是 Xpath 的属性过滤） |
| `tr.xpath("./td/text()")` | **在当前 tr 节点下**找直接子元素 td 并取文本（`./` 表示当前节点） |

> [!WARNING]
> 正式项目里给请求加超时：`requests.get(url, timeout=60)`。不加的话，对方服务器没响应时你的程序会一直卡着。

## 相关

- [网络机器人概述](/posts/编程学习/python学习笔记/42-网络机器人概述/)
- [网页解析与lxml](/posts/编程学习/python学习笔记/45-网页解析与lxml/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. Requests 库是 Python 中最流行、最优雅的 ____ 库
2. 安装命令：`pip ____ requests`
3. 发 GET 请求：`response = requests.____(url)`
4. 拿到 HTML 源码字符串：`response.____`
5. 把 HTML 字符串解析成文档对象：`html.____(response.text)`（来自 ____ 库）
6. 在文档对象上用 ____ 语法定位元素、取文本
7. Xpath 里 `//*[@id='top20']` 的意思是：从 ____ 位置找 id 为 top20 的任意元素
8. `tr.xpath("./td/text()")` 里的 `./` 表示从 ____ 节点下查找

> [!TIP]- 填空答案（做完再点开）
> 1. HTTP 客户端　2. install　3. get　4. text　5. fromstring / lxml　6. Xpath　7. 任意　8. 当前

### 二、裸写题

- [ ] **2-1 抓一个网页看看源码**
  用 requests 请求 `https://www.itcast.cn`，把返回的 HTML 源码**前 200 个字符**打印出来。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：发请求 → 拿到响应 → 字符串切片
  > **二级 · 方法**：`requests.get(url)` / `response.text`
  > **三级 · 骨架**：`print(response.text[:____])`

- [ ] **2-2 抓 TIOBE 榜单的表头**
  请求 TIOBE 排行榜页面，解析出榜单表格的表头（一行列表），加上 `timeout=60`。

  > [!TIP]- 提示
  > **一级 · 思路**：请求 → 解析成文档对象 → Xpath 取表头
  > **二级 · 方法**：`html.fromstring` / `document.xpath("//*[@id='top20']/thead/tr/th/text()")`
  > **三级 · 骨架**：`response = requests.get(url, timeout=____)`

- [ ] **2-3 请求失败也要优雅**
  把 2-2 的请求用 try/except 包住：网络出问题时打印"请求失败：原因"，程序不崩溃。可以用一个不存在的域名（如 https://www.this-domain-not-exist-12345.com）来测试。

  > [!TIP]- 提示
  > **一级 · 思路**：网络请求随时可能失败（超时、连不上、域名不存在），失败时要有兜底
  > **二级 · 方法**：`try ... except Exception as e`（第 25 篇异常处理）
  > **三级 · 骨架**：`except Exception as e:\n    print(f"请求失败: {e}")`

> [!TIP]- 参考答案（做完再点开）
> ```python
> # 2-1
> import requests
>
> response = requests.get("https://www.itcast.cn", timeout=60)
> print(response.text[:200])
>
> # 2-2
> import requests
> from lxml import html
>
> response = requests.get("https://www.tiobe.com/tiobe-index/", timeout=60)
> document = html.fromstring(response.text)
> th_list = document.xpath("//*[@id='top20']/thead/tr/th/text()")
> print(th_list)
>
> # 2-3
> import requests
> from lxml import html
>
> try:
>     response = requests.get("https://www.tiobe.com/tiobe-index/", timeout=60)
>     document = html.fromstring(response.text)
>     print(document.xpath("//*[@id='top20']/thead/tr/th/text()"))
> except Exception as e:
>     print(f"请求失败: {e}")
> ```