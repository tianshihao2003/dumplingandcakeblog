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

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 异常（也叫 ____）是程序 ____ 过程中出现的错误，它会 ____ 程序的正常执行流程；异常的作用是保证数据、逻辑的 ____，并在开发阶段尽量 ____ 问题
2. 常见异常类型：变量或函数名不存在 ____、类型不匹配 ____、索引超出范围 ____、字典的键不存在 ____、值不合法 ____、访问不存在的属性（如 `"ABC".hello`）____
3. 处理异常有两种方案：____（整个程序因为一个 Bug 中断执行）和 ____（按预案处理，程序继续执行）
4. 语法结构：可能出错的业务代码写在 ____ 块里；出现异常时的预案写在 ____ 块里；不管是否出现异常都要执行的代码写在 ____ 块里
5. 捕获异常并拿到错误信息：`except ____ as ____:`
6. 要为不同异常写不同预案时，可以写多个 ____ 分支；兜底捕获所有异常写 `except ____ as e:`，它要放在 ____（最前面 / 最后面）
7. `finally` 是 ____（可有可无 / 必须写）的；无论程序 ____ 还是 ____，它里面的代码都会执行，常用来 ____
8. 异常传递：异常会从 ____ 的地方沿着函数 ____ 向上传递；如果每一层都没捕获，最终会 ____；如果某一层捕获了，程序可以 ____
9. 笔记示例里的捕获顺序是 NameError → ZeroDivisionError → IndexError → Exception，说明：越具体的异常类型要写在越 ____（前 / 后）面，兜底的写在最后

> [!TIP]- 填空答案（做完再点开）
> 1. Bug、运行、中断 / 正确性、发现　2. NameError、TypeError、IndexError、KeyError、ValueError、AttributeError　3. 不做处理、捕获异常　4. try、except、finally　5. 异常类型、变量名（如 `e`）　6. except、Exception、最后面　7. 可有可无 / 正常执行（没出异常）、出现异常 / 释放资源　8. 发生错误、调用链 / 程序崩溃 / 继续执行　9. 前

### 二、裸写题

- [ ] **2-1 基础捕获**
  写一段代码：打印分隔线 → 打印一个不存在的变量 → 再打印分隔线。用捕获结构处理这个"名字不存在"的错误，打印"程序运行报错，错误信息：xxx"，并加上收尾块打印"释放资源 ~"。运行后观察：报错那行后面的分隔线有没有打印出来？

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：可能出错的代码放一个块，出错的预案放另一个块，收尾代码再放一个块
  > **二级 · 方法**：`try` / `except 异常类型 as e` / `finally`
  > **三级 · 骨架**：`except ____ as e:` / `finally:`（"名字不存在"的异常类型是 NameError）

- [ ] **2-2 一份代码里捕获多种异常**
  1. 写一段业务代码，依次可能触发三种错误：取列表的第 10 个元素（列表只有 3 个元素）、取字典里不存在的键、用一个数除以 0
  2. 每种错误写一个单独的捕获分支，分别打印中文提示 + 错误信息
  3. 最后加一个兜底分支捕获其它所有异常，打印"程序运行出错了，请联系管理员，错误信息：xxx"
  4. 加上收尾块打印"资源释放 ~"
  5. 运行后想一想：三个错误会依次都触发吗？第一个错误发生后，后面的代码还会不会往下走？

  > [!TIP]- 提示
  > **一级 · 思路**：一个 try 可以配多个 except，按异常类型从上往下匹配，匹配上就跳出去，不会回到出错的那一行继续
  > **二级 · 方法**：`except IndexError as e` / `except KeyError as e` / `except ZeroDivisionError as e` / `except Exception as e`
  > **三级 · 骨架**：`except ____ as e:  # 索引错误` / `except ____ as e:  # 兜底，放最后`

- [ ] **2-3 异常的传递**
  1. 写三个函数 `fun1()` → 调用 `fun2()` → 调用 `fun3()`，每个函数进来先打印一行 `xxx running ...`
  2. 在 `fun3()` 里访问一个不存在的变量，制造异常
  3. 先在主程序里直接调用 `fun1()`，运行并观察报错信息里显示的调用链顺序
  4. 再把调用放进捕获结构里（在最外层捕获），打印"在最外层捕获到异常：xxx"，观察程序不再崩溃

  > [!TIP]- 提示
  > **一级 · 思路**：底层函数不处理，异常就沿着"谁调用了我"一层层往上报，谁接住谁负责
  > **二级 · 方法**：`if __name__ == "__main__":` 里写 `try: fun1()` + `except NameError as e`
  > **三级 · 骨架**：`def fun3(): print(my_color)` 制造异常；报错信息最后一行就是异常类型和说明

