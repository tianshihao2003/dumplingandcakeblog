---
title: Python类型注解
published: 2026-09-16
tags:
  - Python
  - 类型注解
description: Python类型注解的基本介绍、变量类型注解、类型推断、函数类型注解
order: 22
---

## 类型注解基本介绍

类型注解是Python中的一种语法特性，用于明确标识变量、函数参数和返回值的数据类型，从而使代码更清晰、更安全、更易维护。

### 变量类型注解语法

```python
变量名: 数据类型 = 值
```

### 示例对比

```python
# 无类型注解
a = 695
score = 98.5
hobby = "Python"
flag = True
pic = None
names = ["A", "C", "E"]
phones = {"13309091111", "15209109121"}
options = {"count": 0, "total": 0}
goods = ("手机", 5999, 1)

# 有类型注解
a: int = 695
score: float = 98.5
hobby: str = "Python"
flag: bool = True
pic: None = None
names: list[str] = ["A", "C", "E"]
phones: set[str] = {"13309091111", "15209109121"}
options: dict[str, int] = {"count": 0, "total": 0}
goods: tuple[str, int, int] = ("手机", 5999, 1)
```

---

## 类型推断

类型推断是指Python解释器自动推断出变量、表达式或函数返回值的数据类型的能力，而无需开发者显式声明。

### 示例

```python
# Python会自动推断类型
a = 695          # 推断为 int
score = 98.5     # 推断为 float
hobby = "football"  # 推断为 str
flag = True      # 推断为 bool
pic = None       # 推断为 NoneType
names = ["张三", "李四", "王五"]  # 推断为 list[str]
goods = ("鼠标", "键盘", "USB")  # 推断为 tuple[str, str, str]
```

### 注意事项

- 在对变量进行直接赋值，或者涉及到变量的运算、容器的推导等场景时，解释器会自动推导出变量的类型

---

## 类型注解小结

1. **类型注解的写法？**
   - `变量: 数据类型`（如 `a: int`）

2. **常见类型的写法**
   - `int`、`float`、`bool`、`str`、`None`、`list`、`set`、`tuple`、`dict`
   - 多类型：`str | int`（使用 `|` 表示或）

3. **为什么要使用类型注解，有什么好处呢？**
   - 代码结构更清晰、代码逻辑更安全、易维护
   - 更准确的代码自动提示
   - 提前发现代码潜在问题

### 重要提醒

> **如果对变量直接赋值、变量运算等场景，Python会自动进行类型推断**

> **Python是动态类型语言，添加的类型注解只是提示，并不是强制约束！！！**

---

## 函数类型注解

为函数添加类型注解，其实主要就是为函数的参数和返回值添加类型注解。

### 语法格式

```python
def 函数名(参数名: 参数类型, ...) -> 返回值类型: 
    函数体
    return 返回值
```

### 示例1：单返回值

```python
def calc(scores: list[int]) -> float:
    return sum(scores) / len(scores)

# 调用
result = calc([85, 90, 95, 100])
print(result)  # 92.5
```

### 示例2：多返回值

```python
def calc_data(scores: list[int]) -> tuple[int, int, float]:
    max_v = max(scores)
    min_v = min(scores)
    avg_v = sum(scores) / len(scores)
    return max_v, min_v, avg_v

# 调用
max_score, min_score, avg_score = calc_data([85, 90, 95, 100])
print(max_score, min_score, avg_score)  # 100 85 92.5
```

### 语法说明

- **参数类型**：在参数名后加 `: 类型`
- **返回值类型**：在函数名后加 `-> 类型`

---

## 函数类型注解小结

1. **函数中类型注解的语法？**
   ```python
   def calc_data(scores: list[int]) -> tuple[int, int, float]:
       ...
   ```

2. **推荐使用场景**
   - 对于需要团队协作开发和长期维护的项目，推荐使用类型注解

---

## 总结口诀

- **变量注解**：冒号后面写类型，等号后面给值
- **容器注解**：list[str]、dict[str, int]、tuple[str, int, int]
- **多类型**：用 `|` 分隔，如 `str | int`
- **函数注解**：参数冒号写类型，箭头后面写返回
- **类型推断**：直接赋值自动推，不用手写也行
- **动态语言**：注解只是提示，不是强制约束

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 类型注解的作用：让代码结构更 ____、逻辑更 ____、更易 ____；还能带来更准确的代码 ____，提前发现潜在 ____
2. 变量类型注解的语法是 `变量名 ____ 数据类型 ____ 值`，如 `a: int = 695`
3. 常见类型注解的写法：整数 ____、小数 ____、布尔 ____、字符串 ____、空值 ____
4. 容器类型注解：字符串列表 `____`、字符串集合 `____`、键是字符串值是整数的字典 `____`、三个元素依次为字符串、整数、整数的元组 `____`
5. 一个变量可能有多种类型时，类型之间用 ____ 分隔，如 `str | int`
6. 类型推断：直接 ____、变量 ____、容器的 ____ 等场景，Python 会自动推导出类型，不用手写注解
7. Python 是 ____ 类型语言，类型注解只是 ____，并不是 ____ 约束——注解写错了也不会因此报错
8. 函数类型注解：参数类型写在参数名的 ____ 面（用冒号隔开），返回值类型写在函数名后面的 ____ 符号之后
9. 函数注解示例 `def calc(scores: ____) -> ____:`：参数是整数列表、返回值是小数；如果函数返回多个值，返回值类型写成 ____
10. 推荐使用场景：需要 ____ 开发和 ____ 维护的项目

