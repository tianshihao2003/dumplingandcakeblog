---
title: Python面向对象编程基础
published: 2026-09-16
tags:
  - Python
  - 面向对象
  - 类
  - 对象
description: Python面向对象编程基础，包括面向过程与面向对象对比、类与对象、类的定义、实例方法、魔法方法、实例属性与类属性
image: https://img.tsh520.cn/file/blog/post-covers/python-24-oop.webp
order: 24
---

## 面向过程编程

核心思想：把一个需求分解成一系列要执行的步骤，然后按照步骤依次执行这些任务（关注的是**流程、步骤**）。

适用场景：面向过程编程非常直接，适合**简单、线性**的任务。

### 示例：建筑施工流程

```
平整地基 → 地基打桩 → 地基浇筑 → 主体施工 → 砌墙施工 → 外墙施工 → 室内硬装 → 室内软装
```

---

## 面向对象编程

对象可以理解为现实中具体的人/物在程序中的数字化身（**万物皆对象**）。

它把一个人/物的特征和功能打包到一起，是面向对象编程的基本单元（关注的是**谁来帮我做这件事儿**）。

- **特征** = 属性
- **功能** = 方法

### 示例

| 对象 | 属性 | 方法 |
| --- | --- | --- |
| 挖掘机 | 颜色、油耗、马力 | 推平、挖掘 |
| 混凝土车 | 容量、颜色、臂长 | 搅拌、运输、浇筑 |
| 工人 | 工种、年龄、工服颜色、技能 | 打桩、砌墙、浇筑、装修 |
| 建材 | 类型、数量、价格、材质 | 存储、运输、焊接、铺贴 |

---

## 类与对象

**类**：描述的是一组具有相同属性（特征）和方法（功能/行为）的模板。

**对象**：对象是类的实例，是基于类创建出来的（实例对象）。

### 示例

- **类**：月饼模具（属性：颜色、形状、大小、厚度；功能：提供能量、文化传承）
- **对象**：用模具制作出来的月饼（每个月饼颜色可能不同）

> 提示：对象是由类创建出来的，创建对象的过程，也称为对象的实例化。一个类可以创建无数个对象。

---

## 目录

- 类与对象
- 实例方法
- 魔法方法
- 实例属性与类属性
- 案例

---

## 类的定义

### 语法格式

```python
# 定义类
class 类名:
    pass
```

### 方式1：动态添加属性（不推荐）

```python
# 定义类
class Car:
    pass

# 创建对象
c1 = Car()
c1.brand = "BMW"
c1.name = "X5"
c1.price = 500000
print(c1.__dict__)  # {'brand': 'BMW', 'name': 'X5', 'price': 500000}
```

### 方式2：定义类时指定实例属性（推荐）

```python
# 定义类
class Car:
    def __init__(self, c_brand, c_name, c_price):
        self.brand = c_brand
        self.name = c_name
        self.price = c_price

# 创建对象
c1 = Car("BMW", "X5", 500000)
print(c1.__dict__)  # {'brand': 'BMW', 'name': 'X5', 'price': 500000}
```

### 重要概念

- **`self`**：方法的第一个参数，表示当前创建的实例对象
- **`__init__`**：初始化方法，对象创建后自动调用，主要用于设置对象的初始状态（设置对象属性）

> 说明：定义在类的外面的称之为函数，定义在类中的函数称之为方法

### 完整示例

```python
# 定义类
class Car:
    def __init__(self, c_color, c_brand, c_name, c_price):
        self.color = c_color
        self.brand = c_brand
        self.name = c_name
        self.price = c_price
        print("Car 类型的对象初始化完毕，对象属性已经添加完毕.")

# 创建对象
c1 = Car(c_color="红色", c_brand="BMW", c_name="X7", c_price=800000)
print(c1.__dict__)

c2 = Car(c_color="白色", c_brand="奔驰", c_name="E300", c_price=450000)
print(c2.__dict__)
```

---

## 类的定义小结

1. **定义类时，类名的命名规范？**
   - 大驼峰命名法，如 `UserInfo`、`UserAccount`

