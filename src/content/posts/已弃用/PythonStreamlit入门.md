---
title: Python Streamlit入门
published: 2026-09-16
tags:
  - Python
  - Streamlit
  - Web开发
description: Streamlit基础概念、常用API、页面构建、运行方式及核心知识点
---

## 一、什么是Streamlit

Streamlit是一个开源的Python库，专为数据工程师及机器学习工程师设计，用来快速基于Python代码构建交互式的web网站（**无需掌握前端技术**）。

- 官方网站：https://streamlit.io
- **核心优势**：用纯Python代码就能构建美观的Web应用

---

## 二、Streamlit使用步骤

### 1. 安装Streamlit

```bash
pip install streamlit
```

### 2. 创建Python文件并引入模块

```python
import streamlit as st
```

### 3. 基于Streamlit API构建页面

使用Streamlit提供的各种API来构建页面内容。

### 4. 运行程序

```bash
streamlit run xxxx.py
```

运行后会自动打开浏览器访问 `http://localhost:8501`

---

## 三、Streamlit常用API

### 文本与标题

| API | 说明 | 示例 |
| --- | --- | --- |
| `st.title()` | 页面主标题 | `st.title("我的应用")` |
| `st.header()` | 二级标题 | `st.header("章节标题")` |
| `st.subheader()` | 三级标题 | `st.subheader("小节标题")` |
| `st.write()` | 通用写入方法，支持多种类型 | `st.write("Hello World")` |
| `st.markdown()` | 支持Markdown语法 | `st.markdown("**加粗**")` |
| `st.text()` | 纯文本输出 | `st.text("纯文本内容")` |
| `st.code()` | 代码块展示 | `st.code("print('hello')")` |
| `st.caption()` | 小字说明 | `st.caption("这是说明文字")` |

### 数据展示

| API | 说明 | 示例 |
| --- | --- | --- |
| `st.image()` | 显示图片 | `st.image("cat.jpg")` |
| `st.table()` | 静态表格 | `st.table(data)` |
| `st.dataframe()` | 可交互数据框 | `st.dataframe(df)` |
| `st.json()` | 显示JSON数据 | `st.json(data)` |
| `st.metric()` | 指标卡片 | `st.metric("温度", "26°C")` |

### 图表展示

| API | 说明 |
| --- | --- |
| `st.line_chart()` | 折线图 |
| `st.bar_chart()` | 柱状图 |
| `st.area_chart()` | 面积图 |
| `st.scatter_chart()` | 散点图 |
| `st.pyplot()` | Matplotlib图表 |
| `st.plotly_chart()` | Plotly图表 |

### 交互组件

| API | 说明 | 示例 |
| --- | --- | --- |
| `st.button()` | 按钮 | `st.button("点击我")` |
| `st.text_input()` | 文本输入框 | `st.text_input("请输入姓名")` |
| `st.text_area()` | 多行文本区域 | `st.text_area("请输入内容")` |
| `st.number_input()` | 数字输入 | `st.number_input("请输入年龄")` |
| `st.selectbox()` | 下拉选择框 | `st.selectbox("选择", ["A","B"])` |
| `st.multiselect()` | 多选下拉 | `st.multiselect("多选", ["A","B"])` |
| `st.slider()` | 滑块 | `st.slider("选择", 0, 100)` |
| `st.date_input()` | 日期选择 | `st.date_input("选择日期")` |
| `st.time_input()` | 时间选择 | `st.time_input("选择时间")` |
| `st.file_uploader()` | 文件上传 | `st.file_uploader("上传文件")` |
| `st.color_picker()` | 颜色选择器 | `st.color_picker("选择颜色")` |
| `st.checkbox()` | 复选框 | `st.checkbox("同意协议")` |
| `st.radio()` | 单选按钮 | `st.radio("选择", ["A","B"])` |

### 布局与容器

| API | 说明 |
| --- | --- |
| `st.sidebar` | 侧边栏容器 |
| `st.columns()` | 多列布局 |
| `st.tabs()` | 标签页布局 |
| `st.expander()` | 可展开区域 |
| `st.container()` | 容器 |
| `st.divider()` | 分隔线 |
| `st.empty()` | 空占位符 |

### 状态与反馈

| API | 说明 |
| --- | --- |
| `st.success()` | 成功提示（绿色） |
| `st.error()` | 错误提示（红色） |
| `st.warning()` | 警告提示（黄色） |
| `st.info()` | 信息提示（蓝色） |
| `st.spinner()` | 加载动画 |
| `st.progress()` | 进度条 |
| `st.toast()` | 临时提示消息 |
| `st.balloons()` | 气球动画（庆祝效果） |

---

## 四、入门示例

