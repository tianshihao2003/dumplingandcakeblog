---
title: Python数据容器总结与对比
published: 2026-09-16
tags:
  - Python
  - 数据结构
description: Python五大数据容器（字符串、列表、元组、集合、字典）的特性对比与使用场景总结
order: 14
---

Python 提供了多种数据容器来存储和操作数据，理解它们的特性差异对于选择合适的数据结构至关重要。

## 五大容器特性对比

| 特性 | 字符串 (str) | 列表 (list) | 元组 (tuple) | 集合 (set) | 字典 (dict) |
| --- | --- | --- | --- | --- | --- |
| 有序性 | 有序 | 有序 | 有序 | **无序** | 有序(3.7+) |
| 重复元素 | 允许 | 允许 | 允许 | **不允许** | **key不允许** |
| 可变性 | **不可变** | 可变 | **不可变** | 可变 | 可变 |
| 索引访问 | 支持 | 支持 | 支持 | **不支持** | **不支持** |
| 切片操作 | 支持 | 支持 | 支持 | **不支持** | **不支持** |
| 使用场景 | 文本处理 | 有序可重复数据集合 | 固定数据记录 | 去重数据集合 | 键值对 |

---

## 各容器特点详解

### 字符串 (str)
- **有序**：元素按顺序排列
- **不可变**：创建后不能修改
- **支持索引和切片**：可以访问特定位置的元素
- **典型用途**：文本处理、字符操作

```python
s = "Hello World"
print(s[0])      # H
print(s[0:5])    # Hello
```

### 列表 (list)
- **有序**：元素按插入顺序排列
- **可变**：可以添加、删除、修改元素
- **允许重复**：可以包含相同的元素
- **支持索引和切片**：灵活的数据访问方式
- **典型用途**：需要频繁增删改的有序数据

```python
lst = [1, 2, 3, 2, 1]
lst.append(4)     # [1, 2, 3, 2, 1, 4]
lst[0] = 10       # [10, 2, 3, 2, 1, 4]
```

### 元组 (tuple)
- **有序**：元素按插入顺序排列
- **不可变**：创建后不能修改
- **允许重复**：可以包含相同的元素
- **支持索引和切片**：但不能修改
- **典型用途**：固定数据记录、函数返回多个值

```python
t = (1, 2, 3)
print(t[0])       # 1
# t[0] = 10       # 报错：tuple不支持修改
```

### 集合 (set)
- **无序**：元素没有固定顺序
- **可变**：可以添加、删除元素
- **不允许重复**：自动去重
- **不支持索引和切片**：只能通过值来判断是否存在
- **典型用途**：去重、集合运算（交集、并集、差集）

```python
s = {1, 2, 3, 2, 1}
print(s)          # {1, 2, 3} 自动去重
s.add(4)          # {1, 2, 3, 4}
```

### 字典 (dict)
- **有序**（Python 3.7+）：按插入顺序排列
- **可变**：可以增删改键值对
- **Key不允许重复**：相同的Key会覆盖
- **不支持索引和切片**：通过Key访问Value
- **典型用途**：键值对数据、JSON数据处理

```python
d = {"name": "Alice", "age": 25}
print(d["name"])  # Alice
d["city"] = "Beijing"  # 添加新键值对
```

---

## 如何选择数据容器？

| 需求场景         | 推荐容器       |     |
| ------------ | ---------- | --- |
| 存储文本数据       | 字符串 (str)  |     |
| 需要频繁增删改的有序数据 | 列表 (list)  |     |
| 固定不变的数据记录    | 元组 (tuple) |     |
| 需要自动去重的数据    | 集合 (set)   |     |
| 需要通过键快速查找值   | 字典 (dict)  |     |

---

## 总结口诀

- **字符串**：文本处理用它
- **列表**：能变能重复，有序可索引
- **元组**：固定不变，安全可靠
- **集合**：去重专家，无序独特
- **字典**：键值配对，查找飞快

---

## 综合练习：教务管理系统

这个案例综合运用了字典、列表、循环、条件语句等知识点，是一个很好的复习练习。

### 案例需求

开发一个教务管理系统，可以维护和管理学员的成绩信息：

1. 添加学生信息：录入学生姓名、语文、数学、英语成绩
2. 修改学生信息：根据姓名修改成绩
3. 删除学生信息：根据姓名删除学生
4. 查询学生信息：根据姓名查询成绩
5. 列出所有学生：遍历所有学生信息
6. 统计班级成绩：最高分、最低分、平均分
7. 退出系统

### 分步引导

**第一步：显示菜单**
- 用 `print` 打印菜单
- 提示：可以用多行字符串 `""" """`

**第二步：用字典存储学生信息**
- 创建空字典 `student_scores = {}`
- 格式：`{姓名: {"chinese": 语文, "math": 数学, "english": 英语}}`

**第三步：用 while 循环实现主循环**
- 用 `while True` 创建无限循环
- 每次循环显示菜单，获取用户输入
- 用 `match...case` 匹配用户选择

**第四步：实现添加学生功能**
- 获取学生姓名：`input("请输入学生姓名: ")`
- 检查学生是否已存在：`if student_name in student_scores:`
- 如果不存在，获取各科成绩并保存

