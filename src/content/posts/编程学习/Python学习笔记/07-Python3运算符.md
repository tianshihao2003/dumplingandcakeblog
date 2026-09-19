---
title: Python3 运算符
published: 2026-09-14
updated: 2026-09-18
tags:
  - Python
description: Python3 算术、比较、赋值、逻辑、成员、身份运算符及优先级
order: 7
---
## 什么是运算符？

本章节主要说明 Python 的运算符。

举个简单的例子:

```
4 + 5 = 9
```

例子中， **4** 和 **5** 被称为 **操作数** ，+ 称为 **运算符** 。

Python 语言支持以下类型的运算符:

接下来让我们一个个来学习Python的运算符。

---

## Python算术运算符

以下假设变量 a=10，变量 b=21：

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| + | 加 - 两个对象相加 | a + b 输出结果 31 |
| \- | 减 - 得到负数或是一个数减去另一个数 | a - b 输出结果 -11 |
| \* | 乘 - 两个数相乘或是返回一个被重复若干次的字符串 | a \* b 输出结果 210 |
| / | 除 - x 除以 y | b / a 输出结果 2.1 |
| % | 取模 - 返回除法的余数 | b % a 输出结果 1 |
| \*\* | 幂 - 返回x的y次幂 | a\*\*b 为10的21次方 |
| // | 取整除 - 往小的方向取整数 | ``` >>> 9//2 4 >>> -9//2 -5 ``` |

以下实例演示了Python所有算术运算符的操作：

## 实例(Python 3.0+)

```python
a = 21
b = 10
c = 0

c = a + b
print("1 - c 的值为：", c)

c = a - b
print("2 - c 的值为：", c)

c = a * b
print("3 - c 的值为：", c)

c = a / b
print("4 - c 的值为：", c)

c = a % b
print("5 - c 的值为：", c)

a = 2
b = 3
c = a**b
print("6 - c 的值为：", c)

a = 10
b = 5
c = a // b
print("7 - c 的值为：", c)
```

以上实例输出结果：

```
1 - c 的值为： 31
2 - c 的值为： 11
3 - c 的值为： 210
4 - c 的值为： 2.1
5 - c 的值为： 1
6 - c 的值为： 8
7 - c 的值为： 2
```

---

## Python 比较运算符

以下假设变量 a 为 10，变量 b 为20：

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| \== | 等于 - 比较对象是否相等 | (a == b) 返回 False。 |
| != | 不等于 - 比较两个对象是否不相等 | (a!= b) 返回 True。 |
| \> | 大于 - 返回x是否大于y | (a > b) 返回 False。 |
| < | 小于 - 返回x是否小于y。所有比较运算符返回1表示真，返回0表示假。这分别与特殊的变量True和False等价。注意，这些变量名的大写。 | (a < b) 返回 True。 |
| \>= | 大于等于 - 返回x是否大于等于y。 | (a >= b) 返回 False。 |
| <= | 小于等于 - 返回x是否小于等于y。 | (a <= b) 返回 True。 |

以下实例演示了Python所有比较运算符的操作：

## 实例(Python 3.0+)

```python
a = 21
b = 10
c = 0

if (a == b):
    print("1 - a 等于 b")
else:
    print("1 - a 不等于 b")

if (a != b):
    print("2 - a 不等于 b")
else:
    print("2 - a 等于 b")

if (a < b):
    print("3 - a 小于 b")
else:
    print("3 - a 大于等于 b")

if (a > b):
    print("4 - a 大于 b")
else:
    print("4 - a 小于等于 b")

a = 5
b = 20

if (a <= b):
    print("5 - a 小于等于 b")
else:
    print("5 - a 大于 b")

if (b >= a):
    print("6 - b 大于等于 a")
else:
    print("6 - b 小于 a")
```

以上实例输出结果：

