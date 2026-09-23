---
title: Python模块与包
published: 2026-09-16
tags:
  - Python
  - 模块
  - 包
description: Python模块的概念、导入方式、自定义模块、__all__与__name__变量、包的概念与导入方式
image: https://img.tsh520.cn/file/blog/post-covers/python-23-modules.webp
order: 23
---

## Python模块概念

Python模块(module)：一个 `.py` 文件就是一个模块，模块是Python程序的基本组织单位。在模块中可以定义变量、函数、类，以及可执行的代码。

### 模块的好处

- 提高代码复用性
- 降低开发门槛
- 避免命名冲突

### 常见内置模块

| 模块名      | 功能说明    |
| -------- | ------- |
| math     | 数学计算    |
| random   | 随机数     |
| os       | 操作系统    |
| sys      | 系统参数    |
| datetime | 日期时间    |
| time     | 时间访问    |
| re       | 正则表达式   |
| csv      | csv文件操作 |

### 示例：随机点名器

```python
import random

# 人物列表
names = ["王林", "李慕婉", "许立国", "韩立", "涛哥", "莫厉海", "十三", "虎咆", "红蝶", "天运子"]
print(random.choice(names))
```

---

## 模块导入方式

在使用模块中提供的功能之前，必须得**先导入，再使用**。

### 导入语法

| 导入形式                        | 代码样例                                 | 调用方式      |
| --------------------------- | ------------------------------------ | --------- |
| `import 模块名`                | `import random, os`                  | `模块名.功能名` |
| `import 模块名 as 别名`          | `import random as rd`                | `别名.功能名`  |
| `from 模块名 import 功能名`       | `from random import randint, choice` | `功能名`     |
| `from 模块名 import 功能名 as 别名` | `from random import randint as rint` | `别名`      |
| `from 模块名 import *`         | `from random import *`               | `功能名`     |

### 示例

```python
# 方式1：import 模块名
import random
print(random.randint(10, 100))

# 方式2：import 模块名 as 别名
import random as rd
print(rd.randint(10, 100))

# 方式3：from 模块名 import 功能名
from random import randint, choice
print(randint(10, 100))

# 方式4：from 模块名 import 功能名 as 别名
from random import randint as rint
print(rint(10, 100))

# 方式5：from 模块名 import *
from random import *
print(randint(10, 100))
```

---

## 模块导入小结

1. **什么是模块？有什么用？**
   - 模块：就是一个python文件(.py)，其中就包含了变量、函数、类，以及可执行的代码
   - 作用：提高代码复用性，降低开发门槛

2. **导入模块的常用语法？**（导入模块的语句，一般写在py文件的开头）
   - `import 模块名 [as 别名]`
   - `from 模块名 import 功能名 [as 别名]`
   - `from 模块名 import *`

---

## 自定义模块

当开发一些复杂的项目，为了让项目结构更清晰，更便于项目的维护管理及代码的复用，可能会把一个项目拆分为若干个模块。

### 示例：项目模块拆分

```python
# config.py - 基础配置项
PAGE_TITLE = "AI树洞"  # 页面标题
PAGE_ICON = "🤖"  # 页面icon
LAYOUT = "wide"  # 页面布局
INITIAL_SIDEBAR_STATE = "expanded"  # 侧边栏初始状态
HELP_URL = "https://www.extremelycoolapp.com/help"
SESSION_LOCATION = "sessions/"  # 会话数据存储位置
```

```python
# session.py - 会话管理
import os

def load_session():
    sessions = []
    if os.path.exists("sessions"):
        for filename in os.listdir("sessions"):
            if filename.endswith(".json"):
                sessions.append(filename[:-5])
    return sorted(sessions, reverse=True)
```

```python
# ai_partner.py - 主功能模块
from session import load_session, save_session

# 新建会话按钮
if st.button("新建会话", icon="✨", use_container_width=True):
    # 保存当前会话（如果有）
    if st.session_state.current_session:
        save_session(st.session_state.current_session)
    # 创建新会话
    new_session_name = generate_new_session_name()
    st.session_state.current_session = new_session_name
```

### 注意事项

- 每一个python文件都可以作为一个模块，**模块的名字就是文件的名字**（建议使用python标识符定义，规范命名）

---

## `__all__` 变量

`__all__` 是一个模块级别的特殊变量，用于指定 `from 模块名 import *` 时会导入哪些功能（*通配了哪些功能）。

### 示例

