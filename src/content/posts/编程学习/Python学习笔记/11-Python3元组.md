---
title: Python3 元组
published: 2026-09-15
tags:
  - Python
description: Python3 元组的创建、访问、运算和内置函数
order: 11
---
Python 的元组与列表类似，不同之处在于元组的元素不能修改。

元组使用小括号 ( )，列表使用方括号 \[ \]。

元组创建很简单，只需要在括号中添加元素，并使用逗号隔开即可。

![](https://www.runoob.com/wp-content/uploads/2016/04/tup-2020-10-27-10-26-2.png)

## 实例(Python 3.0+)

```python
>>> tup1 = ('Google', 'Runoob', 1997, 2000)
>>> tup2 = (1, 2, 3, 4, 5)
>>> tup3 = "a", "b", "c", "d"  # 不需要括号也可以
>>> type(tup3)
<class 'tuple'>
```

创建空元组

```python
tup1 = ()
```

元组中只包含一个元素时，需要在元素后面添加逗号, ，否则括号会被当作运算符使用：

## 实例(Python 3.0+)

```python
>>> tup1 = (50)
>>> type(tup1)  # 不加逗号，类型为整型
<class 'int'>

>>> tup1 = (50,)
>>> type(tup1)  # 加上逗号，类型为元组
<class 'tuple'>
```

元组与字符串类似，下标索引从 0 开始，可以进行截取，组合等。

![](https://www.runoob.com/wp-content/uploads/2016/04/py-tup-10-26.png)

---

## 访问元组

元组可以使用下标索引来访问元组中的值，如下实例:

## 实例(Python 3.0+)

```python
tup1 = ('Google', 'Runoob', 1997, 2000)
tup2 = (1, 2, 3, 4, 5, 6, 7)

print("tup1[0]: ", tup1[0])
print("tup2[1:5]: ", tup2[1:5])
```

以上实例输出结果：

```
tup1[0]:  Google
tup2[1:5]:  (2, 3, 4, 5)
```

---

## 修改元组

元组中的元素值是不允许修改的，但我们可以对元组进行连接组合，如下实例:

## 实例(Python 3.0+)

```python
tup1 = (12, 34.56)
tup2 = ('abc', 'xyz')
tup3 = tup1 + tup2
print(tup3)
```

以上实例输出结果：

```
(12, 34.56, 'abc', 'xyz')
```

---

## 删除元组

元组中的元素值是不允许删除的，但我们可以使用del语句来删除整个元组，如下实例:

## 实例(Python 3.0+)

```python
tup = ('Google', 'Runoob', 1997, 2000)
print(tup)
del tup
print("删除后的元组 tup: ")
print(tup)
```

以上实例元组被删除后，输出变量会有异常信息，输出如下所示：

```
删除后的元组 tup : 
Traceback (most recent call last):
  File "test.py", line 8, in <module>
    print (tup)
NameError: name 'tup' is not defined
```

---

## 元组运算符

与字符串一样，元组之间可以使用 +、+=和 \* 号进行运算。这就意味着他们可以组合和复制，运算后会生成一个新的元组。

| Python 表达式 | 结果 | 描述 |
| --- | --- | --- |
| ``` len((1, 2, 3)) ``` | 3 | 计算元素个数 |
| ``` >>> a = (1, 2, 3) >>> b = (4, 5, 6) >>> c = a+b >>> c (1, 2, 3, 4, 5, 6) ``` | (1, 2, 3, 4, 5, 6) | 连接，c 就是一个新的元组，它包含了 a 和 b 中的所有元素。 |
| ``` >>> a = (1, 2, 3) >>> b = (4, 5, 6) >>> a += b >>> a (1, 2, 3, 4, 5, 6) ``` | (1, 2, 3, 4, 5, 6) | 连接，a 就变成了一个新的元组，它包含了 a 和 b 中的所有元素。 |
| ``` ('Hi!',) * 4 ``` | ('Hi!', 'Hi!', 'Hi!', 'Hi!') | 复制 |
| ``` 3 in (1, 2, 3) ``` | True | 元素是否存在 |
| ``` for x in (1, 2, 3):      print (x, end=" ") ``` | 1 2 3 | 迭代 |

---

## 元组索引，截取

因为元组也是一个序列，所以我们可以访问元组中的指定位置的元素，也可以截取索引中的一段元素，如下所示：

元组：

```
tup = ('Google', 'Runoob', 'Taobao', 'Wiki', 'Weibo','Weixin')
```

![](https://www.runoob.com/wp-content/uploads/2016/04/py-tup-7.png)

| Python 表达式 | 结果 | 描述 |
| --- | --- | --- |
| tup\[1\] | 'Runoob' | 读取第二个元素 |
| tup\[-2\] | 'Weibo' | 反向读取，读取倒数第二个元素 |
| tup\[1:\] | ('Runoob', 'Taobao', 'Wiki', 'Weibo', 'Weixin') | 截取元素，从第二个开始后的所有元素。 |
| tup\[1:4\] | ('Runoob', 'Taobao', 'Wiki') | 截取元素，从第二个开始到第四个元素（索引为 3）。 |

运行实例如下：

## 实例

```python
>>> tup = ('Google', 'Runoob', 'Taobao', 'Wiki', 'Weibo', 'Weixin')
>>> tup[1]
'Runoob'
>>> tup[-2]
'Weibo'
>>> tup[1:]
('Runoob', 'Taobao', 'Wiki', 'Weibo', 'Weixin')
>>> tup[1:4]
('Runoob', 'Taobao', 'Wiki')
>>>
```

---

## 元组内置函数

Python元组包含了以下内置函数

| 序号 | 方法及描述 | 实例 |
| --- | --- | --- |
| 1 | len(tuple)   计算元组元素个数。 | ``` >>> tuple1 = ('Google', 'Runoob', 'Taobao') >>> len(tuple1) 3 >>> ``` |
| 2 | max(tuple)   返回元组中元素最大值。 | ``` >>> tuple2 = ('5', '4', '8') >>> max(tuple2) '8' >>> ``` |
| 3 | min(tuple)   返回元组中元素最小值。 | ``` >>> tuple2 = ('5', '4', '8') >>> min(tuple2) '4' >>> ``` |
| 4 | tuple(iterable)   将可迭代系列转换为元组。 | ``` >>> list1= ['Google', 'Taobao', 'Runoob', 'Baidu'] >>> tuple1=tuple(list1) >>> tuple1 ('Google', 'Taobao', 'Runoob', 'Baidu') ``` |

### 关于元组是不可变的

所谓元组的不可变指的是元组所指向的内存中的内容不可变。

```python
>>> tup = ('r', 'u', 'n', 'o', 'o', 'b')
>>> tup[0] = 'g'  # 不支持修改元素
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
>>> id(tup)  # 查看内存地址
4440687904
>>> tup = (1, 2, 3)
>>> id(tup)
4441088800  # 内存地址不一样了
```

从以上实例可以看出，重新赋值的元组 tup，绑定到新的对象了，不是修改了原来的对象。

---

## 练习题

- [x] **1. 创建元组**
  创建文件 `test_tuple.py`，完成以下操作：
  - 创建元组 `t1 = (1, 2, 3, 4, 5)`
  - 创建元组 `t2 = ("a", "b", "c")`
  - 创建只有一个元素的元组 `t3 = (10,)`（注意逗号）
  - 打印每个元组及其类型
  # -> (元素1, 元素2, ...)、(元素,) 单元素元组要加逗号

  **参考答案：**
  ```python
  t1 = (1, 2, 3, 4, 5)
  t2 = ("a", "b", "c")
  t3 = (10,)

  print(f"t1: {t1}, 类型: {type(t1)}")
  print(f"t2: {t2}, 类型: {type(t2)}")
  print(f"t3: {t3}, 类型: {type(t3)}")
  ```

- [x] **2. 访问元组元素**
  创建文件 `test_access.py`，完成以下操作：
  - 创建元组 `t = ("苹果", "香蕉", "橘子", "葡萄", "西瓜")`
  - 打印第一个元素、最后一个元素
  - 打印索引 1 到 3 的切片
  # -> tuple[0]、tuple[-1]、tuple[开始:结束]

  **参考答案：**
  ```python
  t = ("苹果", "香蕉", "橘子", "葡萄", "西瓜")

  print(f"第一个: {t[0]}")      # 苹果
  print(f"最后一个: {t[-1]}")   # 西瓜
  print(f"切片 [1:3]: {t[1:3]}")  # ('香蕉', '橘子')
  ```

- [x] **3. 元组拼接与重复**
  创建文件 `test_concat.py`，完成以下操作：
  - 创建元组 `a = (1, 2, 3)` 和 `b = (4, 5, 6)`
  - 用 `+` 拼接两个元组
  - 用 `*` 重复元组 3 次
  # -> tuple1 + tuple2、tuple * 次数

  **参考答案：**
  ```python
  a = (1, 2, 3)
  b = (4, 5, 6)

  c = a + b
  print(f"拼接: {c}")  # (1, 2, 3, 4, 5, 6)

  d = a * 3
  print(f"重复: {d}")  # (1, 2, 3, 1, 2, 3, 1, 2, 3)
  ```

- [x] **4. 元组常用函数**
  创建文件 `test_func.py`，完成以下操作：
  - 创建元组 `t = (3, 1, 4, 1, 5, 9, 2, 6)`
  - 用 `len()` 计算长度
  - 用 `max()` 获取最大值
  - 用 `min()` 获取最小值
  # -> len(tuple)、max(tuple)、min(tuple)

  **参考答案：**
  ```python
  t = (3, 1, 4, 1, 5, 9, 2, 6)

  print(f"长度: {len(t)}")    # 8
  print(f"最大值: {max(t)}")  # 9
  print(f"最小值: {min(t)}")  # 1
  ```

- [x] **5. 元组与列表转换**
  创建文件 `test_convert.py`，完成以下操作：
  - 创建列表 `lst = [1, 2, 3, 4, 5]`
  - 用 `tuple()` 将列表转换为元组
  - 创建元组 `t = (6, 7, 8)`
  - 用 `list()` 将元组转换为列表
  # -> tuple(列表)、list(元组)

  **参考答案：**
  ```python
  lst = [1, 2, 3, 4, 5]
  t = tuple(lst)
  print(f"列表转元组: {t}")  # (1, 2, 3, 4, 5)

  t2 = (6, 7, 8)
  lst2 = list(t2)
  print(f"元组转列表: {lst2}")  # [6, 7, 8]
  ```

- [x] **6. 元组遍历与删除**
  创建文件 `test_iter.py`，完成以下操作：
  - 创建元组 `t = (10, 20, 30, 40, 50)`
  - 用 `for` 循环遍历打印每个元素
  - 用 `in` 判断 `30` 是否在元组中
  - 用 `del` 删除整个元组，观察结果
  # -> for x in tuple: print(x)、值 in tuple、del tuple

  **参考答案：**
  ```python
  t = (10, 20, 30, 40, 50)

  # for 循环遍历
  for x in t:
      print(x, end=" ")  # 10 20 30 40 50
  print()

  # in 判断
  print(f"30是否在元组中: {30 in t}")  # True

  # del 删除
  del t
  # print(t)  # 报错：NameError: name 't' is not defined
  ```

- [x] **7. 元组不可变性验证**
  创建文件 `test_immut.py`，完成以下操作：
  - 创建元组 `t = (1, 2, 3)`
  - 尝试修改 `t[0] = 10`，观察报错信息
  - 用 `id()` 查看修改前后元组的内存地址
  # -> tuple[索引] = 值（会报错）、id(对象)

  **参考答案：**
  ```python
  t = (1, 2, 3)
  print(f"修改前: {t}")
  print(f"修改前地址: {id(t)}")

  # 尝试修改会报错：TypeError: 'tuple' object does not support item assignment
  # t[0] = 10

  t = (10, 2, 3)  # 重新赋值
  print(f"重新赋值后: {t}")
  print(f"重新赋值后地址: {id(t)}")  # 地址不同，是新对象
  ```