```
1 - a 不等于 b
2 - a 不等于 b
3 - a 大于等于 b
4 - a 大于 b
5 - a 小于等于 b
6 - b 大于等于 a
```

---

## Python赋值运算符

以下假设变量a为10，变量b为20：

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| \= | 简单的赋值运算符 | c = a + b 将 a + b 的运算结果赋值为 c |
| += | 加法赋值运算符 | c += a 等效于 c = c + a |
| \-= | 减法赋值运算符 | c -= a 等效于 c = c - a |
| \*= | 乘法赋值运算符 | c \*= a 等效于 c = c \* a |
| /= | 除法赋值运算符 | c /= a 等效于 c = c / a |
| %= | 取模赋值运算符 | c %= a 等效于 c = c % a |
| \*\*= | 幂赋值运算符 | c \*\*= a 等效于 c = c \*\* a |
| //= | 取整除赋值运算符 | c //= a 等效于 c = c // a |
| := | 海象运算符，这个运算符的主要目的是在表达式中同时进行赋值和返回赋值的值。 **Python3.8 版本新增运算符** 。 | 在这个示例中，赋值表达式可以避免调用 len() 两次:  ``` if (n := len(a)) > 10:     print(f"List is too long ({n} elements, expected <= 10)") ``` |

以下实例演示了Python所有赋值运算符的操作：

## 实例(Python 3.0+)

```python
a = 21
b = 10
c = 0

c = a + b
print("1 - c 的值为：", c)

c += a
print("2 - c 的值为：", c)

c *= a
print("3 - c 的值为：", c)

c /= a
print("4 - c 的值为：", c)

c = 2
c %= a
print("5 - c 的值为：", c)

c **= a
print("6 - c 的值为：", c)

c //= a
print("7 - c 的值为：", c)
```

以上实例输出结果：

```
1 - c 的值为： 31
2 - c 的值为： 52
3 - c 的值为： 1092
4 - c 的值为： 52.0
5 - c 的值为： 2
6 - c 的值为： 2097152
7 - c 的值为： 99864
```

在 Python 3.8 及更高版本中，引入了一种新的语法特性，称为"海象运算符"（Walrus Operator），它使用:= 符号。这个运算符的主要目的是在表达式中同时进行赋值和返回赋值的值。

使用海象运算符可以在一些情况下简化代码，尤其是在需要在表达式中使用赋值结果的情况下。这对于简化循环条件或表达式中的重复计算很有用。

下面是一个简单的实例，演示了海象运算符的使用：

## 实例

```python
# 传统写法
n = 10
if n > 5:
    print(n)

# 使用海象运算符
if (n := 10) > 5:
    print(n)
```

- `if (n := 10) > 5:`：这是使用海象运算符（`:=` ）的写法。海象运算符在表达式中进行赋值操作。
	- `(n := 10)` ：将变量 `n` 赋值为 10，同时返回这个赋值结果。
		- `> 5` ：检查赋值后的 `n` 是否大于 5。如果条件为真，则执行接下来的代码块。
- `print(n)` ：如果条件为真，打印变量 `n` 的值（即 10）。

**海象运算符的优点：**

- 海象运算符（`:=` ）允许在表达式内部进行赋值，这可以减少代码的重复，提高代码的可读性和简洁性。
- 在上述例子中，传统写法需要单独一行来赋值 `n` ，然后在 `if` 语句中进行条件检查。而使用海象运算符的写法可以在 `if` 语句中直接进行赋值和条件检查。

---

## Python位运算符

按位运算符是把数字看作二进制来进行计算的。Python中的按位运算法则如下：

下表中变量 a 为 60，b 为 13二进制格式如下：

