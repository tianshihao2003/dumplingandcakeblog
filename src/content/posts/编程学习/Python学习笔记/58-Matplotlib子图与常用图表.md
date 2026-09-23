---
title: Matplotlib子图与常用图表
published: 2026-09-20
description: 用 subplots 在一张画布上创建多个子图，以及折线图、柱状图、饼状图三种常用图表的画法与适用场景
tags:
  - Python
  - 数据分析
image: https://img.tsh520.cn/file/blog/post-covers/python-58-matplotlib-subplots.webp
order: 58
---

## 为什么要用子图

为了能同时展示多个图表、便于图表之间数据的直观对比和分析，更高效地组织复杂的可视化信息，通常会在**一个画布上创建多个子图**。

```python
import matplotlib.pyplot as plt

figure, axes = plt.subplots(nrows=1, ncols=2, figsize=(20, 6), dpi=100)
# figure : 画布对象
# axes   : 子图数组（里面装着 Axes 对象）
# nrows / ncols : 行数 / 列数     figsize : 画布大小     dpi : 清晰度

axes[0].bar(...)   # 左边的子图：柱状图
axes[1].pie(...)   # 右边的子图：饼状图
```

### axes 的索引规则

| 布局 | 取值方式 |
| --- | --- |
| `nrows=1, ncols=2`（一行两列） | `axes[0]`、`axes[1]` |
| `nrows=2, ncols=2`（两行两列） | `axes[0][0]`、`axes[0][1]`、`axes[1][0]`、`axes[1][1]`（`axes[行][列]`） |

> [!TIP]
> 记住 `axes[行][列]` 就能定位任意子图；写成 `axes1 = axes[0][0]` 这样起个短名字，后面设置标题就不用重复写下标了。

## 三种常用图表

| 图表 | 方法 | 适用场景 |
| --- | --- | --- |
| 折线图 | `plot(x, y)` | 展示**趋势变化**（如每年电影数量） |
| 柱状图 | `bar(x, y, width=0.6, color='g')` | 展示**数量对比**（如各国石油储备） |
| 饼图 | `pie(values, labels=..., autopct='%1.1f%%')` | 展示**比例构成**（如各国人口占比） |

### 子图上的设置

在外面用 `plt.xxx`，在子图上就用 `axes.xxx`（多一个 `set_`）：

| 全局写法 | 子图写法 |
| --- | --- |
| `plt.title('...')` | `axes.set_title('...', fontsize=18)` |
| `plt.xlabel('...')` | `axes.set_xlabel('...')` |
| `plt.ylabel('...')` | `axes.set_ylabel('...')` |
| `plt.grid(...)` | `axes.grid(...)` |

## 完整示例：柱状图 + 饼图

```python
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['SimHei']

figure, axes = plt.subplots(nrows=1, ncols=2, figsize=(20, 6), dpi=100)

# 图一：柱状图（世界石油储备）
countries = ['中国', '美国', '印度', '加拿大', '伊拉克', '沙特', '伊朗', '英国', '德国']
values = [35, 23, 18, 21, 56, 78, 51, 12, 18]

axes[0].bar(countries, values, width=0.6, color='g')
axes[0].set_title('世界石油储备', fontsize=18)
axes[0].set_xlabel('国家')
axes[0].set_ylabel('石油储备(亿吨)')
axes[0].grid(linestyle='--', alpha=0.3)

# 图二：饼状图（世界人口比例）
countries2 = ['印度', '中国', '美国', '印尼', '巴基斯坦', '其他']
values2 = [14.51, 14.09, 3.4, 2.83, 2.51, 20]

axes[1].pie(values2, labels=countries2, autopct='%1.1f%%')
axes[1].set_title('世界人口比例', fontsize=18)
axes[1].legend(loc='lower center', ncol=3, bbox_to_anchor=(0.5, -0.08))

plt.savefig('data/01.png')   # 保存图片
plt.show()                   # 展示图表
```

| 参数 | 作用 |
| --- | --- |
| `autopct='%1.1f%%'` | 饼图上显示百分比（保留 1 位小数） |
| `legend(ncol=3, bbox_to_anchor=(0.5, -0.08))` | `ncol` 每行显示几个图例；`bbox_to_anchor` 控制图例位置 |
| `tick_params(axis='x', rotation=90)` | X 轴标签旋转 90 度（标签太长时用） |

## 小结（复习自测）

