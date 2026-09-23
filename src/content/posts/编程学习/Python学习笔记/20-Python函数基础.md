---
title: Python函数基础
published: 2026-09-16
tags:
  - Python
  - 函数
description: Python函数的定义、调用、参数、返回值及说明文档
image: /assets/images/posts/python-20-function.png
order: 20
---

## 函数定义

函数是组织好的、可重复使用的、用来实现特定功能的代码片段。

### 定义语法

```python
# 定义函数
def 函数名(参数列表):
    函数体
    ......
    return 返回值
```

### 调用语法

```python
# 调用函数
函数名(参数)
```

### 示例

```python
# 定义函数
def out_line():
    print('-------------------------')

# 调用函数
out_line()
```

---

## 函数使用的注意事项

- 函数必须**先定义，在调用**
- 函数定义时，并不会执行，只有在调用函数时，函数体的逻辑才会运行
- 函数中通过**缩进**来描述归属关系
- 函数定义时的参数列表与返回值语句是**可有可无的**（由需求确定）

---

## 函数的参数与返回值

在定义函数时，根据业务需要，可以指定参数与返回值。

### 参数的概念

- **形参（形式参数）**：函数定义时括号里的参数，只能在函数内使用（局部变量）
- **实参（实际参数）**：函数在实际调用时传入的参数

### 示例：单参数函数

```python
# 计算圆的面积
def circle_area(r):
    area = 3.14 * r * r
    return area

# 调用函数
c_area = circle_area(10)
print(c_area)  # 314.0
```

### 示例：多参数函数

```python
# 计算长方形的面积
def rectangle_area(l, w):
    area = l * w
    return area

# 调用函数
r_area = rectangle_area(20, 10)
print(r_area)  # 200
```

### 注意事项

- 函数定义时如果有多个参数，多个参数之间使用**逗号（,）分隔**
- `return` 语句只有返回功能，而没有输出打印的功能，如果要输出，需要结合 `print()` 函数来实现

---

## 函数的多个返回值

函数可以有多个返回值，返回值会封装到元组中。

```python
def circle_area_len(r):
    return 3.14 * r * r, 2 * 3.14 * r

# 方式1：封装到元组中
al = circle_area_len(10)
print(al)  # (314.0, 62.800000000000004)

# 方式2：元组解包
area, len = circle_area_len(10)
print(area, len)  # 314.0 62.800000000000004
```

---

## 函数的说明文档

函数的说明文档（Docstring）是写在函数开头，用三个引号包裹的字符串，用于解释函数的功能、参数、返回值等信息，方便调用者清楚函数的具体作用及细节。

### 语法格式

```python
def 函数名(参数列表):
    """
    函数功能描述
    
    :param 参数名: 参数说明
    :return: 返回值说明
    """
    函数体
    return 返回值
```

### 示例

```python
def circle_area_len(r):
    """
    该函数用于根据圆的半径，计算圆的面积和圆的周长
    
    :param r: 圆的半径
    :return: 圆的面积，圆的周长
    """
    return 3.14 * r * r, 2 * 3.14 * r
```

### 查看函数说明文档

- 使用 `help` 函数：`help(circle_area_len)`
- 鼠标悬浮在函数上，自动展示（IDE推荐）

> 记住：好的文档，能让你的代码更容易理解、使用和维护！

---

## 总结口诀

- **定义用def，调用加括号**
- **形参定义时，实参调用时**
- **多参用逗号，返回用return**
- **多值返元组，解包用逗号**
- **文档写三引号，help可查看**

---

## 练习题

- [x] **1. 分数等级判断**
  定义一个函数 `get_grade(score)`，根据传入的分数返回对应的等级：
  - 分数 >= 90：返回 "A"
  - 分数 >= 75：返回 "B"
  - 分数 >= 60：返回 "C"
  - 分数 < 60：返回 "D"

  **知识点：** def 定义函数、if-elif-else 条件判断、return 返回值

  **参考答案：**
  ```python
  def get_grade(score):
      if score >= 90:
          return "A"
      elif score >= 75:
          return "B"
      elif score >= 60:
          return "C"
      else:
          return "D"

  print(get_grade(93))   # A
  print(get_grade(80))   # B
  print(get_grade(65))   # C
  print(get_grade(40))   # D
  ```

- [x] **2. 回文串判断**
  定义一个函数 `is_palindrome(s)`，判断字符串是否是回文串（正读和反读相同），返回 bool 值。
  示例回文串："level"、"radar"、"黄山落叶松叶落山黄"、"12321"

  **知识点：** def 定义函数、return 返回布尔值、字符串切片 `s[::-1]` 反转

  **参考答案：**
  ```python
  def is_palindrome(s):
      return s == s[::-1]

  print(is_palindrome("level"))          # True
  print(is_palindrome("hello"))          # False
  print(is_palindrome("黄山落叶松叶落山黄"))  # True
  print(is_palindrome("12321"))          # True
  print(is_palindrome("12345"))          # False
  ```

- [x] **3. 时间转换**
  定义一个函数 `time_convert(seconds)`，将传入的秒数转换为小时、分钟、秒，并返回格式化的字符串。

  **知识点：** def 定义函数、整除 `//`、取余 `%`、return 返回字符串

  **参考答案：**
  ```python
  def time_convert(seconds):
      hours = seconds // 3600
      minutes = (seconds % 3600) // 60
      seconds = (seconds % 3600) % 60
      return f"{hours} 小时 {minutes} 分钟 {seconds} 秒"

  print(time_convert(3772))  # 1 小时 2 分钟 52 秒
  ```