```python
# my.py
__all__ = ["log_separator1", "log_separator3", "PI"]

PI = 3.1415926
NAME = "黑马☆涛哥"

def log_separator1():
    print("- " * 30)

def log_separator2():
    print("+ " * 30)

def log_separator3():
    print("# " * 30)

def log_separator4():
    print("* " * 30)
```

```python
# test.py
from my import *

log_separator1()  # ✓ 可以使用
log_separator3()  # ✓ 可以使用
log_separator2()  # ✗ 报错，未导入
log_separator4()  # ✗ 报错，未导入

print(PI)  # ✓ 可以使用
print(NAME)  # ✗ 报错，未导入
```

### 注意事项

- `__all__` 控制的是 `from ... import *` 时，要导入的功能，并不会影响直接导入具体的功能（如：`from ... import 功能`）

---

## `__name__` 变量

`__name__` 是Python中非常重要的内置变量，表示的是当前模块的名称。

### 两种情况

- 当模块**直接运行**时：`__name__` 的值为 `"__main__"`
- 当模块**被导入**时：`__name__` 等于模块的文件名(不含.py后缀)

### 示例

```python
# my_module.py
def greet():
    print("Hello!")

# 当直接运行时执行
if __name__ == "__main__":
    greet()  # 只有直接运行my_module.py时才会执行
```

---

## `__name__` 与 `__all__` 小结

1. **`__name__` 与 `__all__` 这两个特殊变量的作用是什么？**
   - `__name__` 是Python中非常重要的内置变量，表示的是当前模块的名称
     - 当模块直接运行时：`__name__` 的值为 `"__main__"`（`if __name__ == "__main__"`）
     - 当模块被导入时：`__name__` 等于模块的文件名(不含.py后缀)
   - `__all__`：控制 `import *` 时导入哪些功能

---

## 包的概念

包：本质就是一个文件夹，该文件夹中可以包含若干python模块（.py文件），文件夹下还包含了一个 `__init__.py` 文件。

### 包的作用

- 模块文件较多时，用来管理多个模块
- 包的本质也是一个模块

### 包的结构

```
utils/                    # 包名
├── __init__.py           # 描述当前包的信息的
├── my_fun.py             # 模块1
├── my_var.py             # 模块2
└── my_config.py          # 模块3
```

---

## 包的导入方式

| 导入形式 | 代码样例 | 调用方式 |
| --- | --- | --- |
| `import 包名.模块名` | `import utils.my_fun` | `包名.模块名.功能名` |
| `from 包名 import 模块名` | `from utils import my_fun` | `模块名.功能名` |
| `from 包名 import *` | `from utils import *` | `模块名.功能名` |
| `from 包名.模块名 import 功能名` | `from utils.my_fun import log_separator1` | `功能名` |
| `from 包名.模块名 import *` | `from utils.my_fun import *` | `功能名` |

### 示例

```python
# 方式1：import 包名.模块名
import utils.my_fun
utils.my_fun.log_separator1()

# 方式2：from 包名 import 模块名
from utils import my_fun
my_fun.log_separator1()

# 方式3：from 包名 import *
from utils import *
my_fun.log_separator1()

# 方式4：from 包名.模块名 import 功能名
from utils.my_fun import log_separator1
log_separator1()

# 方式5：from 包名.模块名 import *
from utils.my_fun import *
log_separator1()
```

---

## 包导入的路径

```python
# 相对路径：从当前文件所在目录开始查找
from utils.my_fun import log_separator1, log_separator3

# 绝对路径：从项目的根目录下开始查找
from 第二章.utils.my_fun import log_separator1, log_separator3
```

---

## 包小结

1. **什么是包？有什么作用？**
   - 包就是一个文件夹，里面可以存储很多Python模块（py文件），通过包可以对模块进行归类

2. **`__init__.py` 文件的作用？**
   - 标识这是一个包，而不是普通的文件夹
   - 控制在 `import *` 时导入的模块列表（`__all__` 变量）

3. **导入包的方式？**
   - `import 包名.模块名`
   - `from 包名 import 模块名`
   - `from 包名 import *`
   - `from 包名.模块名 import 功能名`
   - `from 包名.模块名 import *`

---

## 总结口诀

