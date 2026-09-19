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
