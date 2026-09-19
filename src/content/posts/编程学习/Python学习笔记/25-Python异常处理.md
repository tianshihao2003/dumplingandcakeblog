---
title: Python异常处理
published: 2026-09-16
tags:
  - Python
  - 异常处理
description: Python异常的概念、异常处理语法、捕获多种异常、finally关键字、异常的传递
order: 25
---

## 什么是异常

异常（也称为Bug）就是程序运行过程中出现的错误，它会中断程序的正常执行流程。

### 异常的作用

- 保证数据、逻辑的正确性，避免程序执行混乱
- 在开发阶段，尽量发现更多的问题，尽早解决问题，保障程序正常执行

### 常见异常类型

| 异常类型 | 说明 |
| --- | --- |
| NameError | 名称错误（变量或函数名不存在） |
| TypeError | 类型错误（类型不匹配） |
| IndexError | 索引错误（索引超出范围） |
| KeyError | 键错误（字典的键不存在） |
| ValueError | 值错误（值不合法） |

> **异常不是坏东西，而是编写健壮程序的重要工具**

---

## 异常处理

程序运行过程中出现异常，有两种处理方案：

1. **不做处理**：整个程序因为一个Bug，中断执行。（之前编程的程序）
2. **捕获异常**：按照我们自己的处理方式，处理完异常，程序继续执行。（编写程序时，做好预案，出现异常，按预案处理）

### 语法格式

```python
try:
    可能出现异常的业务代码1
    可能出现异常的业务代码2
    ...
except [异常类型 as 变量名]:
    出现异常时的预案
[finally:
    不管是否出现异常，都会执行的代码]
```

### 示例1：基础用法

```python
try:
    print("=" * 30)
    print(my_name)
    print("=" * 30)
except NameError as e:
    print("程序运行报错，错误信息：", e)
finally:
    print("释放资源 ~")
```

### 示例2：捕获多种异常

```python
try:
    print("=" * 30)
    # print(my_name)        # NameError
    # print(1 / 0)          # ZeroDivisionError
    # print("ABC"[10])      # IndexError
    print("ABC".hello)      # AttributeError
    print("=" * 30)
except NameError as e:  # 捕获的是 NameError 类型的异常
    print("名字不存在，请检查变量或函数名字，异常信息：", e)
except ZeroDivisionError as e:
    print("0不能做被除数，异常信息：", e)
except IndexError as e:
    print("索引错误，异常信息：", e)
except Exception as e:  # 捕获所有的异常
    print("程序运行出错了，请联系管理员，错误信息：", e)
finally:  # 无论程序是否正常运行，finally代码块中的代码都会运行
    print("资源释放 ~")
```

---

## 异常处理小结

1. **为什么要捕获异常？**
   - 当程序运行出现异常，提供预案，处理异常，而不是让其中止程序运行

2. **如何捕获异常，具体的语法？**
   ```python
   try:
       print("ABC".hello)
   except NameError as e:
       print("名称不存在，请检查，具体信息：", e)
   except ZeroDivisionError as e:
       print("0不能做被除数，请检查，具体信息：", e)
   except IndexError as e:
       print("索引错误，请检查，具体信息：", e)
   except Exception as e:
       print("其他错误，请检查，具体信息：", e)
   finally:
       print("无论正常执行还是出现异常，都要释放资源 ~")
   ```

> **`finally` 是可有可无的**

---

## 异常的传递

异常传递就是异常在函数调用中层层上报的过程，直到有人处理它，或者程序崩溃。

### 示例

```python
def fun1():
    print("fun1 ... running ...")
    fun2()

def fun2():
    print("fun2 ... running ...")
    fun3()

def fun3():
    print("fun3 ... running ...")
    print(my_color)  # 异常发生在这里

if __name__ == '__main__':
    fun1()
```

### 异常传递流程

```
__main__ (fun1调用)
    ↓
fun1() (fun2调用)
    ↓
fun2() (fun3调用)
    ↓
fun3() (print(my_color) 报错)
    ↑
    │ 异常向上传递
    │
Exception被捕获或程序崩溃
```

### 异常传递说明

- 异常会从发生错误的地方，沿着函数调用链**向上传递**
- 如果每一层都没有捕获异常，最终会导致程序崩溃
- 如果某一层捕获了异常，程序可以继续执行

---

## 总结口诀

- **异常**：程序出错别害怕，捕获处理顶呱呱
- **try**：可能出现异常的代码放里面
- **except**：出现异常怎么办，预案写在后面
- **as e**：异常信息拿来看看，方便排查问题
- **finally**：不管出不出错，资源释放要做
- **Exception**：兜底捕获所有异常，放最后面
- **异常传递**：层层上报找人处理，没人处理程序崩
