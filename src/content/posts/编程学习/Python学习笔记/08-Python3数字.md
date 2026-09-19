---
title: Python3 数字(Number)
published: 2026-09-14
tags:
  - Python
description: Python3 数字类型、数学函数、随机数函数和三角函数
order: 8
---
Python 数字数据类型用于存储数值。

数据类型是不允许改变的，这就意味着如果改变数字数据类型的值，将重新分配内存空间。

以下实例在变量赋值时 Number 对象将被创建：

```python
var1 = 1
var2 = 10
```

您也可以使用del语句删除一些数字对象的引用。

del语句的语法是：

```python
del var1[, var2[, var3[, ..., varN]]]
```

您可以通过使用del语句删除单个或多个对象的引用，例如：

```python
del var
del var_a, var_b
```

Python 支持三种不同的数值类型：

- **整型(int)** - 通常被称为是整型或整数，是正或负整数，不带小数点。Python3 整型是没有限制大小的，可以当作 Long 类型使用，所以 Python3 没有 Python2 的 Long 类型。布尔(bool)是整型的子类型。
- **浮点型(float)** - 浮点型由整数部分与小数部分组成，浮点型也可以使用科学计数法表示（2.5e2 = 2.5 x 10 <sup>2</sup> = 250）
- **复数( (complex))** - 复数由实数部分和虚数部分构成，可以用a + bj,或者complex(a,b)表示， 复数的实部a和虚部b都是浮点型。

我们可以使用十六进制和八进制来代表整数：

```python
>>> number = 0xA0F  # 十六进制
>>> number
2575

>>> number = 0o37  # 八进制
>>> number
31
```

| int | float | complex |
| --- | --- | --- |
| 10 | 0.0 | 3.14j |
| 100 | 15.20 | 45.j |
| \-786 | \-21.9 | 9.322e-36j |
| 080 | 32.3e+18 | .876j |
| \-0490 | \-90. | \-.6545+0J |
| \-0x260 | \-32.54e100 | 3e+26J |
| 0x69 | 70.2E-12 | 4.53e-7j |

- Python支持复数，复数由实数部分和虚数部分构成，可以用a + bj,或者complex(a,b)表示， 复数的实部a和虚部b都是浮点型。

---

## Python 数字类型转换

有时候，我们需要对数据内置的类型进行转换，数据类型的转换，你只需要将数据类型作为函数名即可。

- **int(x)** 将x转换为一个整数。
- **float(x)** 将x转换到一个浮点数。
- **complex(x)** 将x转换到一个复数，实数部分为 x，虚数部分为 0。
- **complex(x, y)** 将 x 和 y 转换到一个复数，实数部分为 x，虚数部分为 y。x 和 y 是数字表达式。

以下实例将浮点数变量 a 转换为整数：

```python
>>> a = 1.0
>>> int(a)
1
```

---

## Python 数字运算

Python 解释器可以作为一个简单的计算器，您可以在解释器里输入一个表达式，它将输出表达式的值。

表达式的语法很直白： +, -, \* 和 /, 和其它语言（如Pascal或C）里一样。例如：

```python
>>> 2 + 2
4
>>> 50 - 5*6
20
>>> (50 - 5*6) / 4
5.0
>>> 8 / 5  # 总是返回一个浮点数
1.6
```

**注意：** 在不同的机器上浮点运算的结果可能会不一样。

在整数除法中，除法 / 总是返回一个浮点数，如果只想得到整数的结果，丢弃可能的分数部分，可以使用运算符 // ：

```python
>>> 17 / 3  # 整数除法返回浮点型
5.666666666666667
>>> 17 // 3  # 整数除法返回向下取整后的结果
5
>>> 17 % 3  # ％操作符返回除法的余数
2
>>> 5 * 3 + 2
17
```

**注意：** // 得到的并不一定是整数类型的数，它与分母分子的数据类型有关系。

```python
>>> 7 // 2
3
>>> 7.0 // 2
3.0
>>> 7 // 2.0
3.0
```

等号 = 用于给变量赋值。赋值之后，除了下一个提示符，解释器不会显示任何结果。

```python
>>> width = 20
>>> height = 5 * 9
>>> width * height
900
```

Python 可以使用 \*\* 操作来进行幂运算：

```python
>>> 5 ** 2  # 5 的平方
25
>>> 2 ** 7  # 2的7次方
128
```

变量在使用前必须先"定义"（即赋予变量一个值），否则会出现错误：

```python
>>> n  # 尝试访问一个未定义的变量
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'n' is not defined
```

不同类型的数混合运算时会将整数转换为浮点数：

```python
>>> 3 * 3.75 / 1.5
7.5
>>> 7.0 / 2
3.5
```

在交互模式中，最后被输出的表达式结果被赋值给变量 **\_** 。例如：

```python
>>> tax = 12.5 / 100
>>> price = 100.50
>>> price * tax
12.5625
>>> price + _
113.0625
>>> round(_, 2)
113.06
```

