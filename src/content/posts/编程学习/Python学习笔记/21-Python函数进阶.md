---
title: Python函数进阶
published: 2026-09-16
tags:
  - Python
  - 函数
description: Python变量作用域、参数详解（位置参数、关键字参数、默认参数、不定长参数）、函数作为参数、匿名函数
image: https://img.tsh520.cn/file/blog/post-covers/python-21-advanced-function.webp
order: 21
---

## 变量作用域

变量的作用域指的是变量的作用范围（标识这个变量在哪里可以使用，在哪儿不可以使用）。

### 全局变量

在函数之外定义的变量，称之为全局变量，在整个文件中（包括函数内）都可以使用（通常定义在文件的顶部）。

### 局部变量

在函数内部定义的变量，称之为局部变量，只能在该函数内部使用，外部无法访问（函数执行完毕后，会自动销毁其内部局部变量）。

### 示例

```python
# 定义函数
num = 100  # 全局变量
def circle_area(r):
    pi = 3.14
    area = pi * r * r  # 局部变量
    return area

count = 0  # 全局变量
# 调用函数
c_area = circle_area(10)
print(c_area)
```

---

## global关键字

`global` 关键字用于明确的告诉Python解释器，在函数中要使用全局变量，使得可以在函数内部修改全局变量的值。

### 示例1：不使用global（无法修改全局变量）

```python
num1 = 1  # 全局变量

def fun1():
    num1 = 100  # 局部变量，只是新建了一个同名的局部变量
    print(num1)

fun1()  # 100
print(num1)  # 1（全局变量未被修改）
```

### 示例2：使用global（可以修改全局变量）

```python
num1 = 1  # 全局变量

def fun1():
    global num1  # 告诉python解释器，函数中使用全局变量num1
    num1 = 100  # 修改全局变量num1
    print(num1)

fun1()  # 100
print(num1)  # 100（全局变量被修改）
```

### 注意事项

- 在基于 `global` 声明全局变量时，要**先声明，再使用**

---

## 变量作用域小结

1. **什么是局部变量，全局变量？**
   - 在函数内部定义的变量就是局部变量，函数外声明的变量是全局变量

2. **global关键字的作用？**
   - 在函数内部使用，声明接下来要使用的是全局变量，语法：`global xxx`

3. **注意事项**
   - 尽量避免在函数中使用全局变量，因为会使代码难以维护和调试
   - 考虑使用函数参数和返回值来传递数据，而不是依赖全局变量
   - `global` 主要用在程序的状态、配置和计数器等场景中

---

## 函数传参方式

传参方式指的是，在调用函数时，传递实参的方式。

### 1. 位置参数

调用函数时根据函数定义时的位置来传递参数。

```python
# 定义函数
def reg_stu(name, age, gender, city):
    print(f"注册成功,姓名:{name}，年龄:{age}，性别:{gender}，城市:{city}")
    return {"name": name, "age": age, "gender": gender, "city": city}

# 调用函数（顺序必须与定义一致）
stu = reg_stu("张三", 18, "男", "北京")
print(stu)
```

**要求**：调用函数时参数顺序与定义函数时参数顺序**完全一致**

### 2. 关键字参数

调用函数时以函数定义时形参名称作为关键字，以 `"键=值"` 的形式来传递参数（不要求顺序）。

```python
# 定义函数
def reg_stu(name, age, gender, city):
    print(f"注册成功,姓名:{name}，年龄:{age}，性别:{gender}，城市:{city}")
    return {"name": name, "age": age, "gender": gender, "city": city}

# 调用函数（顺序可以不一致）
stu = reg_stu(name="张三", age=18, gender="男", city="北京")
print(stu)

stu2 = reg_stu(gender="男", name="王武", city="上海", age=22)
print(stu2)
```

### 3. 位置参数与关键字参数混用

```python
# 位置参数在前，关键字参数在后
stu = reg_stu("赵四", 28, gender="男", city="上海")
print(stu)
```

**要求**：如果位置参数与关键字参数混用，**关键字参数必须在位置参数之后**（关键字参数之间，没有顺序要求）

---

## 位置参数 vs 关键字参数

| 对比项 | 位置参数 | 关键字参数 |
| --- | --- | --- |
| 优点 | 简洁 | 可读性强、易维护和扩展 |
| 缺点 | 可读性差、易出错、维护难 | 代码繁琐 |
| 适用场景 | 参数少（不超过3个），且顺序自然 | 参数较多，或易混淆的场景 |

