---
title: Pandas数据读取与写入
published: 2026-09-20
description: 用 Pandas 读取和写入数据文件：read_csv 常用参数、计算新列、to_csv 写回，以及 _xxx 命名规律
tags:
  - Python
  - 数据分析
image: https://img.tsh520.cn/file/blog/post-covers/python-53-pandas-io.webp
order: 53
---

## 一套命名规律：read_xxx / to_xxx

Pandas 提供了一套 API，可以方便地读取和写入各类数据文件（csv、Excel、数据库、网络数据等）：

| 方向 | 方法 | 例子 |
| --- | --- | --- |
| 读取 | `read_xxx` | `pd.read_csv()`、`pd.read_excel()` |
| 写入 | `to_xxx` | `df.to_csv()`、`df.to_excel()` |

流程上的位置：**读取 → 清洗处理 → 分析 → 写出**。

## 读取 + 计算 + 写出的完整例子

```python
import pandas as pd

# 读取数据 --> read_csv
df = pd.read_csv('data/sales.csv', usecols=['订单号', '产品类别', '产品名称', '销售数量', '单价'])

# 数据处理：新增一列（销售金额 = 销售数量 × 单价）
df['销售金额'] = df['销售数量'] * df['单价']

# 写入数据 --> to_csv；index=False 表示不写入索引列
df.to_csv('data/sales_01.csv', index=False)
```

### read_csv 常用参数

| 参数 | 作用 |
| --- | --- |
| `usecols=['列1', '列2']` | 只读取需要的列 |
| `index_col='订单号'` | 指定某一列作为行索引 |
| `nrows=10` | 只读前 n 行（试读大文件时好用） |
| `dtype={'年份': 'Int64'}` | 指定某列的读取类型（`Int64` 支持空值） |

### to_csv 常用参数

| 参数 | 作用 |
| --- | --- |
| `index=False` | **不写入索引列**（最常用，否则文件里会多出一列行号） |
| `encoding='utf-8'` | 指定编码 |

> [!TIP]
> `df['新列名'] = 表达式` 是 Pandas 里新增列的标准写法：右边是**整列**的运算（`df['销售数量'] * df['单价']` 会把每一行对应相乘），不需要写循环。

## 相关

- [Pandas数据查看、选择与过滤](/posts/编程学习/python学习笔记/54-pandas数据查看选择与过滤/)
- [实战-TMDB电影榜单统计分析](/posts/编程学习/python学习笔记/59-实战-tmdb电影榜单统计分析/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 读取数据的方法是 `read_xxx`，写入是 `____`
2. 读 CSV：`pd.____('data/sales.csv')`；只读需要的列用参数 ____
3. 指定某列当行索引用参数 ____；只读前 n 行用参数 ____
4. 新增一列"销售金额"：`df['销售金额'] = df['销售数量'] ____ df['单价']`
5. 写出 CSV：`df.____('data/sales_01.csv', index=____)`
6. `index=False` 的作用是 ____

> [!TIP]- 填空答案（做完再点开）
> 1. `to_xxx`（如 `to_csv`）　2. read_csv / `usecols`　3. `index_col` / `nrows`　4. `*`　5. to_csv / False　6. 不把索引列写进文件（否则会多出一列行号）

### 二、裸写题

- [ ] **2-1 读取指定列**
  读取 `data/sales.csv`，只要"订单号、产品类别、销售数量、单价"四列，打印前 5 行。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：读文件时就把不需要的列过滤掉，省内存
  > **二级 · 方法**：`pd.read_csv(路径, usecols=[...])`
  > **三级 · 骨架**：`df.____(5)` 看前 5 行

- [ ] **2-2 计算新列并写回文件**
  在上面基础上新增"销售金额"列（销售数量 × 单价），写出到 `sales_out.csv`（不要索引列）。

  > [!TIP]- 提示
  > **一级 · 思路**：新增列 → 写出
  > **二级 · 方法**：`df['销售金额'] = df['销售数量'] * df['单价']` / `df.to_csv(..., index=False)`
  > **三级 · 骨架**：右边是整列相乘，不用写循环

- [ ] **2-3 用订单号当行索引**
  重新读取 `data/sales.csv`，把"订单号"设为行索引，然后打印索引的前 3 个值。

  > [!TIP]- 提示
  > **一级 · 思路**：读的时候直接指定索引列
  > **二级 · 方法**：`pd.read_csv(路径, index_col='订单号')`
  > **三级 · 骨架**：`print(df.index[:3].tolist())`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import pandas as pd
>
> # 2-1
> df = pd.read_csv('data/sales.csv', usecols=['订单号', '产品类别', '销售数量', '单价'])
> print(df.head(5))
>
> # 2-2
> df['销售金额'] = df['销售数量'] * df['单价']
> df.to_csv('sales_out.csv', index=False)
> print(df.head(3))
>
> # 2-3
> df2 = pd.read_csv('data/sales.csv', index_col='订单号')
> print(df2.index[:3].tolist())
> ```