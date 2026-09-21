---
title: RAG入门与文档加载切分
published: 2026-09-21
description: 大模型的三个局限与 RAG 的六个环节，文档加载器（Document 对象、txt/csv/json/pdf/word/markdown/html）与文档切分器（五种策略、四种实现、chunk 参数与实测）
tags:
  - LangChain
  - AI
order: 24
---

## 大模型的三个局限

| 局限 | 说明 |
| --- | --- |
| **知识滞后** | LLM 训练数据有**截止日期**，无法反映最新信息。比如"请推荐当前热门影片"这类时间敏感的问题 |
| **知识缺失** | 训练依赖网络上**海量公开的静态数据**，某些**特定领域**（企业内部资料、专有技术文档）或**你的私有数据**是缺乏的 |
| **幻觉** | 模型会"胡言乱语"：错误陈述、编造事实、错误推理，或复杂语境下理解不足 |

**幻觉为什么严重**：大模型生成内容不可控。在**金融、医疗**等领域，**一次金额评估错误、一次诊断失误，哪怕只出现一次都是致命的**——而对非专业人士来说可能难以辨识。目前还没有能 100% 解决这个问题的方案。

幻觉产生的原因有四条：训练知识存在**偏差**、训练时**过度泛化**、**没有真正理解**训练数据的深层含义、**缺乏某些领域知识**时会编造不存在的信息。

**当前的共识方案**：① 先为大模型**提供一定的上下文信息**，让输出更稳定；② 用 RAG 把**检索出来的文档 + 提示词**一起送给大模型，生成更可靠的答案。

## 什么是 RAG

**RAG（Retrieval-Augmented Generation，检索增强生成）** 是一种结合**信息检索**与**文本生成**的技术，目的是提升大语言模型回答专业问题时的**准确性和可靠性**。

> 打个比方：如果说 LangChain 相当于给 LLM 这个"大脑"安装"四肢和躯干"，那么 **RAG 就是为 LLM 提供了接入"人类知识图书馆"的能力**。

目前已有非常多的产品几乎完全建立在 RAG 之上：**客服系统**、基于大模型的数据分析，以及成千上万的数据驱动聊天应用。

| RAG 的优点 | RAG 的缺点 |
| --- | --- |
| 相比提示词工程，有更丰富的上下文和数据样本，不需要用户提供过多背景描述 | 每次问答都涉及外部系统数据检索，**响应时延相对较高** |
| 相比模型微调，能提升问答内容的**时效性和可靠性** | 引用的外部知识数据会**消耗大量模型 Token** |
| 在一定程度上保护业务数据的**隐私性** | |

## RAG 工作流程（六个环节）

```text
Source（数据源） → Load（加载） → Transform（转换，含切分） → Embed（嵌入） → Store（存储） → Retrieve（检索） → 生成回答
```

| 环节 | 说明 |
| --- | --- |
| **1. Source（数据源）** | 外挂的知识库。类型多样：视频、图片、文本、代码、文档；形式多样：上百个 csv、上千个 json、上万个 pdf，或某业务系统的 API、网站实时数据 |
| **2. Load（加载）** | **文档加载器**把非结构化文本加载到内存，成为 **Document 对象**（包含内容和元数据）。支持**延迟加载**（lazy load）以缓解大文件的内存压力 |
| **3. Transform（转换）** | **文档转换器**：文本拆分器、冗余过滤器、元数据提取器、多语言转换器、对话转换器。**其中拆分器是必须的** |
| **3.1 Text Splitting** | 切块之后才能向量化并入库。LangChain 不仅能切普通文本，还能切 Markdown、JSON、HTML、代码 |
| **4. Embed（嵌入）** | 把文本转成**向量表示**，使相似文本在向量空间中距离相近（"猫"和"犬"的向量夹角小于"猫"和"汽车"） |
| **5. Store（存储）** | 把嵌入存进**向量数据库**或缓存，避免重复计算 |
| **6. Retrieve（检索）** | **检索器**响应非结构化查询、返回符合条件的文档；通过配置不同检索器平衡精度、召回率与效率 |

> [!IMPORTANT]
> 课程特别强调：**拆分/分块是整条链路中最具挑战性的环节之一，它显著影响检索效果**。目前**没有通用方法**能说清哪种分块策略最有效——不同场景、不同数据类型都会影响选择。

## 环境准备