- **模块**：一个py文件就是一个模块
- **导入**：import先导入，再用模块名.功能名
- **别名**：as起别名，方便书写好记忆
- **from**：from导入功能，直接用功能名
- **通配符**：import *全部导入，__all__来控制
- **__name__**：直接运行是__main__，被导入是模块名
- **包**：文件夹加__init__，管理多个模块用
- **路径**：相对从当前找，绝对从根目录找

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 模块：一个 ____ 文件就是一个模块，模块名就是 ____（不含后缀）；模块的好处有提高代码 ____、降低开发 ____、避免 ____ 冲突
2. 常见内置模块按功能填名字：数学计算 ____、随机数 ____、操作系统 ____、系统参数 ____、日期时间 ____、正则表达式 ____
3. 导入模块的语句一般写在 py 文件的 ____；`import random, os` 说明一次 ____（可以 / 不可以）导入多个模块
4. `import 模块名` 之后调用要写 ____；`import 模块名 ____ 别名` 之后调用写 ____
5. `from 模块名 import 功能名` 之后调用直接写 ____；`from 模块名 import 功能名 as 别名` 之后调用写 ____；`from 模块名 import *` 表示把模块里的功能 ____ 导入
6. `__all__` 是 ____ 级别的特殊变量，用来指定 `from 模块名 import ____` 时导入哪些功能；它 ____（影响 / 不影响）`from 模块名 import 具体功能`
7. `__name__` 表示当前模块的 ____：模块直接运行时值是 ____，被导入时值是 ____（不含 .py 后缀）
8. 包的本质是一个 ____，其中必须包含 ____ 文件；它的作用一是 ____ 这是包，二是用 ____ 变量控制 `import *` 时导入哪些 ____
9. 包的导入：`import 包名.模块名` 调用时写 ____；`from 包名 import 模块名` 调用时写 ____；`from 包名.模块名 import 功能名` 调用时直接写 ____
10. 包的导入路径：相对路径从 ____ 开始查找，绝对路径从 ____ 开始查找

> [!TIP]- 填空答案（做完再点开）
> 1. `.py`（Python）、文件名 / 复用性、门槛、命名　2. math、random、os、sys、datetime、re　3. 开头（最前面）/ 可以　4. `模块名.功能名`、`as`、`别名.功能名`　5. `功能名`、`别名`、全部　6. 模块、`*`、不影响　7. 名称、`"__main__"`、模块的文件名　8. 文件夹、`__init__.py`、标识、`__all__`、模块　9. `包名.模块名.功能名`、`模块名.功能名`、`功能名`　10. 当前文件所在目录、项目的根目录

### 二、裸写题

- [ ] **2-1 随机点名器（三种导入方式）**
  准备一个 5 人名单，用三种不同的导入方式各抽一次名并打印：① 导入模块名 ② 导入模块并起别名 ③ 只导入需要的那一个功能。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：三种写法的区别只在导入语句，以及调用时要不要写模块名/别名
  > **二级 · 方法**：`import random` / `import random as rd` / `from random import choice`，功能是 `choice(名单)`
  > **三级 · 骨架**：`import random as ____` → `print(____.choice(names))`

- [ ] **2-2 自定义模块 + 主程序保护**
  1. 在本目录新建 `my_tools.py`：定义一个函数打印一句问候，再定义一个变量保存作者名
  2. 给它加上主程序保护，让其中一行"自我介绍"的测试代码只在直接运行这个文件时执行
  3. 回到本文件里导入这个模块，调用它的函数、打印它的变量
  4. 分别运行"直接运行 `my_tools.py`"和"运行本文件"，观察那行测试代码有没有执行

  > [!TIP]- 提示
  > **一级 · 思路**：模块被导入时也有一个"当前模块名"，只是值变成了文件名，用它就能区分"直接运行"和"被导入"
  > **二级 · 方法**：`if __name__ == "__main__":`；导入用 `import 模块名`，调用写 `模块名.功能名`
  > **三级 · 骨架**：`if ____ == "__main__":`

- [ ] **2-3 控制通配导入的范围**
  1. 在 `my_tools.py` 里再补上 3 个打印分隔线的函数和 1 个变量
  2. 用模块级的特殊变量只放行其中 2 个功能（其余的不让 `import *` 拿到）
  3. 在本文件里用通配方式导入，逐个使用这 4 个功能：不能用的先注释掉，并在旁边写明报错原因

  > [!TIP]- 提示
  > **一级 · 思路**：通配导入默认把模块里的功能全搬过来，可以用一个列表变量限定白名单
  > **二级 · 方法**：`__all__ = ["功能名", ...]`（写的是字符串名字）
  > **三级 · 骨架**：`____ = ["log_separator1", "PI"]`

