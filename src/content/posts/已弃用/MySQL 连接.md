---
title: MySQL 连接
published: 2026-08-31
tags:
  - MySQL
description: MySQL数据库的命令行客户端连接方式与DBeaver、DbGate等图形化管理工具的安装配置教程
---
安装 MySQL 后，你可以通过以下几种方式连接到 MySQL 服务端：
- 1、使用命令行客户端连接
- 2、使用图形化工具连接

常用 MySQL 图形化管理工具：

---

## 使用 MySQL 二进制方式连接

您可以使用 MySQL 二进制方式进入到 mysql 命令提示符下来连接 MySQL 数据库，格式如下：

``` bash
mysql -u your_username -p
```

**参数说明：**

- `-u` 参数用于指定用户名。
- `-p` 参数表示需要输入密码。

指定主机和端口连接（适用于远程连接）:

``` bash
mysql -h 主机名或IP地址 -P 端口号 -u 用户名 -p
```

例如：

``` bash
mysql -h 127.0.0.1 -P 3306 -u root -p
```

### 实例

以下是从命令行中连接 mysql 服务器的简单实例：

```
[root@host]# mysql -u root -p
Enter password:******
```

按照提示输入密码，并按下 Enter 键。

在登录成功后会出现 mysql> 命令提示窗口，你可以在上面执行任何 SQL 语句。

以上命令执行后，登录成功输出结果如下:

``` bash
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2854760 to server version: 5.0.9

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.
```

在以上实例中，我们使用了 root 用户登录到 MySQL 服务器，当然你也可以使用其他 MySQL 用户登录。

如果用户权限足够，任何用户都可以在 MySQL 的命令提示窗口中进行 SQL 操作。

成功连接到 MySQL 后，你可以在命令行中直接执行 SQL 查询。

列出所有可用的数据库：

``` mysql
SHOW DATABASES;
```

选择要使用的数据库：

``` mysql
USE your_database;
```

列出所选数据库中的所有表：

``` mysql
SHOW TABLES;
```

退出 mysql> 命令提示窗口可以使用 exit 命令，如下所示：

``` mysql
mysql> EXIT;
Bye
```

或者使用：

``` mysql
mysql> QUIT;
```

或者按下 Ctrl + D（在 Unix/Linux 系统中）。

---

## 数据库管理工具

### 1\. DBeaver

DBeaver是一款免费、开源、跨平台的数据库管理工具。

DBeaver 支持多种数据库系统，包括 MySQL、PostgreSQL、MariaDB、SQLite、Oracle、DB2、SQL Server、Sybase、MS Access、Teradata、Firebird、Derby 等。

下载地址： [https://dbeaver.io/download/](https://dbeaver.io/download/)

![](https://www.runoob.com/wp-content/uploads/2014/03/mysql-db-client-1.webp)

### 2\. DbGate

DbGate 是一款跨平台的数据库管理工具，支持多种数据库系统，包括 MySQL、PostgreSQL、Microsoft SQL Server、SQLite、MongoDB 等。

DbGate 支持在 Windows、Linux 和 Mac 操作系统上运行，为用户提供了跨平台的灵活性。

DbGate 不仅仅是本地应用程序，还可以作为 Web 应用程序运行，使用户能够通过浏览器轻松访问和管理数据库。

下载地址： [https://dbgate.org/download/](https://dbgate.org/download/)

![](https://www.runoob.com/wp-content/uploads/2014/03/mysql-db-client-2.webp)

---

## 操作练习

- [x] 练习 1：使用命令行连接 MySQL

1.  打开 Windows 的命令提示符（按 `Win + R`，输入 `cmd`，然后回车）。
2.  在命令提示符中，输入以下命令并回车：
    ```bash
    mysql -u root -p
    ```
3.  系统会提示你输入密码。输入你的 MySQL root 用户密码（密码输入时不会显示字符，这是正常的），然后按回车。
4.  如果看到 `mysql>` 提示符，说明连接成功。
5.  在 `mysql>` 提示符下，输入 `exit;` 或 `quit;` 退出连接。

- [x] 练习 2：使用图形化工具 DBeaver 连接 MySQL

1.  从官网 [https://dbeaver.io/download/](https://dbeaver.io/download/) 下载并安装 DBeaver（Windows 版）。
2.  启动 DBeaver。
3.  点击左上角的“新建数据库连接”按钮（插头形状的图标），或点击菜单栏的“数据库” -> “新建数据库连接”。
4.  在弹出的窗口中，选择“MySQL”，然后点击“下一步”。
5.  在“连接设置”窗口中，填写以下信息：
    -   **服务器主机**：`localhost` 或 `127.0.0.1`（如果 MySQL 在本机）。
    -   **端口**：`3306`（MySQL 默认端口）。
    -   **数据库**：可以留空，或输入一个已存在的数据库名（如 `test`）。
    -   **用户名**：`root`（或你的 MySQL 用户名）。
    -   **密码**：输入你的 MySQL 密码。
6.  点击“测试连接”按钮。如果提示“已连接”，说明设置正确。
7.  点击“完成”保存连接。现在你可以在左侧的“数据库导航”中看到你的 MySQL 服务器，并像操作文件夹一样浏览数据库和表。

- [x] 练习 3：连接后执行基本 SQL 查询

1.  使用练习 1 的方法（命令行）或练习 2 的方法（DBeaver）连接到 MySQL。
2.  在连接状态下，执行以下 SQL 命令，查看服务器上有哪些数据库：
    ```sql
    SHOW DATABASES;
    ```
3.  选择一个数据库进行操作（例如，选择 `test` 数据库。如果 `test` 不存在，可以先创建一个：`CREATE DATABASE test;`）：
    ```sql
    USE test;
    ```
4.  查看当前数据库中有哪些表（可能为空，这是正常的）：
    ```sql
    SHOW TABLES;
    ```
5.  退出连接：
    -   如果是命令行：输入 `exit;`。
    -   如果是 DBeaver：直接关闭连接标签页或退出程序即可。