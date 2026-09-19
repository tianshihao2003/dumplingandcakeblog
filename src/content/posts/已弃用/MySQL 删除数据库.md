---
title: MySQL 删除数据库
published: 2026-09-01
tags:
  - MySQL
description: 使用DROP DATABASE语句和mysqladmin工具安全删除MySQL数据库的方法，含IF EXISTS防报错与操作注意事项
---

使用普通用户登陆 MySQL 服务器，你可能需要特定的权限来创建或者删除 MySQL 数据库，所以我们这边使用 root 用户登录，root 用户拥有最高权限。

在删除数据库过程中，务必要十分谨慎，因为在执行删除命令后，所有数据将会消失。

## drop 命令删除数据库

drop 命令格式：

``` mysql
DROP DATABASE <database_name>;        -- 直接删除数据库，不检查是否存在
或
DROP DATABASE [IF EXISTS] <database_name>;
```

**参数说明：**

- `IF EXISTS` 是一个可选的子句，表示如果数据库存在才执行删除操作，避免因为数据库不存在而引发错误。
- `database_name` 是你要删除的数据库的名称。

例如删除名为 RUNOOB 的数据库：

``` mysql
-- 直接删除数据库，不检查是否存在
mysql> DROP DATABASE RUNOOB;

-- 删除数据库，如果存在的话
DROP DATABASE IF EXISTS RUNOOB;
```

**注意：** 在执行删除数据库操作前，请确保你确实想要删除数据库及其所有数据，因为该操作是不可逆的。为了避免误操作，通常建议在执行删除之前备份数据库。

## 使用 mysqladmin 删除数据库

你也可以使用 MySQL mysqladmin 命令在终端来执行删除命令。

以下是使用 mysqladmin 删除数据库的命令：

``` bash
mysqladmin -u your_username -p drop your_database
```

**your\_username** 是 MySQL 用户名， **your\_database** 是要删除的数据库的名称。

执行此命令后，系统会提示输入密码，输入密码后按 Enter 键即可删除数据库。

以下实例删除数据库 RUNOOB(该数据库在前一章节已创建)：
```
[root@host]# mysqladmin -u root -p drop RUNOOB
Enter password:******
```

执行以上删除数据库命令后，会出现一个提示框，来确认是否真的删除数据库：

``` mysql
Dropping the database is potentially a very bad thing to do.
Any data stored in the database will be destroyed.

Do you really want to drop the 'RUNOOB' database [y/N] y
Database "RUNOOB" dropped
```

---

## 操作练习

- [x] 练习 1：使用 SQL 语句删除数据库

1.  打开 Windows 的命令提示符（按 `Win + R`，输入 `cmd`，然后回车）。
2.  连接到 MySQL：
    ```bash
    mysql -u root -p
    ```
3.  先创建一个用于练习的数据库：
    ```sql
    CREATE DATABASE test_delete_db;
    ```
4.  查看所有数据库，确认 `test_delete_db` 已创建：
    ```sql
    SHOW DATABASES;
    ```
5.  删除这个数据库：
    ```sql
    DROP DATABASE test_delete_db;
    ```
6.  再次查看所有数据库，确认 `test_delete_db` 已被删除。

- [x] 练习 2：使用 IF EXISTS 子句安全删除

1.  在 MySQL 命令行中，尝试删除一个不存在的数据库：
    ```sql
    DROP DATABASE non_existent_db;
    ```
    观察系统返回的错误信息。
2.  使用 `IF EXISTS` 子句再次尝试删除同名数据库，观察这次没有错误：
    ```sql
    DROP DATABASE IF EXISTS non_existent_db;
    ```
3.  总结：在实际项目中，为什么建议使用 `IF EXISTS` 子句？

- [x] 练习 3：使用 mysqladmin 命令删除数据库

1.  退出当前 MySQL 连接（输入 `exit;`）。
2.  先创建一个用于练习的数据库（在 Windows 命令提示符中）：
    ```bash
    mysqladmin -u root -p create test_admin_delete
    ```
3.  使用 `mysqladmin` 删除这个数据库：
    ```bash
    mysqladmin -u root -p drop test_admin_delete
    ```
4.  系统会提示确认删除，输入 `y` 并按回车。
5.  重新连接到 MySQL，查看所有数据库，确认 `test_admin_delete` 已被删除。
