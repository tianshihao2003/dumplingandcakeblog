---
title: Python3 数据类型转换
published: 2026-09-14
tags:
  - Python
description: Python3 隐式类型转换和显式类型转换的方法
image: https://img.tsh520.cn/file/blog/post-covers/python-15-conversion.webp
order: 15
---
有时候，我们需要对数据内置的类型进行转换，数据类型的转换，一般情况下你只需要将数据类型作为函数名即可。

Python 数据类型转换可以分为两种：

- 隐式类型转换 - 自动完成
- 显式类型转换 - 需要使用类型函数来转换

### 隐式类型转换

在隐式类型转换中，Python 会自动将一种数据类型转换为另一种数据类型，不需要我们去干预。

以下实例中，我们对两种不同类型的数据进行运算，较低数据类型（整数）就会转换为较高数据类型（浮点数）以避免数据丢失。

## 实例

``` python
num_int = 123
num_flo = 1.23

num_new = num_int + num_flo

print("num_int 数据类型为:",type(num_int))
print("num_flo 数据类型为:",type(num_flo))

print("num_new 值为:",num_new)
print("num_new 数据类型为:",type(num_new))
```

以上实例输出结果为：

```
num_int 数据类型为: <class 'int'>
num_flo 数据类型为: <class 'float'>
num_new: 值为: 124.23
num_new 数据类型为: <class 'float'>
```

代码解析：

- 实例中我们对两个不同数据类型的变量 `num_int` 和 `num_flo` 进行相加运算，并存储在变量 `num_new` 中。
- 然后查看三个变量的数据类型。
- 在输出结果中，我们看到 `num_int` 是 `整型（integer）` ， `num_flo` 是 ` 浮点型（float）` 。
- 同样，新的变量 `num_new` 是 ` 浮点型（float）` ，这是因为 Python 会将较小的数据类型转换为较大的数据类型，以避免数据丢失。

我们再看一个实例，整型数据与字符串类型的数据进行相加：

## 实例

``` python
num_int = 123
num_str = "456"

print("num_int 数据类型为:",type(num_int))
print("num_str 数据类型为:",type(num_str))

print(num_int+num_str)
```
以上实例输出结果为：

```
num_int 数据类型为: <class 'int'>
num_str 数据类型为: <class 'str'>
Traceback (most recent call last):
  File "/runoob-test/test.py", line 7, in <module>
    print(num_int+num_str)
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```

从输出中可以看出，整型和字符串类型运算结果会报错，输出 TypeError。 Python 在这种情况下无法使用隐式转换。

但是，Python 为这些类型的情况提供了一种解决方案，称为显式转换。

### 显式类型转换

在显式类型转换中，用户将对象的数据类型转换为所需的数据类型。 我们使用 int()、float()、str() 等预定义函数来执行显式类型转换。

int() 强制转换为整型：

## 实例

```python
x = int(1)      # x 输出结果为 1
y = int(2.8)    # y 输出结果为 2
z = int("3")    # z 输出结果为 3
```

float() 强制转换为浮点型：

## 实例

```python
x = float(1)      # x 输出结果为 1.0
y = float(2.8)    # y 输出结果为 2.8
z = float("3")    # z 输出结果为 3.0
w = float("4.2")  # w 输出结果为 4.2
```

str() 强制转换为字符串类型：

## 实例

```python
x = str("s1")   # x 输出结果为 's1'
y = str(2)      # y 输出结果为 '2'
z = str(3.0)    # z 输出结果为 '3.0'
```

整型和字符串类型进行运算，就可以用强制类型转换来完成：

## 实例

```python
num_int = 123
num_str = "456"

print("num_int 数据类型为:", type(num_int))
print("类型转换前，num_str 数据类型为:", type(num_str))

num_str = int(num_str)  # 强制转换为整型
print("类型转换后，num_str 数据类型为:", type(num_str))

num_sum = num_int + num_str

print("num_int 与 num_str 相加结果为:", num_sum)
print("sum 数据类型为:", type(num_sum))
```

以上实例输出结果为：

