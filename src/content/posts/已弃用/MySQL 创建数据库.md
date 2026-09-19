---
title: MySQL 创建数据库
published: 2026-09-01
tags:
  - MySQL
description: 使用CREATE DATABASE语句和mysqladmin命令行工具创建MySQL数据库的方法，含字符集配置与IF NOT EXISTS防重复
---
我们可以在登陆 MySQL 服务后，使用 create 命令创建数据库，语法如下:

``` mysql
CREATE DATABASE 数据库名;
```

以下命令简单的演示了创建数据库的过程，数据名为 RUNOOB:

```
[root@host]# mysql -u root -p   
Enter password:******  # 登录后进入终端

mysql> create DATABASE RUNOOB;
```

建数据库的基本语法如下：

``` mysql
CREATE DATABASE [IF NOT EXISTS] database_name
  [CHARACTER SET charset_name]
  [COLLATE collation_name];
```

如果你希望在创建数据库时指定一些选项，可以使用 CREATE DATABASE 语句的其他参数，例如，你可以指定字符集和排序规则：

## 实例

``` mysql
CREATE DATABASE mydatabase  
CHARACTER SET utf8mb4  
COLLATE utf8mb4_general_ci;
```

如果数据库已经存在，执行 CREATE DATABASE 将导致错误。

为了避免这种情况，你可以在 CREATE DATABASE 语句中添加 IF NOT EXISTS 子句：

## 实例

``` mysql
CREATE DATABASE IF NOT EXISTS mydatabase;
```

## 使用 mysqladmin 创建数据库

mysqladmin 是 MySQL 提供的一个用于执行管理任务的命令行工具。

通过 mysqladmin，你可以执行各种数据库管理操作，包括创建数据库。

以下是使用 mysqladmin 创建数据库的基本语法：

``` mysql
mysqladmin -u your_username -p create your_database
```
- `-u` 参数用于指定 MySQL 用户名。
- `-p` 参数表示需要输入密码。
- `create` 是执行的操作，表示创建数据库。
- `your_database` 是要创建的数据库的名称。

使用普通用户，你可能需要特定的权限来创建或者删除 MySQL 数据库。

我们这边使用 root 用户登录，root 用户拥有最高权限，可以使用 mysql mysqladmin 命令来创建数据库。

执行上述命令后，系统会提示你输入密码，输入密码后按 Enter 键即可。

以下命令简单的演示了创建数据库的过程，数据名为 RUNOOB:

```
[root@host]# mysqladmin -u root -p create RUNOOB
Enter password:******
```

以上命令执行成功后会创建 MySQL 数据库 RUNOOB。

如果你希望在创建数据库时指定字符集和排序规则，可以使用 -default-character-set 和 -default-collation 参数：

``` mysql
mysqladmin -u your_username -p create your_database \
  --default-character-set=utf8mb4 \
  --default-collation=utf8mb4_general_ci
```

以上代码创建一个使用 utf8mb4 字符集和 utf8mb4\_general\_ci 排序规则的数据库。

请注意，在执行这些命令时，请确保 MySQL 服务器正在运行，并且你有足够的权限执行这些操作。

如果你希望使用 mysqladmin 连接到 MySQL 服务器执行其他管理任务，例如查看服务器状态、重启服务器等，可以使用以下形式的命令：

``` mysql
mysqladmin -u your_username -p your_command
```

在这里，your\_command 是你希望执行的具体管理命令。

例如，要查看 MySQL 服务器的状态，可以使用：

``` mysql
mysqladmin -u your_username -p status
```

这将要求你输入密码，并显示有关服务器状态的信息。

---

## 操作练习

- [x] 练习 1：使用 SQL 语句创建数据库

1.  打开 Windows 的命令提示符（按 `Win + R`，输入 `cmd`，然后回车）。
2.  连接到 MySQL：
    ```bash
    mysql -u root -p
    ```
3.  创建一个名为 `my_first_db` 的数据库：
    ```sql
    CREATE DATABASE my_first_db;
    ```
4.  查看所有数据库，确认 `my_first_db` 已创建：
    ```sql
    SHOW DATABASES;
    ```
5.  再创建一个指定字符集的数据库（使用 `utf8mb4`）：
    ```sql
    CREATE DATABASE my_second_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    ```
6.  再次查看所有数据库，确认 `my_second_db` 也创建成功。

- [x] 练习 2：使用 mysqladmin 命令创建数据库

1.  退出当前 MySQL 连接（输入 `exit;`）。
2.  在 Windows 命令提示符中，使用 `mysqladmin` 创建数据库：
    ```bash
    mysqladmin -u root -p create test_db_from_admin
    ```
3.  输入密码后，数据库将被创建。
4.  重新连接到 MySQL：
    ```bash
    mysql -u root -p
    ```
5.  查看所有数据库，确认 `test_db_from_admin` 已创建：
    ```sql
    SHOW DATABASES;
    ```

- [x] 练习 3：使用 IF NOT EXISTS 子句避免错误

1.  在 MySQL 命令行中，尝试重复创建已经存在的数据库：
    ```sql
    CREATE DATABASE my_first_db;
    ```
    观察系统返回的错误信息。
2.  使用 `IF NOT EXISTS` 子句再次尝试创建同名数据库，观察这次没有错误：
    ```sql
    CREATE DATABASE IF NOT EXISTS my_first_db;
    ```
3.  总结：当你要确保一个数据库存在但又不确定它是否已经存在时，应该使用哪种语法？