**第五步：实现修改学生功能**
- 检查学生是否存在：`if student_name not in student_scores:`
- 如果不存在，用 `continue` 跳过
- 如果存在，获取新成绩并更新

**第六步：实现删除学生功能**
- 检查学生是否存在
- 如果存在，用 `del` 删除：`del student_scores[student_name]`

**第七步：实现查询学生功能**
- 检查学生是否存在
- 如果存在，用 f-string 打印学生信息

**第八步：实现列出所有学生功能**
- 用 for 循环遍历字典：`for name, scores in student_scores.items():`
- 打印每个学生的信息

**第九步：实现统计班级成绩功能**
- 创建空列表收集各科成绩
- 用 `max()`、`min()`、`sum()`、`len()` 计算统计值
- 打印统计结果

**第十步：实现退出系统功能**
- 打印 "Bye ~"
- 用 `break` 跳出循环

### 涉及知识点

| 知识点 | 在代码中的应用 |
|--------|----------------|
| 字典 | 存储学生信息 `student_scores` |
| 列表 | 收集各科成绩 `chinese_scores` |
| while 循环 | 持续显示菜单 |
| for 循环 | 遍历学生信息 |
| if 判断 | 检查学生是否存在 |
| match...case | 匹配用户选择 |
| 内置函数 | `max()`、`min()`、`sum()`、`len()` |
| 字符串格式化 | `f-string` 输出信息 |
| `in` 运算符 | 判断学生是否存在 |
| `del` 语句 | 删除学生信息 |

### 参考答案

```python
# 菜单显示
menu = """
========== 【教务管理系统】 ==========
  1. 添加学生信息    2. 修改学生信息
  3. 删除学生信息    4. 查询学生信息
  5. 列出所有学生    6. 统计班级成绩
  7. 退出系统
====================================
"""

print("欢迎使用教务管理系统 ~")

# 用字典存储所有学生信息
student_scores = {}

while True:
    # 显示菜单
    print(menu)

    # 获取用户选择
    choice = input("请选择要执行的操作(1-7): ")

    match choice:
        case "1":  # 添加学生信息
            student_name = input("请输入学生姓名: ")

            # 检查学生是否已存在
            if student_name in student_scores:
                print("该学生已存在, 请重新选择 ~")
            else:
                chinese_score = float(input("请输入语文成绩: "))
                math_score = float(input("请输入数学成绩: "))
                english_score = float(input("请输入英语成绩: "))
                student_scores[student_name] = {
                    "chinese": chinese_score,
                    "math": math_score,
                    "english": english_score
                }
                print("学生信息添加完毕 ~")

        case "2":  # 修改学生信息
            student_name = input("请输入要修改的学生姓名: ")

            # 检查学生是否存在
            if student_name not in student_scores:
                print("该学生不存在, 请重新选择 ~")
                continue

            chinese_score = float(input("请输入语文成绩: "))
            math_score = float(input("请输入数学成绩: "))
            english_score = float(input("请输入英语成绩: "))
            student_scores[student_name] = {
                "chinese": chinese_score,
                "math": math_score,
                "english": english_score
            }
            print("学生信息修改完毕 ~")

        case "3":  # 删除学生信息
            student_name = input("请输入要删除的学生姓名: ")

            # 检查学生是否存在
            if student_name not in student_scores:
                print("该学生不存在, 请重新选择 ~")
            else:
                del student_scores[student_name]
                print("学生信息删除完毕 ~")

        case "4":  # 查询学生信息
            student_name = input("请输入要查询的学生姓名: ")

            # 检查学生是否存在
            if student_name not in student_scores:
                print("该学生不存在, 请重新选择 ~")
            else:
                info = student_scores[student_name]
                print(f"学生姓名: {student_name}")
                print(f"语文成绩: {info['chinese']}")
                print(f"数学成绩: {info['math']}")
                print(f"英语成绩: {info['english']}")

        case "5":  # 列出所有学生
            if not student_scores:
                print("系统中暂无学生信息 ~")
            else:
                print("===== 所有学生信息 =====")
                for name, scores in student_scores.items():
                    print(f"{name}: 语文{scores['chinese']}, 数学{scores['math']}, 英语{scores['english']}")
                print("========================")

        case "6":  # 统计班级成绩
            if not student_scores:
                print("系统中暂无学生信息，请先添加学生 ~")
                continue

            # 收集所有成绩
            chinese_scores = []
            math_scores = []
            english_scores = []

            for scores in student_scores.values():
                chinese_scores.append(scores['chinese'])
                math_scores.append(scores['math'])
                english_scores.append(scores['english'])

            # 计算统计值
            print("===== 班级成绩统计 =====")
            print(f"语文 - 最高分: {max(chinese_scores)}, 最低分: {min(chinese_scores)}, 平均分: {sum(chinese_scores)/len(chinese_scores):.2f}")
            print(f"数学 - 最高分: {max(math_scores)}, 最低分: {min(math_scores)}, 平均分: {sum(math_scores)/len(math_scores):.2f}")
            print(f"英语 - 最高分: {max(english_scores)}, 最低分: {min(english_scores)}, 平均分: {sum(english_scores)/len(english_scores):.2f}")
            print("========================")

        case "7":  # 退出系统
            print("Bye ~")
            break

        case _:  # 其他情况
            print("非法操作, 不支持!!!")
```
