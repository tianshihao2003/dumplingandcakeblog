---
title: Matplotlib入门
published: 2026-09-20
description: Matplotlib 是什么、如何画折线图，以及画布/标题/轴标签/刻度/网格/图例等图表元素的设置方法
tags:
  - Python
  - 数据分析
order: 57
---

## Matplotlib 是什么

Matplotlib 是一个功能强大的**数据可视化**开源 Python 库，也是 Python 中使用最多的绘图库，可以创建静态、动态、交互式的图表。

官网：https://matplotlib.org

```bash
pip install matplotlib
```

## 入门程序：画一条折线

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [6, 2, 9, 8, 10]

plt.plot(x, y)     # 折线图
plt.show()         # 显示图表
```

> [!WARNING]
> **X 轴的数据数量与 Y 轴的数据数量必须一致**，否则画不出来（10 个点就必须都是 10 个）。

## 一份完整的折线图

```python
import matplotlib.pyplot as plt
import random

# 展示中文：设置中文字体为黑体（不设置的话中文会变成方块）
plt.rcParams['font.sans-serif'] = ['SimHei']

x = [i for i in range(1, 25)]
y_bj = [random.randint(10, 15) for i in x]
y_xa = [random.randint(13, 18) for i in x]

plt.figure(figsize=(10, 5))          # 设置画布大小（宽, 高）；不写会自动创建
plt.plot(x, y_bj, label='北京')       # 折线图，label 用于图例
plt.plot(x, y_xa, label='西安')

# 设置折线图的详细信息
plt.title('气温变化折线图', fontsize=15)   # 标题
plt.xlabel('时间')                        # X 轴标签
plt.ylabel('温度')                        # Y 轴标签
plt.xticks(x)                            # X 轴刻度
plt.yticks(range(5, 21))                 # Y 轴刻度
plt.grid(linestyle='--', alpha=0.3)      # 网格线（虚线、透明度 0.3）
plt.legend(loc='upper right')            # 图例（位置：右上）

plt.show()
```

## 图表元素对照表

| 元素 | 设置方式 |
| --- | --- |
| 画布（Figure） | `plt.figure(figsize=(宽, 高))` |
| 折线 | `plt.plot(x, y, label='图例名')` |
| 标题（Title） | `plt.title('...')` |
| X/Y 轴标签 | `plt.xlabel('...')` / `plt.ylabel('...')` |
| X/Y 轴刻度 | `plt.xticks(...)` / `plt.yticks(...)` |
| 网格线（Grid） | `plt.grid(linestyle='--', alpha=0.3)` |
| 图例（Legend） | `plt.legend(loc='upper right')` |
| 显示图表 | `plt.show()` |

> [!TIP]
> `label` 与 `legend` 是配套的：**每条折线都要写 `label`，`plt.legend()` 才会显示出图例**；只调 `legend()` 不写 `label`，图例是空的。

## 相关

- [Matplotlib子图与常用图表](/posts/编程学习/python学习笔记/58-matplotlib子图与常用图表/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. Matplotlib 是 Python 中使用最多的 ____ 库，安装命令 `pip install ____`
2. 画折线用 `plt.____(x, y)`；显示图表用 `plt.____()`
3. 画折线前必须保证 X 轴与 Y 轴的 ____ 一致
4. 展示中文要设置 `plt.rcParams['font.sans-serif'] = ['____']`
5. 设置画布大小：`plt.figure(figsize=(____, ____))`
6. 设置标题用 `plt.____('...')`；X 轴标签用 `plt.____('...')`；网格线用 `plt.____()`；图例用 `plt.____()`

> [!TIP]- 填空答案（做完再点开）
> 1. 可视化（绘图）/ matplotlib　2. plot / show　3. 数据数量　4. SimHei（黑体）　5. 宽, 高　6. title / xlabel / grid / legend

### 二、裸写题

- [ ] **2-1 画一条最简单的折线**
  x 取 1~10，y 取这 10 个数的平方，画出折线图（不用设置中文）。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：准备两组等长的列表 → 画 → 显示
  > **二级 · 方法**：`plt.plot(x, y)` / `plt.show()`
  > **三级 · 骨架**：`y = [i ** 2 for i in x]`

- [ ] **2-2 加满细节的折线图**
  画两条折线（北京/西安的气温，数据自拟），要求有：中文标题、XY 轴标签、X 轴刻度、网格线、图例。

  > [!TIP]- 提示
  > **一级 · 思路**：先设中文字体，再画线（带 label），最后统一设置文字与网格
  > **二级 · 方法**：`rcParams` / `plot(..., label=)` / `title` / `xlabel` / `ylabel` / `xticks` / `grid` / `legend`
  > **三级 · 骨架**：`plt.legend(loc='upper right')` 显示图例

- [ ] **2-3 把图保存成图片**
  在 2-2 的基础上，把图表保存成 `chart.png` 再显示。

  > [!TIP]- 提示
  > **一级 · 思路**：保存要在 `show()` 之前（show 之后画布会被清掉）
  > **二级 · 方法**：`plt.savefig('chart.png')`
  > **三级 · 骨架**：`savefig` 也可以指定 `dpi=100`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import matplotlib.pyplot as plt
>
> # 2-1
> x = [i for i in range(1, 11)]
> y = [i ** 2 for i in x]
> plt.plot(x, y)
> plt.show()
>
> # 2-2 / 2-3
> plt.rcParams['font.sans-serif'] = ['SimHei']
>
> x = [i for i in range(1, 13)]
> y_bj = [10, 12, 15, 18, 22, 26, 28, 27, 23, 18, 13, 11]
> y_xa = [12, 14, 17, 21, 25, 29, 31, 30, 26, 21, 16, 13]
>
> plt.figure(figsize=(10, 5))
> plt.plot(x, y_bj, label='北京')
> plt.plot(x, y_xa, label='西安')
> plt.title('气温变化折线图', fontsize=15)
> plt.xlabel('月份')
> plt.ylabel('温度(℃)')
> plt.xticks(x)
> plt.grid(linestyle='--', alpha=0.3)
> plt.legend(loc='upper right')
>
> plt.savefig('chart.png')   # 先保存
> plt.show()                 # 再显示
> ```