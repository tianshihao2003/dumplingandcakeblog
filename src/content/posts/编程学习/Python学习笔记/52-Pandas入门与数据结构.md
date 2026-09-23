---
title: Pandas入门与数据结构
published: 2026-09-20
description: Pandas 的 DataFrame 与 Series 是什么、四种构建方式和常用属性（index/columns/values/shape 等）
tags:
  - Python
  - 数据分析
image: https://img.tsh520.cn/file/blog/post-covers/python-52-pandas-basics.webp
order: 52
---

## Pandas 是什么

Pandas 是一个功能强大的**结构化数据分析**工具集，底层基于 Numpy 构建，在数据分析和大数据开发场景中都有显著优势。

官网：https://pandas.pydata.org

安装（注意是 pip，不是 npm）：

```bash
pip install pandas
```

> [!WARNING]
> 课程 PPT 上写的 `npm install pandas` 是笔误——npm 是 Node.js 的包管理器，Python 用 `pip`。

### 两个核心数据结构

| 结构 | 是什么 | 类比 |
| --- | --- | --- |
| **DataFrame** | 表格型的数据结构，有行有列 | 一张 Excel 表格 |
| **Series** | 一列数据 | DataFrame 中的单独一列 |

概念对应关系：**index**（索引，行号或行标签）、**column**（列名）、**row**（一行）。

## 初体验：统计各科成绩

需求：基于 Pandas 统计班级学员各科成绩的最高分、最低分、平均分。

```python
import pandas as pd

# 构造 DataFrame —— 创建数据集(学员成绩信息)
df = pd.DataFrame([
    {"姓名": "小王", "语文": 90, "数学": 80, "英语": 70},
    {"姓名": "小李", "语文": 80, "数学": 90, "英语": 80},
    {"姓名": "小张", "语文": 70, "数学": 80, "英语": 90},
])

# 统计计算
print(f"语文最高分: {df['语文'].max()}, 最低分: {df['语文'].min()}, 平均分: {df['语文'].mean():.2f}")
print(f"数学最高分: {df['数学'].max()}, 最低分: {df['数学'].min()}, 平均分: {df['数学'].mean():.2f}")
print(f"英语最高分: {df['英语'].max()}, 最低分: {df['英语'].min()}, 平均分: {df['英语'].mean():.2f}")
```

`:.2f` 表示保留两位小数。取出一列后，`max()` / `min()` / `mean()` 这些统计方法直接就能用。

## DataFrame 的四种构建方式

```python
import pandas as pd

# 1. 列表套字典：每个字典是一行
df1 = pd.DataFrame([
    {'姓名': '王林', '语文': 80, '英语': 90, '数学': 88},
    {'姓名': '李慕婉', '语文': 92, '英语': 81, '数学': 93},
])

# 2. 字典套列表：键是列名，值是该列的数据
df2 = pd.DataFrame({
    '姓名': ['王林', '李慕婉'],
    '语文': [80, 92],
    '英语': [90, 81],
    '数学': [88, 93],
})

# 3. 列表套元组 + columns 指定列名
df3 = pd.DataFrame([
    ('王林', 80, 90, 88),
    ('李慕婉', 92, 81, 93),
], columns=['姓名', '语文', '英语', '数学'])

# 4. 在 3 的基础上再指定自定义行索引
df4 = pd.DataFrame([
    ('王林', 80, 90, 88),
    ('李慕婉', 92, 81, 93),
], columns=['姓名', '语文', '英语', '数学'], index=['a', 'b'])
```

### DataFrame 常见属性

| 属性 | 作用 |
| --- | --- |
| `df.index` | 获取行索引 |
| `df.columns` | 获取列名（DataFrame 特有） |
| `df.values` | 获取值（二维数组） |
| `df.size` | 获取单元格的数量 |
| `df.dtypes` | 获取每一列的数据类型 |
| `df.shape` | 获取数据维度（行, 列） |

## Series 的构建与属性