RAG 涉及的依赖较多且大，**不在之前的依赖文件里**，需要单独补装：

```bash
pip install -r requirements_full.txt     # 完整版依赖（见资料目录）
pip check                                # 检查依赖冲突，正常输出 No broken requirements found.
```

再把 `knowledge.txt` 放到项目根目录，`asset` 文件夹解压后同样放到根目录。

## 文档加载器（Document Loaders）

**Document 对象**是加载的产物，它有两部分：**`page_content`（文档内容）+ `metadata`（元数据）**。

```python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("./test.txt", encoding="utf-8")
docs = loader.load()
print(docs[0].page_content)     # 文档内容
print(docs[0].metadata)         # {'source': './test.txt'}
```

各类格式的加载器（完整列表见官方 Integrations → Document loaders）：

| 格式 | 加载器 | 备注 |
| --- | --- | --- |
| txt | `TextLoader` | 最基础 |
| CSV | `CSVLoader` | 每行变成一个 Document，metadata 带 `row` |
| JSON | `JSONLoader` | 用 `jq_schema` 指定要抽取的字段 |
| PDF | `PyPDFLoader` | 每页一个 Document |
| Word | `Docx2txtLoader` 等 | 需额外依赖 |
| Markdown | `UnstructuredMarkdownLoader` | 需额外依赖 |
| HTML | `BSHTMLLoader` 等 | 需 `lxml` 等 |
| 目录 | `DirectoryLoader` | 批量加载整个文件夹，可按后缀过滤 |

> [!NOTE]
> **本机实测（conda 环境 `langchain1.2`）**：装好基础依赖后，`TextLoader`、`CSVLoader`、`PyPDFLoader` **可以直接用**；
> 而 `JSONLoader` 提示 `ImportError: jq package not found`（`pip install jq`）、`UnstructuredMarkdownLoader` 提示 `No module named 'unstructured'`、`BSHTMLLoader` 提示需要 `lxml`。
> **结论：用哪个格式的加载器，就按提示补它需要的依赖**——这些都在 `requirements_full.txt` 里。

**加载 + 切分可以一步完成**：加载器自带 `load_and_split()`：

```python
loader = CSVLoader("../asset/load/02-load.csv", encoding="utf-8")
docs = loader.load_and_split()          # 加载并按默认切分器切分
texts = [doc.page_content for doc in docs]
```

## 文档切分器（Text Splitters）

### 为什么必须切

**切块之后才能向量化并存入数据库**；同时切块也决定了每次送给模型的上下文片段有多长（要适配模型的上下文窗口限制）。

### 五种切分策略

| 策略 | 做法 | 评价 |
| --- | --- | --- |
| 1. 按句子切分 | 按自然句子边界切，保持语义完整 | 简单场景可用 |
| 2. 按固定字符数切分 | 按字符数硬切 | **可能在不适当的位置切断句子** |
| 3. 固定字符数 + 重叠窗口 | 在方法 2 基础上让相邻块有重叠 | 避免切断关键内容，保持连贯 |
| 4. **递归字符切分** | 递归地动态确定切分点，按文档复杂度调整块大小 | ✅ **通常是首选策略** |
| 5. 按语义内容切分 | 依据语义内容划分块 | 保持语义最完整，但**效率低、块长极不均匀**，不适合所有情况 |

方法 2、3 只看字符、**不考虑语义**，容易造成主题断裂；方法 4 结合了固定长度与语义分析，能更好保证每段落含完整主题；方法 5 精度高但慢。

### 核心参数

以 `CharacterTextSplitter` 为例：

| 参数 | 默认值 | 含义 |
| --- | --- | --- |
| `chunk_size` | 4000 | 每个切块的**最大字符数** |
| `chunk_overlap` | 200 | 相邻两个切块之间的**最大重叠字符数**（保证段间语义完整） |
| `separator` | `"\n\n"` | 分割使用的分隔符 |
| `length_function` | `len` | 计算切块长度的方法 |

> [!WARNING]
> **实测一个反直觉的点**：把 `separator=""` 时表示"**禁用分隔符优先**"。这时切块长度**可能小于 `chunk_size`**（尤其对中文）：
>
> ```python
> cs = CharacterTextSplitter(chunk_size=50, chunk_overlap=5, separator="")
> # 结果：[50 字符的块, 20 字符的块]  ← 第二块只有 20 字
> ```
> 课程提醒：如果必须禁用分隔符（比如处理无空格文本），**要容忍实际块长略小于 `chunk_size`**。

