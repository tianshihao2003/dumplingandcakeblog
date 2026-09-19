---
title: Python3 列表
published: 2026-09-15
tags:
  - Python
description: Python3 列表的创建、访问、增删改查等基本操作
order: 10
---
序列是 Python 中最基本的数据结构。

序列中的每个值都有对应的位置值，称之为索引，第一个索引是 0，第二个索引是 1，依此类推。

Python 有 6 个序列的内置类型，但最常见的是列表和元组。

列表都可以进行的操作包括索引，切片，加，乘，检查成员。

此外，Python 已经内置确定序列的长度以及确定最大和最小的元素的方法。

列表是最常用的 Python 数据类型，它可以作为一个方括号内的逗号分隔值出现。

列表的数据项不需要具有相同的类型

创建一个列表，只要把逗号分隔的不同的数据项使用方括号括起来即可。如下所示：

```python
list1 = ['Google', 'Runoob', 1997, 2000]
list2 = [1, 2, 3, 4, 5]
list3 = ["a", "b", "c", "d"]
list4 = ['red', 'green', 'blue', 'yellow', 'white', 'black']
```

---

## 访问列表中的值

与字符串的索引一样，列表索引从 0 开始，第二个索引是 1，依此类推。

通过索引列表可以进行截取、组合等操作。

