---
title: Pandas数据清洗
published: 2026-09-20
description: 处理缺失值（dropna/fillna/ffill/bfill）、重复值（duplicated/drop_duplicates）、异常值与格式统一
tags:
  - Python
  - 数据分析
image: https://img.tsh520.cn/file/blog/post-covers/python-55-pandas-cleaning.webp
order: 55
---

## 数据清洗是什么

数据清洗是指**发现并纠正数据中可识别的错误**的过程，包括处理缺失值、重复值、异常值，统一数据格式，保证数据的一致性。

四类常见脏数据：

```text
重复值处理 · 缺失值处理 · 异常值处理 · 异常格式处理
```

## 缺失值处理

```python
df.isnull()                 # 查看缺失值（每个位置是不是空，True/False）
df.isnull().sum()           # 看每列有几个缺失值（更常用）

df.dropna()                 # 删除缺失值所在【行】
df.dropna(axis=1)           # 删除缺失值所在【列】

df.fillna('--')             # 用指定值填充
df.ffill()                  # 用【上一行】的值填充
df.bfill()                  # 用【下一行】的值填充
```

| 方法 | 作用 |
| --- | --- |
| `isnull()` | 查看缺失值 |
| `dropna()` | 删除缺失值所在行；加 `axis=1` 删列 |
| `fillna(值)` | 填充缺失值 |
| `ffill()` | 用上一行的值填充 |
| `bfill()` | 用下一行的值填充 |

## 重复值处理

```python
df.duplicated()                          # 查看重复值（所有列都相同才算重复）
df.duplicated(subset=['订单号'])          # 只按指定列判断是否重复

df.drop_duplicates(subset=['订单号'])     # 删除重复值，默认保留第一条（keep='first'）
df.drop_duplicates(subset=['订单号'], keep='last')   # 保留最后一条
```

> [!NOTE]
> 判断"重复"的标准由 `subset` 决定：订单数据通常按**订单号**去重，而不是要求整行一模一样。

## 异常值处理

```python
df[df['单价'] < 0]                       # 1. 查看异常值
df.drop(df[df['单价'] < 0].index)         # 2. 删除异常值（按索引删行）
df['单价'] = df['单价'].abs()             # 3. 修复异常值（取绝对值）
```

处理异常值有三条路：**查看 → 删除 或 修复**。负数单价很可能是录入时漏了负号，取绝对值比直接删更合适。

## 异常格式处理

```python
df['订单日期'] = df['订单日期'].str.replace('/', '-')   # 2025/06/01 → 2025-06-01
```

`.str` 是 Series 的"字符串方法入口"，可以像操作单个字符串一样对**整列**做替换、切片、分割：`df['类型'].str.split(',')`、`df['上映时间'].str[:4]`。

## 相关

- [Pandas数据排序与分组](/posts/编程学习/python学习笔记/56-pandas数据排序与分组/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 数据清洗包括处理 ____ 值、____ 值、____ 值，以及统一数据格式、保证一致性
2. 查看缺失值：`df.____()`；看每列缺失数量：`df.isnull().____()`
3. 删除缺失值所在行：`df.____()`；删除缺失值所在列要加参数 `axis=____`
4. 用上一行的值填充缺失值用 `df.____()`；用下一行用 `df.____()`
5. 查看重复值：`df.____()`，按指定列判断加参数 `subset=[...]`
6. 删除重复值：`df.____(subset=['订单号'])`；保留最后一条用 `keep='____'`
7. 异常值三条路：用 `df[条件]` ____、用 `df.drop(索引)` ____、用 `.abs()` ____
8. 把整列的 `/` 替换成 `-`：`df['订单日期'].____.replace('/', '-')`

> [!TIP]- 填空答案（做完再点开）
> 1. 缺失 / 重复 / 异常　2. isnull / sum　3. dropna / 1　4. ffill / bfill　5. duplicated　6. drop_duplicates / last　7. 查看 / 删除 / 修复　8. str

### 二、裸写题

数据：`data/sales.csv`

- [ ] **2-1 先体检：看缺失和重复**
  统计每一列的缺失值数量；再按"订单号"看有没有重复行、有多少条。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：先量化问题规模，再决定怎么处理
  > **二级 · 方法**：`df.isnull().sum()` / `df.duplicated(subset=['订单号']).sum()`
  > **三级 · 骨架**：`duplicated` 返回的是 True/False 序列，`sum()` 就是重复条数

- [ ] **2-2 缺失值两种处理**
  分别用"删除"和"填充"两种方式处理缺失值（各跑一次，观察行数变化）。

  > [!TIP]- 提示
  > **一级 · 思路**：删除会少行，填充不会；填充时想清楚用什么值合理
  > **二级 · 方法**：`df.dropna()` / `df.fillna('--')` / `df.ffill()`
  > **三级 · 骨架**：用 `len(df)` 前后对比行数

- [ ] **2-3 按订单号去重**
  删除按"订单号"重复的行（保留第一条），打印前后行数对比。

  > [!TIP]- 提示
  > **一级 · 思路**：去重前先记录行数，去重后再看
  > **二级 · 方法**：`df.drop_duplicates(subset=['订单号'])`
  > **三级 · 骨架**：`keep='____'` 是默认值（保留第一条）

- [ ] **2-4 处理异常值与格式**
  找出单价为负的行并删除；把"订单日期"里的 `/` 统一替换成 `-`。

  > [!TIP]- 提示
  > **一级 · 思路**：定位异常 → 删；格式问题 → 整列字符串替换
  > **二级 · 方法**：`df.drop(df[df['单价'] < 0].index)` / `.str.replace('/', '-')`
  > **三级 · 骨架**：负单价也可以用 `.abs()` 修复而不是删除，两种都试试

> [!TIP]- 参考答案（做完再点开）
> ```python
> import pandas as pd
>
> df = pd.read_csv('data/sales.csv')
>
> # 2-1
> print(df.isnull().sum())
> print(df.duplicated(subset=['订单号']).sum())
>
> # 2-2
> print(len(df))                      # 处理前行数
> print(len(df.dropna()))             # 删除缺失值后的行数
> print(len(df.fillna('--')))         # 填充后行数不变
> print(len(df.ffill()))              # 用上一行填充
>
> # 2-3
> before = len(df)
> df2 = df.drop_duplicates(subset=['订单号'], keep='first')
> print(before, '→', len(df2))
>
> # 2-4
> df3 = df.drop(df[df['单价'] < 0].index)          # 删除单价为负的行
> print(len(df), '→', len(df3))
>
> df['订单日期'] = df['订单日期'].str.replace('/', '-')   # 统一日期格式
> print(df['订单日期'].head(3))
> ```