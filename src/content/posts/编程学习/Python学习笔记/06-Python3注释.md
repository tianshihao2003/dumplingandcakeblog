---
title: Python3 注释
published: 2026-09-14
tags:
  - Python
description: Python3 单行注释、多行注释和 Docstring 的使用方法
order: 6
---
Python 中，注释不会影响程序的执行，但是会使代码更易于阅读和理解。

Python 中的注释有 **单行注释** 和 **多行注释** 。

---

## 单行注释

Python 中单行注释以 # 开头， `#` 符号后面的所有文本都被视为注释，不会被解释器执行。

## 实例

```python
# 这是一个注释
print("Hello, World!")
# 这也是注释
```

---

## 多行注释

在 Python 中，多行字符串（由三个单引号 ''' 或三个双引号 """ 包围的文本块）可以用作多行注释。

### 1、使用三个单引号

## 实例

```python
#!/usr/bin/python3

'''
这是多行注释，用三个单引号
这是多行注释，用三个单引号
这是多行注释，用三个单引号
'''
print("Hello, World!")
```

### 2、使用三个双引号

## 实例

```python
#!/usr/bin/python3

"""
这是多行注释，用三个双引号
这是多行注释，用三个双引号
这是多行注释，用三个双引号
"""
print("Hello, World!")
```

> **注意** ：虽然多行字符串在这里被当作多行注释使用，但它实际上是一个字符串，我们只要不使用它，它不会影响程序的运行。
> 
> 这些字符串在代码中可以被放置在一些位置，而不引起实际的执行，从而达到注释的效果。

### 多行注释注意事项

在 Python 中，多行注释是由三个单引号 ''' 或三个双引号 """ 来定义的， **这种注释方式不能嵌套使用** 。

当你开始一个多行注释块时，Python 会一直将后续的行都当作注释，直到遇到另一组三个单引号或三个双引号。

**嵌套多行注释会导致语法错误：**

## 实例（错误示例）

```python
'''
这是外部的多行注释
可以包含一些描述性的内容

'''
这是尝试嵌套的多行注释
会导致语法错误
'''
'''
```

在这个例子中，内部的三个单引号并没有被正确识别为多行注释的结束，而是被解释为普通的字符串，这将导致代码结构不正确。

**正确做法：使用单行注释嵌套**

## 实例（正确示例）

```python
'''
这是外部的多行注释
可以包含一些描述性的内容

# 这是内部的单行注释
# 可以嵌套在多行注释中
'''
```

---

## Docstring 文档字符串

Python 的 Docstring（文档字符串）是一种特殊的注释，用于为函数、类、模块等添加文档说明。它类似于 Java 的 Javadoc，但更加强大和灵活。

与普通注释不同， **Docstring 可以通过 `__doc__` 属性直接访问** ，也可以使用 `help()` 函数查看。

### 基本语法

Docstring 使用三个双引号 `"""` 或三个单引号 `'''` 包围，放在函数、类、模块的开头。

## 实例

```python
def add(a, b):
    """返回两数之和"""
    return a + b

# 通过 __doc__ 属性访问
print(add.__doc__)  # 输出: 返回两数之和
```

### 使用 help() 查看文档

## 实例

```python
def add(a, b):
    """返回两数之和"""
    return a + b

# 使用 help() 函数
help(add)
```

**运行结果预期:**

```
Help on function add in module __main__:

add(a, b)
    返回两数之和
```

### 使用 inspect 模块提取文档

Python 的标准库提供了 `inspect` 模块，可以直接提取文档内容：

## 实例

```python
import inspect

def add(a, b):
    """返回两数之和"""
    return a + b

# 使用 inspect.getdoc() 获取文档
print(inspect.getdoc(add))  # 输出: 返回两数之和
```

**运行结果预期:**

```
返回两数之和
```

### 多行 Docstring

对于复杂的函数，可以使用多行 Docstring：

## 实例

```python
def calculate(a, b, operation="add"):
    """
    执行数学运算

    参数:
        a: 第一个数字
        b: 第二个数字
        operation: 操作类型，可选 "add", "subtract", "multiply"

    返回:
        计算结果
    """
    if operation == "add":
        return a + b
    elif operation == "subtract":
        return a - b
    elif operation == "multiply":
        return a * b
    else:
        raise ValueError("不支持的操作")

# 查看完整文档
help(calculate)
```

**运行结果预期:**

``` yaml
Help on function calculate in module __main__:

calculate(a, b, operation='add')
    执行数学运算

    参数:
        a: 第一个数字
        b: 第二个数字
        operation: 操作类型，可选 "add", "subtract", "multiply"

    返回:
        计算结果
```

### 类的 Docstring

Docstring 也可以用于类：

## 实例

```python
class Person:
    """人物类，用于表示一个人的基本信息"""

    def __init__(self, name, age):
        """
        初始化人物对象

        参数:
            name: 姓名
            age: 年龄
        """
        self.name = name
        self.age = age

    def introduce(self):
        """介绍这个人"""
        return f"我叫{self.name}，今年{self.age}岁"

# 访问类的文档
print(Person.__doc__)

# 访问方法的文档
print(Person.introduce.__doc__)
```

**运行结果预期:**

```
人物类，用于表示一个人的基本信息
介绍这个人
```

### Docstring 规范

Python 中有多种 Docstring 风格，常用的有：

- **Google 风格** ：使用空格缩进，参数和返回值有明确的标签。
- **Sphinx/reST 风格** ：使用冒号开头，如 `:param name:`。
- **NumPy 风格** ：与 Google 风格类似，但格式略有不同。

建议在项目中选择一种风格并保持一致。

---

## 练习题

- [x] **1. 单行注释练习**
  创建文件 `test_comment.py`，完成以下操作：
  - 写一行注释说明程序功能
  - 写一个 print 语句输出 "Hello"
  - 再写一行注释

  **参考答案：**
  ```python
  # 这是我的第一个 Python 程序
  print("Hello")
  # 程序结束
  ```

- [x] **2. 多行注释练习**
  创建文件 `test_multiline.py`，用三种方式写注释：
  - 用 `#` 写三行单行注释
  - 用 `'''` 写多行注释
  - 用 `"""` 写多行注释

  **参考答案：**
  ```python
  # 第一行注释
  # 第二行注释
  # 第三行注释

  '''
  这是多行注释
  用三个单引号
  '''

  """
  这是多行注释
  用三个双引号
  """

  print("注释练习完成")
  ```

- [x] **3. Docstring 练习**
  创建文件 `test_docstring.py`，完成以下操作：
  - 写一个函数 `greet(name)`，功能是返回 `"你好，{name}！"`
  - 给函数添加 Docstring 说明
  - 用 `print(函数名.__doc__)` 打印文档

  **参考答案：**
  ```python
  def greet(name):
      """返回问候语"""
      return f"你好，{name}！"

  print(greet.__doc__)
  print(greet("小明"))
  ```

- [x] **4. 注释嵌套练习**
  创建文件 `test_nest.py`，完成以下操作：
  - 写一个多行注释 `''''''`
  - 在多行注释内部用 `#` 写单行注释
  - 观察是否能正常运行

  **参考答案：**
  ```python
  '''
  这是外部的多行注释
  # 这是内部的单行注释
  # 可以嵌套在多行注释中
  '''
  print("嵌套注释练习完成")
  ```

- [x] **5. 带 Docstring 的函数**
  创建文件 `test_func_doc.py`，完成以下操作：
  - 写一个函数 `add(a, b)`，返回两数之和
  - 添加详细的多行 Docstring，说明参数和返回值
  - 用 `help()` 查看文档

  **参考答案：**
  ```python
  def add(a, b):
      """
      计算两数之和

      参数:
          a: 第一个数字
          b: 第二个数字

      返回:
          两数之和
      """
      return a + b

  help(add)
  ```