> [!TIP]- 参考答案（做完再点开）
> ```python
> # 2-1 三种导入方式
> names = ["王林", "李慕婉", "许立国", "韩立", "涛哥"]
>
> import random                       # 方式1：模块名.功能名
> print("方式1：", random.choice(names))
>
> import random as rd                 # 方式2：别名.功能名
> print("方式2：", rd.choice(names))
>
> from random import choice           # 方式3：直接用功能名
> print("方式3：", choice(names))
>
> # 2-2 my_tools.py（新建的文件）
> # def say_hi():
> #     print("你好，我是自定义模块里的函数")
> #
> # AUTHOR = "涛哥"
> #
> # if __name__ == "__main__":
> #     print("my_tools 被直接运行，当前模块名：", __name__)
> #     say_hi()
>
> # 2-2 本文件里：
> import my_tools
>
> my_tools.say_hi()
> print("模块里的变量 AUTHOR =", my_tools.AUTHOR)
> print("当前模块名：", __name__)      # __main__
> # 运行本文件：my_tools 的保护块不执行；直接运行 my_tools.py：保护块才执行
>
> # 2-3 my_tools.py 里补上：
> # __all__ = ["log_separator1", "PI"]
> # PI = 3.1415926
> # NAME = "黑马☆涛哥"
> # def log_separator1(): print("- " * 30)
> # def log_separator2(): print("+ " * 30)
> # def log_separator3(): print("# " * 30)
>
> # 2-3 本文件里：
> from my_tools import *
>
> log_separator1()      # ✓ 放行了
> print(PI)             # ✓ 放行了
>
> # log_separator2()    # ✗ NameError: name 'log_separator2' is not defined
> # print(NAME)         # ✗ NameError: name 'NAME' is not defined
> ```

### 三、综合题

- [ ] **3-1 把一个小项目拆成包**
  照着笔记里"项目模块拆分"的思路做一遍：
  1. 在本目录下建包 `utils/`：里面要有描述包信息的文件、一个放函数的模块 `my_fun.py`、一个放常量的模块 `my_var.py`
  2. `my_fun.py` 里定义 3 个打印分隔线的函数（分别用 `-`、`+`、`#` 重复 30 次）；`my_var.py` 里定义 `PI = 3.1415926` 和 `NAME = "黑马☆涛哥"`
  3. 在包描述文件里用模块级特殊变量放行这两个模块，使 `from utils import *` 能拿到它们
  4. 在本文件里用三种方式各导入一次并调用，观察调用写法有什么区别：① 导入"包.模块" ② 从包里导入模块 ③ 从"包.模块"里导入功能
  5. 最后打印本文件的当前模块名，想一想直接运行本文件时它的值是什么

  > [!TIP]- 提示
  > **一级 · 思路**：包 = 文件夹 + `__init__.py`；导入的层级不同，调用时写的前缀就不同
  > **二级 · 方法**：`import utils.my_fun` / `from utils import my_var` / `from utils.my_fun import log_separator1`；包描述文件里写 `__all__ = ["my_fun", "my_var"]`
  > **三级 · 骨架**：`import utils.my_fun` → `utils.my_fun.____()` ／ `from utils import ____` → `my_var.PI`

> [!TIP]- 参考答案（做完再点开）
> ```python
> # utils/__init__.py（描述包信息，并控制 import * 时导入哪些模块）
> __all__ = ["my_fun", "my_var"]
>
> # utils/my_fun.py
> def log_separator1():
>     print("- " * 30)
>
> def log_separator2():
>     print("+ " * 30)
>
> def log_separator3():
>     print("# " * 30)
>
> # utils/my_var.py
> PI = 3.1415926
> NAME = "黑马☆涛哥"
>
> # 本文件里：
> # ① import 包名.模块名  →  包名.模块名.功能名
> import utils.my_fun
> utils.my_fun.log_separator1()
>
> # ② from 包名 import 模块名  →  模块名.功能名
> from utils import my_var
> print("② 从包里导入模块：", my_var.PI, my_var.NAME)
>
> # ③ from 包名.模块名 import 功能名  →  功能名
> from utils.my_fun import log_separator3
> log_separator3()
>
> # ④ from 包名 import *（受 __init__.py 里 __all__ 控制） →  模块名.功能名
> from utils import *
> my_fun.log_separator2()
>
> # ⑤ from 包名.模块名 import *  →  功能名
> from utils.my_var import *
> print("⑤ 通配导入模块：", NAME)
>
> print("当前模块名：", __name__)      # __main__
> ```
