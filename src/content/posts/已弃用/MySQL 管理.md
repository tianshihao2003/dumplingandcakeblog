---
title: MySQL 管理
published: 2026-08-31
tags:
  - MySQL
description: MySQL服务器在Windows/Linux/Mac下的启动关闭、用户创建与权限管理、my.cnf配置文件参数详解及常用管理命令汇总
---
## 启动及关闭 MySQL 服务器

### Windows 系统下

**启动 MySQL 服务器:**

1、 **通过 "服务" 管理工具：** 打开"运行"对话框（Win + R），输入 **services.msc** ，找到"MySQL"服务，右击选择"启动"。

**2、通过命令提示符：** 打开命令提示符（以管理员身份），输入以下命令：

``` bash
net start mysql
```

**关闭MySQL服务器:**

1、 **通过 "服务" 管理工具：** 同样打开"运行"对话框，输入 services.msc，找到 "MySQL" 服务，右击选择"停止"。

2、 **通过命令提示符：** 打开命令提示符（以管理员身份），输入以下命令：

``` bash
net stop mysql
```

### Linux 系统下

**1、启动 MySQL 服务：**

使用 systemd命令（适用于大多数现代 Linux 发行版，如 Ubuntu、CentOS 等）：

``` bash
sudo systemctl start mysql
```

使用 service 命令（在一些较旧的发行版中）：

``` bash
sudo service mysql start
```

**2、关闭 MySQL 服务：**

**使用 systemd：**

```
sudo systemctl stop mysql
```

使用 service 命令：

```
sudo service mysql stop
```

**3、重启 MySQL 服务：**

**使用 systemd：**
```
sudo systemctl restart mysql
```

使用 service 命令：

```
sudo service mysql restart
```

**4、检查 MySQL 服务状态：**

使用 systemd命令：

```
sudo systemctl status mysql
```

使用 service 命令：

```
sudo service mysql status
```

### Mac OS 系统

启动 MySQL 服务：

使用命令行：

```
sudo /usr/local/mysql/support-files/mysql.server start
```

关闭 MySQL 服务：

使用命令行：

```
sudo /usr/local/mysql/support-files/mysql.server stop
```

重启 MySQL 服务：

使用命令行：

```
sudo /usr/local/mysql/support-files/mysql.server restart
```

检查 MySQL 服务状态：

使用命令行：

```
sudo /usr/local/mysql/support-files/mysql.server status
```

以上命令中，mysql 可能会因为安装路径或版本的不同而有所变化。

在 Mac OS 中，MySQL 的安装路径通常是 /usr/local/mysql/，因此启动和关闭 MySQL 服务需要使用这个路径下的 mysql.server 脚本。

---

## MySQL 用户设置

在 MySQL 中，用户设置包括创建用户、设置权限、管理用户等操作。以下是一些常用的 MySQL 用户设置操作，包括创建用户、设置权限、查看和删除用户等。

### 创建用户

要创建一个新用户，你可以使用以下 SQL 命令：

``` mysql
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
```
- `username` ：用户名。
- `host` ：指定用户可以从哪些主机连接。例如， `localhost` 仅允许本地连接， `%` 允许从任何主机连接。
- `password` ：用户的密码。

## 实例

``` mysql
CREATE USER 'john'@'localhost' IDENTIFIED BY 'password123';
```

### 授权权限

创建用户后，你需要授予他们访问权限，使用 GRANT 命令来授予权限：

``` mysql
GRANT privileges ON database_name.* TO 'username'@'host';
```
- `privileges` ：所需的权限，如 `ALL PRIVILEGES` 、 `SELECT` 、 `INSERT` 、 `UPDATE` 、 `DELETE` 等。
- `database_name.*` ：表示对某个数据库或表授予权限。 `database_name.*` 表示对整个数据库的所有表授予权限， `database_name.table_name` 表示对指定的表授予权限。
- `TO 'username'@'host'` ：指定授予权限的用户和主机。

## 实例

``` mysql
GRANT ALL PRIVILEGES ON test\_db.\* TO 'john'@'localhost';
```