### 四种具体实现（实测）

| 切分器 | 特点 | 实测结果（同一段中文，chunk_size=50） |
| --- | --- | --- |
| `CharacterTextSplitter` | 按字符/分隔符切 | 2 块（50、20 字） |
| `RecursiveCharacterTextSplitter` | **首选**，默认分隔符 `["\n\n", "\n", " ", ""]`，逐级尝试 | 3 块（9、49、16 字）——按换行优先切，块长更贴近语义 |
| `TokenTextSplitter` | 按 **token** 数切（更贴近模型的真实限制） | 5 块（23、16、17、17、5 字）⚠️ 见下方警告 |
| `MarkdownHeaderTextSplitter` | 按 Markdown 标题层级切，**并把标题写进 metadata** | `{'h1': '一级标题', 'h2': '二级标题'}` |

> [!WARNING]
> **中文场景慎用 `TokenTextSplitter`**。本机实测（同一段中文知识拆成 11 块）**有 9 块出现 `�` 乱码**：
>
> ```text
> 块1: ❌ '退换货政策：客户在收到�'
> 块2: ❌ '�品之后 7 个自然日内，如果�'
> ...
> 块11: ❌ '�。'
> ```
>
> 原因：它按 tiktoken 的**字节级 token** 边界切割，一个中文字符可能由多个 token 组成，**在 token 边界切开就会把字符劈成两半**。
> **结论：中文文本老老实实用 `RecursiveCharacterTextSplitter`**（它按字符切，不会有这个问题）。

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=80,
    separators=["\n\n", "\n", "。", " ", ""],   # 切分策略：优先按段落，其次句子
)
chunks = splitter.split_documents(documents)     # 直接吃 Document 列表
print(f"文档共切分为 {len(chunks)} 个 chunk")
```

> [!TIP]
> **实战里最值得抄的一招**：在客服知识库案例中，作者给 `separators` 加了一个**自定义业务分隔符**——`"\n==============================\n"`，也就是知识库里条目之间的分隔线。**先按业务边界切，再按自然语言边界切**，这样更容易让每条知识落在同一个 chunk 里。
>
> **但要注意一个实测坑**：`RecursiveCharacterTextSplitter` 默认 `keep_separator=True`（把分隔符留在块里），于是**那行分隔线会自己变成一个"只有一行等号"的块**，白占一个向量库名额：
>
> ```text
> keep_separator=True（默认）→ 3 块
>   块1(48): '退换货政策：客户在收到商品之后 7 个自然日内可以申请无理由退货，15 个自然日内可以申请换货。'
>   块2(30): '=============================='        ← 只装分隔符的块
>   块3(36): '发货时间：订单支付成功后 24 小时内发货，遇到大促或法定节假日会顺延。'
>
> keep_separator=False → 2 块
>   块1(48): '退换货政策：…'
>   块2(36): '发货时间：…'
> ```
>
> **所以用业务分隔符时，记得一起设置 `keep_separator=False`**（或者事后再过滤掉这种"只有分隔符"的块）。
>
> 另外注意 `split_documents(documents)` 与 `split_text(text)` 的区别：前者吃 `Document` 列表、返回 `Document` 列表（**保留并合并 metadata**），后者吃纯字符串。

## 相关

- [嵌入模型与向量存储实战](/posts/编程学习/langchain学习笔记/25-嵌入模型与向量存储实战/)
- [Agent的结构化输出](/posts/编程学习/langchain学习笔记/16-agent的结构化输出/)
- [实战多功能智能助手](/posts/编程学习/langchain学习笔记/18-实战多功能智能助手/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. 大模型的三个局限：知识____、知识____、____
2. RAG 的全称是____，它结合了信息____与文本____
3. RAG 相比提示词工程的优点是上下文更____；相比模型微调的优点是能提升____和可靠性；缺点是响应____较高、消耗大量____
4. RAG 六个环节：Source → ____ → Transform → ____ → Store → ____
5. 加载器把数据加载成 ____ 对象，它由 `____` 和 `metadata` 两部分组成
6. 加载器用 `____()` 加载、用 `____()` 一步完成加载+切分
7. 五种切分策略中最常用的是____字符切分；它通过____方式动态确定切分点
8. `CharacterTextSplitter` 的两个核心参数：`____`（每块最大字符数，默认 4000）和 `____`（块间重叠字符数，默认 200）
9. 按 Markdown 标题切分的切分器是 `____TextSplitter`，它会把标题写进____
10. `split_documents()` 吃的是 Document 列表，返回的也是____列表（保留 metadata）；`split_text()` 吃的是____

> [!TIP]- 填空答案（做完再点开）
> 1. 滞后 / 缺失 / 幻觉　2. Retrieval-Augmented Generation（检索增强生成） / 检索 / 生成　3. 丰富 / 时效性 / 时延 / Token　4. Load / Embed / Retrieve　5. Document / `page_content`　6. `load` / `load_and_split`　7. 递归 / 递归　8. `chunk_size` / `chunk_overlap`　9. `MarkdownHeader` / metadata　10. Document / 纯字符串

### 二、裸写题

- [ ] **2-1 加载一个 txt 并看清 Document 对象**
  自己造一个 `test.txt`（写两三句中文），用 `TextLoader` 加载，打印：文档数量、`page_content`、`metadata`。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：加载器干的事就是"读文件 → 包成 Document"
  > **二级 · 方法**：`TextLoader("test.txt", encoding="utf-8").load()`
  > **三级 · 骨架**：中文文件**一定要显式传 `encoding="utf-8"`**，否则 Windows 下可能乱码

- [ ] **2-2 三种切分器对比**
  用同一段 100 字左右的中文，分别用 `CharacterTextSplitter(chunk_size=50)`、`RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=10)`、`TokenTextSplitter(chunk_size=33)` 切分，打印每块的**长度和内容**，比较差异。

  > [!TIP]- 提示
  > **一级 · 思路**：都是"切"，差别在"从哪里下刀"
  > **二级 · 方法**：`splitter.split_text(text)`
  > **三级 · 骨架**：观察 Recursive 是否更倾向在换行/句号处断开

- [ ] **2-3 用 Markdown 切分器保住标题结构**
  造一个带 `# 一级标题`、`## 二级标题` 的 md 文本，用 `MarkdownHeaderTextSplitter(headers_to_split_on=[('#', 'h1'), ('##', 'h2')])` 切分，打印每块的 `content` 和 `metadata`。

  > [!TIP]- 提示
  > **一级 · 思路**：标题变成了 metadata，正文才是 content
  > **二级 · 方法**：`headers_to_split_on` 是 `(标题符号, 元数据键名)` 的元组列表
  > **三级 · 骨架**：想一想：检索时"标题进 metadata"有什么用？（提示：可以按章节过滤）