```python
import pandas as pd

s1 = pd.Series([10, 20, 30, 40, 50])                              # 列表
s2 = pd.Series((10, 20, 30, 40, 50), index=['a', 'b', 'c', 'd', 'e'])  # 元组 + 自定义索引
s3 = pd.Series({'a': 10, 'b': 20, 'c': 30})                       # 字典
s4 = df1['语文']                                                  # 从 DataFrame 里取一列
```

| 属性 | 作用 |
| --- | --- |
| `s.index` | 获取索引 |
| `s.values` | 获取值 |
| `s.dtype` | 获取数据类型（Series 是**单数** dtype） |
| `s.size` | 获取数据个数 |
| `s.shape` | 获取数据维度（行,）——只有一个维度 |

> [!TIP]
> 记法：DataFrame 有 `columns`、类型是 `dtypes`（复数）；Series 没有 `columns`、类型是 `dtype`（单数）。

## 相关

- [Pandas数据读取与写入](/posts/编程学习/python学习笔记/53-pandas数据读取与写入/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. Pandas 是____分析工具集，底层基于 ____ 构建
2. 两个核心结构：____ 像一张 Excel 表格；____ 像表格中的一列
3. 安装命令：`____ install pandas`
4. DataFrame 取列名用 `df.____`、取维度用 `df.____`、取单元格数量用 `df.____`、取每列类型用 `df.____`
5. Series 取数据类型用 `s.____`（单数），DataFrame 用 `df.____`（复数）
6. `df['语文'].`____`()` 求平均分；`max()` 求最大值、`min()` 求最小值
7. 构造 DataFrame 时用参数 ____ 指定列名，用参数 ____ 指定行索引

> [!TIP]- 填空答案（做完再点开）
> 1. 结构化数据 / Numpy　2. DataFrame / Series　3. pip　4. columns / shape / size / dtypes　5. dtype / dtypes　6. mean　7. columns / index

### 二、裸写题

- [ ] **2-1 构造 DataFrame**
  用"字典套列表"的方式造一个 3 名学员的成绩表（列：姓名、语文、数学），打印 `shape` 和 `columns`。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：列名当字典的键，每列的数据当值
  > **二级 · 方法**：`pd.DataFrame({...})`
  > **三级 · 骨架**：`df = pd.DataFrame({"姓名": [...], "语文": [...], "数学": [...]})`

- [ ] **2-2 取属性**
  对上面造出的表，分别打印：行索引、列名、值、单元格数量、每列类型、维度。

  > [!TIP]- 提示
  > **一级 · 思路**：六个属性各一行
  > **二级 · 方法**：`index` / `columns` / `values` / `size` / `dtypes` / `shape`
  > **三级 · 骨架**：`print(df.index.tolist())`（转成列表看得更清楚）

- [ ] **2-3 统计一列**
  取出"语文"这一列，打印最高分、最低分、平均分（平均分保留两位小数）。

  > [!TIP]- 提示
  > **一级 · 思路**：先取列，再用统计方法
  > **二级 · 方法**：`df['语文'].max()` / `.min()` / `.mean()`
  > **三级 · 骨架**：`f"{df['语文'].mean():.____}"` 保留两位小数

> [!TIP]- 参考答案（做完再点开）
> ```python
> import pandas as pd
>
> # 2-1
> df = pd.DataFrame({
>     "姓名": ["小王", "小李", "小张"],
>     "语文": [90, 80, 70],
>     "数学": [80, 90, 80],
> })
> print(df.shape)      # (3, 3)
> print(df.columns.tolist())  # ['姓名', '语文', '数学']
>
> # 2-2
> print(df.index.tolist())    # [0, 1, 2]
> print(df.columns.tolist())
> print(df.values.tolist())
> print(df.size)              # 9
> print(df.dtypes)
> print(df.shape)             # (3, 3)
>
> # 2-3
> print(f"最高分: {df['语文'].max()}, 最低分: {df['语文'].min()}, 平均分: {df['语文'].mean():.2f}")
> ```