### 刷新权限

授予或撤销权限后，需要刷新权限使更改生效：

``` mysql
FLUSH PRIVILEGES;
```

### 查看用户权限

要查看特定用户的权限，可以使用以下命令：

``` mysql
SHOW GRANTS FOR 'username'@'host';
```

## 实例

``` mysql
SHOW GRANTS FOR 'john'@'localhost';
```

### 撤销权限

要撤销用户的权限，使用 REVOKE 命令：

``` mysql
REVOKE privileges ON database_name.* FROM 'username'@'host';
```

## 实例

``` mysql
REVOKE ALL PRIVILEGES ON test\_db.\* FROM 'john'@'localhost';
```

### 删除用户

如果需要删除用户，可以使用以下命令：

``` mysql
DROP USER 'username'@'host';
```

## 实例

``` mysql
DROP USER 'john'@'localhost';
```

### 修改用户密码

要修改用户的密码，可以使用 ALTER USER 命令：

``` mysql
ALTER USER 'username'@'host' IDENTIFIED BY 'new_password';
```

## 实例

``` mysql
ALTER USER 'john'@'localhost' IDENTIFIED BY 'newpassword456';
```

### 修改用户主机

要更改用户的主机（即允许从哪些主机连接），可以先删除用户，再重新创建一个新的用户。

## 实例

\-- 删除旧用户  
``` mysql
DROP USER 'john'@'localhost';  
```
  
\-- 重新创建用户并指定新的主机  
``` mysql
CREATE USER 'john'@'%' IDENTIFIED BY 'password123';
```

### 创建用户时指定权限

在创建用户时，也可以同时授予权限（在 MySQL 8.0.16 及更高版本）：

## 实例

``` mysql
CREATE USER 'john'@'localhost' IDENTIFIED BY 'password123' WITH GRANT OPTION;  
GRANT ALL PRIVILEGES ON test\_db.\* TO 'john'@'localhost';
```

---

## /etc/my.cnf 文件配置

/etc/my.cnf 文件是 MySQL 配置文件，用于配置 MySQL 服务器的各种参数和选项。

一般情况下，你不需要修改该配置文件，该文件默认配置如下：

