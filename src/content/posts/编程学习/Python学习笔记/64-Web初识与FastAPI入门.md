---
title: Web初识与FastAPI入门
published: 2026-09-20
description: Web 网站的三个组成部分与 FastAPI 的四步入门用法、两种启动方式，以及 uvicorn 是什么
tags:
  - Python
  - Web开发
order: 64
---

## Web 初识

Web：全球广域网，也称为万维网（www，World Wide Web），能够通过浏览器访问到的网站。

一个 Web 网站由三个核心部分组成：

| 部分 | 作用 | 用什么做 |
| --- | --- | --- |
| 前端程序 | 界面展示 | HTML（结构）+ CSS（表现）+ JavaScript（行为） |
| 服务端程序 | 业务逻辑处理 | Python 里可用 **Django / Flask / FastAPI** |
| 数据库 | 数据存储和管理 | MySQL 等（本章案例用 JSON 文件代替） |

> [!NOTE]
> 前端三件套的分工在第 4 章（爬虫）里已经见过：HTML 管结构、CSS 管样式、JS 管交互。这里要写的是**服务端**。

## FastAPI 是什么

FastAPI 是一个**现代、快速、高性能**的 Web 框架，用于基于标准的 Python **类型提示**构建 API 接口服务。

官网：https://fastapi.org.cn

**API 接口**：应用程序编程接口（Application Programming Interface），就是对外提供的**功能入口**，供别人来调用（比如天气查询的 API 接口）。一次调用的过程就是：客户端发 HTTP 请求 → 服务端返回 HTTP 响应。

## 四步写出第一个接口

```python
from fastapi import FastAPI          # 1. 导入 FastAPI

app = FastAPI()                      # 2. 创建 FastAPI 实例

@app.get("/")                        # 3. 创建路径操作函数，定义访问路径
def root():
    return {"message": "Hello World"}

@app.get("/users")
def get_users():
    return [
        {"id": 1, "name": "张三"},
        {"id": 2, "name": "李四"},
        {"id": 3, "name": "王五"},
    ]

if __name__ == "__main__":           # 4. 运行 FastAPI 服务
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

| 步骤 | 代码 |
| --- | --- |
| 1. 导入 | `from fastapi import FastAPI` |
| 2. 创建实例 | `app = FastAPI()` |
| 3. 定义接口 | `@app.get("/路径")` + 函数（函数返回值就是接口返回的数据） |
| 4. 运行服务 | 命令行 `fastapi dev "xxxx.py"` 或 `uvicorn xxxx:app --reload`；也可以写在代码里 `uvicorn.run(...)` |

## 两种启动方式

```bash
# 方式一：FastAPI 官方 CLI
fastapi dev "main.py"

# 方式二：直接用 uvicorn（xxxx:app 表示"文件:FastAPI实例名"）
uvicorn main:app --reload
```

| 名词 | 说明 |
| --- | --- |
| **uvicorn** | 专门为现代 Python Web 框架（FastAPI、Starlette）设计的**高性能服务器** |
| `main:app` | 文件 `main.py` 里的 `app` 对象 |
| `--reload` | 改代码后自动重启（开发时用） |

> [!TIP]
> 启动后浏览器打开 http://127.0.0.1:8000 就能看到接口返回的 JSON；FastAPI 还自带交互式接口文档，打开 **/docs** 就能直接在网页上试接口——**这也是它比 Django/Flask 更适合做 API 的地方**。

## 相关

- [RESTful接口规范](/posts/编程学习/python学习笔记/65-restful接口规范/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. Web 全称 ____，是能通过 ____ 访问到的网站
2. 网站三部分：____ 负责界面展示、____ 负责业务逻辑、____ 负责数据存储管理
3. 前端网页由 ____（结构）、____（样式）、____（行为）组成
4. Python 中开发服务端可以用 ____、____ 或 ____
5. FastAPI 是____、____、高性能的 Web 框架，基于 Python 的 ____ 提示构建 API
6. API 接口就是对外提供的 ____，供别人调用
7. FastAPI 四步：导入 → 创建 ____ 实例 → 创建 ____ 函数 → 运行服务
8. 两个启动命令：`fastapi ____ "main.py"` 或 `uvicorn ____:app --reload`
9. uvicorn 是专门为 FastAPI/Starlette 设计的 ____ 服务器

> [!TIP]- 填空答案（做完再点开）
> 1. 万维网（World Wide Web）/ 浏览器　2. 前端程序 / 服务端程序 / 数据库　3. HTML / CSS / JavaScript　4. Django、Flask、FastAPI　5. 现代、快速 / 类型　6. 功能入口　7. FastAPI / 路径操作　8. dev / main　9. 高性能

### 二、裸写题

- [ ] **2-1 第一个接口**
  写一个 FastAPI 程序：`/` 返回 `{"message": "Hello World"}`，`/users` 返回 3 个用户的列表。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：创建实例 → 用装饰器把函数"挂"到路径上
  > **二级 · 方法**：`app = FastAPI()` / `@app.get("/")`
  > **三级 · 骨架**：函数返回字典或列表，FastAPI 会自动转成 JSON

- [ ] **2-2 带路径参数的接口**
  再加一个 `/users/{user_id}` 接口：根据路径里的编号返回对应用户（编号不存在就返回提示）。

  > [!TIP]- 提示
  > **一级 · 思路**：路径里的花括号就是"路径参数"，要写进函数形参
  > **二级 · 方法**：`@app.get("/users/{user_id}")` + `def get_user(user_id: int):`
  > **三级 · 骨架**：`user_id: int` 会让 FastAPI 自动把字符串转成整数

- [ ] **2-3 用测试客户端验证**
  不启动服务器，用 FastAPI 自带的 `TestClient` 直接请求两个接口，打印状态码和返回内容。

  > [!TIP]- 提示
  > **一级 · 思路**：像写单元测试一样调接口，不用真的开服务器
  > **二级 · 方法**：`from fastapi.testclient import TestClient` / `client = TestClient(app)`
  > **三级 · 骨架**：`print(response.status_code, response.json())`

> [!TIP]- 参考答案（做完再点开）
> ```python
> from fastapi import FastAPI
> from fastapi.testclient import TestClient
>
> app = FastAPI(title="入门练习")
>
> USERS = [
>     {"id": 1, "name": "张三"},
>     {"id": 2, "name": "李四"},
>     {"id": 3, "name": "王五"},
> ]
>
> @app.get("/")
> def root():
>     return {"message": "Hello World"}
>
> @app.get("/users")
> def get_users():
>     return USERS
>
> @app.get("/users/{user_id}")
> def get_user(user_id: int):
>     for user in USERS:
>         if user["id"] == user_id:
>             return user
>     return {"message": "用户不存在"}
>
> # 2-3：不启动服务器也能测
> if __name__ == "__main__":
>     client = TestClient(app)
>     for path in ["/", "/users", "/users/2", "/users/99"]:
>         resp = client.get(path)
>         print(path, resp.status_code, resp.json())
>
> # 真正启动服务时用：
> #   fastapi dev main.py   或   uvicorn main:app --reload
> ```