```
a = 0011 1100

b = 0000 1101

-----------------

a&b = 0000 1100

a|b = 0011 1101

a^b = 0011 0001

~a  = 1100 0011
```

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| & | 按位与运算符：参与运算的两个值,如果两个相应位都为1,则该位的结果为1,否则为0 | (a & b) 输出结果 12 ，二进制解释： 0000 1100 |
| \| | 按位或运算符：只要对应的二个二进位有一个为1时，结果位就为1。 | (a \| b) 输出结果 61 ，二进制解释： 0011 1101 |
| ^ | 按位异或运算符：当两对应的二进位相异时，结果为1 | (a ^ b) 输出结果 49 ，二进制解释： 0011 0001 |
| ~ | 按位取反运算符：对数据的每个二进制位取反,即把1变为0,把0变为1。~x 类似于 -x-1 | (~a ) 输出结果 -61 ，二进制解释： 1100 0011， 在一个有符号二进制数的补码形式。 |
| << | 左移动运算符：运算数的各二进位全部左移若干位，由"<<"右边的数指定移动的位数，高位丢弃，低位补0。 | a << 2 输出结果 240 ，二进制解释： 1111 0000 |
| \>> | 右移动运算符：把">>"左边的运算数的各二进位全部右移若干位，">>"右边的数指定移动的位数 | a >> 2 输出结果 15 ，二进制解释： 0000 1111 |

以下实例演示了Python所有位运算符的操作：

## 实例(Python 3.0+)

```python
a = 60
b = 13
c = 0

c = a & b
print("1 - c 的值为：", c)

c = a | b
print("2 - c 的值为：", c)

c = a ^ b
print("3 - c 的值为：", c)

c = ~a
print("4 - c 的值为：", c)

c = a << 2
print("5 - c 的值为：", c)

c = a >> 2
print("6 - c 的值为：", c)
```

以上实例输出结果：

```
1 - c 的值为： 12
2 - c 的值为： 61
3 - c 的值为： 49
4 - c 的值为： -61
5 - c 的值为： 240
6 - c 的值为： 15
```

---

## Python逻辑运算符

Python语言支持逻辑运算符，以下假设变量 a 为 10, b为 20:

| 运算符 | 逻辑表达式   | 描述                                                   | 实例                    |
| --- | ------- | ---------------------------------------------------- | --------------------- |
| and | x and y | 布尔"与" - 如果 x 为 False，x and y 返回 x 的值，否则返回 y 的计算值。    | (a and b) 返回 20。      |
| or  | x or y  | 布尔"或" - 如果 x 是 True，它返回 x 的值，否则它返回 y 的计算值。           | (a or b) 返回 10。       |
| not | not x   | 布尔"非" - 如果 x 为 True，返回 False 。如果 x 为 False，它返回 True。 | not(a and b) 返回 False |

以上实例输出结果：

## 实例(Python 3.0+)

```python
a = 10
b = 20

if (a and b):
    print("1 - 变量 a 和 b 都为 true")
else:
    print("1 - 变量 a 和 b 有一个不为 true")

if (a or b):
    print("2 - 变量 a 和 b 都为 true，或其中一个变量为 true")
else:
    print("2 - 变量 a 和 b 都不为 true")

a = 0

if (a and b):
    print("3 - 变量 a 和 b 都为 true")
else:
    print("3 - 变量 a 和 b 有一个不为 true")

if (a or b):
    print("4 - 变量 a 和 b 都为 true，或其中一个变量为 true")
else:
    print("4 - 变量 a 和 b 都不为 true")

if not (a and b):
    print("5 - 变量 a 和 b 都为 false，或其中一个变量为 false")
else:
    print("5 - 变量 a 和 b 都为 true")
```

以上实例输出结果：

```
1 - 变量 a 和 b 都为 true
2 - 变量 a 和 b 都为 true，或其中一个变量为 true
3 - 变量 a 和 b 有一个不为 true
4 - 变量 a 和 b 都为 true，或其中一个变量为 true
5 - 变量 a 和 b 都为 false，或其中一个变量为 false
```

---

## Python成员运算符

