---
title: RESTful接口规范
published: 2026-09-20
description: REST 架构风格：用 URL 定位资源、用 HTTP 动词描述操作，以及传统风格与 REST 风格接口的对比
tags:
  - Python
  - Web开发
order: 65
---

## RESTful 是什么

Restful 指的是**遵循 REST 架构风格的 API 接口服务**，而 REST（REpresentational State Transfer，表述性状态转换）是一种软件架构风格。

它解决的是"接口怎么起名字"的问题：

| 传统风格 url | 请求方式 | 含义 | 备注 |
| --- | --- | --- | --- |
| `/user/getById?id=1` | GET | 查询 id 为 1 的用户 | 不规范、难维护 |
| `/user/saveUser` | POST | 新增用户 | |
| `/user/updateUser` | POST | 修改用户 | |
| `/user/deleteUser?id=1` | GET | 删除 id 为 1 的用户 | |

| REST 风格 url | 请求方式 | 含义 |
| --- | --- | --- |
| `/users/1` | GET | 查询 id 为 1 的用户 |
| `/users` | POST | 新增用户 |
| `/users` | PUT | 修改用户 |
| `/users/1` | DELETE | 删除 id 为 1 的用户 |

## 两条核心特点

1. **URL 定位资源**：地址里只写"操作哪个资源"，不写动作（所以不出现 `getById`、`saveUser` 这类动词）
2. **HTTP 动词描述操作**：具体做什么由请求方式决定

| 请求方式 | 操作 |
| --- | --- |
| GET | 查询 |
| POST | 新增 |
| PUT | 修改 |
| DELETE | 删除 |

> [!NOTE]
> 两个容易踩的点：
> ① **REST 是风格、是约定，不是规定**——约定可以打破。
> ② 描述"功能模块"通常用**复数形式**（加 s）表示这一类资源而非单个资源：`users`、`books`、`items`。

## 本项目用到的接口（对照理解）

| 接口 | 方式 | 含义 |
| --- | --- | --- |
| `/api/sessions` | POST | 新建会话 |
| `/api/sessions` | GET | 获取会话列表 |
| `/api/sessions/{id}` | GET | 查询指定会话 |
| `/api/sessions/{id}` | DELETE | 删除指定会话 |
| `/api/chat` | POST | 与 AI 交互（提交一条消息） |

## 相关

- [汉字谜盒-环境搭建与静态资源](/posts/编程学习/python学习笔记/66-汉字谜盒-环境搭建与静态资源/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. REST 全称 ____，中文 ____，它是一种软件 ____
2. REST 的两条特点：用 ____ 定位资源，用 ____ 描述操作
3. 四种请求方式对应的操作：GET ____、POST ____、PUT ____、DELETE ____
4. 描述功能模块时通常用 ____ 形式（如 users、books）
5. REST 是 ____（风格/规定），约定 ____（可以/不可以）打破

> [!TIP]- 填空答案（做完再点开）
> 1. REpresentational State Transfer / 表述性状态转换 / 架构风格　2. URL / HTTP 动词　3. 查询 / 新增 / 修改 / 删除　4. 复数　5. 风格 / 可以

### 二、概念与动手

- [ ] **2-1** 把 `/book/getBookById?id=5`、`/book/addBook`、`/book/delete?id=5` 三个传统接口改写成 REST 风格
- [ ] **2-2** 一个"学生管理"系统要支持：查列表、查单个、新增、修改、删除，写出 5 个 REST 接口（路径 + 方式）
- [ ] **2-3** 为什么 DELETE 用 `/users/1` 而不是 `/users/delete/1`？（用"URL 定位资源"这句话解释）

> [!TIP]- 参考答案（做完再点开）
> **2-1**
> ```text
> GET    /books/5      查询 id 为 5 的图书
> POST   /books        新增图书
> DELETE /books/5      删除 id 为 5 的图书
> ```
> **2-2**
> ```text
> GET    /students        查询列表
> GET    /students/{id}   查询单个
> POST   /students        新增
> PUT    /students/{id}   修改
> DELETE /students/{id}   删除
> ```
> **2-3** 因为 URL 只负责**定位资源**（"要操作 id 为 1 的那个用户"），"要做什么"由 HTTP 动词（DELETE）表达。把动作塞进 URL 里（`/users/delete/1`）就退化成了传统风格，又多又乱。