2. **定义类时，`__init__`方法的作用？self参数的作用？**
   - `__init__` 是初始化方式，对象创建时自动调用，主要用于设置对象的初始状态（设置对象属性）
   - `self` 是类中定义的方法的第一个参数，表示当前创建的实例对象

---

## 实例方法

在类中定义实例方法时，定义语法与之前学习的函数定义的方式是一致的。

### 语法格式

```python
class 类名:
    def __init__(self, 形参列表):
        self.属性名 = 参数值
    
    def 方法名(self, 形参列表):
        ...
```

### 示例

```python
class Car:
    def __init__(self, brand, name, price):
        self.brand = brand
        self.name = name
        self.price = price
    
    def running(self):
        print(f"{self.brand} {self.name} 正在高速行驶...")
    
    def total_cost(self, discount, rate):
        return self.price * discount + self.price * rate

# 创建对象
c1 = Car("BMW", "X5", 500000)
total_cost = c1.total_cost(0.9, 0.1)
print(f"提车总价为：{total_price:.0f}")

c1.running()
```

> **注意**：`self` 表示当前实例对象，方法调用时无需传递

---

## 魔法方法

魔法方法是指Python中提供的以双下划线开头和结尾的特殊方法，用于定义类的特殊行为，比如：`__init__`。

**魔法方法是不需要我们手动调用的，Python会在合适的时机自动调用。**

### 常用魔法方法

| 魔法方法 | 描述 |
| --- | --- |
| `__init__` | 初始化方法 |
| `__str__` | 字符串表示的方法 |
| `__eq__` | 比较两个对象是否相等（equal） |
| `__lt__`、`__le__`、`__gt__`、`__ge__` | 支持比较两个对象的大小（小于、小于等于、大于、大于等于） |

### 示例

```python
class Car:
    def __init__(self, brand, name, price):
        self.brand = brand
        self.name = name
        self.price = price
    
    def running(self):
        print(f"{self.brand} {self.name} 正在高速行驶...")
    
    def __str__(self):
        return f"{self.brand} {self.name} {self.price}"
    
    def __eq__(self, other):
        return self.price == other.price and self.brand == other.brand and self.name == other.name
    
    def __lt__(self, other):
        return self.price < other.price

# 测试
c1 = Car("BMW", "X5", 500000)
print(c1)  # BMW X5 500000

c2 = Car("BMW", "X5", 500000)
print(c2)  # BMW X5 500000

print(c1 == c2)  # True
print(c1 < c2)   # False
```

---

## 魔法方法小结

1. **什么是魔法方法？**
   - Python中提供的 `__xxx__` 形式的特殊方法
   - 魔法方法无需手动调用，Python会在合适的时机自动调用

2. **常用的魔法方法有哪些，作用是什么？**
   - `__init__`：初始化方法
   - `__str__`：字符串表示
   - `__eq__`：判断相等
   - `__lt__`、`__le__`、`__gt__`、`__ge__`：比较大小

---

## 实例属性与类属性

属性分为：

- **实例属性**：实例属性属于每个具体对象的属性，每个对象都是独立的。（各个对象特有的数据）
- **类属性**：类属性是属于类本身的属性，所有实例共享的。（所有对象共享的数据或配置）

### 示例

```python
class Car:
    wheel = 4  # 轮胎数量（类属性）
    tax_rate = 0.1  # 购置税（类属性）
    
    def __init__(self, c_brand, c_name, c_price):
        self.brand = c_brand  # 实例属性
        self.name = c_name    # 实例属性
        self.price = c_price  # 实例属性
    
    def running(self):
        print(f"{self.brand} {self.name} 正在高速行驶...")

# 创建对象
c1 = Car("BYD", "汉", 180000)
c2 = Car("Tesla", "Model Y", 260000)

# 类属性：通过 类名.属性 的方式操作
print(Car.wheel)      # 4
print(Car.tax_rate)   # 0.1

# 实例属性：通过 实例对象.属性 的方式操作
print(c1.brand)       # BYD
print(c2.brand)       # Tesla
```

### 注意事项

