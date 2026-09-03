---
title: Python3 基本数据类型 | 菜鸟教程
published: 2026-08-18
tags:
  - py
description: ""
---
## Python3.xPython3 基本数据类型

Python 中的变量不需要声明。每个变量在使用前都必须赋值，变量赋值以后该变量才会被创建。

在 Python 中，变量就是变量，它**没有类型**，我们所说的类型是变量所指的**内存中对象的类型**。

等号 = 用来给变量赋值。等号左边是变量名，右边是存储在变量中的值。
``` python
#!/usr/bin/python3

counter = 100          # 整型变量
miles   = 1000.0       # 浮点型变量
name    = "runoob"     # 字符串

print(counter)
print(miles)
print(name)
```

### 多个变量赋值

``` python
a = b = c = 1
```

你也可以为多个变量同时指定不同的值。例如：

``` python
a, b, c = 1, 2, "runoob"
```

可以通过 **type() 函数**查看变量的类型：

## 实例

``` python
# 变量定义
x = 10           # 整数
y = 3.14         # 浮点数
name = "Alice"   # 字符串
is_active = True # 布尔值

# 多变量赋值
a, b, c = 1, 2, "three"

# 查看数据类型
print(type(x))         # <class 'int'>
print(type(y))         # <class 'float'>
print(type(name))      # <class 'str'>
print(type(is_active)) # <class 'bool'>
```

---

## 标准数据类型

Python3 中有 **6 种标准数据类型**，以及 bool 布尔类型（bool 是 int 的子类，有时单独列出）：

- Number（数字）
- String（字符串）
- bool（布尔类型）
- List（列表）
- Tuple（元组）
- Set（集合）
- Dictionary（字典）

按是否可变，可以分为以下两类：

- **不可变数据（4 个）：** Number（数字）、String（字符串）、bool（布尔）、Tuple（元组）
- **可变数据（3 个）：** List（列表）、Dictionary（字典）、Set（集合）

此外还有一些高级的数据类型，如**字节数组类型** bytes。

---

## Number（数字）

Python3 支持 **int、float、bool、complex（复数）** 。

在 Python 3 里，只有一种整数类型 int，表示为长整型，没有 Python 2 中的 Long。
``` python
>>> a = 111
>>> isinstance(a, int)
True
```

`isinstance` 和 `type` 的区别在于：

- `type()` 不会认为子类是一种父类类型。
- `isinstance()` 会认为子类是一种父类类型。
 **注意：** Python3 中，bool 是 int 的子类，True 和 False 可以和数字相加，True==1、False==0 会返回 **True** ，但可以通过 is 来判断对象身份。
 
> 在 Python 2 中是没有布尔型的，它用数字 0 表示 False，用 1 表示 True。

当你指定一个值时，**Number 对象**就会被创建：

``` python
var1 = 1
var2 = 10
```

可以使用 del 语句删除对象引用：

``` python
del var1[, var2[, var3[...., varN]]]
```

例如：

``` python
del var
del var_a, var_b
```

``` python
var1 = 1 
var2 = var1 
# var1、var2都指向同一个数字对象1 

del var1 
print(var2) # ✅输出1，对象还活着，var2还指着它 
del var2 
print(var2) # ❌ NameError，var2这个名字已经被删掉
```
### 数值运算

## 实例

``` python
>>> 5 + 4   # 加法 +
9
>>> 4.3 - 2 # 减法 -
2.3
>>> 3 * 7   # 乘法 *
21
>>> 2 / 4   # 除法，得到一个浮点数 /
0.5
>>> 2 // 4  # 整除，得到一个整数 //
0
>>> 17 % 3  # 取余 %
2
>>> 2 ** 5  # 乘方 **
32
```

**注意：**

- 一个变量可以通过赋值指向不同类型的对象。
- 数值的除法包含两个运算符：/ 返回一个浮点数，// 返回一个整数（向下取整）。
- 在混合计算时，Python 会把整型自动转换为浮点数。

### 数值类型实例