> [!TIP]- 参考答案（做完再点开）
> ```python
> # 2-1
> try:
>     print("=" * 30)
>     print(my_name)          # 变量不存在 → NameError
>     print("=" * 30)         # 这行不会执行（出错后直接跳到 except）
> except NameError as e:
>     print("程序运行报错，错误信息：", e)
> finally:
>     print("释放资源 ~")
>
> # 2-2
> try:
>     print("=" * 30)
>     print([1, 2, 3][10])          # 索引越界 → IndexError
>     print({"a": 1}["b"])          # 键不存在 → KeyError
>     print(1 / 0)                  # 除零 → ZeroDivisionError
>     print("=" * 30)
> except IndexError as e:
>     print("索引错误，请检查下标是否越界，异常信息：", e)
> except KeyError as e:
>     print("键不存在，请检查字典的键，异常信息：", e)
> except ZeroDivisionError as e:
>     print("0 不能做除数，异常信息：", e)
> except Exception as e:
>     print("程序运行出错了，请联系管理员，错误信息：", e)
> finally:
>     print("资源释放 ~")
> # 实际只会走到第一个出错的那行：先报 IndexError，剩下两行不会执行
>
> # 2-3
> def fun1():
>     print("fun1 ... running ...")
>     fun2()
>
> def fun2():
>     print("fun2 ... running ...")
>     fun3()
>
> def fun3():
>     print("fun3 ... running ...")
>     print(my_color)          # 异常发生在这里
>
> if __name__ == "__main__":
>     try:
>         fun1()
>     except NameError as e:
>         print("在最外层捕获到异常：", e)
>     finally:
>         print("资源释放 ~")
> # 不捕获时，报错信息里的调用链是：<module> → fun1 → fun2 → fun3
> ```

### 三、综合题

- [ ] **3-1 批量数据体检**
  把异常类型、多分支捕获、兜底和收尾块串成一个能用的小工具：
  1. 准备一个列表，放 5 条"待处理数据"：2 条正常的数字字符串（如 `"88"`、`"92"`）、1 条不能转成数字的字符串（如 `"abc"`）、1 条空字符串、1 个数字 `0`
  2. 循环处理每条数据：先把它转成整数，再用 `100` 除以它，成功就打印算式和结果
  3. 用捕获结构分别处理"转不成数字"和"除数为 0"两类错误，每条错误打印提示后继续处理下一条（不要让程序崩掉）
  4. 统计成功条数，循环结束后打印"处理完成，成功 N 条"
  5. 加一个收尾块，每处理一条就打印一行分隔线，观察它是不是成功失败都会执行

  > [!TIP]- 提示
  > **一级 · 思路**：把 try 写在循环里面，一条数据出错只影响这一条；转整数和做除法分别会抛不同的异常
  > **二级 · 方法**：`int(文本)` 抛 `ValueError`；除以 0 抛 `ZeroDivisionError`；`finally` 放在 except 之后
  > **三级 · 骨架**：`for item in raw_data:` → `try:` → `num = int(item)` → `result = 100 / num`；`except ____ as e:` / `except ____ as e:` / `finally: print("-" * 30)`

> [!TIP]- 参考答案（做完再点开）
> ```python
> raw_data = ["88", "abc", "0", "", "92"]
>
> success = 0
> for item in raw_data:
>     try:
>         num = int(item)             # "abc"、"" 转不了 → ValueError
>         result = 100 / num          # 除数为 0 → ZeroDivisionError
>         print(f"「{item}」通过：100 ÷ {num} = {result:.2f}")
>         success += 1
>     except ValueError as e:
>         print(f"「{item}」不能转成数字，跳过。异常信息：{e}")
>     except ZeroDivisionError as e:
>         print(f"「{item}」是 0，不能做除数，跳过。异常信息：{e}")
>     except Exception as e:
>         print(f"「{item}」出现其它错误，跳过。异常信息：{e}")
>     finally:
>         print("-" * 30)             # 每条数据成功失败都会执行
>
> print(f"处理完成，成功 {success} 条")
> # 运行结果：88 和 92 通过，abc / 空字符串 / 0 各自被对应分支拦下，最后打印"成功 2 条"
> ```
