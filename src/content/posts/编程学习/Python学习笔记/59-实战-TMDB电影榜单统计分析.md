---
title: 实战-TMDB电影榜单统计分析
published: 2026-09-20
description: 综合实战：用 Pandas 统计 TMDB-TOP300 电影数据，用 Matplotlib 画出每年数量折线图、语言/类型柱状图与评分占比饼图
image: https://img.tsh520.cn/file/blog/post-covers/python-59-tmdb-analysis.webp
tags:
  - Python
  - 数据分析
order: 59
---

## 项目目标

把上一章爬到的 300 部电影数据（`data/movies.csv`）做成一张统计分析图。

| 需求 | 统计内容 | 图表 |
| --- | --- | --- |
| 1 | TOP300 中每一年上映的电影数量变化 | 折线图 |
| 2 | 不同语言的电影数量对比 | 柱状图 |
| 3 | 不同类型（题材）的电影数量对比 | 柱状图 |
| 4 | 各个评分的电影占比 | 饼状图 |

## 开发步骤

1. **准备工作**：导入依赖库、配置运行时参数（中文）、创建子图完成基本布局、加载数据
2. 需求一：每年电影数量变化（折线图）
3. 需求二：不同语言电影数量（柱状图）
4. 需求三：不同类型电影数量（柱状图）
5. 需求四：不同评分电影占比（饼状图）

### 准备工作

```python
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.axes import Axes

plt.rcParams['font.sans-serif'] = ['SimHei']       # 中文

fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(20, 12), dpi=100)
fig.suptitle('TMDB-TOP300电影榜单数据统计', fontsize=23, x=0.5, y=0.95)
fig.subplots_adjust(hspace=0.4, wspace=0.2)        # 调整子图间距

axes1: Axes = axes[0][0]
axes2: Axes = axes[0][1]
axes3: Axes = axes[1][0]
axes4: Axes = axes[1][1]

# 加载数据：年份指定为 Int64（这种整型支持空值）
data = pd.read_csv('data/movies.csv',
                   usecols=['电影名', '年份', '上映时间', '类型', '时长', '评分', '语言'],
                   dtype={'年份': 'Int64'})
```

## 需求一：每年电影数量（折线图）

```python
# 1.1 缺失值处理：年份为空的，用"上映时间"的前 4 位补上
data['年份'] = data['年份'].fillna(data['上映时间'].str[:4])

# 1.2 分组统计：每年有多少部
year_count = data.groupby('年份')['年份'].count()

# 1.3 组装 x、y（把年份补全，没有电影的年份记 0）
min_year = year_count.index.min()
max_year = year_count.index.max()
x = [i for i in range(min_year, max_year + 1)]
y = [int(year_count.get(i, 0)) for i in x]

# 1.4 绘制
axes1.plot(x, y, color='green')
axes1.set_title('每年电影数量变化折线图', fontsize=18)
axes1.set_xlabel('年份', fontsize=12)
axes1.set_ylabel('电影数量', fontsize=12)
axes1.set_xticks(x[::8])                       # 每 8 年显示一个刻度
axes1.set_yticks([i for i in range(0, 31, 3)])
axes1.grid(linestyle='--', alpha=0.5)
```

> [!TIP]
> `year_count.get(i, 0)` 的作用是"取不到就记 0"：中间有些年份可能一部都没有，直接画会断档。

## 需求二：不同语言电影数量（柱状图）

```python
language_count = data.groupby('语言')['语言'].count().sort_values(ascending=False)

x_language = language_count.index.tolist()
y_language_count = language_count.values.tolist()

axes2.bar(x_language, y_language_count, color='green', width=0.7)
axes2.set_title('不同语言电影数量柱状图', fontsize=18)
axes2.set_xlabel('语言', fontsize=12)
axes2.set_ylabel('电影数量', fontsize=12)
axes2.grid(linestyle='--', alpha=0.5)
axes2.tick_params(axis='x', rotation=90)        # 语言名较长，竖排
```

## 需求三：不同类型电影数量（柱状图）

难点：`类型` 一列存的是 `"剧情,犯罪"` 这样的多值，需要**拆开逐个计数**。

```python
type_count = {}                                  # {'剧情': 5, '犯罪': 3}
for types in data['类型'].str.split(','):        # 每行拆成 ['剧情', '犯罪']
    for t in types:
        if t in type_count:
            type_count[t] += 1
        else:
            type_count[t] = 1

x_types = list(type_count.keys())
y_values = list(type_count.values())

axes3.bar(x_types, y_values, color='green', width=0.7)
axes3.set_title('不同类型电影数量柱状图', fontsize=18)
axes3.set_xlabel('类型', fontsize=12)
axes3.set_ylabel('电影数量', fontsize=12)
axes3.grid(linestyle='--', alpha=0.5)
axes3.tick_params(axis='x', rotation=90)
```

## 需求四：评分占比（饼图）

难点：评分取值很分散（87、85、83…），如果全都画进饼图会碎成一团。做法是**把占比小于 2% 的合并成"其他"**。

```python
score_count = data.groupby('评分')['评分'].count()

total = score_count.sum()
large_scores = score_count.loc[score_count >= total * 0.02]   # 占比 >= 2%
small_scores = score_count.loc[score_count < total * 0.02]    # 占比 < 2%

if small_scores.shape[0] > 0:
    large_scores['其他'] = small_scores.sum()                  # 小数据合并

scores = large_scores.index.tolist()
scores_values = large_scores.values.tolist()

axes4.pie(scores_values, labels=scores, autopct='%1.1f%%', startangle=0, radius=1.2)
axes4.set_title('不同评分电影数量占比饼状图', fontsize=18)
axes4.legend(loc='lower center', ncol=4, bbox_to_anchor=(0.5, -0.3))

plt.savefig('data/TMDB-TOP300.png')   # 保存
plt.show()                            # 显示
```

