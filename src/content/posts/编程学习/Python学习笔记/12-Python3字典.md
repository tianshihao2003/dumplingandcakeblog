---
title: Python3 字典
published: 2026-09-15
tags:
  - Python
description: Python3 字典的创建、访问、修改、删除和常用方法
image: https://img.tsh520.cn/file/blog/post-covers/python-12-dict.webp
order: 12
---
字典是另一种可变容器模型，且可存储任意类型对象。

字典的每个键值 key=>value 对用冒号: 分割，每个对之间用逗号(**,**)分割，整个字典包括在花括号 {} 中,格式如下所示：

```
d = {key1 : value1, key2 : value2, key3 : value3 }
```

**注意：** dict 作为 Python 的关键字和内置函数，变量名不建议命名为 **dict** 。

![](https://img.tsh520.cn/file/blog/article/py-dict-3.png)

键必须是唯一的，但值则不必。

值可以取任何数据类型，但键必须是不可变的，如字符串，数字。

一个简单的字典实例：

```
tinydict = {'name': 'runoob', 'likes': 123, 'url': 'www.runoob.com'}
```

![](https://img.tsh520.cn/file/blog/article/py-dict-2.png)

也可如此创建字典：

```
tinydict1 = { 'abc': 456 }
tinydict2 = { 'abc': 123, 98.6: 37 }
```

---

## 创建空字典

使用大括号 { } 创建空字典：

## 实例

```python
# 使用大括号 {} 来创建空字典
emptyDict = {}

# 打印字典
print(emptyDict)

# 查看字典的数量
print("Length:", len(emptyDict))

# 查看类型
print(type(emptyDict))
```

以上实例输出结果：

```
{}
Length: 0
<class 'dict'>
```

使用内建函数 dict() 创建字典：

## 实例

```python
emptyDict = dict()

# 打印字典
print(emptyDict)

# 查看字典的数量
print("Length:", len(emptyDict))

# 查看类型
print(type(emptyDict))
```

以上实例输出结果：

```
{}
Length: 0
<class 'dict'>
```

---

## 访问字典里的值

把相应的键放入到方括号中，如下实例:

## 实例

```python
tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}
print("tinydict['Name']: ", tinydict['Name'])
print("tinydict['Age']: ", tinydict['Age'])
```

以上实例输出结果：

```
tinydict['Name']:  Runoob
tinydict['Age']:  7
```

如果用字典里没有的键访问数据，会输出错误如下：

## 实例

```python
tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}
print("tinydict['Alice']: ", tinydict['Alice'])
```

以上实例输出结果：

```
Traceback (most recent call last):
  File "test.py", line 5, in <module>
    print ("tinydict['Alice']: ", tinydict['Alice'])
KeyError: 'Alice'
```

---

## 修改字典

向字典添加新内容的方法是增加新的键/值对，修改或删除已有键/值对如下实例:

## 实例

```python
tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}
tinydict['Age'] = 8
tinydict['School'] = "菜鸟教程"
print("tinydict['Age']: ", tinydict['Age'])
print("tinydict['School']: ", tinydict['School'])
```

以上实例输出结果：

```
tinydict['Age']:  8
tinydict['School']:  菜鸟教程
```

---

## 删除字典元素

能删单一的元素也能清空字典，清空只需一项操作。

显式删除一个字典用del命令，如下实例：

## 实例

```python
tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}
del tinydict['Name']
tinydict.clear()
del tinydict
print("tinydict['Age']: ", tinydict['Age'])
print("tinydict['School']: ", tinydict['School'])
```

但这会引发一个异常，因为用执行 del 操作后字典不再存在：

```
Traceback (most recent call last):
  File "/runoob-test/test.py", line 9, in <module>
    print ("tinydict['Age']: ", tinydict['Age'])
NameError: name 'tinydict' is not defined
```

**注：** del() 方法后面也会讨论。

### 字典键的特性

字典值可以是任何的 python 对象，既可以是标准的对象，也可以是用户定义的，但键不行。

两个重要的点需要记住：

1）不允许同一个键出现两次。创建时如果同一个键被赋值两次，后一个值会被记住，如下实例：

## 实例

```python
tinydict = {'Name': 'Runoob', 'Age': 7, 'Name': '小菜鸟'}
print("tinydict['Name']: ", tinydict['Name'])
```

以上实例输出结果：

```
tinydict['Name']:  小菜鸟
```

2）键必须不可变，所以可以用数字，字符串或元组充当，而用列表就不行，如下实例：

## 实例

```python
tinydict = {['Name']: 'Runoob', 'Age': 7}
print("tinydict['Name']: ", tinydict['Name'])
```

以上实例输出结果：

```
Traceback (most recent call last):
  File "test.py", line 3, in <module>
    tinydict = {['Name']: 'Runoob', 'Age': 7}
TypeError: unhashable type: 'list'
```

---

## 字典内置函数&方法

Python字典包含了以下内置函数：

| 序号 | 函数及描述 | 实例 |
| --- | --- | --- |
| 1 | len(dict)   计算字典元素个数，即键的总数。 | ``` >>> tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'} >>> len(tinydict) 3 ``` |
| 2 | str(dict)   输出字典，可以打印的字符串表示。 | ``` >>> tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'} >>> str(tinydict) "{'Name': 'Runoob', 'Class': 'First', 'Age': 7}" ``` |
| 3 | type(variable)   返回输入的变量类型，如果变量是字典就返回字典类型。 | ``` >>> tinydict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'} >>> type(tinydict) <class 'dict'> ``` |

Python字典包含了以下内置方法：

| 序号 | 函数及描述 |
| --- | --- |
| 1 | [dict.clear()](https://www.runoob.com/python3/python3-att-dictionary-clear.html)   删除字典内所有元素 |
| 2 | [dict.copy()](https://www.runoob.com/python3/python3-att-dictionary-copy.html)   返回一个字典的浅复制 |
| 3 | [dict.fromkeys()](https://www.runoob.com/python3/python3-att-dictionary-fromkeys.html)   创建一个新字典，以序列seq中元素做字典的键，val为字典所有键对应的初始值 |
| 4 | [dict.get(key, default=None)](https://www.runoob.com/python3/python3-att-dictionary-get.html)   返回指定键的值，如果键不在字典中返回 default 设置的默认值 |
| 5 | [key in dict](https://www.runoob.com/python3/python3-att-dictionary-in.html)   如果键在字典dict里返回true，否则返回false |
| 6 | [dict.items()](https://www.runoob.com/python3/python3-att-dictionary-items.html)   以列表返回一个视图对象 |
| 7 | [dict.keys()](https://www.runoob.com/python3/python3-att-dictionary-keys.html)   返回一个视图对象 |
| 8 | [dict.setdefault(key, default=None)](https://www.runoob.com/python3/python3-att-dictionary-setdefault.html)   和get()类似, 但如果键不存在于字典中，将会添加键并将值设为default |
| 9 | [dict.update(dict2)](https://www.runoob.com/python3/python3-att-dictionary-update.html)   把字典dict2的键/值对更新到dict里 |
| 10 | [dict.values()](https://www.runoob.com/python3/python3-att-dictionary-values.html)   返回一个视图对象 |
| 11 | [dict.pop(key\[,default\])](https://www.runoob.com/python3/python3-att-dictionary-pop.html)   删除字典 key（键）所对应的值，返回被删除的值。 |
| 12 | [dict.popitem()](https://www.runoob.com/python3/python3-att-dictionary-popitem.html)   返回并删除字典中的最后一对键和值。 |

---

## 练习题

- [x] **1. 创建字典**
  创建文件 `test_dict.py`，完成以下操作：
  - 创建空字典 `d1 = {}`
  - 用 `dict()` 创建空字典 `d2 = dict()`
  - 创建字典 `person = {"name": "张三", "age": 20, "city": "北京"}`
  - 打印每个字典及其类型
  # -> {}、dict()、{key: value, key: value}

  **参考答案：**
  ```python
  d1 = {}
  d2 = dict()
  person = {"name": "张三", "age": 20, "city": "北京"}

  print(f"空字典d1: {d1}, 类型: {type(d1)}")
  print(f"空字典d2: {d2}, 类型: {type(d2)}")
  print(f"字典person: {person}, 类型: {type(person)}")
  ```

- [x] **2. 访问字典元素**
  创建文件 `test_access.py`，完成以下操作：
  - 创建字典 `d = {"name": "李四", "age": 25, "job": "工程师"}`
  - 用 `[]` 访问 name 的值
  - 用 `get()` 访问 age 的值
  - 用 `get()` 访问不存在的键 salary，设置默认值 0
  # -> dict[key]、dict.get(key)、dict.get(key, 默认值)

  **参考答案：**
  ```python
  d = {"name": "李四", "age": 25, "job": "工程师"}

  print(f"name: {d['name']}")        # 李四
  print(f"age: {d.get('age')}")      # 25
  print(f"salary: {d.get('salary', 0)}")  # 0（不存在返回默认值）
  ```

- [x] **3. 修改字典**
  创建文件 `test_modify.py`，完成以下操作：
  - 创建字典 `d = {"name": "王五", "age": 30}`
  - 修改 age 的值为 31
  - 添加新的键值对 "city": "上海"
  - 打印修改后的字典
  # -> dict[key] = value（修改或添加）

  **参考答案：**
  ```python
  d = {"name": "王五", "age": 30}
  print(f"修改前: {d}")

  d["age"] = 31      # 修改
  d["city"] = "上海"  # 添加
  print(f"修改后: {d}")
  ```

- [x] **4. 删除字典元素**
  创建文件 `test_delete.py`，完成以下操作：
  - 创建字典 `d = {"a": 1, "b": 2, "c": 3, "d": 4}`
  - 用 `del` 删除键 "a"
  - 用 `pop()` 删除键 "b"，并获取其值
  - 用 `clear()` 清空字典
  # -> del dict[key]、dict.pop(key)、dict.clear()

  **参考答案：**
  ```python
  d = {"a": 1, "b": 2, "c": 3, "d": 4}
  print(f"初始: {d}")

  del d["a"]
  print(f"del后: {d}")  # {'b': 2, 'c': 3, 'd': 4}

  val = d.pop("b")
  print(f"pop后: {d}, 删除的值: {val}")  # {'c': 3, 'd': 4}, 2

  d.clear()
  print(f"clear后: {d}")  # {}
  ```

- [x] **5. 字典遍历**
  创建文件 `test_iter.py`，完成以下操作：
  - 创建字典 `d = {"name": "赵六", "age": 28, "city": "广州"}`
  - 遍历打印所有键
  - 遍历打印所有值
  - 遍历打印所有键值对
  # -> dict.keys()、dict.values()、dict.items()

  **参考答案：**
  ```python
  d = {"name": "赵六", "age": 28, "city": "广州"}

  print("所有键:", list(d.keys()))
  print("所有值:", list(d.values()))
  print("所有键值对:")
  for k, v in d.items():
      print(f"  {k}: {v}")
  ```

- [x] **6. 字典判断与统计**
  创建文件 `test_check.py`，完成以下操作：
  - 创建字典 `d = {"apple": 5, "banana": 3, "orange": 8}`
  - 用 `in` 判断 "apple" 是否在字典中
  - 用 `len()` 统计字典长度
  - 用 `get()` 获取 "grape" 的数量（不存在返回 0）
  # -> key in dict、len(dict)、dict.get(key, 默认值)

  **参考答案：**
  ```python
  d = {"apple": 5, "banana": 3, "orange": 8}

  print(f"apple是否在字典中: {'apple' in d}")  # True
  print(f"字典长度: {len(d)}")                  # 3
  print(f"grape数量: {d.get('grape', 0)}")      # 0
  ```

- [x] **7. 字典合并与复制**
  创建文件 `test_merge.py`，完成以下操作：
  - 创建字典 `d1 = {"a": 1, "b": 2}` 和 `d2 = {"c": 3, "d": 4}`
  - 用 `update()` 将 d2 合并到 d1
  - 用 `copy()` 复制 d1 到 d3
  - 修改 d1 的 "a" 为 10，观察 d3 是否变化
  # -> dict1.update(dict2)、dict.copy()

  **参考答案：**
  ```python
  d1 = {"a": 1, "b": 2}
  d2 = {"c": 3, "d": 4}

  d1.update(d2)
  print(f"合并后: {d1}")  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}

  d3 = d1.copy()
  d1["a"] = 10
  print(f"d1: {d1}")  # {'a': 10, 'b': 2, 'c': 3, 'd': 4}
  print(f"d3: {d3}")  # {'a': 1, 'b': 2, 'c': 3, 'd': 4}（不受影响）
  ```