![](https://www.runoob.com/wp-content/uploads/2014/05/positive-indexes-1.png)

## 实例

```python
#!/usr/bin/python3

list = ['red', 'green', 'blue', 'yellow', 'white', 'black']
print(list[0])
print(list[1])
print(list[2])
```

以上实例输出结果：

```
red
green
blue
```

索引也可以从尾部开始，最后一个元素的索引为 -1，往前一位为 -2，以此类推。

![](https://www.runoob.com/wp-content/uploads/2014/05/negative-indexes.png)

## 实例

```python
#!/usr/bin/python3

list = ['red', 'green', 'blue', 'yellow', 'white', 'black']
print(list[-1])
print(list[-2])
print(list[-3])
```

以上实例输出结果：

```
black
white
yellow
```

使用下标索引来访问列表中的值，同样你也可以使用方括号 [] 的形式截取字符，如下所示：

![](https://www.runoob.com/wp-content/uploads/2014/05/first-slice.png)

## 实例

```python
#!/usr/bin/python3

nums = [10, 20, 30, 40, 50, 60, 70, 80, 90]
print(nums[0:4])
```

以上实例输出结果：

``` json
[10, 20, 30, 40]
```

使用负数索引值截取：

## 实例

```python
#!/usr/bin/python3

list = ['Google', 'Runoob', "Zhihu", "Taobao", "Wiki"]

# 读取第二位
print("list[1]: ", list[1])
# 从第二位开始（包含）截取到倒数第二位（不包含）
print("list[1:-2]: ", list[1:-2])
```

以上实例输出结果：

```
list[1]:  Runoob
list[1:-2]:  ['Runoob', 'Zhihu']
```

---

## 更新列表

你可以对列表的数据项进行修改或更新，你也可以使用 append() 方法来添加列表项，如下所示：

## 实例(Python 3.0+)

```python
#!/usr/bin/python3

list = ['Google', 'Runoob', 1997, 2000]

print("第三个元素为: ", list[2])
list[2] = 2001
print("更新后的第三个元素为: ", list[2])

list1 = ['Google', 'Runoob', 'Taobao']
list1.append('Baidu')
print("更新后的列表: ", list1)
```

**注意：** 我们会在接下来的章节讨论 [append()](https://www.runoob.com/python3/python3-att-list-append.html) 方法的使用。

以上实例输出结果：

```
第三个元素为 :  1997
更新后的第三个元素为 :  2001
更新后的列表 :  ['Google', 'Runoob', 'Taobao', 'Baidu']
```

---

## 删除列表元素

可以使用 del 语句来删除列表中的元素，如下实例：

## 实例(Python 3.0+)

```python
#!/usr/bin/python3

list = ['Google', 'Runoob', 1997, 2000]

print("原始列表: ", list)
del list[2]
print("删除第三个元素: ", list)
```

以上实例输出结果：

```
原始列表 :  ['Google', 'Runoob', 1997, 2000]
删除第三个元素 :  ['Google', 'Runoob', 2000]
```

**注意：** 我们会在接下来的章节讨论 remove() 方法的使用

---

## Python列表脚本操作符

列表对 + 和 \* 的操作符与字符串相似。+ 号用于组合列表，\* 号用于重复列表。

如下所示：

| Python 表达式 | 结果 | 描述 |
| --- | --- | --- |
| len(\[1, 2, 3\]) | 3 | 长度 |
| \[1, 2, 3\] + \[4, 5, 6\] | \[1, 2, 3, 4, 5, 6\] | 组合 |
| \['Hi!'\] \* 4 | \['Hi!', 'Hi!', 'Hi!', 'Hi!'\] | 重复 |
| 3 in \[1, 2, 3\] | True | 元素是否存在于列表中 |
| for x in \[1, 2, 3\]: print(x, end=" ") | 1 2 3 | 迭代 |

---

## Python 列表截取与拼接

Python 的列表截取与字符串操作类似，如下所示：

L=\['Google', 'Runoob', 'Taobao'\]

操作：

| Python 表达式 | 结果 | 描述 |
| --- | --- | --- |
| L\[2\] | 'Taobao' | 读取第三个元素 |
| L\[-2\] | 'Runoob' | 从右侧开始读取倒数第二个元素: count from the right |
| L\[1:\] | \['Runoob', 'Taobao'\] | 输出从第二个元素开始后的所有元素 |

```python
>>> L = ['Google', 'Runoob', 'Taobao']
>>> L[2]
'Taobao'
>>> L[-2]
'Runoob'
>>> L[1:]
['Runoob', 'Taobao']
>>>
```

列表还支持拼接操作：

```python
>>> squares = [1, 4, 9, 16, 25]
>>> squares += [36, 49, 64, 81, 100]
>>> squares
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
>>>
```

---

## 嵌套列表

使用嵌套列表即在列表里创建其它列表，例如：

```python
>>> a = ['a', 'b', 'c']
>>> n = [1, 2, 3]
>>> x = [a, n]
>>> x
[['a', 'b', 'c'], [1, 2, 3]]
>>> x[0]
['a', 'b', 'c']
>>> x[0][1]
'b'
```

---

## 列表比较

列表比较需要引入 operator 模块的 eq 方法（详见： [Python operator 模块](https://www.runoob.com/python3/python-operator.html) ）：

## 实例

```python
# 导入 operator 模块
import operator

a = [1, 2]
b = [2, 3]
c = [2, 3]
print("operator.eq(a,b): ", operator.eq(a, b))
print("operator.eq(c,b): ", operator.eq(c, b))
```

以上代码输出结果为：

```
operator.eq(a,b):  False
operator.eq(c,b):  True
```

---

## Python列表函数&方法

Python包含以下函数:

| 序号 | 函数 |
| --- | --- |
| 1 | [len(list)](https://www.runoob.com/python3/python3-att-list-len.html)   列表元素个数 |
| 2 | [max(list)](https://www.runoob.com/python3/python3-att-list-max.html)   返回列表元素最大值 |
| 3 | [min(list)](https://www.runoob.com/python3/python3-att-list-min.html)   返回列表元素最小值 |
| 4 | [list(seq)](https://www.runoob.com/python3/python3-att-list-list.html)   将元组转换为列表 |

Python包含以下方法:

| 序号 | 方法 |
| --- | --- |
| 1 | [list.append(obj)](https://www.runoob.com/python3/python3-att-list-append.html)   在列表末尾添加新的对象 |
| 2 | [list.count(obj)](https://www.runoob.com/python3/python3-att-list-count.html)   统计某个元素在列表中出现的次数 |
| 3 | [list.extend(seq)](https://www.runoob.com/python3/python3-att-list-extend.html)   在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表） |
| 4 | [list.index(obj)](https://www.runoob.com/python3/python3-att-list-index.html)   从列表中找出某个值第一个匹配项的索引位置 |
| 5 | [list.insert(index, obj)](https://www.runoob.com/python3/python3-att-list-insert.html)   将对象插入列表 |
| 6 | [list.pop(\[index=-1\])](https://www.runoob.com/python3/python3-att-list-pop.html)   移除列表中的一个元素（默认最后一个元素），并且返回该元素的值 |
| 7 | [list.remove(obj)](https://www.runoob.com/python3/python3-att-list-remove.html)   移除列表中某个值的第一个匹配项 |
| 8 | [list.reverse()](https://www.runoob.com/python3/python3-att-list-reverse.html)   反向列表中元素 |
| 9 | [list.sort( key=None, reverse=False)](https://www.runoob.com/python3/python3-att-list-sort.html)   对原列表进行排序 |
| 10 | [list.clear()](https://www.runoob.com/python3/python3-att-list-clear.html)   清空列表 |
| 11 | [list.copy()](https://www.runoob.com/python3/python3-att-list-copy.html)   复制列表 |

---

## 练习题

- [x] **1. 创建列表与访问元素**
  创建文件 `test_list.py`，完成以下操作：
  - 创建列表 `fruits = ["苹果", "香蕉", "橘子", "葡萄"]`
  - 打印第一个元素、最后一个元素
  - 打印索引 1 到 3 的切片
  - 打印列表长度
  # -> list[0]、list[-1]、list[开始:结束]、len(list)

  **参考答案：**
  ```python
  fruits = ["苹果", "香蕉", "橘子", "葡萄"]

  print(f"第一个: {fruits[0]}")      # 苹果
  print(f"最后一个: {fruits[-1]}")   # 葡萄
  print(f"切片 [1:3]: {fruits[1:3]}")  # ['香蕉', '橘子']
  print(f"长度: {len(fruits)}")      # 4
  ```

- [x] **2. 列表添加元素**
  创建文件 `test_append.py`，完成以下操作：
  - 创建列表 `nums = [1, 2, 3]`
  - 用 `append()` 在末尾添加 `4`
  - 用 `insert()` 在索引 1 处插入 `10`
  - 打印每次操作后的列表
  # -> list.append(元素)、list.insert(索引, 元素)

  **参考答案：**
  ```python
  nums = [1, 2, 3]
  print(f"初始: {nums}")

  nums.append(4)
  print(f"append后: {nums}")  # [1, 2, 3, 4]

  nums.insert(1, 10)
  print(f"insert后: {nums}")  # [1, 10, 2, 3, 4]
  ```

- [x] **3. 列表删除元素**
  创建文件 `test_delete.py`，完成以下操作：
  - 创建列表 `a = [1, 2, 3, 4, 5]`
  - 用 `del` 删除索引 2 的元素
  - 用 `remove()` 删除值为 `4` 的元素
  - 用 `pop()` 删除最后一个元素
  - 打印每次操作后的列表
  # -> del list[索引]、list.remove(值)、list.pop()

  **参考答案：**
  ```python
  a = [1, 2, 3, 4, 5]
  print(f"初始: {a}")

  del a[2]
  print(f"del后: {a}")  # [1, 2, 4, 5]

  a.remove(4)
  print(f"remove后: {a}")  # [1, 2, 5]

  a.pop()
  print(f"pop后: {a}")  # [1, 2]
  ```

- [x] **4. 列表排序与反转**
  创建文件 `test_sort.py`，完成以下操作：
  - 创建列表 `nums = [3, 1, 4, 1, 5, 9, 2, 6]`
  - 用 `sort()` 排序（升序）
  - 用 `reverse()` 反转
  - 打印每次操作后的列表
  # -> list.sort()、list.reverse()

  **参考答案：**
  ```python
  nums = [3, 1, 4, 1, 5, 9, 2, 6]
  print(f"初始: {nums}")

  nums.sort()
  print(f"sort后: {nums}")  # [1, 1, 2, 3, 4, 5, 6, 9]

  nums.reverse()
  print(f"reverse后: {nums}")  # [9, 6, 5, 4, 3, 2, 1, 1]
  ```

- [x] **5. 列表查找与统计**
  创建文件 `test_find.py`，完成以下操作：
  - 创建列表 `a = [1, 2, 3, 2, 4, 2]`
  - 用 `count()` 统计 `2` 出现的次数
  - 用 `index()` 查找 `3` 的位置
  - 判断 `5` 是否在列表中（用 `in`）
  # -> list.count(值)、list.index(值)、值 in list

  **参考答案：**
  ```python
  a = [1, 2, 3, 2, 4, 2]

  print(f"2出现次数: {a.count(2)}")  # 3
  print(f"3的位置: {a.index(3)}")    # 2
  print(f"5是否在列表中: {5 in a}")  # False
  ```

- [x] **6. 列表复制与合并**
  创建文件 `test_copy.py`，完成以下操作：
  - 创建列表 `a = [1, 2, 3]`
  - 用 `copy()` 复制列表到 `b`
  - 修改 `a` 的第一个元素为 `10`，观察 `b` 是否变化
  - 用 `+` 合并两个列表
  # -> list.copy()、list1 + list2

  **参考答案：**
  ```python
  a = [1, 2, 3]
  b = a.copy()

  a[0] = 10
  print(f"a: {a}")  # [10, 2, 3]
  print(f"b: {b}")  # [1, 2, 3]（不受影响）

  c = a + b
  print(f"合并: {c}")  # [10, 2, 3, 1, 2, 3]
  ```