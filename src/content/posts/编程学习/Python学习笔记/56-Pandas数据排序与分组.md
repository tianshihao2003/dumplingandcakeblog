---
title: Pandas数据排序与分组
published: 2026-09-20
description: 用 sort_values 做单列/多列排序，用 groupby 按特征分组并做 count/sum/min/max/mean 与 agg 聚合
tags:
  - Python
  - 数据分析
image: https://img.tsh520.cn/file/blog/post-covers/python-56-pandas-sort-group.webp
order: 56
---

## 数据排序：sort_values

```python
# 降序：销售数量从多到少
df.sort_values('销售数量', ascending=False)

# 升序：单价从小到大（ascending=True 是默认值，可以不写）
df.sort_values('单价', ascending=True)
df.sort_values('单价')

# 多列排序：先按第一列，第一列的值相同时才按第二列
df.sort_values(['单价', '销售数量'], ascending=[True, False])
```

> [!NOTE]
> 多列排序就像 Excel 的"多级排序"：`ascending` 要传**列表**，和前面的列一一对应。上面这句的含义是"单价升序，单价相同再看销售数量降序"。

## 数据分组：groupby

分组操作就是把数据**按照某个特征分成不同的组**，然后对每个组分别进行统计计算。

```python
df = pd.read_csv('data/sales.csv', nrows=20)
df['销售金额'] = df['单价'] * df['销售数量']

# 按"产品类别"分组，分别统计
df.groupby('产品类别')['订单号'].count()     # 各组的订单数量
df.groupby('产品类别')['销售数量'].sum()     # 各组的销售数量之和
df.groupby('产品类别')['销售金额'].sum()     # 各组的销售金额之和
df.groupby('产品类别')['单价'].min()         # 各组的最低单价
df.groupby('产品类别')['单价'].max()         # 各组的最高单价
df.groupby('产品类别')['单价'].mean()        # 各组的平均单价
```

| 聚合方法 | 含义 |
| --- | --- |
| `count()` | 统计数量 |
| `sum()` | 求和 |
| `min()` / `max()` | 最小值 / 最大值 |
| `mean()` | 平均值 |

### 一次算多个指标：agg

```python
# 对同一列做多种聚合
df.groupby('产品类别')['单价'].agg(['mean', 'max', 'min'])

# 不同列做不同聚合（推荐写法）：字典的键是列名，值是聚合方式
df.groupby('产品类别').agg({
    '销售数量': 'sum',
    '销售金额': 'sum',
    '单价': 'mean',
})
```

> [!TIP]
> "分组 + 聚合"是数据分析里出结论最快的一招：`df.groupby(按什么分)[看哪一列].(算什么)`。比如"各产品类别的销售金额合计"，一行代码就出来了。

## 相关

- [实战-TMDB电影榜单统计分析](/posts/编程学习/python学习笔记/59-实战-tmdb电影榜单统计分析/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 排序用 `df.____('列名', ascending=____)`；升序是 `True`，降序是 ____
2. 多列排序：`df.sort_values([列1, 列2], ascending=[____, ____])`，会先按第 ____ 列排，相同时才按第二列
3. 分组用 `df.____('列名')`，作用是按某特征分成不同组后分别做 ____ 计算
4. 分组后统计数量用 `____()`、求和用 `____()`、平均值用 `____()`、最值用 `min()`/`max()`
5. 一次算多个指标用 `____()`：`df.groupby('产品类别')['单价'].agg(['mean', 'max', 'min'])`
6. 不同列做不同聚合时，agg 里传 ____：`{'销售数量': 'sum', '单价': 'mean'}`

> [!TIP]- 填空答案（做完再点开）
> 1. sort_values / True / False　2. True, False / 一　3. groupby / 统计　4. count / sum / mean　5. agg　6. 字典

### 二、裸写题

数据：`data/sales.csv`

- [ ] **2-1 排序**
  按"销售数量"降序显示；再按"单价升序 + 销售数量降序"做多列排序，打印前 5 行。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：单列排序传列名，多列排序传列表 + ascending 列表
  > **二级 · 方法**：`sort_values('销售数量', ascending=False)` / `sort_values(['单价', '销售数量'], ascending=[True, False])`
  > **三级 · 骨架**：结果用 `.head(5)` 看前 5 行

- [ ] **2-2 分组统计**
  按"产品类别"分组，统计各类别的订单数量、销售数量之和。

  > [!TIP]- 提示
  > **一级 · 思路**：`df.groupby(按什么分)[看哪一列].(算什么)`
  > **二级 · 方法**：`df.groupby('产品类别')['订单号'].count()` / `['销售数量'].sum()`
  > **三级 · 骨架**：先算出"销售金额"列再分组求和更有业务意义

- [ ] **2-3 一行出多个指标**
  按"产品类别"分组，一次算出各类别的"平均单价、最高单价、最低单价"。

  > [!TIP]- 提示
  > **一级 · 思路**：同一列要多个指标 → 用 agg 传列表
  > **二级 · 方法**：`df.groupby('产品类别')['单价'].agg(['mean', 'max', 'min'])`
  > **三级 · 骨架**：如果想再多一列"销售金额合计"，改用 agg 传字典

> [!TIP]- 参考答案（做完再点开）
> ```python
> import pandas as pd
>
> df = pd.read_csv('data/sales.csv')
> df['销售金额'] = df['销售数量'] * df['单价']
>
> # 2-1
> print(df.sort_values('销售数量', ascending=False).head(5))
> print(df.sort_values(['单价', '销售数量'], ascending=[True, False]).head(5))
>
> # 2-2
> print(df.groupby('产品类别')['订单号'].count())
> print(df.groupby('产品类别')['销售数量'].sum())
>
> # 2-3
> print(df.groupby('产品类别')['单价'].agg(['mean', 'max', 'min']))
>
> # 扩展：不同列不同聚合
> print(df.groupby('产品类别').agg({'销售数量': 'sum', '销售金额': 'sum', '单价': 'mean'}))
> ```