```
num_int 数据类型为: <class 'int'>
类型转换前，num_str 数据类型为: <class 'str'>
类型转换后，num_str 数据类型为: <class 'int'>
num_int 与 num_str 相加结果为: 579
sum 数据类型为: <class 'int'>
```

以下几个内置的函数可以执行数据类型之间的转换。这些函数返回一个新的对象，表示转换的值。

| 函数 | 描述 |
| --- | --- |
| [int(x \[,base\])](https://www.runoob.com/python3/python3-func-int.html) | 将x转换为一个整数 |
| [float(x)](https://www.runoob.com/python3/python3-func-float.html) | 将x转换到一个浮点数 |
| [complex(real \[,imag\])](https://www.runoob.com/python3/python3-func-complex.html) | 创建一个复数 |
| [str(x)](https://www.runoob.com/python3/python3-func-str.html) | 将对象 x 转换为字符串 |
| [repr(x)](https://www.runoob.com/python3/python3-func-repr.html) | 将对象 x 转换为表达式字符串 |
| [eval(str)](https://www.runoob.com/python3/python3-func-eval.html) | 用来计算在字符串中的有效Python表达式,并返回一个对象 |
| [tuple(s)](https://www.runoob.com/python3/python3-func-tuple.html) | 将序列 s 转换为一个元组 |
| [list(s)](https://www.runoob.com/python3/python3-att-list-list.html) | 将序列 s 转换为一个列表 |
| [set(s)](https://www.runoob.com/python3/python3-func-set.html) | 转换为可变集合 |
| [dict(d)](https://www.runoob.com/python3/python3-func-dict.html) | 创建一个字典。d 必须是一个 (key, value)元组序列。 |
| [frozenset(s)](https://www.runoob.com/python3/python3-func-frozenset.html) | 转换为不可变集合 |
| [chr(x)](https://www.runoob.com/python3/python3-func-chr.html) | 将一个整数转换为一个字符 |
| [ord(x)](https://www.runoob.com/python3/python3-func-ord.html) | 将一个字符转换为它的整数值 |
| [hex(x)](https://www.runoob.com/python3/python3-func-hex.html) | 将一个整数转换为一个十六进制字符串 |
| [oct(x)](https://www.runoob.com/python3/python3-func-oct.html) | 将一个整数转换为一个八进制字符串 |
| [bool(x)](https://www.runoob.com/python3/python3-func-bool.html) | 将对象 x 转换为布尔值（True 或 False） |
| [bytes(\[source\[, encoding\[, errors\]\]\])](https://www.runoob.com/python3/python3-func-bytes.html) | 将对象转换为不可变字节序列 |
| [bytearray(\[source\[, encoding\[, errors\]\]\])](https://www.runoob.com/python3/python3-func-bytearray.html) | 将对象转换为可变字节数组 |
| [memoryview(obj)](https://www.runoob.com/python3/python3-func-memoryview.html) | 返回给定参数的内存视图对象（不复制数据） |
| [bin(x)](https://www.runoob.com/python3/python3-func-bin.html) | 将一个整数转换为一个二进制字符串 |
| [ascii(x)](https://www.runoob.com/python3/python3-func-ascii.html) | 返回对象的 ASCII 表示，非 ASCII 字符会被转义 |

---

## 练习题

- [x] **1. 隐式类型转换**
  创建文件 `test_implicit.py`，完成以下操作：
  - 创建变量 `a = 10`（整数）和 `b = 3.14`（浮点数）
  - 计算 `c = a + b`
  - 用 `type()` 打印 `a`、`b`、`c` 的类型
  - 观察结果，解释为什么 `c` 是浮点数

  **参考答案：**
  ```python
  a = 10
  b = 3.14
  c = a + b

  print(f"a = {a}, 类型: {type(a)}")
  print(f"b = {b}, 类型: {type(b)}")
  print(f"c = {c}, 类型: {type(c)}")
  # 输出：
  # a = 10, 类型: <class 'int'>
  # b = 3.14, 类型: <class 'float'>
  # c = 13.14, 类型: <class 'float'>
  # 解释：Python 会自动将整数转换为浮点数，避免数据丢失
  ```

- [x] **2. int() 转换练习**
  创建文件 `test_int.py`，完成以下操作：
  - 将浮点数 `3.14` 转换为整数
  - 将字符串 `"123"` 转换为整数
  - 将字符串 `"3.14"` 转换为整数（观察是否报错）
  - 打印每个结果及其类型

  **参考答案：**
  ```python
  a = int(3.14)
  b = int("123")
  # c = int("3.14")  # 这行会报错，因为不能直接将小数字符串转为整数

  print(f"int(3.14) = {a}, 类型: {type(a)}")  # 3, <class 'int'>
  print(f"int('123') = {b}, 类型: {type(b)}")  # 123, <class 'int'>
  # 如果要转换 "3.14"，需要先转为 float 再转 int：
  c = int(float("3.14"))
  print(f"int(float('3.14')) = {c}")  # 3
  ```

- [x] **3. float() 转换练习**
  创建文件 `test_float.py`，完成以下操作：
  - 将整数 `100` 转换为浮点数
  - 将字符串 `"3.14"` 转换为浮点数
  - 将字符串 `"100"` 转换为浮点数
  - 打印每个结果及其类型

  **参考答案：**
  ```python
  a = float(100)
  b = float("3.14")
  c = float("100")

  print(f"float(100) = {a}, 类型: {type(a)}")    # 100.0, <class 'float'>
  print(f"float('3.14') = {b}, 类型: {type(b)}")  # 3.14, <class 'float'>
  print(f"float('100') = {c}, 类型: {type(c)}")   # 100.0, <class 'float'>
  ```

- [x] **4. str() 转换练习**
  创建文件 `test_str.py`，完成以下操作：
  - 将整数 `123` 转换为字符串
  - 将浮点数 `3.14` 转换为字符串
  - 将布尔值 `True` 转换为字符串
  - 打印每个结果及其类型，并用 `+` 拼接字符串

  **参考答案：**
  ```python
  a = str(123)
  b = str(3.14)
  c = str(True)

  print(f"str(123) = '{a}', 类型: {type(a)}")      # '123', <class 'str'>
  print(f"str(3.14) = '{b}', 类型: {type(b)}")      # '3.14', <class 'str'>
  print(f"str(True) = '{c}', 类型: {type(c)}")      # 'True', <class 'str'>
  print(f"拼接: 数字是 {a}")  # 拼接: 数字是 123
  ```

- [x] **5. bool() 转换练习**
  创建文件 `test_bool.py`，用 `bool()` 测试以下值，记录哪些是 `True`，哪些是 `False`：
  - `0`、`1`、`-1`
  - `""`、`"0"`、`"False"`
  - `[]`、`[0]`
  - `None`

  **参考答案：**
  ```python
  print(f"bool(0) = {bool(0)}")       # False
  print(f"bool(1) = {bool(1)}")       # True
  print(f"bool(-1) = {bool(-1)}")     # True
  print(f"bool('') = {bool('')}")     # False
  print(f"bool('0') = {bool('0')}")   # True（非空字符串）
  print(f"bool('False') = {bool('False')}")  # True（非空字符串）
  print(f"bool([]) = {bool([])}")     # False
  print(f"bool([0]) = {bool([0])}")   # True（非空列表）
  print(f"bool(None) = {bool(None)}") # False
  ```

- [x] **6. list() 转换练习**
  创建文件 `test_list.py`，完成以下操作：
  - 将字符串 `"hello"` 转换为列表
  - 将元组 `(1, 2, 3)` 转换为列表
  - 将集合 `{3, 1, 2}` 转换为列表（观察顺序）
  - 打印每个结果

  **参考答案：**
  ```python
  a = list("hello")
  b = list((1, 2, 3))
  c = list({3, 1, 2})

  print(f"list('hello') = {a}")        # ['h', 'e', 'l', 'l', 'o']
  print(f"list((1,2,3)) = {b}")        # [1, 2, 3]
  print(f"list({3,1,2}) = {c}")        # 顺序可能不同，因为集合是无序的
  ```

- [x] **7. tuple() 转换练习**
  创建文件 `test_tuple.py`，完成以下操作：
  - 将字符串 `"Python"` 转换为元组
  - 将列表 `[10, 20, 30]` 转换为元组
  - 打印每个结果及其类型

  **参考答案：**
  ```python
  a = tuple("Python")
  b = tuple([10, 20, 30])

  print(f"tuple('Python') = {a}")       # ('P', 'y', 't', 'h', 'o', 'n')
  print(f"tuple([10,20,30]) = {b}")     # (10, 20, 30)
  print(f"类型: {type(b)}")             # <class 'tuple'>
  ```

- [x] **8. set() 转换练习**
  创建文件 `test_set.py`，完成以下操作：
  - 将列表 `[1, 2, 2, 3, 3, 3]` 转换为集合（观察去重效果）
  - 将字符串 `"aabbbccc"` 转换为集合
  - 打印每个结果

  **参考答案：**
  ```python
  a = set([1, 2, 2, 3, 3, 3])
  b = set("aabbbccc")

  print(f"set([1,2,2,3,3,3]) = {a}")   # {1, 2, 3}（自动去重）
  print(f"set('aabbbccc') = {b}")      # {'a', 'b', 'c'}（自动去重）
  ```

- [x] **9. dict() 转换练习**
  创建文件 `test_dict.py`，完成以下操作：
  - 用 `dict()` 从键值对列表创建字典：`[("name", "小明"), ("age", 18)]`
  - 用字典推导式创建字典：`{x: x**2 for x in range(1, 5)}`
  - 打印每个结果

  **参考答案：**
  ```python
  a = dict([("name", "小明"), ("age", 18)])
  b = {x: x**2 for x in range(1, 5)}

  print(f"dict() 创建: {a}")    # {'name': '小明', 'age': 18}
  print(f"推导式创建: {b}")      # {1: 1, 2: 4, 3: 9, 4: 16}
  ```

- [x] **10. eval() 和 repr() 练习**
  创建文件 `test_eval.py`，完成以下操作：
  - 用 `eval()` 计算字符串 `"3 + 5 * 2"` 的结果
  - 用 `repr()` 将浮点数 `3.14` 转换为表达式字符串
  - 打印每个结果及其类型

  **参考答案：**
  ```python
  a = eval("3 + 5 * 2")
  b = repr(3.14)

  print(f"eval('3 + 5 * 2') = {a}")   # 13
  print(f"类型: {type(a)}")            # <class 'int'>
  print(f"repr(3.14) = {b}")           # '3.14'
  print(f"类型: {type(b)}")            # <class 'str'>
  ```

- [x] **11. chr() 和 ord() 练习**
  创建文件 `test_char.py`，完成以下操作：
  - 用 `chr()` 将数字 `65`、`97`、`48` 转换为字符
  - 用 `ord()` 将字符 `'A'`、`'a'`、`'0'` 转换为数字
  - 打印每个结果

  **参考答案：**
  ```python
  print(f"chr(65) = {chr(65)}")   # A
  print(f"chr(97) = {chr(97)}")   # a
  print(f"chr(48) = {chr(48)}")   # 0

  print(f"ord('A') = {ord('A')}")  # 65
  print(f"ord('a') = {ord('a')}")  # 97
  print(f"ord('0') = {ord('0')}")  # 48
  ```

- [x] **12. hex() 和 oct() 练习**
  创建文件 `test_hex.py`，完成以下操作：
  - 用 `hex()` 将数字 `255`、`16`、`10` 转换为十六进制字符串
  - 用 `oct()` 将数字 `8`、`16`、`255` 转换为八进制字符串
  - 打印每个结果

  **参考答案：**
  ```python
  print(f"hex(255) = {hex(255)}")  # 0xff
  print(f"hex(16) = {hex(16)}")    # 0x10
  print(f"hex(10) = {hex(10)}")    # 0xa

  print(f"oct(8) = {oct(8)}")      # 0o10
  print(f"oct(16) = {oct(16)}")    # 0o20
  print(f"oct(255) = {oct(255)}")  # 0o377
  ```