### 三、综合题

- [ ] **3-1 给一份知识文档设计切分方案**
  自造一份"客服知识库"文本：**3 条较长的问答**（每条 100 字以上），条目之间用 `\n==============================\n` 分隔。然后依次做四件事：
  1. 用 `TextLoader` 加载成 `Document`
  2. 用 `RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0, separators=[分隔线, "\n\n", "\n", "。", " "])` 切分，打印每块的字符数和内容
  3. 观察两个现象：**长条目会被切成两块**、**那行分隔线自己成了一个块**；然后加上 `keep_separator=False` 再切一次，看分隔线块是否消失
  4. 再用 `TokenTextSplitter(chunk_size=30)` 切同一段中文，检查有没有出现 `�` 乱码，并解释原因

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：切分的目标不是"块数少"，而是"每块自成一个小主题、且不含垃圾内容"
  > **二级 · 方法**：`separators=[sep, "\n\n", "\n", "。", " "]` + `keep_separator=False`
  > **三级 · 骨架**：判断"垃圾块"的简单标准——`chunk.page_content` 里有没有实际信息（比如只剩分隔线就得处理掉）

> [!TIP]- 参考答案（做完再点开）
> ```python
> import os
>
> from langchain_community.document_loaders import TextLoader
> from langchain_text_splitters import (
>     CharacterTextSplitter,
>     MarkdownHeaderTextSplitter,
>     RecursiveCharacterTextSplitter,
>     TokenTextSplitter,
> )
>
> BASE = os.path.dirname(os.path.abspath(__file__))
>
> # ---------- 2-1 加载 txt ----------
> txt_path = os.path.join(BASE, "test.txt")
> with open(txt_path, "w", encoding="utf-8") as f:
>     f.write("LangChain 是一个用于开发语言模型应用的框架。\n它提供了一套工具和抽象。\n")
>
> docs = TextLoader(txt_path, encoding="utf-8").load()
> print("文档数量:", len(docs))
> print("内容:", docs[0].page_content)
> print("元数据:", docs[0].metadata)
>
> # ---------- 2-2 三种切分器对比 ----------
> text = ("LangChain 是一个用于开发由语言模型驱动的应用程序的框架，"
>         "它提供了一套工具和抽象，使开发者能够更容易地构建复杂的应用程序。"
>         "它让模型能够结合检索、记忆与工具调用完成任务。")
>
> cs = CharacterTextSplitter(chunk_size=50, chunk_overlap=0, separator="")
> rs = RecursiveCharacterTextSplitter(chunk_size=50, chunk_overlap=10)
> ts = TokenTextSplitter(chunk_size=33, chunk_overlap=5)
>
> for name, splitter in [("Character", cs), ("Recursive", rs)]:
>     chunks = splitter.split_text(text)
>     print(f"\n【{name}】共 {len(chunks)} 块")
>     for i, c in enumerate(chunks, 1):
>         print(f"  块{i} ({len(c)} 字): {c}")
>
> # ---------- 2-3 Markdown 切分 ----------
> md = "# 一级标题\n\n正文一\n\n## 二级标题\n\n正文二\n"
> md_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=[("#", "h1"), ("##", "h2")])
> for d in md_splitter.split_text(md):
>     print("\ncontent:", repr(d.page_content), "| metadata:", d.metadata)
>
> # ---------- 3-1 知识库切分方案 ----------
> sep = "\n==============================\n"
> entries = [
>     "退换货政策：客户在收到商品之后 7 个自然日内，如果商品不影响二次销售，可以申请无理由退货；"
>     "15 个自然日内，如果商品存在质量问题，可以申请换货。退货运费由谁承担要看具体原因：质量问题由平台承担，"
>     "非质量问题由客户承担。特殊商品（如定制商品、生鲜）不支持无理由退货。",
>     "发货时间：正常情况下，订单支付成功后 24 小时内由仓库安排发货，遇到大促或法定节假日会顺延。"
>     "发货后会推送物流单号，客户可以在订单详情页实时查看物流轨迹。若超过 48 小时仍未发货，可以联系客服加急处理。",
>     "运费说明：单笔订单金额满 99 元包邮；不满 99 元收取 8 元基础运费。偏远地区（新疆、西藏等）单独计费，"
>     "具体金额以下单页面显示为准。会员用户每月享有 3 次免运费权益，权益当月有效，不累计到下个月。",
> ]
>
> kb_path = os.path.join(BASE, "knowledge.txt")
> with open(kb_path, "w", encoding="utf-8") as f:
>     f.write(sep.join(entries))
> documents = TextLoader(kb_path, encoding="utf-8").load()
>
> def show(label, splitter, docs_in):
>     chunks = splitter.split_documents(docs_in)
>     print(f"\n【{label}】{len(chunks)} 块")
>     for i, c in enumerate(chunks, 1):
>         body = c.page_content.replace("\n", "⏎")
>         print(f"  块{i}({len(c.page_content)}字): {body[:60]}{'…' if len(body) > 60 else ''}")
>     return chunks
>
> # ① 默认 keep_separator=True：分隔线会自己变成一个块
> show(
>     "业务分隔线优先（默认 keep_separator=True）",
>     RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0,
>                                    separators=[sep, "\n\n", "\n", "。", " "]),
>     documents,
> )
>
> # ② keep_separator=False：分隔线被丢掉，块更干净
> show(
>     "业务分隔线优先（keep_separator=False）",
>     RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0, keep_separator=False,
>                                    separators=[sep, "\n\n", "\n", "。", " "]),
>     documents,
> )
>
> # ③ TokenTextSplitter 切中文：会出现 � 乱码（按字节级 token 边界切开汉字）
> print("\n【TokenTextSplitter 切中文】")
> tt = TokenTextSplitter(chunk_size=30, chunk_overlap=0)
> for i, c in enumerate(tt.split_text(entries[0]), 1):
>     print(f"  块{i}: {'❌乱码' if '�' in c else '✅正常'} {c[:36]!r}")
>
> # 结论：
> # 1) 中文用 RecursiveCharacterTextSplitter，别用 TokenTextSplitter
> # 2) 用业务分隔符切分时设 keep_separator=False，避免"只有一行等号"的垃圾块进向量库
> ```
