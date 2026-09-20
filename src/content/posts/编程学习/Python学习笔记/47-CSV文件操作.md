---
title: CSV文件操作
published: 2026-09-19
description: CSV 是逗号分隔值的表格文件格式：手写方式与 csv.DictWriter/DictReader 两种读写方法
tags:
  - Python
  - 爬虫
order: 47
---

## CSV 是什么

CSV：（Comma-Separated Values，逗号分隔值），是一种**简单、通用的文本文件格式**，用于存储表格数据，可以直接使用 Excel 打开。

爬虫抓到的数据通常就存成 CSV。

## 方式一：文件操作的原始方式

把每一行当成普通字符串写，列之间用逗号分隔：

```python
with open("csv_data/01.csv", "w", encoding="utf-8") as f:
    f.write("姓名,年龄,性别,爱好\n")            # 先写表头
    f.write("小王,18,男,'football,Java'\n")     # 再一行一行写数据
    f.write("小李,18,女,Python\n")

# 读：按行读出来即可
with open("csv_data/01.csv", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())
```

> [!WARNING]
> 原始方式的坑：如果某个值**自己带逗号**（如爱好 `football,Java`），会把一行的列数弄乱，只能靠加引号手动规避——所以推荐方式二。

## 方式二：csv 模块（推荐）

```python
import csv

# 写
with open("csv_data/02.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["姓名", "年龄", "性别", "爱好"])
    writer.writeheader()                                     # 写入表头
    writer.writerow({"姓名": "小王", "年龄": 18, "性别": "男", "爱好": "football,Java"})
    writer.writerow({"姓名": "小李", "年龄": 18, "性别": "女", "爱好": "Python"})

# 读
with open("csv_data/02.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)        # 每行是一个字典，如 {'姓名': '小王', '年龄': '18', ...}
```

| 要点                                  | 说明                               |
| ----------------------------------- | -------------------------------- |
| `newline=""`                        | 写 CSV 必须加：避免 Windows 下每行之间多出空行   |
| `csv.DictWriter(f, fieldnames=...)` | 按**字典**写入，fieldnames 指定列名和顺序     |
| `writer.writeheader()`              | 写入表头（就是 fieldnames 那一行）          |
| `writer.writerow(字典)`               | 写一行；`writer.writerows(列表)` 一次写多行 |
| `csv.DictReader(f)`                 | 按字典读，第一行自动当表头，每行是 `{列名: 值}`      |

## 相关

- [实战-电影榜单爬取](/posts/编程学习/python学习笔记/50-实战-电影榜单爬取/)

## 练习题

### 一、回忆填空（写完再展开对答案）

1. CSV 全称 ____，是一种用于存储 ____ 数据的文本文件格式，可以直接用 ____ 打开
2. 原始方式的坑：值里自带 ____ 会把一行的列数弄乱
3. 推荐用 ____ 模块按字典读写
4. 写文件时必须加 `newline="____"`，否则 Windows 下行与行之间会多出空行
5. `writer.____()` 写表头；`writer.____(字典)` 写一行；`writer.____(列表)` 一次写多行
6. 按字典读 CSV 用 ____，第一行自动当 ____

> [!TIP]- 填空答案（做完再点开）
> 1. Comma-Separated Values（逗号分隔值）/ 表格 / Excel　2. 逗号　3. csv　4. 空（`""`）　5. writeheader / writerow / writerows　6. DictReader / 表头

### 二、裸写题

- [ ] **2-1 原始方式写 CSV**
  不用 csv 模块：用文件操作把表头 + 3 行学生数据写进 `students_raw.csv`。

  > [!TIP]- 提示（先自己想，实在想不出再点开）
  > **一级 · 思路**：一行一个字符串，列之间用逗号，行尾加换行
  > **二级 · 方法**：`open(..., "w")` + `f.write(...)`
  > **三级 · 骨架**：`f.write("姓名,年龄,性别\____")`

- [ ] **2-2 DictWriter 写 + DictReader 读**
  用 csv 模块把 3 个学生（含一个爱好带逗号的）写入 `students.csv`，再读回来打印每一行。

  > [!TIP]- 提示
  > **一级 · 思路**：写用 DictWriter（先 writeheader），读用 DictReader
  > **二级 · 方法**：`csv.DictWriter` / `writerow` / `csv.DictReader`
  > **三级 · 骨架**：`with open(..., "w", encoding="utf-8", newline="") as f:`

- [ ] **2-3 批量写入**
  把一个包含 3 个学生字典的列表，用 **一次调用** 全部写入 CSV。

  > [!TIP]- 提示
  > **一级 · 思路**：DictWriter 有一个方法就是"写多行"
  > **二级 · 方法**：`writer.____(学生列表)`
  > **三级 · 骨架**：`writer.writerows(students)`

> [!TIP]- 参考答案（做完再点开）
> ```python
> import csv
>
> students = [
>     {"姓名": "小王", "年龄": 18, "性别": "男", "爱好": "football,Java"},
>     {"姓名": "小李", "年龄": 18, "性别": "女", "爱好": "Python"},
>     {"姓名": "小张", "年龄": 18, "性别": "男", "爱好": "C++"},
> ]
>
> # 2-1 原始方式
> with open("students_raw.csv", "w", encoding="utf-8") as f:
>     f.write("姓名,年龄,性别,爱好\n")
>     f.write("小王,18,男,'football,Java'\n")
>     f.write("小李,18,女,Python\n")
>     f.write("小张,18,男,C++\n")
>
> # 2-2 / 2-3 csv 模块（writerows 一次写多行）
> with open("students.csv", "w", encoding="utf-8", newline="") as f:
>     writer = csv.DictWriter(f, fieldnames=["姓名", "年龄", "性别", "爱好"])
>     writer.writeheader()
>     writer.writerows(students)
>
> with open("students.csv", "r", encoding="utf-8") as f:
>     for row in csv.DictReader(f):
>         print(row)
> ```