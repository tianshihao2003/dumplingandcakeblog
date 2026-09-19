---
title: Python 推导式
published: 2026-09-16
tags:
  - Python
description: Python 列表、字典、集合和元组推导式的使用方法
order: 18
---
Python 推导式是一种独特的数据处理方式，可以从一个数据序列构建另一个新的数据序列的结构体。

Python 推导式是一种强大且简洁的语法，适用于生成列表、字典、集合和生成器。

在使用推导式时，需要注意可读性，尽量保持表达式简洁，以免影响代码的可读性和可维护性。

Python 支持各种数据结构的推导式：

## 列表推导式

列表推导式格式为：

```
[表达式 for 变量 in 列表] 
[out_exp_res for out_exp in input_list]

或者 

[表达式 for 变量 in 列表 if 条件]
[out_exp_res for out_exp in input_list if condition]
```
- out\_exp\_res：列表生成元素表达式，可以是有返回值的函数。
- for out\_exp in input\_list：迭代 input\_list 将 out\_exp 传入到 out\_exp\_res 表达式中。
- if condition：条件语句，可以过滤列表中不符合条件的值。

过滤掉长度小于或等于3的字符串列表，并将剩下的转换成大写字母：

## 实例

```python
>>> names = ['Bob', 'Tom', 'alice', 'Jerry', 'Wendy', 'Smith']
>>> new_names = [name.upper() for name in names if len(name) > 3]
>>> print(new_names)
['ALICE', 'JERRY', 'WENDY', 'SMITH']
```

计算 30 以内可以被 3 整除的整数：

## 实例

```python
>>> multiples = [i for i in range(30) if i % 3 == 0]
>>> print(multiples)
[0, 3, 6, 9, 12, 15, 18, 21, 24, 27]
```

## 字典推导式

字典推导基本格式：

```
{ key_expr: value_expr for value in collection }

或

{ key_expr: value_expr for value in collection if condition }
```

使用字符串及其长度创建字典：

## 实例

```python
listdemo = ['Google', 'Runoob', 'Taobao']
# 将列表中各字符串值为键，各字符串的长度为值，组成键值对
>>> newdict = {key: len(key) for key in listdemo}
>>> newdict
{'Google': 6, 'Runoob': 6, 'Taobao': 6}
```

提供三个数字，以三个数字为键，三个数字的平方为值来创建字典：

## 实例

```python
>>> dic = {x: x**2 for x in (2, 4, 6)}
>>> dic
{2: 4, 4: 16, 6: 36}
>>> type(dic)
<class 'dict'>
```

## 集合推导式

集合推导式基本格式：

```
{ expression for item in Sequence }
或
{ expression for item in Sequence if conditional }
```

计算数字 1,2,3 的平方数：

## 实例

```python
>>> setnew = {i**2 for i in (1, 2, 3)}
>>> setnew
{1, 4, 9}
```

判断不是 abc 的字母并输出：

## 实例

```python
>>> a = {x for x in 'abracadabra' if x not in 'abc'}
>>> a
{'d', 'r'}
>>> type(a)
<class 'set'>
```

## 元组推导式（生成器表达式）

元组推导式可以利用 range 区间、元组、列表、字典和集合等数据类型，快速生成一个满足指定需求的元组。

元组推导式基本格式：

```
(expression for item in Sequence )
或
(expression for item in Sequence if conditional )
```

元组推导式和列表推导式的用法也完全相同，只是元组推导式是用 () 圆括号将各部分括起来，而列表推导式用的是中括号 \[\]，另外元组推导式返回的结果是一个生成器对象。

例如，我们可以使用下面的代码生成一个包含数字 1~9 的元组：

## 实例

```python
>>> a = (x for x in range(1, 10))
>>> a
<generator object <genexpr> at 0x7faf6ee20a50>  # 返回的是生成器对象

>>> tuple(a)  # 使用 tuple() 函数，可以直接将生成器对象转换成元组
(1, 2, 3, 4, 5, 6, 7, 8, 9)
```

---

## 练习题

- [x] **1. 列表推导式**
  创建文件 `test_list.py`，完成以下操作：
  - 用列表推导式生成 1-20 中所有偶数的列表
  - 用列表推导式将列表中的字符串转换为大写

  **知识点：** [表达式 for 变量 in 序列 if 条件]

  **参考答案：**
  ```python
  # 1-20 中所有偶数
  even = [x for x in range(1, 21) if x % 2 == 0]
  print(f"偶数列表: {even}")

  # 字符串转大写
  words = ["hello", "world", "python"]
  upper_words = [word.upper() for word in words]
  print(f"大写列表: {upper_words}")
  ```

- [x] **2. 字典推导式**
  创建文件 `test_dict.py`，完成以下操作：
  - 用字典推导式创建平方数字典 `{1:1, 2:4, 3:9, 4:16, 5:25}`
  - 用字典推导式将两个列表合并为字典

  **知识点：** {key: value for 变量 in 序列}

  **参考答案：**
  ```python
  # 平方数字典
  squares = {x: x**2 for x in range(1, 6)}
  print(f"平方数字典: {squares}")

  # 两个列表合并为字典
  keys = ["name", "age", "city"]
  values = ["张三", 25, "北京"]
  d = {k: v for k, v in zip(keys, values)}
  print(f"合并字典: {d}")
  ```

- [x] **3. 集合推导式**
  创建文件 `test_set.py`，完成以下操作：
  - 用集合推导式去除列表中的重复元素
  - 用集合推导式从字符串中提取不重复的字符

  **知识点：** {表达式 for 变量 in 序列}

  **参考答案：**
  ```python
  # 去除重复元素
  lst = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
  unique = {x for x in lst}
  print(f"去重后: {unique}")

  # 提取不重复字符
  s = "abracadabra"
  chars = {x for x in s}
  print(f"不重复字符: {chars}")
  ```

- [x] **4. 元组推导式**
  创建文件 `test_tuple.py`，完成以下操作：
  - 用元组推导式生成 1-10 的平方数
  - 将生成器转换为元组

  **知识点：** (表达式 for 变量 in 序列)、tuple(生成器)

  **参考答案：**
  ```python
  # 生成器
  gen = (x**2 for x in range(1, 11))
  print(f"生成器对象: {gen}")

  # 转换为元组
  t = tuple(gen)
  print(f"元组: {t}")
  ```