## 进阶：拆成函数（模块化）

课程的最后一步把这套流程拆成了函数，主函数只负责"按顺序调用"：

| 函数 | 职责 |
| --- | --- |
| `load_data()` | 读取 movies.csv（含年份类型指定） |
| `create_subplots()` | 创建 2×2 子图并返回 axes1~axes4 |
| `process_year_data(data)` / `plot_year_trend(axes1, x, y)` | 需求一的**数据处理**与**画图**分开 |
| `process_language_data(data)` / `plot_language_bar(...)` | 需求二 |
| `process_genre_data(data)` / `plot_genre_bar(...)` | 需求三 |
| `process_score_data(data)` / `plot_score_pie(...)` | 需求四 |

> [!TIP]
> "数据处理"和"画图"分开写的好处：**统计逻辑可以单独测试**（对着数字检查对不对），画图只是最后一步。完整的分函数版本见课程文件 `10. TMDB-TOP300电影榜单数据统计.py`。

## 相关

- [Matplotlib子图与常用图表](/posts/编程学习/python学习笔记/58-matplotlib子图与常用图表/)
- [Pandas数据排序与分组](/posts/编程学习/python学习笔记/56-pandas数据排序与分组/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 子图布局 2 行 2 列时，左上角子图是 `axes[____][____]`，右下角是 `axes[1][1]`
2. 画布总标题用 `fig.____('...')`；调整子图间距用 `fig.____(hspace=0.4, wspace=0.2)`
3. 读取年份列时指定 `dtype={'年份': '____'}`，这种整型支持空值
4. 年份缺失时用 `data['年份'].____(data['上映时间'].str[:4])` 补齐
5. 每年电影数量用 `data.groupby('年份')['年份'].____()` 统计
6. 组装折线数据时 `year_count.____(i, 0)` 表示"取不到就记 0"
7. `类型` 列是多值（"剧情,犯罪"），用 `data['类型'].____.split(',')` 拆开逐个计数
8. 饼图前把占比小于 2% 的评分合并成"____"，避免图形碎成一团
9. 柱子标签太长时用 `axes.tick_params(axis='x', rotation=____)` 竖排

> [!TIP]- 填空答案（做完再点开）
> 1. 0、0　2. suptitle / subplots_adjust　3. Int64　4. fillna　5. count　6. get　7. str　8. 其他　9. 90

### 二、裸写题（用 data/movies.csv 实跑）

- [ ] **2-1 统计每年电影数量**
  用 `data/movies.csv` 统计出"每年上映电影数量"，打印 1994 年和 2000 年各有多少部（年份缺失的用上映时间补）。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：先补年份 → 按年份分组计数 → 取值
  > **二级 · 方法**：`fillna(上映时间的前 4 位)` / `groupby('年份')['年份'].count()`
  > **三级 · 骨架**：`year_count.get(1994, 0)`

- [ ] **2-2 统计不同语言的电影数量并排序**
  按语言分组统计数量，按数量从多到少排序，打印前 5 名。

  > [!TIP]- 提示
  > **一级 · 思路**：分组计数得到 Series，再排序切片
  > **二级 · 方法**：`groupby('语言')['语言'].count().sort_values(ascending=False)`
  > **三级 · 骨架**：`.head(5)`

- [ ] **2-3 统计不同类型电影数量**
  `类型` 列是 `"剧情,犯罪"` 这种多值，拆开后统计每种题材各有多少部，打印数量前 5 的题材。

  > [!TIP]- 提示
  > **一级 · 思路**：一行可能属于多个题材，要先拆再计数（字典计数）
  > **二级 · 方法**：`data['类型'].str.split(',')` + 双重 for 循环
  > **三级 · 骨架**：`if t in type_count: type_count[t] += 1`

- [ ] **2-4 统计评分占比（合并小数据）**
  统计各评分电影数量占比，把占比小于 2% 的合并成"其他"，打印合并后的结果。

  > [!TIP]- 提示
  > **一级 · 思路**：先算总数，再按比例切两半（大的一块、小的一块）
  > **二级 · 方法**：`score_count.loc[score_count >= total * 0.02]`
  > **三级 · 骨架**：`large_scores['其他'] = small_scores.____()`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import pandas as pd
>
> data = pd.read_csv('data/movies.csv',
>                    usecols=['电影名', '年份', '上映时间', '类型', '时长', '评分', '语言'],
>                    dtype={'年份': 'Int64'})
>
> # 2-1
> data['年份'] = data['年份'].fillna(data['上映时间'].str[:4])
> year_count = data.groupby('年份')['年份'].count()
> print('1994 年:', year_count.get(1994, 0), '部')
> print('2000 年:', year_count.get(2000, 0), '部')
>
> # 2-2
> language_count = data.groupby('语言')['语言'].count().sort_values(ascending=False)
> print(language_count.head(5))
>
> # 2-3
> type_count = {}
> for types in data['类型'].str.split(','):
>     for t in types:
>         type_count[t] = type_count.get(t, 0) + 1
> type_series = pd.Series(type_count).sort_values(ascending=False)
> print(type_series.head(5))
>
> # 2-4
> score_count = data.groupby('评分')['评分'].count()
> total = score_count.sum()
> large_scores = score_count.loc[score_count >= total * 0.02]
> small_scores = score_count.loc[score_count < total * 0.02]
> if small_scores.shape[0] > 0:
>     large_scores['其他'] = small_scores.sum()
> print(large_scores)
> ```