- 通过实例查找属性时，会先查找实例属性，实例属性不存在时，再查找类属性

---

## 总结口诀

- **面向过程**：关注流程步骤，一步步来
- **面向对象**：关注谁来做，对象来帮忙
- **类是模板**：定义属性和方法
- **对象是实例**：用类创建出来
- **`__init__`**：初始化方法，创建时自动调
- **`self`**：代表自己，方法第一个参数
- **实例属性**：对象独有，各自独立
- **类属性**：大家共享，类名访问
- **魔法方法**：双下划线包围，自动调用不用管

---

## 综合练习：购物车管理系统

这个案例综合运用了类的定义、实例方法、魔法方法等知识点，是一个很好的面向对象编程练习。

### 案例需求

开发一个购物车管理系统，实现商品信息的添加、修改、删除、查询功能：

1. 添加购物车：录入商品名称、价格、数量
2. 修改购物车：根据商品名称修改价格和数量
3. 删除购物车：根据商品名称删除商品
4. 查询购物车：展示所有商品信息
5. 退出系统

### 分步引导

**第一步：定义商品类 Goods**
- 定义 `__init__` 方法，初始化 `name`、`price`、`num` 属性
- 定义 `__str__` 方法，返回商品信息字符串

**第二步：为商品类添加修改方法**
- 定义 `update_info` 方法，可以修改价格和数量
- 使用默认参数 `price=None, num=None`

**第三步：定义购物车类 ShoppingCart**
- 定义类属性 `system_version` 和 `system_name`
- 定义 `__init__` 方法，初始化空列表 `goods_list`

**第四步：实现添加商品功能**
- 获取用户输入的商品信息
- 检查商品是否已存在
- 创建 Goods 对象并添加到列表

**第五步：实现修改商品功能**
- 根据名称查找商品
- 调用商品的 `update_info` 方法

**第六步：实现删除商品功能**
- 根据名称查找商品
- 用 `remove()` 从列表中删除

**第七步：实现查询功能**
- 遍历列表，打印每个商品（会自动调用 `__str__` 方法）

**第八步：实现主循环**
- 用 `while True` 显示菜单
- 用 `match...case` 匹配用户选择

### 涉及知识点

| 知识点 | 在代码中的应用 |
|--------|----------------|
| 类的定义 | `class Goods:`、`class ShoppingCart:` |
| `__init__` 方法 | 初始化对象属性 |
| `__str__` 方法 | 自定义对象的字符串表示 |
| 实例方法 | `add_goods()`、`update_goods()` 等 |
| 类属性 | `system_version`、`system_name` |
| 实例属性 | `self.goods_list`、`self.name` |
| 列表 | 存储商品对象 |
| for 循环 | 遍历商品列表 |
| if 判断 | 检查商品是否存在 |
| match...case | 匹配用户选择 |

### 参考答案