```python
# 位置参数（简洁但可读性差）
s = calc(87, 68, 92, 85)

# 关键字参数（可读性强）
s = calc(math=87, chinese=68, english=92, computer=85)
```

> **黄金法则**：半年后回头看你今天写的代码，能否一眼看出每个参数的含义，如果不能，就应该使用关键字参数。

---

## 传参方式小结

1. **位置参数**
   - 调用函数时，传入的实参的顺序与定义函数时形参的顺序完全一致

2. **关键字参数**
   - 调用函数时，通过 `"形参名=值"` 的形式传递参数，顺序没有要求
   - 如果同时存在位置参数与关键字参数，位置参数在前，关键字参数在后

3. **两种传参方式的适用场景**
   - 一切以代码结构清晰明了（可读性）、便于维护（维护性）为目标
   - 如果参数比较少（不超过3个），可直接使用位置参数
   - 如果参数数量较多，建议使用关键字参数

---

## 默认参数

默认参数也称为缺省参数，用于在定义函数时，为参数提供默认值，调用函数时，可以不传递有默认值的参数。

```python
# 定义函数（city有默认值'北京'）
def reg_stu(name, age, gender, city='北京'):
    print(f"注册成功,姓名:{name}，年龄:{age}，性别:{gender}，城市:{city}")
    return {"name": name, "age": age, "gender": gender, "city": city}

# 调用函数（不传city，使用默认值）
stu = reg_stu("张三", 18, "男")
print(stu)  # 城市:北京

# 调用函数（传city，覆盖默认值）
stu = reg_stu("赵四", 22, "男", "深圳")
print(stu)  # 城市:深圳
```

### 注意事项

- 默认参数必须放在没有默认值的参数列表的后面，一个函数在定义时是可以设置多个默认参数的
- 函数调用时，如果为默认参数传递了值，则会修改默认的参数值；如果没有传递该参数，则直接使用默认值

---

## 不定长参数

当参数个数不确定时，可以使用不定长参数解决这类问题。

### 1. 位置传递（*args）

传递的所有匹配的位置参数都会被 `args` 变量收集，这些参数会合并封装为一个**元组**（注意并不会封装关键字参数）。

```python
# 定义函数
def calc_data(*args):
    min_data = min(args)
    max_data = max(args)
    avg_data = sum(args) / len(args)
    return min_data, max_data, round(avg_data, 1)

# 调用函数
data = calc_data(10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
print(data)  # (10, 100, 55.0)

data = calc_data(100, 200, 300, 400, 500)
print(data)  # (100, 500, 300.0)
```

### 注意事项

- `args` 只是约定俗成的变量名，并不是关键字，这里可以使用任何合法的变量名（如 `*data`）

### 2. 关键字传递（**kwargs）

参数是以 `"键=值"` 形式传递的关键字参数，这些 `"键=值"` 参数都会被 `kwargs` 接受，并合并封装为一个**字典**类型。

```python
# 定义函数
def calc_data(*args, **kwargs):
    min_data = min(args)
    max_data = max(args)
    avg_data = sum(args) / len(args)
    
    if kwargs.get('round'):
        avg_data = round(avg_data, kwargs.get('round'))
    
    return min_data, max_data, avg_data

# 调用函数（带配置参数）
data = calc_data(100, 200, 300, 400, round=2, count=0)
print(data)  # (100, 400, 250.0)

# 调用函数（不带配置参数）
data = calc_data(33, 11, 28, 91, 32, 75, 49)
print(data)  # (11, 91, 45.6)
```

### 注意事项

- `kwargs` 只是约定俗成的变量名，并不是关键字，这里可以使用任何合法的变量名（如 `**options`）

### 不定长参数小结

1. **什么是不定长参数？**
   - 参数个数不确定，此时就可以使用不定长参数解决这类问题

2. **不定长参数的分类？**
   - `*args`：不定长位置参数，函数调用时，通过位置参数传递多个参数封装到一个元组(tuple)中
   - `**kwargs`：不定长关键字参数，函数调用时，通过关键字参数传递多个参数封装到一个字典(dict)中

3. ***args与**kwargs的应用场景？**
   - `*args` 适用于处理数量不确定的数据（核心数据）
   - `**kwargs` 适用于处理数量不确定的选项（函数的配置参数，用来定制函数的行为）

```python
# 核心数据：你要什么
点奶茶("珍珠奶茶")

# 选项：你要什么样的
点奶茶("珍珠奶茶", 甜度="少糖", 冰度="去冰", 加料=["布丁", "珍珠"], 大小="大杯")
```

