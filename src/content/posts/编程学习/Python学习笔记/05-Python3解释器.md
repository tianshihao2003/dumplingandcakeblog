---
title: Python3 解释器
published: 2026-09-14
tags:
  - Python
description: Python3 解释器的启动方式、交互式编程和脚本式编程
order: 5
---
Linux/Unix的系统上，一般默认的 python 版本为 2.x，我们可以将 python3.x 安装在 **/usr/local/python3** 目录中。

安装完成后，我们可以将路径 **/usr/local/python3/bin** 添加到您的 Linux/Unix 操作系统的环境变量中，这样您就可以通过 shell 终端输入下面的命令来启动 Python3 。

```bash
$ PATH=$PATH:/usr/local/python3/bin/python3    # 设置环境变量
$ python3 --version
Python 3.4.0
```

在Window系统下你可以通过以下命令来设置Python的环境变量，假设你的Python安装在 C:\Python34 下:

```cmd
set path=%path%;C:\python34
```

---

## 交互式编程

我们可以在命令提示符中输入"Python"命令来启动Python解释器：

```bash
$ python3
```

执行以上命令后，出现如下窗口信息：

```bash
$ python3
Python 3.4.0 (default, Apr 11 2014, 13:05:11) 
[GCC 4.8.2] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

在 python 提示符中输入以下语句，然后按回车键查看运行效果：

```python
print("Hello, Python!")
```

以上命令执行结果如下：

```
Hello, Python!
```

当键入一个多行结构时，续行是必须的。我们可以看下如下 if 语句：

```python
>>> flag = True
>>> if flag :
...     print("flag 条件为 True!")
... 
flag 条件为 True!
```

---

## 脚本式编程

将如下代码拷贝至 **hello.py** 文件中：

```python
print("Hello, Python!")
```

通过以下命令执行该脚本：

```bash
python3 hello.py
```

输出结果为：

```
Hello, Python!
```

在Linux/Unix系统中，你可以在脚本顶部添加以下命令让Python脚本可以像SHELL脚本一样可直接执行：

```python
#! /usr/bin/env python3
```

然后修改脚本权限，使其有执行权限，命令如下：

```bash
$ chmod +x hello.py
```

执行以下命令：

```bash
./hello.py
```

输出结果为：

```
Hello, Python!
```

---

## 练习题

- [x] **1. 启动 Python 交互式环境**
  打开命令提示符（CMD），输入 `python` 启动 Python 交互式环境，然后：
  - 输入 `1 + 1` 查看结果
  - 输入 `print("Hello")` 查看结果
  - 输入 `exit()` 退出

  **参考答案：**
  ```bash
  # 在 CMD 中操作：
  C:\> python
  Python 3.13.0 (tags/v3.13.0:60403a5, Oct 07 2024, 09:38:07) [MSC v.1941 64 bit (AMD64)] on win32
  Type "help", "copyright", "credits" or "license" for more information.
  >>> 1 + 1
  2
  >>> print("Hello")
  Hello
  >>> exit()
  ```

- [x] **2. 交互式模式下输入多行代码**
  在 Python 交互式环境中，输入以下多行 if 语句：
  ```python
  x = 10
  if x > 5:
      print("大于5")
      print("结束")
  ```
  注意：输入 `if x > 5:` 后按回车，会出现 `...` 提示符，继续输入，最后按两次回车执行。

  **参考答案：**
  ```python
  >>> x = 10
  >>> if x > 5:
  ...     print("大于5")
  ...     print("结束")
  ...
  大于5
  结束
  ```

- [x] **3. 创建并运行第一个 Python 脚本**
  用记事本创建文件 `hello.py`，写入以下内容：
  ```python
  print("Hello, Python!")
  print("这是我的第一个脚本")
  ```
  然后在 CMD 中用 `python hello.py` 运行它。

  **参考答案：**
  ```bash
  # 在 CMD 中：
  C:\> python hello.py
  Hello, Python!
  这是我的我的第一个脚本
  ```

- [x] **4. 查看 Python 版本**
  在 CMD 中执行以下命令，查看 Python 版本信息：
  ```bash
  python --version
  python -V
  ```

  **参考答案：**
  ```bash
  C:\> python --version
  Python 3.13.0
  
  C:\> python -V
  Python 3.13.0
  ```

- [x] **5. 使用交互式模式进行计算**
  在 Python 交互式环境中，完成以下计算：
  - 计算 `100 / 3`（保留小数）
  - 计算 `100 // 3`（整除）
  - 计算 `2 ** 10`（乘方）
  - 用 `type()` 查看结果类型

  **参考答案：**
  ```python
  >>> 100 / 3
  33.333333333333336
  >>> type(100 / 3)
  <class 'float'>
  >>> 100 // 3
  33
  >>> type(100 // 3)
  <class 'int'>
  >>> 2 ** 10
  1024
  >>> type(2 ** 10)
  <class 'int'>
  ```

- [x] **6. 多行循环练习**
  在交互式环境中，输入一个 for 循环，打印 1 到 5：
  ```python
  for i in range(1, 6):
      print(i)
  ```
  记住：最后要按两次回车才能执行。

  **参考答案：**
  ```python
  >>> for i in range(1, 6):
  ...     print(i)
  ...
  1
  2
  3
  4
  5
  ```