```python
# 商品类
class Goods:
    def __init__(self, name, price, num):
        """初始化方法"""
        self.name = name
        self.price = price
        self.num = num

    def __str__(self):
        return f"商品名称: {self.name}, 商品价格: {self.price}, 商品数量: {self.num}"

    def update_info(self, price=None, num=None):
        """修改商品信息"""
        if price is not None:
            self.price = price
        if num is not None:
            self.num = num


# 购物车系统类
class ShoppingCart:
    system_version = "1.0"
    system_name = "购物车管理系统"

    def __init__(self):
        self.goods_list = []

    def add_goods(self):
        """添加商品"""
        name = input("请输入商品名称: ")
        for goods in self.goods_list:
            if goods.name == name:
                print("该商品已在购物车中，添加失败!")
                return

        price = float(input("请输入商品价格: "))
        num = int(input("请输入商品数量: "))

        if price >= 0 and num >= 0:
            goods = Goods(name, price, num)
            self.goods_list.append(goods)
            print("商品添加成功 ~")
        else:
            print("价格和数量必须为非负数!")

    def update_goods(self):
        """修改商品"""
        name = input("请输入要修改的商品名称: ")
        for goods in self.goods_list:
            if goods.name == name:
                print(f"当前商品信息: {goods}")
                price = float(input("请输入修改后的商品价格: "))
                num = int(input("请输入修改后的商品数量: "))
                if price >= 0 and num >= 0:
                    goods.update_info(price, num)
                    print("商品信息修改成功 ~")
                else:
                    print("价格和数量必须为非负数!")
                return
        print("未找到该商品，修改失败!")

    def delete_goods(self):
        """删除商品"""
        name = input("请输入要删除的商品名称: ")
        for goods in self.goods_list:
            if goods.name == name:
                self.goods_list.remove(goods)
                print("商品删除成功 ~")
                return
        print("未找到该商品，删除失败!")

    def query_all_goods(self):
        """查询所有商品"""
        if not self.goods_list:
            print("购物车为空!")
            return
        print("购物车中的商品信息:")
        print("-" * 40)
        for goods in self.goods_list:
            print(goods)
        print("-" * 40)
        print(f"总计商品数量: {len(self.goods_list)}")

    def run(self):
        """运行系统"""
        print(f"欢迎使用{ShoppingCart.system_name} V{ShoppingCart.system_version}")
        while True:
            print()
            print("# " * 35)
            print("#       1.添加商品  2.修改商品  3.删除商品  4.查询购物车  5.退出系统        #")
            print("# " * 35)
            choice = input("请选择要执行的操作，输入1-5: ")
            match choice:
                case "1": self.add_goods()
                case "2": self.update_goods()
                case "3": self.delete_goods()
                case "4": self.query_all_goods()
                case "5":
                    print("感谢使用购物车管理系统，再见!")
                    break
                case _: print("输入错误，请选择1-5之间的菜单功能!")


# 测试
if __name__ == '__main__':
    shopping_cart = ShoppingCart()
    shopping_cart.run()
```

---

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 面向过程编程关注 ____ 和 ____，适合 ____、____ 的任务；面向对象编程关注 ____，把对象的 ____ 和 ____ 打包到一起。
2. 对象的"特征"在程序里叫 ____，"功能"叫 ____；类是描述一组相同属性和方法的 ____，对象是类的 ____，创建对象的过程也叫对象的 ____。
3. 定义类的关键字是 ____，类名的命名规范是 ____（如 `UserInfo`）；定义在类外面的叫 ____，定义在类里面的叫 ____。
4. 初始化方法的名字是 ____，它在对象创建后 ____（自动 / 手动）调用，作用是设置对象的 ____；实例方法的第一个参数是 ____，它表示当前创建的 ____；调用实例方法时 ____（需要 / 不需要）手动传这个参数，在方法里定义实例属性写 `self.____ = 值`。
5. 魔法方法的名字以 ____ 开头和结尾；____ 定义对象的字符串表示；____ 判断两个对象是否相等；____、____、____、____ 分别支持小于、小于等于、大于、大于等于的比较。
6. 魔法方法 ____（需要 / 不需要）手动调用，Python 会在 ____ 的时机自动调用：比如打印对象时自动用上 ____ 方法、两个对象比大小时自动用上 ____ 方法。
7. ____ 属性属于每个具体对象、各自独立；____ 属性属于类本身、所有实例共享；类属性通过 ____ 访问，实例属性通过 ____ 访问；通过实例查属性时先找 ____ 属性，找不到再找 ____ 属性。
8. 购物车案例：商品类用 ____ 方法初始化名称、价格、数量；修改商品信息的 `update_info` 用了默认参数 ____ 和 ____；购物车类用类属性存 ____ 和 ____，用实例属性存 ____ 列表；遍历打印商品时会自动调用 ____ 方法。

> [!TIP]- 填空答案（做完再点开）
> 1. 流程、步骤；简单、线性；谁来帮我做这件事；特征（属性）、功能（方法）
> 2. 属性、方法；模板；实例（实例对象）；实例化
> 3. class、大驼峰命名法；函数、方法
> 4. `__init__`、自动、初始状态（属性）；self、实例对象；不需要、属性名
> 5. 双下划线（`__`）、`__str__`、`__eq__`、`__lt__`、`__le__`、`__gt__`、`__ge__`
> 6. 不需要、合适；`__str__`、`__lt__`
> 7. 实例、类、类名、实例对象；实例、类
> 8. `__init__`、price、num、system_version、system_name、goods_list、`__str__`