> [!TIP]- 填空答案（做完再点开）
> 1. 清晰、安全、维护 / 自动提示 / 问题　2. `:`（冒号）、`=`（等号）　3. `int`、`float`、`bool`、`str`、`None`　4. `list[str]`、`set[str]`、`dict[str, int]`、`tuple[str, int, int]`　5. `|`（竖线）　6. 赋值、运算、推导　7. 动态、提示、强制　8. 后、`->`　9. `list[int]`、`float`、元组（`tuple`）　10. 团队协作、长期

### 二、裸写题

- [ ] **2-1 给变量加类型注解**
  给 6 个变量分别加上类型注解并各打印一次：整数 `695`、小数 `98.5`、字符串 `"Python"`、布尔 `True`、字符串列表 `["A", "C", "E"]`、键和值都是整数的字典 `{"count": 0, "total": 0}`。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：注解写在变量名和等号中间，冒号后面写类型；容器类型还要写清里面装的是什么类型
  > **二级 · 方法**：`变量名: 类型 = 值`；容器写成 `类型[元素类型]`
  > **三级 · 骨架**：`a: ____ = 695` / `names: ____[str] = ["A", "C", "E"]` / `options: ____[str, ____] = {"count": 0}`

- [ ] **2-2 给函数加类型注解（单返回值）**
  写函数 `average(scores)`：传入整数列表，返回平均分（小数）。给参数和返回值都加上类型注解，再用 `[85, 90, 95, 100]` 调用并打印结果（应得 `92.5`）。

  > [!TIP]- 提示
  > **一级 · 思路**：参数注解写在参数名后面，返回值注解写在函数名那一行的右箭头后面
  > **二级 · 方法**：`def 函数名(参数: 类型) -> 返回类型:`
  > **三级 · 骨架**：`def average(scores: ____[int]) -> ____:`

- [ ] **2-3 给多返回值函数加类型注解**
  写函数 `min_max_avg(scores)`：一次返回最大值、最小值、平均值。返回值类型要写成"三个元素依次为整数、整数、小数的元组"，调用后把三个结果分别打印出来（应得 `100 85 92.5`）。

  > [!TIP]- 提示
  > **一级 · 思路**：返回多个值时其实返回的是一个元组，元组注解要按顺序写清每个元素的类型
  > **二级 · 方法**：`-> tuple[int, int, float]`
  > **三级 · 骨架**：`def min_max_avg(scores: list[int]) -> ____[int, int, ____]:`

> [!TIP]- 参考答案（做完再点开）
> ```python
> # 2-1
> a: int = 695
> score: float = 98.5
> hobby: str = "Python"
> flag: bool = True
> names: list[str] = ["A", "C", "E"]
> options: dict[str, int] = {"count": 0, "total": 0}
>
> print(a, score, hobby, flag, names, options)
>
> # 2-2
> def average(scores: list[int]) -> float:
>     return sum(scores) / len(scores)
>
> print(average([85, 90, 95, 100]))    # 92.5
>
> # 2-3
> def min_max_avg(scores: list[int]) -> tuple[int, int, float]:
>     return max(scores), min(scores), sum(scores) / len(scores)
>
> max_score, min_score, avg_score = min_max_avg([85, 90, 95, 100])
> print(max_score, min_score, avg_score)    # 100 85 92.5
> ```

### 三、综合题

- [ ] **3-1 成绩统计小程序（注解版）**
  把这一篇的知识串起来用一遍：
  1. 用带类型注解的方式定义 4 个变量：班级名（字符串）、学生名单（字符串列表）、三科平均分（整数列表）、等级对照表（键和值都是字符串的字典）
  2. 写函数 `average(scores)`：参数标注整数列表、返回值标注小数，返回平均分
  3. 写函数 `report(scores)`：一次返回最高分、最低分、平均分，返回值标注"三个元素的元组"
  4. 打印班级、人数、平均分（保留 2 位小数）、最高分/最低分和等级对照表
  5. 故意把字符串列表传给第 2 步的函数，看报错信息来自哪里，再用一句注释写下"注解只是提示，不是强制约束"的意思

  > [!TIP]- 提示
  > **一级 · 思路**：先定义数据（带注解）→ 写两个带注解的函数 → 打印结果 → 故意传错类型做对照
  > **二级 · 方法**：`list[str]` / `dict[str, str]` / `tuple[int, int, float]`；打印保留两位小数用 `f"{值:.2f}"`
  > **三级 · 骨架**：`def report(scores: list[int]) -> ____[int, int, ____]:` / `print(f"平均分：{average(avg_scores):____}")`

> [!TIP]- 参考答案（做完再点开）
> ```python
> class_name: str = "Python 提高班"
> students: list[str] = ["小王", "小李", "小张"]
> avg_scores: list[int] = [85, 90, 95, 100]
> levels: dict[str, str] = {"优秀": "90 分以上", "良好": "80 分以上"}
>
> def average(scores: list[int]) -> float:
>     return sum(scores) / len(scores)
>
> def report(scores: list[int]) -> tuple[int, int, float]:
>     return max(scores), min(scores), sum(scores) / len(scores)
>
> print(f"班级：{class_name}，共 {len(students)} 人：{'、'.join(students)}")
> print(f"平均分：{average(avg_scores):.2f}")     # 92.50
>
> max_score, min_score, avg_score = report(avg_scores)
> print(f"最高分 {max_score} / 最低分 {min_score} / 平均分 {avg_score}")
> print("等级对照：", levels)
>
> # 故意把字符串列表传进去：注解只是提示，不会拦住它，报错来自 sum 运算本身
> # 取消下面一行的注释运行，会看到 TypeError: unsupported operand type(s) for +: 'int' and 'str'
> # print(average(["a", "b"]))
> ```