---

## 函数作为参数

普通参数：数字、布尔、字符串、列表、元组、集合、字典等。

特殊参数：**函数**。

```python
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def calc(x, y, oper):
    return oper(x, y)

# 传递的是函数中封装的逻辑
result = calc(10, 20, add)
print(result)  # 30

result = calc(10, 20, subtract)
print(result)  # -10
```

---

## 匿名函数

匿名函数指的是没有名称的函数，需要通过 `lambda` 表达式来声明函数，可以简化简单函数的编写（单行表达式）。

### 定义语法

```python
lambda 参数列表 : 函数体
```

### 示例对比

```python
# 命名函数
def out_line():
    print('-------------------------')

def add(x, y):
    return x + y

out_line()
print(add(10, 20))


# 匿名函数
out_line = lambda : print('-------------------------')
add = lambda x, y: x + y

out_line()
print(add(100, 200))
```

### 注意事项

- 函数逻辑比较简单（单行表达式）且只在一个地方使用时，可以考虑使用匿名函数，简化书写（通常作为高阶函数的参数使用）
- 匿名函数中可以返回结果，也可以不返回结果。返回结果时，不需要写 `return`，表达式的运行结果就是要返回的结果

### 匿名函数小结

1. **匿名函数的定义方式**
   ```python
   lambda 参数列表 : 函数体
   ```

2. **命名函数与匿名函数的选择？**
   - 建议使用匿名函数的情况：函数逻辑简单，只在一个地方调用（常作为高阶函数的参数）
   - 建议使用命名函数的情况：函数逻辑复杂，需要多步操作，需要多个地方重复使用或需要加文档说明的场景

> **代码的可读性和可维护性比简洁性更重要**

---

## 总结口诀

- **作用域**：函数外定义全局用，函数内定义局部用
- **global**：想改全局先声明，global放在函数中
- **位置参数**：按顺序传，简洁但要记清楚
- **关键字参数**：键值对传，顺序随意可读性强
- **默认参数**：给个默认值，不传就用它
- **不定长参数**：*args收元组，**kwargs收字典
- **匿名函数**：lambda一行写，简单场景用它

---

## 练习题

- [x] **1. 三角形类型判断**
  定义一个函数 `triangle_type(a, b, c)`，根据传入的三个边长判定三角形类型：
  - 等边三角形：三边相等
  - 等腰三角形：两边相等
  - 普通三角形：三边都不相等
  - 不能构成三角形：任意两边之和小于等于第三边

  **知识点：** 多参数函数、if-elif-else 条件判断、return 返回字符串

  **参考答案：**
  ```python
  def triangle_type(a, b, c):
      if a + b > c and a + c > b and b + c > a:
          if a == b == c:
              return "等边三角形"
          elif a == b or a == c or b == c:
              return "等腰三角形"
          else:
              return "普通三角形"
      else:
          return "不能构成三角形"

  print(triangle_type(3, 4, 5))    # 普通三角形
  print(triangle_type(3, 3, 5))    # 等腰三角形
  print(triangle_type(8, 8, 8))    # 等边三角形
  print(triangle_type(3, 4, 7))    # 不能构成三角形
  ```

- [x] **2. 成绩统计函数**
  定义一个函数 `calc_stats(*scores)`，接收任意数量的成绩，返回最高分、最低分、平均分。

  **知识点：** 不定长参数 `*args`、内置函数 max/min/sum/len、return 多个返回值

  **参考答案：**
  ```python
  def calc_stats(*scores):
      return max(scores), min(scores), round(sum(scores) / len(scores), 1)

  highest, lowest, avg = calc_stats(85, 92, 78, 96, 88)
  print(f"最高分: {highest}, 最低分: {lowest}, 平均分: {avg}")
  ```

- [x] **3. 学生信息注册**
  定义一个函数 `register(name, age, gender, city='北京')`，使用默认参数，返回学生信息字典。

  **知识点：** 默认参数、return 返回字典

  **参考答案：**
  ```python
  def register(name, age, gender, city='北京'):
      return {"name": name, "age": age, "gender": gender, "city": city}

  # 使用默认值
  stu1 = register("张三", 18, "男")
  print(stu1)  # {'name': '张三', 'age': 18, 'gender': '男', 'city': '北京'}

  # 覆盖默认值
  stu2 = register("李四", 20, "女", "上海")
  print(stu2)  # {'name': '李四', 'age': 20, 'gender': '女', 'city': '上海'}
  ```