```python
import streamlit as st

# 标题
st.title("AI智能伴侣")

# 段落
st.write("这是一个基于Streamlit构建的AI对话应用")

# 图片
st.image("cat.jpg")

# 分隔线
st.divider()

# 表格
data = {
    "姓名": ["王林", "李慕婉", "贝罗"],
    "学号": ["20230001", "20230002", "20230003"],
    "语文": [80, 90, 85],
    "数学": [87, 92, 87],
    "英语": [90, 85, 90]
}
st.table(data)

# 输入框
name = st.text_input("请输入你的名字")
if name:
    st.write(f"你好，{name}！")

# 按钮
if st.button("点击我"):
    st.success("按钮已点击！")
```

---

## 五、Streamlit运行机制

### 脚本从上到下执行

Streamlit程序从第一行开始，从上到下依次执行。

### 每次交互重新运行

当用户与页面交互（点击按钮、输入内容等），整个脚本会**从头重新执行**。

```python
# 这是Streamlit的重要特性
# 每次交互都会重新运行整个脚本
import streamlit as st

st.write("这段文字每次都会显示")

# 按钮点击后，整个脚本重新运行
if st.button("点击"):
    st.write("按钮被点击了！")  # 只有点击后才显示
```

### 缓存机制

为了避免重复计算，Streamlit提供了缓存装饰器：

```python
import streamlit as st
import time

# 使用缓存，避免重复计算
@st.cache_data
def expensive_computation(a, b):
    time.sleep(2)  # 模拟耗时计算
    return a + b

# 第一次调用会执行计算，之后直接返回缓存结果
result = expensive_computation(1, 2)
st.write(f"结果: {result}")
```

| 缓存装饰器 | 适用场景 |
| --- | --- |
| `@st.cache_data` | 缓存数据（返回可序列化对象） |
| `@st.cache_resource` | 缓存资源（如数据库连接、ML模型） |

---

## 六、多列布局

```python
import streamlit as st

# 创建两列布局
col1, col2 = st.columns(2)

# 在第一列中放置内容
with col1:
    st.header("左列")
    st.write("这是左边的内容")

# 在第二列中放置内容
with col2:
    st.header("右列")
    st.write("这是右边的内容")
```

### 不等宽列布局

```python
# 按比例分配列宽
col1, col2, col3 = st.columns([1, 2, 1])  # 1:2:1比例
```

---

## 七、侧边栏

```python
import streamlit as st

# 侧边栏内容
with st.sidebar:
    st.header("设置")
    model = st.selectbox("选择模型", ["GPT-3.5", "GPT-4", "DeepSeek"])
    temperature = st.slider("温度", 0.0, 2.0, 0.7)
    api_key = st.text_input("API Key", type="password")

# 主区域内容
st.title("AI对话助手")
st.write(f"当前模型: {model}")
```

---

## 八、会话状态（Session State）

Streamlit本身是无状态的，但可以通过 `st.session_state` 在多次交互间保持状态：

```python
import streamlit as st

# 初始化会话状态
if "messages" not in st.session_state:
    st.session_state.messages = []

# 显示历史消息
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

# 输入框
if prompt := st.chat_input("请输入你的问题"):
    # 显示用户消息
    with st.chat_message("user"):
        st.write(prompt)
    
    # 添加到历史记录
    st.session_state.messages.append({"role": "user", "content": prompt})
    
    # 模拟AI回复
    response = f"这是AI对'{prompt}'的回复"
    with st.chat_message("assistant"):
        st.write(response)
    
    st.session_state.messages.append({"role": "assistant", "content": response})
```

---

## 九、文件上传

```python
import streamlit as st

uploaded_file = st.file_uploader("选择文件", type=["csv", "txt", "pdf"])

if uploaded_file is not None:
    # 读取文件内容
    content = uploaded_file.read()
    st.write("文件内容:")
    st.write(content.decode("utf-8"))
```

---

## 十、项目结构建议

```
my_ai_app/
├── app.py              # 主应用文件
├── requirements.txt    # 依赖包列表
├── .streamlit/
│   └── config.toml     # Streamlit配置
├── pages/              # 多页面应用
│   ├── 1_对话.py
│   └── 2_设置.py
├── utils/              # 工具函数
│   └── ai_chat.py
└── static/             # 静态资源
    └── images/
```

### 多页面应用

在项目根目录创建 `pages/` 文件夹，每个 `.py` 文件就是一个子页面，文件名决定了页面顺序和标题。

---

## 总结口诀

- **Streamlit**：纯Python写网页，无需前端知识
- **安装**：`pip install streamlit` 一键安装
- **运行**：`streamlit run xxx.py` 启动应用
- **核心API**：write/title/button/input，常用组件记心间
- **运行机制**：脚本从上到下跑，交互重跑是特点
- **缓存**：cache_data缓存数据，避免重复计算
- **会话状态**：session_state保持状态，对话历史存里面
- **侧边栏**：sidebar放设置，主区域放内容