除了以上的一些运算符之外，Python还支持成员运算符，测试实例中包含了一系列的成员，包括字符串，列表或元组。

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| in | 如果在指定的序列中找到值返回 True，否则返回 False。 | x 在 y 序列中, 如果 x 在 y 序列中返回 True。 |
| not in | 如果在指定的序列中没有找到值返回 True，否则返回 False。 | x 不在 y 序列中, 如果 x 不在 y 序列中返回 True。 |

以下实例演示了Python所有成员运算符的操作：

## 实例(Python 3.0+)

```python
a = 10
b = 20
list = [1, 2, 3, 4, 5]

if (a in list):
    print("1 - 变量 a 在给定的列表中 list 中")
else:
    print("1 - 变量 a 不在给定的列表中 list 中")

if (b not in list):
    print("2 - 变量 b 不在给定的列表中 list 中")
else:
    print("2 - 变量 b 在给定的列表中 list 中")

a = 2
if (a in list):
    print("3 - 变量 a 在给定的列表中 list 中")
else:
    print("3 - 变量 a 不在给定的列表中 list 中")
```

以上实例输出结果：

```
1 - 变量 a 不在给定的列表中 list 中
2 - 变量 b 不在给定的列表中 list 中
3 - 变量 a 在给定的列表中 list 中
```

---

## Python身份运算符

身份运算符用于比较两个对象的存储单元

| 运算符 | 描述 | 实例 |
| --- | --- | --- |
| is | is 是判断两个标识符是不是引用自一个对象 | **x is y**, 类似 **id(x) == id(y)**, 如果引用的是同一个对象则返回 True，否则返回 False |
| is not | is not 是判断两个标识符是不是引用自不同对象 | **x is not y** ， 类似 **id(x)!= id(y)** 。如果引用的不是同一个对象则返回结果 True，否则返回 False。 |