| 题目 | 答案 |
| --- | --- |
| 如何在画布中创建子图？ | `figure, axes = plt.subplots(nrows=1, ncols=2, figsize=(20, 6), dpi=100)` |
| 折线图 / 柱状图 / 饼状图分别适合什么？ | 趋势变化 / 数量对比 / 比例构成 |

## 相关

- [实战-TMDB电影榜单统计分析](/posts/编程学习/python学习笔记/59-实战-tmdb电影榜单统计分析/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 创建子图：`figure, axes = plt.____(nrows=2, ncols=2, figsize=(20, 12), dpi=100)`
2. `figure` 是 ____ 对象，`axes` 是 ____ 数组
3. 一行两列时子图是 `axes[0]`、`axes[1]`；两行两列时是 `axes[____][____]` 的形式
4. 折线图用 `plot`，柱状图用 `____`，饼图用 `____`
5. 折线图适合展示 ____，柱状图适合展示 ____，饼图适合展示 ____
6. 子图上设置标题用 `axes.____('...')`（比全局写法多一个 `set_`）
7. 饼图显示百分比用参数 `____='%1.1f%%'`
8. 保存图片用 `plt.____('data/01.png')`

> [!TIP]- 填空答案（做完再点开）
> 1. subplots　2. 画布 / 子图　3. 行、列（如 `axes[0][0]`）　4. bar / pie　5. 趋势变化 / 数量对比 / 比例构成　6. set_title　7. autopct　8. savefig

### 二、裸写题

- [ ] **2-1 一行两列的子图**
  创建 1 行 2 列的子图，左边画柱状图（自拟 5 个城市的人口），右边画饼图（同样数据看占比），两边都要有标题。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：先建子图拿到 axes，再往 axes[0]、axes[1] 上分别画
  > **二级 · 方法**：`plt.subplots(nrows=1, ncols=2, figsize=(20, 6))` / `axes[0].bar(...)` / `axes[1].pie(...)`
  > **三级 · 骨架**：`axes[0].set_title('...', fontsize=18)`

- [ ] **2-2 两行两列的布局**
  改成 2 行 2 列，把两个图放在 `axes[0][0]` 和 `axes[1][1]`，并给整个画布加标题。

  > [!TIP]- 提示
  > **一级 · 思路**：画布标题是 fig 级别的，不是某个子图的
  > **二级 · 方法**：`fig.suptitle('总标题', x=0.5, y=0.95)` / `fig.subplots_adjust(hspace=0.4, wspace=0.2)`
  > **三级 · 骨架**：`axes[0][0]` 和 `axes[1][1]`

- [ ] **2-3 标签太长怎么办**
  柱状图的 X 轴是较长的中文名称，画出后标签挤在一起——想办法让它竖着显示。

  > [!TIP]- 提示
  > **一级 · 思路**：旋转刻度标签
  > **二级 · 方法**：`axes.tick_params(axis='x', rotation=90)`
  > **三级 · 骨架**：`axis='____'` 指定是哪根轴

> [!TIP]- 参考答案（做完再点开）
> ```python
> import matplotlib.pyplot as plt
>
> plt.rcParams['font.sans-serif'] = ['SimHei']
>
> cities = ['北京', '上海', '广州', '深圳', '成都']
> pops = [2184, 2487, 1868, 1756, 2126]
>
> # 2-1
> fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(20, 6), dpi=100)
> axes[0].bar(cities, pops, width=0.6, color='g')
> axes[0].set_title('城市人口对比', fontsize=18)
> axes[0].set_xlabel('城市')
> axes[0].set_ylabel('人口(万)')
>
> axes[1].pie(pops, labels=cities, autopct='%1.1f%%')
> axes[1].set_title('城市人口占比', fontsize=18)
> plt.show()
>
> # 2-2 两行两列 + 画布标题
> fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(20, 12), dpi=100)
> fig.suptitle('城市人口分析', fontsize=23, x=0.5, y=0.95)
> fig.subplots_adjust(hspace=0.4, wspace=0.2)
>
> axes[0][0].bar(cities, pops, color='g')
> axes[0][0].set_title('人口对比', fontsize=15)
> axes[0][0].tick_params(axis='x', rotation=90)   # 2-3：标签竖排
>
> axes[1][1].pie(pops, labels=cities, autopct='%1.1f%%')
> axes[1][1].set_title('人口占比', fontsize=15)
> plt.show()
> ```