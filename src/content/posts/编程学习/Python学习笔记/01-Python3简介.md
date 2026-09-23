---
title: Python3 简介
published: 2026-08-18
tags:
  - Python
description: Python3 语言简介、设计哲学和应用领域
image: https://img.tsh520.cn/file/blog/post-covers/python3-intro.webp
order: 1
---
## Python3.xPython3 简介

Python 是一个高层次的结合了解释性、编译性、互动性和面向对象的**脚本语言。**

Python 的设计具有很强的可读性，相比其他语言经常使用英文关键字，其他语言的一些标点符号，它具有比其他语言更有特色语法结构。

- **Python 是一种解释型语言：** 这意味着开发过程中没有了编译这个环节。
- **Python 是交互式语言：** 这意味着，您可以在一个 Python 提示符 >>> 后直接执行代码。
- **Python 是面向对象语言:** 这意味着Python支持面向对象的风格或代码封装在对象的编程技术。
- **Python 是初学者的语言：** Python 对初级程序员而言，是一种伟大的语言，它支持广泛的应用程序开发，从简单的文字处理到 WWW 浏览器再到游戏。

![499](https://img.tsh520.cn/file/blog/article/a700b5c8-d654-48f4-8c4c-63fc0070774f.webp)

---

## Python 特点

- **1.易于学习：** Python有相对较少的关键字，结构简单，和一个明确定义的语法，学习起来更加简单。
- **2.易于阅读：** Python代码定义的更清晰。
- **3.易于维护：** Python的成功在于它的源代码是相当容易维护的。
- **4.一个广泛的标准库：** Python的最大的优势之一是丰富的库，跨平台的，在UNIX，Windows和Macintosh兼容很好。
- **5.互动模式：** 互动模式的支持，您可以从终端输入执行代码并获得结果的语言，互动的测试和调试代码片断。
- **6.可移植：** 基于其开放源代码的特性，Python已经被移植（也就是使其工作）到许多平台。
- **7.可扩展：** 如果你需要一段运行很快的关键代码，或者是想要编写一些不愿开放的算法，你可以使用C或C++完成那部分程序，然后从你的Python程序中调用。
- **8.数据库：** Python提供所有主要的商业数据库的接口。
- **9.GUI编程：** Python支持GUI可以创建和移植到许多系统调用。
- **10.可嵌入:** 你可以将Python嵌入到C/C++程序，让你的程序的用户获得"脚本化"的能力。

---

## Python3 下载

Python3 最新源码，二进制文档，新闻资讯等可以在 Python 的官网查看到。

Python 官网： [https://www.python.org/](https://www.python.org/)

![](https://img.tsh520.cn/file/blog/article/33d69961-710e-452e-9429-93cfdf2d3110.png)

Python3 提供了完整的中文文档： [https://docs.python.org/zh-cn/3/](https://docs.python.org/zh-cn/3/)

---

## Python 安装

以下为各平台对应的 Python 安装包下载地址：

![](https://img.tsh520.cn/file/blog/article/9e11647a-cd0e-4117-8c49-976c3027aabe.png)

**Source Code** 可用于 Linux 上的安装。

以下为不同平台上安装 Python3 的方法。

### Window 平台安装 Python:

以下为在 Window 平台上安装 Python 的简单步骤。

打开 WEB 浏览器访问 [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/) ：

![](https://img.tsh520.cn/file/blog/article/1bf7d20f853bf2c4a8f03c03c864982f.png)

这些链接提供了不同类型的 Python 安装文件，适用于不同类型的 Windows 系统和使用情景：

- **Download Windows installer (64-bit)** ：64 位 Windows 系统的安装程序。
- **Download Windows installer (ARM64)** ：适用于 ARM64 架构的 Windows 设备的安装程序。
- **Download Windows embeddable package (64-bit)** ：64 位 Windows 系统的嵌入式包，可用于嵌入到应用程序中。
- **Download Windows embeddable package (32-bit)** ：32 位 Windows 系统的嵌入式包，同样可用于嵌入到应用程序中。
- **Download Windows embeddable package (ARM64)** ：适用于 ARM64 架构的 Windows 设备的嵌入式包。
- **Download Windows installer (32-bit)** ：32 位 Windows 系统的安装程序。

记得勾选 **Add Python 3.6 to PATH** 。

![](https://img.tsh520.cn/file/blog/article/20180226150011548.png)

注意：如果没有勾选 **Add Python3.6 to PATH** 」，会导致命令行无法识别 python/python3 命令，需手动配置环境变量。

按 Win+R 键，输入 cmd 调出命令提示符，输入 python:

![](https://img.tsh520.cn/file/blog/article/20170707155742110.png)

也可以在开始菜单中搜索 **IDLE** ：

![](https://img.tsh520.cn/file/blog/article/460F6DFB-3BBF-4683-BEA0-23BE8DF021B0.jpg)

### Unix & Linux 平台安装 Python3

**Linux 多数发行版自带 Python3** ，若未安装或需要升级，可通过包管理器安装。

#### 源码安装

以下为在 Unix & Linux 平台上安装 Python 的简单步骤：

- 打开 WEB 浏览器访问 [https://www.python.org/downloads/source/](https://www.python.org/downloads/source/)
- 选择适用于 Unix/Linux 的源码压缩包。
- 下载及解压压缩包 **Python-3.x.x.tgz** ， **3.x.x** 为你下载的对应版本号。
- 如果你需要自定义一些选项修改 *Modules/Setup*

以 **Python3.6.1** 版本为例：

```
# tar -zxvf Python-3.6.1.tgz
# cd Python-3.6.1
# ./configure
# make && make install
```

#### Ubuntu/Debian

打开终端，执行以下命令：

```
# 更新软件源
sudo apt update
# 安装Python3及pip3（Python包管理工具）
sudo apt install python3 python3-pip -y
```

#### CentOS/RHEL

打开终端，执行以下命令：

```
# CentOS 7
sudo yum install epel-release -y
sudo yum install python3 python3-pip -y

# CentOS 8/RHEL 8
sudo dnf install python3 python3-pip -y
```

检查 Python3 是否正常可用：

```
# python3 -V
Python 3.6.1
```

### MAC 平台安装 Python:

MAC 系统都自带有 Python 环境，你可以在链接 [https://www.python.org/downloads/mac-osx/](https://www.python.org/downloads/mac-osx/) 上下载最新版安装。

![](https://img.tsh520.cn/file/blog/article/aecef1c5-7bf6-4668-a6d7-6937a242817e.png)

你也可以参考源码安装的方式来安装。

### 验证 Python3 环境是否安装成功

验证 Python3 版本打开命令提示符（Windows）或终端（macOS/Linux），执行以下命令：

```
# 通用命令（推荐，所有系统兼容）
python3 --version
# 补充：Windows系统若已配置PATH，也可执行
python --version
```

若输出类似 Python 3.11.4 的信息，说明 Python3 安装成功。

验证 pip3（Python 包管理工具）pip3 是 Python3 默认的包管理工具，用于安装第三方库，验证命令：

```
# 通用命令
pip3 --version
# Windows补充命令
pip --version
```

若输出类似 pip 23.1.2 from xxx (python 3.11) 的信息，说明 pip3 可用。

---

## 环境变量配置

如果以上执行 python 命令执行成功，说明环境配置好了，不需要额外配置，这部分内容可以忽略。

程序可执行文件的存放目录常不在系统默认搜索路径中，而系统的 PATH 环境变量（Unix 区分大小写，Windows 不区分）正是用于存储可执行文件的搜索路径。

Mac OS 中若需在非默认目录引用 Python，需手动将 Python 安装目录添加到 PATH 中。

### 在 Unix/Linux 设置环境变量

**注：** **/usr/local/bin/python** 为 Python 安装目录，需替换为你的实际路径。

bash shell（Linux）：

``` bash
export PATH="$PATH:/usr/local/bin/python"
```

csh shell：

```
setenv PATH "$PATH:/usr/local/bin/python"
```

sh/ksh shell：

```
PATH="$PATH:/usr/local/bin/python"
```

### 在 Windows 设置环境变量

若安装 Python3 时未勾选 Add Python.exe to PATH ，会导致命令行无法识别 python/python3 命令，需手动配置环境变量：

- 找到 Python3 的安装路径（如D:\\Python311、C:\\Program Files\\Python311），同时找到其下的Scripts文件夹（路径如D:\\Python311\\Scripts，pip3 所在目录）。
- 右键「此电脑」→「属性」→「高级系统设置」→「环境变量」。
- 在「用户变量」或「系统变量」中找到 Path 变量，双击编辑。
- 点击「新建」，分别添加 Python3 的安装根路径和Scripts文件夹路径，点击「确定」保存所有配置。

![](https://img.tsh520.cn/file/blog/article/201209201707594792.png)

> 更多详细配置内容参考： [https://www.runoob.com/w3cnote/add-python-to-path-on-windows-11.html](https://www.runoob.com/w3cnote/add-python-to-path-on-windows-11.html)

关闭原有命令提示符，重新打开后执行验证命令即可生效。

下面几个应用于 Python 的环境变量说明：

| 环境变量名称 | 核心作用 |
| --- | --- |
| `PATH` | 系统查找 Python 解释器及可执行文件的搜索路径 |
| `PYTHONPATH` | Python 查找第三方库和自定义模块的搜索路径 |
| `PYTHONHOME` | 指定 Python 的安装根目录，告知解释器核心库/标准库存放位置 |
| `PYTHONSTARTUP` | 指定 Python 交互式解释器启动时自动执行的脚本文件路径 |
| `PYTHONCASEOK` | Windows 专属，让 Python 导入模块时忽略大小写 |
| `PYTHONDONTWRITEBYTECODE` | 禁止 Python 运行时生成 `.pyc` / `.pyo` 字节码缓存文件 |

---

## 运行 Python

有三种方式可以运行 Python：

### 1、交互式解释器：

你可以通过命令行窗口进入 Python 并开始在交互式解释器中开始编写 Python 代码。

你可以在 Unix、DOS 或任何其他提供了命令行或者 shell 的系统进行 Python 编码工作。

```
python
```

以下为 Python 命令行参数：

| 选项 | 描述 |
| --- | --- |
| \-d | 启用调试模式，在代码解析和解释器运行时显示详细调试信息 |
| \-O | 生成优化代码，编译脚本时生成.pyo 优化字节码文件（忽略断言语句等调试相关代码） |
| \-OO | 深度优化代码，生成.pyo 文件并移除代码中的所有文档字符串，进一步减小文件体积 |
| \-S | Python 启动时不自动引入 site 模块，即不加载查找 Python 模块路径的相关配置（如 site-packages 目录） |
| \-V / --version | 输出当前安装的 Python 版本号，直接退出解释器 |
| \-vv | 输出详细的版本信息（包括编译环境、依赖库等额外信息） |
| \-X | 从 Python 1.6 版本之后，基于内建的异常（仅用于字符串类型）的用法已过时，该参数用于兼容旧版相关特性 |
| \-h / --help | 查看所有 Python 命令行参数的完整帮助说明，直接退出解释器 |
| \-c cmd | 直接在命令行中执行指定的 Python 代码片段（cmd 为字符串格式的代码），无需编写.py 脚本文件 |
| \-m module | 以模块的形式运行指定的 Python 模块（如 pip、http.server 等），自动查找模块路径并执行 |
| \-i | 执行完指定的 Python 脚本后，自动进入交互式解释器环境，便于后续调试和代码补充执行 |
| \-b | 当遇到字节串（bytes）与字符串（str）不兼容的比较操作时，发出警告信息 |
| \-bb | 当遇到字节串（bytes）与字符串（str）不兼容的比较操作时，直接抛出错误，终止程序运行 |
| \-u | 禁用标准输出（stdout）和标准错误（stderr）的缓冲机制，实现日志或输出内容的实时打印 |
| file | 指定要执行的 Python 脚本文件路径（绝对路径或相对路径），解释器将加载并运行该文件中的代码 |
| \-q | 进入交互式解释器时，隐藏欢迎信息，直接显示命令提示符 |

### 2、命令行脚本

在你的应用程序中通过引入解释器可以在命令行中执行Python脚本，如下所示：

```
python script.py
```

**注意：** 在执行脚本时，请检查脚本是否有可执行权限。

### 3、集成开发环境PyCharm

PyCharm 功能: 调试、语法高亮、Project管理、代码跳转、智能提示、自动完成、单元测试、版本控制……

PyCharm 下载地址: [https://www.jetbrains.com/pycharm/download/](https://www.jetbrains.com/pycharm/download/)

PyCharm 安装地址： [https://www.runoob.com/pycharm/pycharm-install.html](https://www.runoob.com/pycharm/pycharm-install.html)

PyCharm 界面：

![](https://img.tsh520.cn/file/blog/article/newrunoob_1784096869537.png)

---

## 更多必备工具

### Anaconda 集成环境

一个 **面向数据科学与机器学习** 的 Python 集成发行版，内置：

- Python 解释器
- 常用数据科学库（NumPy / Pandas / Matplotlib 等）
- 环境与包管理工具 `conda`

相比 `pip` ， **conda 更适合多环境切换** ，在数据科学场景中更稳定。

安装与使用： [Anaconda 教程](https://www.runoob.com/python-qt/anaconda-tutorial.html)

### uv Python 包与环境管理工具

**uv** 是由 Astral 公司开发，基于 Rust 构建的高速 Python 工具链。

- 高性能：相比 pip 提升 10~100 倍
- 依赖管理
- 虚拟环境管理
- Python 版本管理

可替代 `pip` 、 `virtualenv` 、 `pip-tools` 等工具的一体化方案

安装与使用： [uv 教程](https://www.runoob.com/python3/uv-tutorial.html)

### Jupyter Notebook 交互式计算工具

一个 **基于 Web 的交互式编程环境** ，适用于学习、实验和数据分析。

- 运行代码并实时查看结果
- 展示数据可视化图表
- 编写 Markdown 文档说明
- 支持数学公式（LaTeX）

Notebook 文件为 JSON 格式，由多个 Cell 组成，可混合代码与文档内容。

安装与使用： [Jupyter Notebook 教程](https://www.runoob.com/jupyter-notebook/jupyter-notebook-tutorial.html)

## Python3.xPython VScode 配置

### 安装 VS Code

VSCode 安装也很简单，打开官网 [https://code.visualstudio.com/](https://code.visualstudio.com/) ，下载软件包，一步步安装即可，安装过程注意安装路径设置、环境变量默认自动添加到系统中，勾选以下所有选项：

![](https://img.tsh520.cn/file/blog/article/RM04TZb.png)

VSCode 完整安装教程参考： [https://www.runoob.com/vscode/vscode-tutorial.html](https://www.runoob.com/vscode/vscode-tutorial.html)

接着我们安装 Python 扩展：

![](https://img.tsh520.cn/file/blog/article/de824f4aad280b93a3c54a5a088c81ca.png)

---

## 创建一个 Python 代码文件

打开 VScode，然后点击新建文件：

![](https://img.tsh520.cn/file/blog/article/vscode-py-1.jpeg)

点击选择语言：

![](https://img.tsh520.cn/file/blog/article/vscode-py-2.jpg)

在搜索框输入 Python，选中 Python 选项：

![](https://img.tsh520.cn/file/blog/article/vscode-py-3.jpg)

输入代码：

```
print("Runoob")
```

右击鼠标，选择在交互式窗口运行文件， **如果有提示需要安装扩展，直接点安装即可(没有安装会一直显示在连接 Python 内核)：**

![](https://img.tsh520.cn/file/blog/article/vscode-py-4.jpeg)

另外，我们也可以打开一个已存在的文件或目录（文件夹），比如我们打开一个 runoob-test，你也可以自己创建一个：

![](https://img.tsh520.cn/file/blog/article/326906F8-C20B-4D76-AC86-FED6544B3DB5.jpeg)

然后我们创建一个 test.py 文件，点击下面新建文件图标，输入文件名 test.py：

![](https://img.tsh520.cn/file/blog/article/86278531-3C46-4E05-BBE9-3E76CE82722A.jpg)

**注：** runoob-test 里面包含了一个.vscode 文件夹，是一些配置信息，可以先不用管。

在 test.py 输入以下代码：

```
print("Runoob")
```

点击右上角绿色图标，即可运行：

![](https://img.tsh520.cn/file/blog/article/438AF06B-6E02-42F0-9062-53337E8E90AD.jpg)

可以右击文件，选择"在终端中运行 Python 文件"：

![](https://img.tsh520.cn/file/blog/article/16743E52-BE92-424B-AE7B-F9F602A44462.jpeg)

当然也可以在代码窗口上右击鼠标，选择"在终端中运行 Python 文件"。

---

## 练习题

### 一、回忆填空（写完再展开对答案）

1. Python 是一种高层次的、结合了 ____、____、____ 和 ____ 的脚本语言。
2. Python 的四个定位：____ 型语言（开发过程中没有编译环节）、____ 式语言（在 `>>>` 提示符后直接执行代码）、____ 语言（支持把代码封装在对象里）、____ 的语言（从文字处理到浏览器再到游戏都能做）。
3. Python 官网是 ____（域名）；Windows 安装时务必勾选 ____，否则命令行不认 `python` 命令；验证版本用 ____ 命令，验证包管理工具用 ____ 命令。
4. Linux 源码安装的三步是 `./____` → `make` → `make ____`；Ubuntu/Debian 用 ____ 安装、CentOS 8/RHEL 8 用 ____ 安装；多数 Linux 发行版 ____（自带 / 不带）Python3。
5. 环境变量：____ 存可执行文件的搜索路径；____ 给 Python 找第三方库和自定义模块；____ 指定 Python 的安装根目录；____ 指定交互式解释器启动时自动执行的脚本；____ 让导入模块时忽略大小写（Windows 专属）；____ 禁止生成 `.pyc` 字节码缓存文件。
6. 运行 Python 的三种方式：____ 解释器、____ 脚本（`python script.py`）、集成开发环境 ____；PyCharm 的功能包括调试、语法高亮、____、代码跳转、____、____、单元测试、版本控制等。
7. 命令行参数：`-____ cmd` 直接执行一段代码字符串；`-____ module` 以模块方式运行；`-____` 执行完脚本后自动进入交互式环境；`-____` 输出当前版本号；`-____` 查看所有参数的完整帮助；`-____` 禁用输出缓冲、实现实时打印。
8. 常用工具：面向数据科学的集成发行版 ____（内置 ____ 做环境与包管理，还自带 ____、____、____ 等库）；基于 Rust 构建的高速工具链 ____（可替代 pip、virtualenv）；基于 Web 的交互式编程环境 ____（文件是 JSON 格式，由多个 ____ 组成，支持 Markdown 与 LaTeX 公式）。
9. VSCode 里写 Python 需要先安装 ____ 扩展；新建 `.py` 文件后可以右击选择"在 ____ 中运行 Python 文件"，也可以点击右上角的 ____ 图标运行；如果一直显示"在连接 Python 内核"，说明扩展 ____（已装好 / 没装好）。

> [!TIP]- 填空答案（做完再点开）
> 1. 解释性、编译性、互动性、面向对象
> 2. 解释、交互、面向对象、初学者
> 3. `python.org`、Add Python to PATH、`python3 --version`（Windows 也可用 `python --version`）、`pip3 --version`（Windows 也可用 `pip --version`）
> 4. configure、install、apt（`sudo apt install python3 python3-pip -y`）、dnf（`sudo dnf install python3 python3-pip -y`）、自带
> 5. PATH、PYTHONPATH、PYTHONHOME、PYTHONSTARTUP、PYTHONCASEOK、PYTHONDONTWRITEBYTECODE
> 6. 交互式、命令行、PyCharm；Project 管理、智能提示、自动完成
> 7. `-c`、`-m`、`-i`、`-V`（`--version`）、`-h`（`--help`）、`-u`
> 8. Anaconda、conda、NumPy、Pandas、Matplotlib、uv、Jupyter Notebook、Cell
> 9. Python、终端、绿色运行（▶）、没装好

### 二、概念自测（口头答得出来即可）

- [ ] **2-1** "解释型语言"和"编译型语言"的区别是什么？为什么说 Python 开发过程中没有编译这个环节？

  > [!TIP]- 参考答案（做完再点开）
  > 编译型语言要先整体翻译成机器码、生成可执行文件，之后才能运行；解释型语言由解释器边读边执行，不需要提前生成可执行文件。Python 属于解释型（同时结合了编译性），所以开发时写完代码直接运行即可，中间没有单独的编译环节。

- [ ] **2-2** 判断对错并说明理由：① Python 是编译型语言；② Windows 安装时没勾选 Add Python to PATH，也能在任意命令行窗口直接用 `python` 命令；③ Python 只能做数据分析；④ PyCharm 是一个集成开发环境。

  > [!TIP]- 参考答案（做完再点开）
  > ① ❌ 错，Python 是解释型语言（"结合了编译性"不等于要你先编译）；② ❌ 错，没勾选就要手动配置环境变量，否则命令行识别不了 `python` / `python3`；③ ❌ 错，Python 可用于文字处理、Web、爬虫、游戏、GUI 等；④ ✅ 对。

- [ ] **2-3** PATH 和 PYTHONPATH 都跟"路径"有关，它们各自负责找什么？没配好分别会出现什么现象？

  > [!TIP]- 参考答案（做完再点开）
  > PATH 管的是"系统到哪里找 Python 解释器和可执行文件"（包括 pip 所在的 Scripts 目录），没配好的现象就是命令行敲 `python` / `pip` 提示找不到命令；PYTHONPATH 管的是"Python 到哪里找第三方库和自定义模块"，没配好会导致 `import` 自己写的模块时报找不到模块。

- [ ] **2-4** 已经会写 Python 了，为什么还要认识 Anaconda、uv、Jupyter Notebook 这几个工具？它们各自解决什么问题？

  > [!TIP]- 参考答案（做完再点开）
  > 三者都是"让环境/工具更好用"的辅助：
  > - Anaconda：面向数据科学与机器学习的集成发行版，一次装好解释器 + 常用科学计算库，自带 conda 做环境与包管理（多环境切换比 pip 稳）
  > - uv：Rust 写的高速工具链，装包比 pip 快 10~100 倍，一套工具顶 pip / virtualenv / pip-tools
  > - Jupyter Notebook：基于 Web 的交互式环境，可以边写代码边看结果，适合学习、实验和数据分析（文件是 JSON，由多个 Cell 组成）