### 二、裸写题

- [ ] **2-1 定义第一个类**
  定义一个表示"学生"的类（类名用大驼峰，例如 `Student`）：
  - 创建对象时传入姓名和成绩，自动保存成这个对象自己的属性
  - 写一个方法，按成绩打印等级：90 分及以上"优秀"，60 分及以上"及格"，其余"不及格"
  - 创建两个成绩落在不同区间的学生对象，分别调用这个方法

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：类 = 属性（姓名、成绩）+ 方法（打印等级），属性要在创建对象时就写好
  > **二级 · 方法**：`class` 定义类、`__init__` 在创建对象时初始化属性、`self.属性名 = 参数值`、普通方法第一个参数也写 `self`
  > **三级 · 骨架**：`class Student:` / `def __init__(self, name, score):` / `def show_level(self):` 里用 if-elif-else

- [ ] **2-2 大家共享的类属性**
  还是"学生"类，加两样东西：
  - 一个所有学生共享的学校名（改一次，所有学生看到的一样）
  - 一个共享计数器：每创建一个学生对象就加 1，最后用类名读出"一共创建了多少个学生"

  创建 3 个学生对象，分别打印每个学生的姓名，以及共享的学校名和计数器。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：姓名每个学生各不相同（实例属性），学校名和计数器大家共用（类属性）
  > **二级 · 方法**：类属性直接写在类里、方法外；创建对象时在初始化方法里给计数器加 1；通过类名读类属性
  > **三级 · 骨架**：`Student.count += 1`（写在初始化方法里）/ `print(Student.count)`

- [ ] **2-3 让对象"会说话"、能比较**
  定义一个"商品"类（名称、价格），然后：
  - 直接打印对象时，显示成"商品名 价格"，而不是一串内存地址
  - 两件名称和价格都相同的商品，互相比较时结果为 True

  创建两个内容相同的商品和一个内容不同的商品，打印它们并两两比较。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：打印对象时的表现、对象之间怎么算"相等"，都可以自己定义
  > **二级 · 方法**：`__str__` 定义打印时的字符串、`__eq__` 定义相等的规则
  > **三级 · 骨架**：`def __str__(self): return f"{self.name} {self.price}"` / `def __eq__(self, other): return self.price == other.price and ...`

- [ ] **2-4 一群对象放在一起**
  定义一个"商品"类（名称、价格），创建 3 个商品对象放进一个列表：
  - 遍历列表，打印每个商品
  - 找出价格最高的那件商品（先让 Python 知道两个商品之间怎么比大小，再借用内置的"取最大值"）

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：对象放进列表和普通数据一样，能遍历、能打印；比大小要先定义"谁更小"的规则
  > **二级 · 方法**：`__lt__` 定义小于规则、内置函数 `max()` 取最大值、`for` 遍历
  > **三级 · 骨架**：`def __lt__(self, other): return self.price < other.price` / `print(max(goods_list))`

### 三、综合题

- [ ] **3-1 班级成绩管理器**
  用类把"学生成绩"封装起来，做一个能跑的小工具：
  1. 定义学生类：创建对象时传入姓名和语文、数学、英语三科成绩，保存为对象自己的属性；再用类属性记录学校名
  2. 给这个类加方法：算总分、算平均分；直接打印对象时显示"姓名 总分 平均分"
  3. 创建 4 个学生对象，放进一个列表
  4. 遍历列表打印全部学生，并找出总分最高的学生
  5. （可选）加一个菜单循环：1 查看全部学生 / 2 查看总分最高 / 3 退出，用 `match...case` 分发

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：先把类和它的属性/方法写全，再准备数据、遍历、找最高分，最后才加菜单
  > **二级 · 方法**：`class` / `__init__` / `self` / 类属性 / `__str__` / `__lt__`（或手写循环比较）/ `max()` / `match...case`
  > **三级 · 骨架**：`def total_score(self): return self.chinese + self.math + self.english` / `def average(self): return self.total_score() / 3`

  > [!NOTE]
  > 笔记正文"综合练习：购物车管理系统"的骨架文件是练习库里的 `test_01_shopping.py`（旧格式，里面带答案注释），想再练一遍那套综合题可以直接用它。

