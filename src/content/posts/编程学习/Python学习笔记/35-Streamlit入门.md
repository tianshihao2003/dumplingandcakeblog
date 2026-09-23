---
title: Streamlit入门
published: 2026-09-18
description: 用纯 Python 快速搭建交互式网页：Streamlit 的三步使用流程与常用组件速查
tags:
  - Python
  - Streamlit
image: https://img.tsh520.cn/file/blog/post-covers/python-35-streamlit.webp
order: 35
---

## Streamlit 是什么

Streamlit 是一个开源的 Python 库，专为数据工程师及机器学习工程师设计，用来**快速基于 Python 代码构建交互式的 web 网站（无需掌握前端技术）**。

官方网站：https://streamlit.io

> [!NOTE]
> 也就是说：不用写 HTML/CSS/JavaScript，只写 Python，就能得到一个能输入、能点击、能展示图表和媒体的网页。这对做 AI 应用的演示界面特别合适。

## 使用三步

```bash
# 1. 安装
pip install streamlit
```

```python
# 2. 在 python 文件中引入 streamlit 模块, 基于提供的 API 构建 Web 应用
import streamlit as st
st.title("AI智能伴侣")
```

```bash
# 3. 运行程序（注意是 streamlit run，不是 python xxx.py）
streamlit run 02.\ streamlit入门.py
```

> [!WARNING]
> 必须用 `streamlit run 文件名.py` 启动。直接 `python xxx.py` 只会执行一遍代码，不会启动网页服务。

## 页面配置：st.set_page_config

```python
import streamlit as st

st.set_page_config(
    page_title="Streamlit入门",      # 浏览器标签页标题
    page_icon="🧊",                  # 标签页图标
    layout="wide",                   # 布局: wide(宽屏) / centered(居中)
    initial_sidebar_state="expanded",# 侧边栏状态: expanded / collapsed / auto
    menu_items={}                    # 右上角菜单
)
```

## 常用组件速查

### 文本与标题

| 组件 | 作用 |
| --- | --- |
| `st.title("...")` | 大标题 |
| `st.header("...")` | 一级标题 |
| `st.subheader("...")` | 二级标题 |
| `st.write("...")` | 输出文本，也支持直接写 Markdown |
| `st.text("...")` | 输出纯文本（不解析 Markdown） |
| `st.divider()` | 分隔线 |

### 媒体与数据

| 组件 | 作用 |
| --- | --- |
| `st.image("resources/cat.jpg")` | 显示图片 |
| `st.audio("resources/news.mp3")` | 音频播放器 |
| `st.video("resources/news.mp4")` | 视频播放器 |
| `st.logo("resources/logo.png")` | 页面 Logo |
| `st.table(数据)` | 表格（字典或 DataFrame） |

### 输入类

| 组件 | 作用 |
| --- | --- |
| `st.text_input("请输入姓名")` | 单行文本输入框 |
| `st.text_input("请输入密码", type="password")` | 密码输入框（输入内容显示为圆点） |
| `st.text_area("性格")` | 多行文本输入框 |
| `st.radio("性别", ["男", "女", "未知"], index=2)` | 单选按钮 |
| `st.button("按钮文字")` | 按钮，返回 `True`/`False` |

### 布局与聊天（实战常用）

| 组件 | 作用 |
| --- | --- |
| `with st.sidebar:` | 把内容放到左侧边栏里 |
| `st.columns([4, 1])` | 一行分成多列 |
| `st.chat_message("user")` | 聊天气泡（user / assistant） |
| `st.chat_input("请输入...")` | 底部聊天输入框 |
| `st.empty()` | 占位组件，可反复覆盖内容（流式输出用） |
| `st.error("...")` | 红色错误提示 |
| `st.rerun()` | 立刻重新运行整个脚本、刷新页面 |

## 完整入门示例

```python
import streamlit as st

# 设置页面的配置项
st.set_page_config(
    page_title="Streamlit入门",
    page_icon="🧊",
    layout="wide",                      # 布局
    initial_sidebar_state="expanded",   # 控制的是侧边栏的状态
    menu_items={}
)

# 大标题 / 标题
st.title("Streamlit 入门演示")
st.header("Streamlit 一级标题")
st.subheader("Streamlit 二级标题")

# 段落文字
st.write("布偶猫，被誉为“猫中仙女”，以其优雅的外表和温顺的性格成为最受欢迎的宠物猫之一。")

# 图片 / 音频 / 视频 / Logo
st.image("resources/cat.jpg")
st.audio("resources/news.mp3")
st.video("resources/news.mp4")
st.logo("resources/logo.png")

# 表格
student_data = {
    "姓名": ["王林", "李慕婉", "贝罗", "莫厉海", "石萧"],
    "学号": ["20260001", "20260002", "20260003", "20260004", "20260005"],
    "语文": [98, 90, 59, 29, 80],
    "数学": [88, 78, 65, 70, 39],
    "英语": [99, 89, 87, 59, 62],
    "总分": [285, 257, 211, 158, 181]
}
st.table(student_data)

# 输入框
name = st.text_input("请输入姓名")
st.write(f"您输入的姓名为: {name}")

# 密码输入框
password = st.text_input("请输入密码", type="password")
st.write(f"您输入的密码为: {password}")

# 单选按钮（index=2 表示默认选中第 3 个选项）
gender = st.radio("请输入您的性别", ["男", "女", "未知"], index=2)
st.write(f"您的性别为: {gender}")
```

