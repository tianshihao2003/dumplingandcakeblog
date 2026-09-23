---
title: RESTful接口规范
published: 2026-09-20
description: REST 架构风格：用 URL 定位资源、用 HTTP 动词描述操作，以及传统风格与 REST 风格接口的对比
image: https://img.tsh520.cn/file/blog/post-covers/python-65-restful.webp
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

1. REST 全称 ____，中文 ____，它是一种软件 ____；遵循 REST 架构风格的接口服务叫作 ____
2. REST 的两条核心特点：用 ____ 定位资源、用 ____ 描述操作；所以地址里只有"要操作哪个 ____"，"要做什么"由 ____ 决定
3. 四种请求方式对应的操作：GET ____、POST ____、PUT ____、DELETE ____
4. 传统 → REST 对照（填"请求方式 + 路径"）：`/user/getById?id=1`（传统用 GET）→ ____ + ____；`/user/saveUser`（传统用 POST）→ ____ + ____；`/user/updateUser`（传统用 POST）→ ____ + ____；`/user/deleteUser?id=1`（传统用 GET）→ ____ + ____
5. 看 REST 接口说含义：`/users` + POST 表示 ____；`/users/1` + GET 表示 ____；`/users` + PUT 表示 ____；`/users/1` + DELETE 表示 ____
6. 描述"功能模块"通常用 ____ 形式（如 `users`、`books`，表示"这一类"而不是单个）；REST 是 ____、是 ____，不是 ____，所以约定 ____（可以 / 不可以）打破
7. 传统风格的毛病：动作被写进了 ____（如 `getById`、`saveUser`），同一个资源的一套增删改查要拼出 ____ 个不同的地址，所以说它"不规范、难 ____"；REST 风格里同一个资源只用 ____ 个地址
8. 本项目的接口（一）：新建会话用 ____ 请求 ____；获取会话列表用 ____ 请求 ____；与 AI 交互（提交一条消息）用 ____ 请求 ____
9. 本项目的接口（二）：查询指定会话用 ____ 请求 ____；删除指定会话用 ____ 请求 ____；地址里的 `{id}` 表示 ____

> [!TIP]- 填空答案（做完再点开）
> 1. REpresentational State Transfer、表述性状态转换、架构风格、RESTful
> 2. URL、HTTP 动词、资源、请求方式
> 3. 查询、新增、修改、删除
> 4. GET、`/users/1`、POST、`/users`、PUT、`/users`、DELETE、`/users/1`
> 5. 新增用户、查询 id 为 1 的用户、修改用户、删除 id 为 1 的用户
> 6. 复数、风格、约定、规定、可以
> 7. URL（地址）、4、维护、1（同一个）
> 8. POST、`/api/sessions`、GET、`/api/sessions`、POST、`/api/chat`
> 9. GET、`/api/sessions/{id}`、DELETE、`/api/sessions/{id}`、id 是路径里的变量（占位符）

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