| int | float | complex |
| --- | --- | --- |
| 10 | 0.0 | 3.14j |
| 100 | 15.20 | 45.j |
| \-786 | \-21.9 | 9.322e-36j |
| 0o17 | 32.3e+18 | .876j |
| \-0o112 | \-90. | \-.6545+0J |
| \-0x260 | \-32.54e100 | 3e+26J |
| 0x69 | 70.2E-12 | 4.53e-7j |

> 注意：Python 3 中整数字面量不允许前导零（如 `080` ），八进制数必须使用 `0o` 前缀（如 `0o17` ），十六进制使用 `0x` 前缀（如 `0x69` ），二进制使用 `0b` 前缀。

Python 还支持复数，复数由实数部分和虚数部分构成，可以用 a + bj 或者 complex(a, b) 表示，复数的实部 **a** 和虚部 **b** 都是浮点型。

---

## String（字符串）

Python 中的字符串用单引号 ' 或双引号 " 括起来，同时使用反斜杠 \\ 转义特殊字符。

字符串截取的语法格式如下：

``` python
变量[头下标:尾下标]
```

索引值以 0 为开始值，-1 为从末尾开始的位置。

![](https://static.jyshare.com/wp-content/uploads/123456-20200923-1.svg)

加号 + 是字符串的连接符，星号 \* 表示复制当前字符串，与之结合的数字为复制的次数。实例如下：

## 实例

``` python
#!/usr/bin/python3

my_str = 'Runoob'       # 定义一个字符串变量（避免使用 str 作为变量名，会覆盖内置类型）

print(my_str)           # 打印整个字符串：Runoob
print(my_str[0:-1])     # 打印索引 0 到倒数第二个字符（不含最后一个）：Runoo
print(my_str[0])        # 打印第一个字符：R
print(my_str[2:5])      # 打印索引 2、3、4 的字符（不含索引 5）：noo
print(my_str[2:])       # 打印从索引 2 开始到末尾：noob
print(my_str * 2)       # 重复打印两次：RunoobRunoob
print(my_str + "TEST")  # 字符串拼接：RunoobTEST
```

结果：

``` python
Runoob
Runoo
R
noo
noob
RunoobRunoob
RunoobTEST
```

Python 使用反斜杠 \\ 转义特殊字符，如果你不想让反斜杠发生转义，可以在字符串前面添加一个 r，表示原始字符串：

## 实例

``` python
>>> print('Ru\noob')
Ru
oob
>>> print(r'Ru\noob')
Ru\noob
```
另外，反斜杠（\\）可以作为续行符，表示下一行是上一行的延续。也可以使用 **"""..."""** 或者 **'''...'''** 跨越多行。

注意，Python 没有单独的字符类型，一个字符就是长度为 1 的字符串。

``` python
>>> word = 'Python'
>>> print(word[0], word[5])
P n
>>> print(word[-1], word[-6])
n P
```

与 C 字符串不同的是，Python 字符串不能被改变。向一个索引位置赋值，比如 word\[0\] = 'm' 会导致错误。

**注意：**

- 反斜杠可以用来转义，使用 `r` 前缀可以让反斜杠不发生转义（原始字符串）。
- 字符串可以用 `+` 运算符连接，用 `*` 运算符重复。
- Python 中的字符串有两种索引方式：从左往右以 0 开始，从右往左以 -1 开始。
- Python 中的字符串不能改变，字符串是不可变类型。

---

## bool（布尔类型）

布尔类型即 True 或 False。在 Python 中，True 和 False 都是关键字，表示布尔值。

布尔类型可以用来控制程序的流程，比如判断某个条件是否成立，或者在某个条件满足时执行某段代码。

布尔类型特点：

- 布尔类型只有两个值：True 和 False。
- bool 是 int 的子类，因此布尔值可以被看作整数来使用，其中 True 等价于 1，False 等价于 0。
- 布尔类型可以和其他数据类型进行比较，比如数字、字符串等。在比较时，Python 会将 True 视为 1，False 视为 0。
- 布尔类型可以和逻辑运算符一起使用，包括 `and` 、 `or` 和 `not` ，用来组合多个布尔表达式。
- 布尔类型也可以被转换成其他数据类型，比如整数、浮点数和字符串。在转换时，True 会被转换成 1，False 会被转换成 0。
- 可以使用 `bool()` 函数将其他类型的值转换为布尔值。以下值转换为布尔值时为 `False` ： `None` 、 `False` 、零（ `0` 、 `0.0` 、 `0j` ）、空序列（如 `''` 、 `()` 、 `[]` ）和空映射（如 `{}` ）。其他所有值转换为布尔值时均为 `True` 。

## 实例

``` python
# 布尔类型的值和类型
a = True
b = False
print(type(a))  # <class 'bool'>
print(type(b))  # <class 'bool'>

# 布尔类型的整数表现
print(int(True))   # 1
print(int(False))  # 0

# 使用 bool() 函数进行转换
print(bool(0))          # False
print(bool(42))         # True
print(bool(''))         # False
print(bool('Python'))   # True
print(bool([]))         # False
print(bool([1, 2, 3]))  # True

# 布尔逻辑运算
print(True and False)  # False
print(True or False)   # True
print(not True)        # False

# 布尔比较运算
print(5 > 3)   # True
print(2 == 2)  # True
print(7 < 4)   # False

# 布尔值在控制流中的应用
if True:
    print("This will always print")

if not False:
    print("This will also always print")

x = 10
if x:
    print("x 是非零值，在布尔上下文中为 True")
```
**注意：** 在 Python 中，所有非零的数字和非空的字符串、列表、元组等数据类型都被视为 True，只有 **0、空字符串、空列表、空元组** 等被视为 False。因此，在进行布尔类型转换时，需要注意数据类型的真假性。

---

## List（列表）

List（列表）是 Python 中使用最频繁的数据类型。

列表可以完成大多数集合类的数据结构实现。列表中元素的类型可以不相同，它支持数字、字符串，甚至可以包含列表（即嵌套列表）。

列表写在方括号 \[\] 之间，用逗号分隔开的元素列表。

和字符串一样，列表同样可以被索引和截取，列表被截取后返回一个包含所需元素的新列表。

列表截取的语法格式如下：

```
变量[头下标:尾下标]
```

索引值以 0 为开始值，-1 为从末尾的开始位置。

![](https://www.runoob.com/wp-content/uploads/2014/08/list_slicing1_new1.png)

加号 + 是列表连接运算符，星号 \* 是重复操作。如下实例：

## 实例

``` python
#!/usr/bin/python3
# 避免使用 list 作为变量名，会覆盖内置类型
my_list = ['abcd', 786, 2.23, 'runoob', 70.2]  
tinylist = [123, 'runoob']
 # 打印整个列表：['abcd', 786, 2.23, 'runoob', 70.2]
print(my_list)        
 # 打印第一个元素（索引 0）：abcd    
print(my_list[0])
# 打印索引 1 和 2 的元素（不含索引 3）：[786, 2.23]
print(my_list[1:3])        
 # 打印从索引 2 开始到末尾的所有元素：[2.23, 'runoob', 70.2]
print(my_list[2:])
# 重复打印 tinylist 两次：[123, 'runoob', 123, 'runoob']        
print(tinylist * 2)        
# 拼接两个列表
print(my_list + tinylist)  
```

以上实例输出结果：

```
['abcd', 786, 2.23, 'runoob', 70.2]
abcd
[786, 2.23]
[2.23, 'runoob', 70.2]
[123, 'runoob', 123, 'runoob']
['abcd', 786, 2.23, 'runoob', 70.2, 123, 'runoob']
```

与 Python 字符串不一样的是，列表中的元素是可以改变的：

## 实例

```
>>> a = [1, 2, 3, 4, 5, 6]
>>> a[0] = 9
>>> a[2:5] = [13, 14, 15]
>>> a
[9, 2, 13, 14, 15, 6]
>>> a[2:5] = []   # 将对应的元素值设置为空列表，即删除这些元素
>>> a
[9, 2, 6]
```

List 内置了有很多方法，例如 `append()` 、 `pop()` 等等，这在后面会讲到。

**注意：**

- 列表写在方括号之间，元素用逗号隔开。
- 和字符串一样，列表可以被索引和切片。
- 列表可以使用 + 操作符进行拼接。
- 列表中的元素是可以改变的（可变类型）。

Python 列表截取可以接收第三个参数，参数作用是截取的步长，以下实例在索引 1 到索引 4 的位置设置步长为 2（每隔一个位置取一个元素）来截取列表：

![](https://www.runoob.com/wp-content/uploads/2014/08/py-dict-1.png)

如果第三个参数为负数表示逆向读取，以下实例用于翻转字符串中的单词顺序：

## 实例
``` python
def reverseWords(input):

    # 通过空格将字符串分隔，把各个单词分隔为列表
    inputWords = input.split(" ")

    # inputWords[-1::-1] 三个参数说明：
    # 第一个参数 -1 表示从最后一个元素开始
    # 第二个参数为空，表示移动到列表开头
    # 第三个参数 -1 表示逆向步进（每次向左移动一个位置）
    inputWords = inputWords[-1::-1]

    # 重新用空格拼接单词
    output = ' '.join(inputWords)

    return output

if __name__ == "__main__":
    input = 'I like runoob'
    rw = reverseWords(input)
    print(rw)
```

输出结果为：

```
runoob like I
```

---

## Tuple（元组）

元组（tuple）与列表类似，不同之处在于元组的元素不能修改。元组写在小括号 () 里，元素之间用逗号隔开。

元组中的元素类型也可以不相同：

## 实例

#!/usr/bin/python3  
  
my\_tuple = ('abcd', 786, 2.23, 'runoob', 70.2) # 避免使用 tuple 作为变量名  
tinytuple = (123, 'runoob')  
  
print(my\_tuple) # 输出完整元组  
print(my\_tuple\[0\]) # 输出第一个元素：abcd  
print(my\_tuple\[1:3\]) # 输出索引 1 和 2 的元素：(786, 2.23)  
print(my\_tuple\[2:\]) # 输出从索引 2 开始的所有元素  
print(tinytuple \* 2) # 输出两次 tinytuple  
print(my\_tuple + tinytuple) # 连接两个元组

以上实例输出结果：

```
('abcd', 786, 2.23, 'runoob', 70.2)
abcd
(786, 2.23)
(2.23, 'runoob', 70.2)
(123, 'runoob', 123, 'runoob')
('abcd', 786, 2.23, 'runoob', 70.2, 123, 'runoob')
```

元组与字符串类似，可以被索引且下标从 0 开始，-1 为从末尾开始的位置，也可以进行截取。

其实，可以把字符串看作一种特殊的元组。

## 实例

\>>> tup = (1, 2, 3, 4, 5, 6)  
\>>> print(tup\[0\])  
1  
\>>> print(tup\[1:5\])  
(2, 3, 4, 5)  
\>>> tup\[0\] = 11 # 修改元组元素的操作是非法的  
Traceback (most recent call last):  
File "&lt;stdin&gt;", line 1, in &lt;module&gt;  
TypeError: 'tuple' object does not support item assignment

虽然元组的元素不可改变，但它可以包含可变的对象，比如 list 列表。

构造包含 0 个或 1 个元素的元组比较特殊，有一些额外的语法规则：

```
tup1 = ()    # 空元组
tup2 = (20,) # 一个元素，需要在元素后添加逗号
```

如果你想创建只有一个元素的元组，需要在元素后面添加一个逗号，以区分它是元组而不是普通的值。因为在没有逗号的情况下，Python 会将括号解释为数学运算中的括号：

```
not_a_tuple = (42)  # 这是整数 42，不是元组
```

`string` 、 `list` 和 `tuple` 都属于 sequence（序列）。

**注意：**

- 与字符串一样，元组的元素不能修改（不可变类型）。
- 元组也可以被索引和切片，方法与列表相同。
- 注意构造包含 0 或 1 个元素的元组的特殊语法规则。
- 元组也可以使用 + 操作符进行拼接。

---

## Set（集合）

Python 中的集合（Set）是一种无序、可变的数据类型，用于存储唯一的元素。集合中的元素不会重复，并且可以进行交集、并集、差集等常见的集合操作。

在 Python 中，集合使用大括号 {} 表示，元素之间用逗号, 分隔。也可以使用 set() 函数创建集合。

> **注意：** 创建一个空集合必须用 set() 而不是 {}，因为 {} 创建的是一个空字典。

创建格式：

```
parame = {value01, value02, ...}
或者
set(value)
```

## 实例

#!/usr/bin/python3  
  
sites = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu'}  
  
print(sites) # 输出集合（无序，重复元素会被自动去掉）  
  
\# 成员测试  
if 'Runoob' in sites:  
print('Runoob 在集合中')  
else:  
print('Runoob 不在集合中')  
  
\# set 可以进行集合运算  
a = set('abracadabra')  
b = set('alacazam')  
  
print(a) # a 中的唯一字符  
  
print(a - b) # a 和 b 的差集（在 a 中但不在 b 中）  
print(a | b) # a 和 b 的并集（在 a 或 b 中）  
print(a & b) # a 和 b 的交集（同时在 a 和 b 中）  
print(a ^ b) # a 和 b 的对称差集（在 a 或 b 中，但不同时存在）

以上实例输出结果：

```
{'Zhihu', 'Baidu', 'Taobao', 'Runoob', 'Google', 'Facebook'}
Runoob 在集合中
{'b', 'c', 'a', 'r', 'd'}
{'r', 'b', 'd'}
{'b', 'c', 'a', 'z', 'm', 'r', 'l', 'd'}
{'c', 'a'}
{'z', 'b', 'm', 'r', 'l', 'd'}
```

---

## Dictionary（字典）

字典（dictionary）是 Python 中另一个非常有用的内置数据类型。

字典是一种映射类型，用 {} 标识，它是一个 **键(key): 值(value)** 的集合。键(key) 必须使用不可变类型，且在同一个字典中键必须是唯一的。

> **注意：** Python 3.7 起，字典会保持元素的 **插入顺序** ，不再是无序的。如果需要有序字典的特性，直接使用普通 `dict` 即可。

## 实例

#!/usr/bin/python3  
  
my\_dict = {}  
my\_dict\['one'\] = "1 - 菜鸟教程"  
my\_dict\[2\] = "2 - 菜鸟工具"  
  
tinydict = {'name': 'runoob', 'code': 1, 'site': 'www.runoob.com'}  
  
print(my\_dict\['one'\]) # 输出键为 'one' 的值  
print(my\_dict\[2\]) # 输出键为 2 的值  
print(tinydict) # 输出完整的字典  
print(tinydict.keys()) # 输出所有键  
print(tinydict.values()) # 输出所有值

以上实例输出结果：

```
1 - 菜鸟教程
2 - 菜鸟工具
{'name': 'runoob', 'code': 1, 'site': 'www.runoob.com'}
dict_keys(['name', 'code', 'site'])
dict_values(['runoob', 1, 'www.runoob.com'])
```

构造函数 `dict()` 可以直接从键值对序列中构建字典：

## 实例

\>>> dict(\[('Runoob', 1), ('Google', 2), ('Taobao', 3)\])  
{'Runoob': 1, 'Google': 2, 'Taobao': 3}  
\>>> {x: x\*\*2 for x in (2, 4, 6)}  
{2: 4, 4: 16, 6: 36}  
\>>> dict(Runoob=1, Google=2, Taobao=3)  
{'Runoob': 1, 'Google': 2, 'Taobao': 3}

{x: x\*\*2 for x in (2, 4, 6)} 使用的是字典推导式，更多推导式内容可以参考： [Python 推导式](https://www.runoob.com/python3/python-comprehensions.html) 。

另外，字典类型也有一些内置的函数，例如 `clear()` 、 `keys()` 、 `values()` 等。

**注意：**

- 字典是一种映射类型，它的元素是键值对。
- 字典的键必须为不可变类型，且不能重复。
- 创建空字典使用 **{}** 。
- Python 3.7 起字典保持插入顺序。

---

## bytes 类型

在 Python3 中，bytes 类型表示的是不可变的二进制序列（byte sequence）。与字符串类型不同的是，bytes 类型中的元素是整数值（0 到 255 之间的整数），而不是 Unicode 字符。

bytes 类型通常用于处理二进制数据，比如图像文件、音频文件、视频文件等。在网络编程中，也经常使用 bytes 类型来传输二进制数据。

创建 bytes 对象最常见的方式是使用 b 前缀：

## 实例

x = b"hello" # 使用 b 前缀创建 bytes 对象  
print(x) # b'hello'  
print(type(x)) # \<class 'bytes'>  
print(x\[0\]) # 104（'h' 的 ASCII 值，bytes 元素是整数）

也可以使用 `bytes()` 函数将其他类型的对象转换为 bytes 类型，第二个参数指定编码方式：

```
x = bytes("hello", encoding="utf-8")
```

与字符串类型类似，bytes 类型也支持切片、拼接、查找、替换等操作。由于 bytes 类型是不可变的，修改操作需要创建一个新的 bytes 对象：

## 实例

x = b"hello"  
y = x\[1:3\] # 切片操作，得到 b'el'  
z = x + b"world" # 拼接操作，得到 b'helloworld'  
print(y) # b'el'  
print(z) # b'helloworld'

需要注意的是，bytes 类型中的元素是整数值，因此在进行比较操作时需要使用相应的整数值。可以用 `ord()` 函数将字符转换为对应的整数值：

## 实例
```
x = b"hello"  
if x[0] == ord("h"): # ord("h") 返回 104  
print("第一个元素是 'h'")
```



---

## Python 数据类型转换

有时候我们需要对数据内置的类型进行转换，只需要将数据类型作为函数名即可。在下一章节 [Python3 数据类型转换](https://www.runoob.com/python3/python3-type-conversion.html) 会具体介绍。

以下几个内置函数可以执行数据类型之间的转换，这些函数返回一个新的对象，表示转换后的值：

| 函数 | 描述 |
| --- | --- |
| [int(x \[,base\])](https://www.runoob.com/python3/python-func-int.html) | 将 x 转换为一个整数 |
| [float(x)](https://www.runoob.com/python3/python-func-float.html) | 将 x 转换为一个浮点数 |
| [complex(real \[,imag\])](https://www.runoob.com/python3/python-func-complex.html) | 创建一个复数 |
| [str(x)](https://www.runoob.com/python3/python-func-str.html) | 将对象 x 转换为字符串 |
| [repr(x)](https://www.runoob.com/python3/python-func-repr.html) | 将对象 x 转换为表达式字符串 |
| [eval(str)](https://www.runoob.com/python3/python-func-eval.html) | 计算字符串中的有效 Python 表达式，并返回一个对象 |
| [tuple(s)](https://www.runoob.com/python3/python3-func-tuple.html) | 将序列 s 转换为一个元组 |
| [list(s)](https://www.runoob.com/python3/python3-att-list-list.html) | 将序列 s 转换为一个列表 |
| [set(s)](https://www.runoob.com/python3/python-func-set.html) | 转换为可变集合 |
| [dict(d)](https://www.runoob.com/python3/python-func-dict.html) | 创建一个字典。d 必须是一个 (key, value) 元组序列。 |
| [frozenset(s)](https://www.runoob.com/python3/python-func-frozenset.html) | 转换为不可变集合 |
| [chr(x)](https://www.runoob.com/python3/python-func-chr.html) | 将一个整数转换为对应的字符 |
| [ord(x)](https://www.runoob.com/python3/python-func-ord.html) | 将一个字符转换为它的整数值（Unicode 码点） |
| [hex(x)](https://www.runoob.com/python3/python-func-hex.html) | 将一个整数转换为十六进制字符串 |
| [oct(x)](https://www.runoob.com/python3/python-func-oct.html) | 将一个整数转换为八进制字符串 |