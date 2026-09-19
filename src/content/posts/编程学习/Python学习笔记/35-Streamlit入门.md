---
title: Streamlit入门
published: 2026-09-18
description: 用纯 Python 快速搭建交互式网页：Streamlit 的三步使用流程与常用组件速查
tags:
  - Python
  - Streamlit
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
