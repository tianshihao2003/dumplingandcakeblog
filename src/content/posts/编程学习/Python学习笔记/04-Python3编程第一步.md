---
title: Python3 编程第一步
published: 2026-09-15
tags:
  - Python
description: Python3 编程入门实例：打印、变量、列表、循环和条件语句
image: https://img.tsh520.cn/file/blog/post-covers/python-04-first-program.webp
order: 4
---
在前面的教程中我们已经学习了一些 Python3 的基本语法知识，接下来我们来尝试一些实例。

打印字符串:

## 实例

```python
print("Hello, world!")
```

输出结果为：

```
Hello, world!
```

输出变量值:

## 实例

```python
i = 256 * 256
print('i 的值为：', i)
```

输出结果为：

```
i 的值为： 65536
```

定义变量并进行简单的数学运算

## 实例

```python
x = 3
y = 2
z = x + y
print(z)
```

输出结果为：

```
5
```

定义一个列表并打印出其中的元素：

## 实例

```python
my_list = ['google', 'runoob', 'taobao']
print(my_list[0])  # 输出 "google"
print(my_list[1])  # 输出 "runoob"
print(my_list[2])  # 输出 "taobao"
```

输出结果为：

```
google
runoob
taobao
```

使用 for 循环打印数字 0 到 4:

## 实例

```python
for i in range(5):
    print(i)
```

输出结果为：

```
0
1
2
3
4
```

根据条件输出不同的结果:

## 实例

```python
x = 6
if x > 10:
    print("x 大于 10")
else:
    print("x 小于或等于 10")
```

输出结果为：

```
x 小于或等于 10
```

下面我们尝试来写一个斐波纳契数列。

斐波那契数列是一个经典的数学问题，其中每个数字是前两个数字之和。

## 实例(Python 3.0+)

```python
a, b = 0, 1
while b < 10:
    print(b)
    a, b = b, a + b
```

其中代码 a, b = b, a+b 的计算方式为先计算右边表达式，然后同时赋值给左边，等价于：

```python
n = b
m = a + b
a = n
b = m
```

执行以上程序，输出结果为：

```
1
1
2
3
5
8
```

这个例子介绍了几个新特征。

第一行包含了一个复合赋值：变量 a 和 b 同时得到新值 0 和 1。最后一行再次使用了同样的方法，可以看到，右边的表达式会在赋值变动之前执行。右边表达式的执行顺序是从左往右的。

也可以使用 for 循环来实现：

## 实例

```python
n = 10
a, b = 0, 1
for i in range(n):
    print(b)
    a, b = b, a + b
```

### end 关键字

关键字end可以用于将结果输出到同一行，或者在输出的末尾添加不同的字符，实例如下：

## 实例(Python 3.0+)

```python
a, b = 0, 1
while b < 1000:
    print(b, end=',')
    a, b = b, a + b
```

执行以上程序，输出结果为：

```
1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,
```

---

## 练习题

- [x] **1. Hello World**
  创建文件 `test_hello.py`，完成以下操作：
  - 打印 "Hello, Python!"
  - 打印你的名字

  **知识点：** print("内容")

  **参考答案：**
  ```python
  print("Hello, Python!")
  print("我的名字是：小明")
  ```

- [x] **2. 变量与数学运算**
  创建文件 `test_math.py`，完成以下操作：
  - 定义变量 `a = 10`、`b = 3`
  - 计算并打印加法、减法、乘法、除法结果

  **知识点：** 变量赋值、print(表达式)

  **参考答案：**
  ```python
  a = 10
  b = 3

  print(f"加法: {a + b}")    # 13
  print(f"减法: {a - b}")    # 7
  print(f"乘法: {a * b}")    # 30
  print(f"除法: {a / b}")    # 3.333...
  ```

- [x] **3. 列表操作**
  创建文件 `test_list.py`，完成以下操作：
  - 创建列表 `colors = ["红", "绿", "蓝"]`
  - 打印第一个元素和最后一个元素
  - 打印列表长度

  **知识点：** list[0]、list[-1]、len(list)

  **参考答案：**
  ```python
  colors = ["红", "绿", "蓝"]

  print(f"第一个: {colors[0]}")    # 红
  print(f"最后一个: {colors[-1]}") # 蓝
  print(f"长度: {len(colors)}")    # 3
  ```

- [x] **4. for 循环**
  创建文件 `test_for.py`，完成以下操作：
  - 用 for 循环打印 1 到 5
  - 每个数字后面加空格

  **知识点：** for i in range(开始, 结束)、print(i, end=" ")

  **参考答案：**
  ```python
  for i in range(1, 6):
      print(i, end=" ")
  print()
  ```

- [x] **5. if 条件语句**
  创建文件 `test_if.py`，完成以下操作：
  - 输入一个数字 `num`
  - 如果是偶数，打印"偶数"
  - 如果是奇数，打印"奇数"

  **知识点：** num = int(input())、if num % 2 == 0:

  **参考答案：**
  ```python
  num = int(input("请输入一个数字: "))

  if num % 2 == 0:
      print("偶数")
  else:
      print("奇数")
  ```

- [x] **6. while 循环**
  创建文件 `test_while.py`，完成以下操作：
  - 用 while 循环累加 1 到 100
  - 打印总和

  **知识点：** while i <= 100:

  **参考答案：**
  ```python
  total = 0
  i = 1
  while i <= 100:
      total += i
      i += 1
  print(f"1到100的和: {total}")  # 5050
  ```

- [x] **7. end 关键字**
  创建文件 `test_end.py`，完成以下操作：
  - 用 for 循环打印 1 到 5，用逗号分隔在同一行
  - 最后打印一个换行

  **知识点：** print(i, end=",")

  **参考答案：**
  ```python
  for i in range(1, 6):
      print(i, end=",")
  print()
  ```