> [!TIP]
> `st.image("resources/cat.jpg")` 用的是**相对路径**，相对于你运行 `streamlit run` 时所在的目录。写错路径就会报 "No such file or directory"。

## 必须理解的一点：脚本会被反复执行

Streamlit 的交互模型是：**用户每做一次交互（点按钮、输入内容），整个脚本就会从头到尾重新执行一遍**，然后重新渲染页面。

这带来一个直接后果：普通的 Python 变量在重跑时会丢失，所以聊天记录这类需要"记住"的数据必须放进 `st.session_state`——这正是 [会话记忆](/posts/编程学习/python学习笔记/38-实战-ai智能伴侣-会话记忆/) 那一节要解决的问题。

## 小结（复习自测）

| 题目 | 答案 |
| --- | --- |
| 什么是 Streamlit | 一个用于快速基于 python 代码构建 web 网页的 python 库（数据科学及机器学习领域） |
| Streamlit 的使用步骤 | 安装（`pip install streamlit`）→ 基于 streamlit 中的 api 构建页面 → 运行（`streamlit run xxx.py`） |

## 相关

- [实战-AI智能伴侣-基本交互](/posts/编程学习/python学习笔记/36-实战-ai智能伴侣-基本交互/)
- [实战-AI智能伴侣-会话管理](/posts/编程学习/python学习笔记/41-实战-ai智能伴侣-会话管理/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 安装：`pip install ____`；运行：`streamlit ____ xxx.py`
2. 为什么不能像普通脚本那样用 `python xxx.py` 启动？因为它是 ____ 应用，要由 streamlit 起服务
3. 页面配置：`st.____(page_title=..., page_icon=..., layout="____", initial_sidebar_state="expanded")`
4. 标题三件套：`st.title()` / `st.header()` / `st.____()`
5. 文本输出：`st.write()`（支持 Markdown）、`st.text()`（纯文本）、`st.____()`（分隔线）
6. 媒体组件：`st.image()` / `st.____()`（音频）/ `st.____()`（视频）/ `st.____()`（Logo）
7. 表格：`st.____(数据字典)`
8. 输入组件：____（单行文本）、____（多行文本）、____（密码框，加 `type="password"`）、____（单选框）
9. 关键机制：用户每做一次交互，整个脚本会从头 ____ 一遍

> [!TIP]- 填空答案（做完再点开）
> 1. streamlit、run　2. Web　3. set_page_config / wide　4. subheader　5. divider　6. audio、video、logo　7. table　8. text_input、text_area、text_input、radio　9. 重新执行

### 二、裸写题



- [ ] **2-1 做一个展示页**
  页面包含：大标题、一级标题、一段文字、分隔线、一个表格（三人三列，含总分行）。运行后能正常看到页面。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：从大到小摆：标题 → 文字 → 分隔 → 表格
  > **二级 · 方法**：`st.title` / `st.header` / `st.write` / `st.divider` / `st.table`
  > **三级 · 骨架**：表格数据用字典表示，键是列名、值是列表

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import streamlit as st
  > 
  > st.title("我的展示页")
  > st.header("一、成绩表格")
  > st.write("下面是一个成绩表格，最后一列是总分。")
  > st.divider()
  > 
  > data = {
  >     "姓名": ["王林", "李慕婉", "贝罗"],
  >     "语文": [98, 90, 59],
  >     "数学": [88, 78, 65],
  >     "英语": [99, 89, 87],
  >     "总分": [285, 257, 211],
  > }
  > st.table(data)
  > ```

- [ ] **2-2 输入组件与回显**
  放三个输入组件（姓名、密码、性别单选），把用户输入的内容回显到页面上。

  > [!TIP]- 提示
  > **一级 · 思路**：每个组件都会"返回"用户输入的值，存进变量再显示
  > **二级 · 方法**：`st.text_input`（密码加 `type="password"`）、`st.radio`
  > **三级 · 骨架**：`gender = st.radio("性别", ["男","女","未知"], index=____)`

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import streamlit as st
  > 
  > name = st.text_input("请输入姓名")
  > password = st.text_input("请输入密码", type="password")
  > gender = st.radio("请输入您的性别", ["男", "女", "未知"], index=2)
  > 
  > st.divider()
  > st.write(f"您输入的姓名为: {name}")
  > st.write(f"您输入的密码为: {password}")
  > st.write(f"您的性别为: {gender}")
  > ```

- [ ] **2-3 页面配置与媒体**
  给页面配置标题和图标、加 Logo，并放一张图片、一段音频、一段视频（用课程 resources 目录里的文件）。

  > [!TIP]- 提示
  > **一级 · 思路**：页面配置要放在所有组件之前；媒体组件直接给文件路径
  > **二级 · 方法**：`st.set_page_config` / `st.logo` / `st.image` / `st.audio` / `st.video`
  > **三级 · 骨架**：路径相对于**运行命令时所在的目录**，写错会报找不到文件

  > [!TIP]- 参考答案（做完再点开）
  > ```python
  > import streamlit as st
  > 
  > st.set_page_config(page_title="我的第一个页面", page_icon="🧊", layout="wide")
  > 
  > st.title("页面配置与媒体演示")
  > st.logo("resources/logo.png")
  > 
  > st.image("resources/cat.jpg")
  > st.audio("resources/news.mp3")
  > st.video("resources/news.mp4")
  > ```