此处， **\_** 变量应被用户视为只读变量。

---

## 数学函数

| 函数 | 返回值 ( 描述 ) |
| --- | --- |
| [abs(x)](https://www.runoob.com/python3/python3-func-number-abs.html) | 返回数字的绝对值，如abs(-10) 返回 10 |
| [ceil(x)](https://www.runoob.com/python3/python3-func-number-ceil.html) | 返回数字的上入整数，如math.ceil(4.1) 返回 5 |
| cmp(x, y) | 如果 x < y 返回 -1, 如果 x == y 返回 0, 如果 x > y 返回 1。 **Python 3 已废弃，使用 (x>y)-(x<y) 替换** 。 |
| [exp(x)](https://www.runoob.com/python3/python3-func-number-exp.html) | 返回e的x次幂(e <sup>x</sup>),如math.exp(1) 返回2.718281828459045 |
| [fabs(x)](https://www.runoob.com/python3/python3-func-number-fabs.html) | 以浮点数形式返回数字的绝对值，如math.fabs(-10) 返回10.0 |
| [floor(x)](https://www.runoob.com/python3/python3-func-number-floor.html) | 返回数字的下舍整数，如math.floor(4.9)返回 4 |
| [log(x)](https://www.runoob.com/python3/python3-func-number-log.html) | 如math.log(math.e)返回1.0,math.log(100,10)返回2.0 |
| [log10(x)](https://www.runoob.com/python3/python3-func-number-log10.html) | 返回以10为基数的x的对数，如math.log10(100)返回 2.0 |
| [max(x1, x2,...)](https://www.runoob.com/python3/python3-func-number-max.html) | 返回给定参数的最大值，参数可以为序列。 |
| [min(x1, x2,...)](https://www.runoob.com/python3/python3-func-number-min.html) | 返回给定参数的最小值，参数可以为序列。 |
| [modf(x)](https://www.runoob.com/python3/python3-func-number-modf.html) | 返回x的整数部分与小数部分，两部分的数值符号与x相同，整数部分以浮点型表示。 |
| [pow(x, y)](https://www.runoob.com/python3/python3-func-number-pow.html) | x\*\*y 运算后的值。 |
| [round(x \[,n\])](https://www.runoob.com/python3/python3-func-number-round.html) | 返回浮点数 x 的四舍五入值，如给出 n 值，则代表舍入到小数点后的位数。  **其实准确的说是保留值将保留到离上一位更近的一端。** |
| [sqrt(x)](https://www.runoob.com/python3/python3-func-number-sqrt.html) | 返回数字x的平方根。 |

---

## 随机数函数

随机数可以用于数学，游戏，安全等领域中，还经常被嵌入到算法中，用以提高算法效率，并提高程序的安全性。

Python包含以下常用随机数函数：

| 函数                                                                                                         | 描述                                                        |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [choice(seq)](https://www.runoob.com/python3/python3-func-number-choice.html)                              | 从序列的元素中随机挑选一个元素，比如random.choice(range(10))，从0到9中随机挑选一个整数。 |
| [randrange (\[start,\] stop \[,step\])](https://www.runoob.com/python3/python3-func-number-randrange.html) | 从指定范围内，按指定基数递增的集合中获取一个随机数，基数默认值为 1                        |
| [random()](https://www.runoob.com/python3/python3-func-number-random.html)                                 | 随机生成下一个实数，它在\[0,1)范围内。                                    |
| [seed(\[x\])](https://www.runoob.com/python3/python3-func-number-seed.html)                                | 改变随机数生成器的种子seed。如果你不了解其原理，你不必特别去设定seed，Python会帮你选择seed。   |
| [shuffle(lst)](https://www.runoob.com/python3/python3-func-number-shuffle.html)                            | 将序列的所有元素随机排序                                              |
| [uniform(x, y)](https://www.runoob.com/python3/python3-func-number-uniform.html)                           | 随机生成下一个实数，它在\[x,y\]范围内。                                   |

---

## 三角函数

Python包括以下三角函数：

| 函数                                                                            | 描述                                    |
| ----------------------------------------------------------------------------- | ------------------------------------- |
| [acos(x)](https://www.runoob.com/python3/python3-func-number-acos.html)       | 返回x的反余弦弧度值。                           |
| [asin(x)](https://www.runoob.com/python3/python3-func-number-asin.html)       | 返回x的反正弦弧度值。                           |
| [atan(x)](https://www.runoob.com/python3/python3-func-number-atan.html)       | 返回x的反正切弧度值。                           |
| [atan2(y, x)](https://www.runoob.com/python3/python3-func-number-atan2.html)  | 返回给定的 X 及 Y 坐标值的反正切值。                 |
| [cos(x)](https://www.runoob.com/python3/python3-func-number-cos.html)         | 返回x的弧度的余弦值。                           |
| [hypot(x, y)](https://www.runoob.com/python3/python3-func-number-hypot.html)  | 返回欧几里德范数 sqrt(x\*x + y\*y)。           |
| [sin(x)](https://www.runoob.com/python3/python3-func-number-sin.html)         | 返回的x弧度的正弦值。                           |
| [tan(x)](https://www.runoob.com/python3/python3-func-number-tan.html)         | 返回x弧度的正切值。                            |
| [degrees(x)](https://www.runoob.com/python3/python3-func-number-degrees.html) | 将弧度转换为角度,如degrees(math.pi/2) ， 返回90.0 |
| [radians(x)](https://www.runoob.com/python3/python3-func-number-radians.html) | 将角度转换为弧度                              |

---

## 数学常量

| 常量 | 描述 |
| --- | --- |
| pi | 数学常量 pi（圆周率，一般以π来表示） |
| e | 数学常量 e，e即自然常数（自然常数）。 |

---

## 练习题

- [x] **1. 数字类型识别**
  创建文件 `test_number_type.py`，完成以下操作：
  - 创建变量 `a = 10`、`b = 3.14`、`c = 2 + 3j`
  - 用 `type()` 打印每个变量的类型
  - 用 `isinstance()` 判断 `a` 是否是 int 类型

  **参考答案：**
  ```python
  a = 10
  b = 3.14
  c = 2 + 3j

  print(f"a = {a}, 类型: {type(a)}")    # <class 'int'>
  print(f"b = {b}, 类型: {type(b)}")    # <class 'float'>
  print(f"c = {c}, 类型: {type(c)}")    # <class 'complex'>

  print(f"isinstance(a, int): {isinstance(a, int)}")  # True
  ```

- [x] **2. 数字类型转换**
  创建文件 `test_convert.py`，完成以下操作：
  - 将浮点数 `3.14` 转换为整数
  - 将整数 `100` 转换为浮点数
  - 将整数 `10` 转换为复数
  - 打印每个结果及其类型

  **参考答案：**
  ```python
  a = int(3.14)
  b = float(100)
  c = complex(10)

  print(f"int(3.14) = {a}, 类型: {type(a)}")      # 3, <class 'int'>
  print(f"float(100) = {b}, 类型: {type(b)}")      # 100.0, <class 'float'>
  print(f"complex(10) = {c}, 类型: {type(c)}")    # (10+0j), <class 'complex'>
  ```

- [x] **3. 进制转换**
  创建文件 `test_hex.py`，完成以下操作：
  - 将十进制数 `255` 转换为十六进制、八进制、二进制
  - 将十六进制 `0xFF` 转换为十进制
  - 打印每个结果

  **参考答案：**
  ```python
  a = 255

  print(f"十六进制: {hex(a)}")   # 0xff
  print(f"八进制: {oct(a)}")     # 0o377
  print(f"二进制: {bin(a)}")     # 0b11111111

  print(f"0xFF 转十进制: {0xFF}")  # 255
  ```

- [x] **4. 数学函数练习**
  创建文件 `test_math.py`，完成以下操作（需要 `import math`）：
  - 计算 `-10` 的绝对值
  - 计算 `4.1` 的上入整数
  - 计算 `4.9` 的下舍整数
  - 计算 `2` 的平方根
  - 计算 `e` 的 `1` 次幂

  **参考答案：**
  ```python
  import math

  print(f"abs(-10) = {abs(-10)}")           # 10
  print(f"math.ceil(4.1) = {math.ceil(4.1)}")  # 5
  print(f"math.floor(4.9) = {math.floor(4.9)}")  # 4
  print(f"math.sqrt(2) = {math.sqrt(2)}")    # 1.4142135623730951
  print(f"math.exp(1) = {math.exp(1)}")      # 2.718281828459045
  ```

- [x] **5. 随机数函数练习**
  创建文件 `test_random.py`，完成以下操作（需要 `import random`）：
  - 生成一个 `[0, 1)` 之间的随机小数
  - 从 `[0, 1, 2, 3, 4, 5]` 中随机选一个数
  - 生成一个 `[1, 100]` 之间的随机整数

  **参考答案：**
  ```python
  import random

  print(f"随机小数: {random.random()}")           # 例如：0.7134
  print(f"随机选择: {random.choice([0,1,2,3,4,5])}")  # 例如：3
  print(f"随机整数: {random.randint(1, 100)}")    # 例如：42
  ```

- [x] **6. 数字运算综合练习**
  创建文件 `test_calculate.py`，完成以下操作：
  - 计算圆的面积（半径 = 5，用 `math.pi`）
  - 计算 `10` 的阶乘（用 `math.factorial`）
  - 对 `3.14159` 四舍五入保留 2 位小数

  **参考答案：**
  ```python
  import math

  r = 5
  area = math.pi * r ** 2
  print(f"半径为{r}的圆面积: {area}")  # 78.53981633974483

  print(f"10的阶乘: {math.factorial(10)}")  # 3628800

  print(f"四舍五入: {round(3.14159, 2)}")   # 3.14
  ```