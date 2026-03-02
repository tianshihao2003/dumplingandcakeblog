---

title: 集成开发环境 (IDE)  
published: 2026-03-02  
description: 集成开发工具的使用。  
image: "https://re.tsh520.cn/img/001.webp"  
tags: ["java","工具"]  
category: "编程学习"

---

## 一、集成开发环境 (IDE)

### 1. IDEA 介绍与使用

​**IDEA (IntelliJ IDEA)** ：业界公认的优秀Java开发工具，支持多种语言。

​**基本使用**​：以**项目 (Project)**  为单位管理Java源码。

**常用快捷键** (可自定义)：

- 删除当前行：Ctrl + D
- 复制当前行：Ctrl + Alt + ↓
- 代码补全：Alt + /
- 注释/取消注释：Ctrl + /
- 自动导包 & 优化导入：Alt + Enter
- 格式化代码：Ctrl + Alt + L
- 快速运行：Alt + R
- 生成代码 (构造器、Getter/Setter等)：Alt + Insert
- 查看类层级关系：Ctrl + H
- 定位到方法定义：Ctrl + B
- 自动分配变量名：表达式.var

​**重要设置**：

- ​**主题与字体**​：File -\> Settings -\> Appearance & Behavior / Editor -\> Font
- ​**字符编码**​：File -\> Settings -\> Editor -\> File Encodings 设置为 UTF-8。

## 二、包 (Package)

### 1. 包的作用

1. ​**区分同名类**：解决多人开发时的命名冲突。
2. ​**管理类**：将功能相似的类组织在一起，便于管理和查找（参考Java API文档结构）。
3. ​**控制访问范围**：配合访问修饰符使用（见第三部分）。

### 2. 包的本质与使用

​**本质**​：就是​**文件夹/目录**，用于保存和管理.class文件。

​**定义语法**：package 包名; (必须放在源文件第一行)。

​**命名规范**：小写字母 + 小圆点。通常为：com.公司名.项目名.业务模块名。例如：com.sina.crm.user。

​**常用包**：

- java.lang.\*：基本包，默认自动引入。
- java.util.\*：工具包（如Scanner, Arrays）。
- java.net.\*：网络开发包。
- java.awt.\*：图形界面开发包。

​**引入包 (import)** ：

- 语法：import 包名.类名; 或 import 包名.\*; (导入该包下所有类)。
- 位置：位于package语句之后，类定义之前。
- ​**建议**​：需要哪个类就导入哪个，不建议使用\*通配符。
