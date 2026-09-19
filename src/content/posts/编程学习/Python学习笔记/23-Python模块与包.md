---
title: Python模块与包
published: 2026-09-16
tags:
  - Python
  - 模块
  - 包
description: Python模块的概念、导入方式、自定义模块、__all__与__name__变量、包的概念与导入方式
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