```
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock

[mysql.server]
user=mysql
basedir=/var/lib

[safe_mysqld]
err-log=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

在配置文件中，你可以指定不同的错误日志文件存放的目录，一般你不需要改动这些配置。

/etc/my.cnf 文件在不同的系统和 MySQL 版本中可能有所不同，但是一般包含以下几个部分：

### 1\. 基本设置

- `basedir`: MySQL 服务器的基本安装目录。
- `datadir`: 存储 MySQL 数据文件的位置。
- `socket`: MySQL 服务器的 Unix 套接字文件路径。
- `pid-file`: 存储当前运行的 MySQL 服务器进程 ID 的文件路径。
- `port`: MySQL 服务器监听的端口号，默认是 3306。

### 2\. 服务器选项

- `bind-address`: 指定 MySQL 服务器监听的 IP 地址，可以是 IP 地址或主机名。
- `server-id`: 在复制配置中，为每个 MySQL 服务器设置一个唯一的标识符。
- `default-storage-engine`: 默认的存储引擎，例如 InnoDB 或 MyISAM。
- `max_connections`: 服务器可以同时维持的最大连接数。
- `thread_cache_size`: 线程缓存的大小，用于提高新连接的启动速度。
- `query_cache_size`: 查询缓存的大小，用于提高相同查询的效率。
- `default-character-set`: 默认的字符集。
- `collation-server`: 服务器的默认排序规则。

### 3\. 性能调优

- `innodb_buffer_pool_size`: InnoDB 存储引擎的缓冲池大小，这是 InnoDB 性能调优中最重要的参数之一。
- `key_buffer_size`: MyISAM 存储引擎的键缓冲区大小。
- `table_open_cache`: 可以同时打开的表的缓存数量。
- `thread_concurrency`: 允许同时运行的线程数。

### 4\. 安全设置

- `skip-networking`: 禁止 MySQL 服务器监听网络连接，仅允许本地连接。
- `skip-grant-tables`: 以无需密码的方式启动 MySQL 服务器，通常用于恢复忘记的 root 密码，但这是一个安全风险。
- `auth_native_password=1`: 启用 MySQL 5.7 及以上版本的原生密码认证。

### 5\. 日志设置

- `log_error`: 错误日志文件的路径。
- `general_log`: 记录所有客户端连接和查询的日志。
- `slow_query_log`: 记录执行时间超过特定阈值的慢查询。
- `log_queries_not_using_indexes`: 记录未使用索引的查询。

### 6\. 复制设置

- `master_host` 和 `master_user`: 主服务器的地址和复制用户。
- `master_password`: 复制用户的密码。
- `master_log_file` 和 `master_log_pos`: 用于复制的日志文件和位置。

---

## 管理MySQL的命令

以下列出了使用Mysql数据库过程中常用的命令：

- **USE *数据库名***:  
	选择要操作的Mysql数据库，使用该命令后所有Mysql命令都只针对该数据库。
	```
	mysql> use RUNOOB;
	Database changed
	```
- **SHOW DATABASES:**  
	列出 MySQL 数据库管理系统的数据库列表。
	```
	mysql> SHOW DATABASES;
	+--------------------+
	| Database           |
	+--------------------+
	| information_schema |
	| RUNOOB             |
	| cdcol              |
	| mysql              |
	| onethink           |
	| performance_schema |
	| phpmyadmin         |
	| test               |
	| wecenter           |
	| wordpress          |
	+--------------------+
	10 rows in set (0.02 sec)
	```
- **SHOW TABLES:**  
	显示指定数据库的所有表，使用该命令前需要使用 use 命令来选择要操作的数据库。
	```
	mysql> use RUNOOB;
	Database changed
	mysql> SHOW TABLES;
	+------------------+
	| Tables_in_runoob |
	+------------------+
	| employee_tbl     |
	| runoob_tbl       |
	| tcount_tbl       |
	+------------------+
	3 rows in set (0.00 sec)
	```
- **SHOW COLUMNS FROM *数据表*:**  
	显示数据表的属性，属性类型，主键信息 ，是否为 NULL，默认值等其他信息。
	```
	mysql> SHOW COLUMNS FROM runoob_tbl;
	+-----------------+--------------+------+-----+---------+-------+
	| Field           | Type         | Null | Key | Default | Extra |
	+-----------------+--------------+------+-----+---------+-------+
	| runoob_id       | int(11)      | NO   | PRI | NULL    |       |
	| runoob_title    | varchar(255) | YES  |     | NULL    |       |
	| runoob_author   | varchar(255) | YES  |     | NULL    |       |
	| submission_date | date         | YES  |     | NULL    |       |
	+-----------------+--------------+------+-----+---------+-------+
	4 rows in set (0.01 sec)
	```
- **SHOW INDEX FROM *数据表*:**  
	显示数据表的详细索引信息，包括PRIMARY KEY（主键）。
	```
	mysql> SHOW INDEX FROM runoob_tbl;
	+------------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
	| Table      | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
	+------------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
	| runoob_tbl |          0 | PRIMARY  |            1 | runoob_id   | A         |           2 |     NULL | NULL   |      | BTREE      |         |               |
	+------------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
	1 row in set (0.00 sec)
	```
- **SHOW TABLE STATUS \[FROM db\_name\] \[LIKE 'pattern'\] \\G:**  
	该命令将输出Mysql数据库管理系统的性能及统计信息。
	```
	# 显示数据库 RUNOOB 中所有表的信息
	mysql> SHOW TABLE STATUS  FROM RUNOOB;   
	# 表名以runoob开头的表的信息
	mysql> SHOW TABLE STATUS from RUNOOB LIKE 'runoob%';   
	# 加上 \G，查询结果按列打印  
	mysql> SHOW TABLE STATUS from RUNOOB LIKE 'runoob%'\G; 
	```

Gif 图演示：

![](https://img.tsh520.cn/file/blog/article/mysql-admin(1).gif)