> [!TIP]- 参考答案（做完再点开）
> ```python
> # 2-1 定义第一个类
> class Student:
>     def __init__(self, name, score):
>         self.name = name
>         self.score = score
>
>     def show_level(self):
>         if self.score >= 90:
>             print(f"{self.name}：优秀")
>         elif self.score >= 60:
>             print(f"{self.name}：及格")
>         else:
>             print(f"{self.name}：不及格")
>
> s1 = Student("小王", 92)
> s2 = Student("小李", 58)
> s1.show_level()   # 小王：优秀
> s2.show_level()   # 小李：不及格
>
>
> # 2-2 类属性（共享的学校名 + 计数器）
> class Student2:
>     school = "希望小学"   # 类属性：所有学生共享
>     count = 0             # 类属性：共享计数器
>
>     def __init__(self, name, score):
>         self.name = name      # 实例属性：每个对象独有
>         self.score = score
>         Student2.count += 1   # 通过类名给类属性加 1
>
> students = [Student2("小王", 92), Student2("小李", 78), Student2("小张", 85)]
> for stu in students:
>     print(f"{stu.name} 来自 {Student2.school}")
> print("一共创建了", Student2.count, "个学生")   # 3
>
>
> # 2-3 魔法方法：__str__ 与 __eq__
> class Goods:
>     def __init__(self, name, price):
>         self.name = name
>         self.price = price
>
>     def __str__(self):
>         return f"{self.name} {self.price}"
>
>     def __eq__(self, other):
>         return self.name == other.name and self.price == other.price
>
> g1 = Goods("键盘", 199)
> g2 = Goods("键盘", 199)
> g3 = Goods("鼠标", 99)
> print(g1)          # 键盘 199
> print(g1 == g2)    # True
> print(g1 == g3)    # False
>
>
> # 2-4 对象放进列表 + 找最贵的
> class Goods2:
>     def __init__(self, name, price):
>         self.name = name
>         self.price = price
>
>     def __str__(self):
>         return f"{self.name} {self.price}"
>
>     def __lt__(self, other):
>         return self.price < other.price
>
> goods_list = [Goods2("键盘", 199), Goods2("显示器", 899), Goods2("鼠标", 99)]
> for goods in goods_list:
>     print(goods)
> most_expensive = max(goods_list)      # 有了 __lt__ 才能直接比大小
> print(f"最贵的商品：{most_expensive.name}（{most_expensive.price} 元）")
>
>
> # 3-1 班级成绩管理器
> class Student3:
>     school = "希望小学"      # 类属性
>
>     def __init__(self, name, chinese, math, english):
>         self.name = name
>         self.chinese = chinese
>         self.math = math
>         self.english = english
>
>     def total_score(self):
>         return self.chinese + self.math + self.english
>
>     def average(self):
>         return self.total_score() / 3
>
>     def __str__(self):
>         return f"{self.name} 总分{self.total_score()} 平均分{self.average():.1f}"
>
>     def __lt__(self, other):
>         return self.total_score() < other.total_score()
>
> students = [
>     Student3("小王", 92, 88, 95),
>     Student3("小李", 78, 82, 80),
>     Student3("小张", 99, 91, 96),
>     Student3("小赵", 60, 72, 65),
> ]
>
> print(f"学校：{Student3.school}")
> for stu in students:
>     print(stu)
> top = max(students)
> print(f"总分最高：{top.name}（{top.total_score()} 分）")
>
> # 第 5 步（可选）：菜单循环
> while True:
>     choice = input("1 查看全部学生  2 查看总分最高  3 退出：")
>     match choice:
>         case "1":
>             for stu in students:
>                 print(stu)
>         case "2":
>             print(max(students))
>         case "3":
>             print("Bye ~")
>             break
>         case _:
>             print("请输入 1-3")
> ```