**注：** [id()](https://www.runoob.com/python/python-func-id.html) 函数用于获取对象内存地址。

以下实例演示了Python所有身份运算符的操作：

## 实例(Python 3.0+)

```python
a = 20
b = 20

if (a is b):
    print("1 - a 和 b 有相同的标识")
else:
    print("1 - a 和 b 没有相同的标识")

if (id(a) == id(b)):
    print("2 - a 和 b 有相同的标识")
else:
    print("2 - a 和 b 没有相同的标识")

b = 30

if (a is b):
    print("3 - a 和 b 有相同的标识")
else:
    print("3 - a 和 b 没有相同的标识")

if (a is not b):
    print("4 - a 和 b 没有相同的标识")
else:
    print("4 - a 和 b 有相同的标识")
```

以上实例输出结果：

```
1 - a 和 b 有相同的标识
2 - a 和 b 有相同的标识
3 - a 和 b 没有相同的标识
4 - a 和 b 没有相同的标识
```

> **is 与 == 区别：**
> 
> is 用于判断两个变量引用对象是否为同一个，== 用于判断引用变量的值是否相等。

```python
>>> a = [1, 2, 3]
>>> b = a
>>> b is a
True
>>> b == a
True
>>> b = a[:]
>>> b is a
False
>>> b == a
True
```

---

## Python运算符优先级

以下表格列出了从最高到最低优先级的所有运算符， 相同单元格内的运算符具有相同优先级。 运算符均指二元运算，除非特别指出。 相同单元格内的运算符从左至右分组（除了幂运算是从右至左分组）：

| 运算符 | 描述 |
| --- | --- |
| `(expressions...)`,  `[expressions...]`, `{key: value...}`, `{expressions...}` | 圆括号的表达式 |
| `x[index]`, `x[index:index]`, `x(arguments...)`, `x.attribute` | 读取，切片，调用，属性引用 |
| await x | await 表达式 |
| `**` | 乘方(指数) |
| `+x`, `-x`, `~x` | 正，负，按位非 NOT |
| `*`, `@`, `/`, `//`, `%` | 乘，矩阵乘，除，整除，取余 |
| `+`, `-` | 加和减 |
| `<<`, `>>` | 移位 |
| `&` | 按位与 AND |
| `^` | 按位异或 XOR |
| `\|` | 按位或 OR |
| `` `in`,`not in`,    `is`,`is not`, `<`,     `<=`, `>`, `>=`, `!=`, `==` `` | 比较运算，包括成员检测和标识号检测 |
| `` `not x` `` | 逻辑非 NOT |
| `` `and` `` | 逻辑与 AND |
| `` `or` `` | 逻辑或 OR |
| `` `if` -- `else` `` | 条件表达式 |
| `` `lambda` `` | lambda 表达式 |
| `:=` | 赋值表达式 |

以下实例演示了Python所有运算符优先级的操作：

## 实例(Python 3.0+)

```python
a = 20
b = 10
c = 15
d = 5
e = 0

e = (a + b) * c / d
print("(a + b) * c / d 运算结果为：", e)

e = ((a + b) * c) / d
print("((a + b) * c) / d 运算结果为：", e)

e = (a + b) * (c / d)
print("(a + b) * (c / d) 运算结果为：", e)

e = a + (b * c) / d
print("a + (b * c) / d 运算结果为：", e)
```

以上实例输出结果：

```
(a + b) * c / d 运算结果为： 90.0
((a + b) * c) / d 运算结果为： 90.0
(a + b) * (c / d) 运算结果为： 90.0
a + (b * c) / d 运算结果为： 50.0
```

and 拥有更高优先级:

## 实例

```python
x = True
y = False
z = False

print("情况1：默认优先级（先算and）")
if x or y and z:
    print("yes")
else:
    print("no")

print("\n情况2：强制改变优先级（先算or）")
if (x or y) and z:
    print("yes")
else:
    print("no")
```

以上实例先计算 y and z 并返回 False ，然后 x or False 返回 True，输出结果：

```
情况1：默认优先级（先算and）
yes

情况2：强制改变优先级（先算or）
no
```

> **注意：** Python3 已不支持 <> 运算符，可以使用!= 代替，如果你一定要使用这种比较运算符，可以使用以下的方式：

```python
>>> from __future__ import barry_as_FLUFL
>>> 1 <> 2
True
```

---

## 三元运算符（条件表达式）

**语法：** `<true_value> if 条件表达式 else <false_value>`

条件为真时整个表达式的结果是第一个值，否则是第二个值。因为它能"算出结果"，所以是**表达式**而不是语句，可以直接写在赋值、函数参数里面。

```python
age = 20

# 普通写法
if age >= 18:
    result = "成年"
else:
    result = "未成年"

# 三元运算符写法：一行搞定
result = "成年" if age >= 18 else "未成年"
print(result)   # 成年
```

**在项目中的实际用法**（AI 智能伴侣侧边栏，当前会话的按钮高亮）：

```python
st.button(
    session,
    key=f"load_{session}",
    type="primary" if session == st.session_state.current_session else "secondary"
)
```

条件是"这个会话是不是当前会话"，为真则按钮类型取 `"primary"`（高亮），否则取 `"secondary"`（普通）。

> **注意：** 三元运算符是**先算条件前面那个值、再看条件**的写法，不要和 `and`/`or` 的短路混用；嵌套多层（`a if x else b if y else c`）会严重影响可读性，超过两层建议改回 `if...elif...else`。

---

## 练习题

- [x] **1. 算术运算符练习**
  创建文件 `test_arithmetic.py`，完成以下计算并打印结果：
  - `15 + 4`（加法）
  - `15 - 4`（减法）
  - `15 * 4`（乘法）
  - `15 / 4`（除法，得到小数）
  - `15 // 4`（整除）
  - `15 % 4`（取余）
  - `2 ** 10`（乘方）

  **参考答案：**
  ```python
  print(f"15 + 4 = {15 + 4}")      # 19
  print(f"15 - 4 = {15 - 4}")      # 11
  print(f"15 * 4 = {15 * 4}")      # 60
  print(f"15 / 4 = {15 / 4}")      # 3.75
  print(f"15 // 4 = {15 // 4}")    # 3
  print(f"15 % 4 = {15 % 4}")      # 3
  print(f"2 ** 10 = {2 ** 10}")    # 1024
  ```

- [x] **2. 比较运算符练习**
  创建文件 `test_compare.py`，完成以下操作：
  - 比较 `10 == 10`、`10 != 5`、`10 > 5`、`10 < 5`、`10 >= 10`、`10 <= 5`
  - 打印每个结果

  **参考答案：**
  ```python
  print(f"10 == 10: {10 == 10}")   # True
  print(f"10 != 5: {10 != 5}")    # True
  print(f"10 > 5: {10 > 5}")      # True
  print(f"10 < 5: {10 < 5}")      # False
  print(f"10 >= 10: {10 >= 10}")  # True
  print(f"10 <= 5: {10 <= 5}")    # False
  ```

- [x] **3. 赋值运算符练习**
  创建文件 `test_assignment.py`，完成以下操作：
  - 创建变量 `a = 10`
  - 用 `+=` 加 5
  - 用 `-=` 减 3
  - 用 `*=` 乘 2
  - 用 `//=` 整除 3
  - 每步打印结果

  **参考答案：**
  ```python
  a = 10
  print(f"初始值: a = {a}")    # 10

  a += 5
  print(f"a += 5: {a}")       # 15

  a -= 3
  print(f"a -= 3: {a}")       # 12

  a *= 2
  print(f"a *= 2: {a}")       # 24

  a //= 3
  print(f"a //= 3: {a}")      # 8
  ```

- [x] **4. 逻辑运算符练习**
  创建文件 `test_logical.py`，完成以下操作：
  - 测试 `True and False`、`True or False`、`not True`
  - 用变量测试：`a = 10, b = 20`，测试 `a and b`、`a or b`、`not a`

  **参考答案：**
  ```python
  print(f"True and False: {True and False}")   # False
  print(f"True or False: {True or False}")     # True
  print(f"not True: {not True}")               # False

  a = 10
  b = 20
  print(f"a and b: {a and b}")   # 20（返回最后一个真值）
  print(f"a or b: {a or b}")     # 10（返回第一个真值）
  print(f"not a: {not a}")       # False
  ```

- [x] **5. 成员运算符练习**
  创建文件 `test_member.py`，完成以下操作：
  - 创建列表 `fruits = ["苹果", "香蕉", "橘子"]`
  - 测试 `"苹果" in fruits`
  - 测试 `"西瓜" not in fruits`
  - 测试 `"香蕉" in fruits`

  **参考答案：**
  ```python
  fruits = ["苹果", "香蕉", "橘子"]

  print(f"'苹果' in fruits: {'苹果' in fruits}")       # True
  print(f"'西瓜' not in fruits: {'西瓜' not in fruits}")  # True
  print(f"'香蕉' in fruits: {'香蕉' in fruits}")       # True
  ```

- [x] **6. 身份运算符练习**
  创建文件 `test_identity.py`，完成以下操作：
  - 创建 `a = [1, 2, 3]`，`b = a`，`c = a[:]`
  - 测试 `a is b`、`a is c`、`a == b`、`a == c`
  - 用 `id()` 查看内存地址

  **参考答案：**
  ```python
  a = [1, 2, 3]
  b = a
  c = a[:]

  print(f"a is b: {a is b}")     # True（同一个对象）
  print(f"a is c: {a is c}")     # False（不同对象）
  print(f"a == b: {a == b}")     # True（值相等）
  print(f"a == c: {a == c}")     # True（值相等）

  print(f"id(a): {id(a)}")
  print(f"id(b): {id(b)}")  # 和 a 相同
  print(f"id(c): {id(c)}")  # 和 a 不同
  ```