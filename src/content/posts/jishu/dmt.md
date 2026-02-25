---
title: 网络教室脱离控制方法
published: 2025-11-18
description: 噢易多媒体网络教室软件V10.8.0 脱离控制方法分享。
image: "../images/017.webp"
tags: [技术]
category: "网络技术"
---


免责声明：仅供学习交流，后果自负。
首先，教程针对此版本，其他版本未尝试，自行甄别。

![](https://re.0824.uk/wzzy/network-asset-network-asset-image-1-20251118144802-h1metbr.png)

#### 方案一（首发）：

删除 C:\\Program Files (x86)\\Os-Easy\\os-easy multicast teaching system\\**MultiClient.exe**，如图所示。
此方法需在被控制前使用，使用后脱离教师端投屏。收发作业、消息等功能均正常，除了教师端可以看见你的电脑页面外，简直完美，故写在前面。

![](https://re.0824.uk/wzzy/network-asset-network-asset-image-2-1024x723-20251118144802-na1darl.png)

可能遇到的问题：

![](https://re.0824.uk/wzzy/network-asset-network-asset-image-3-20251118144802-l6zozv9.png)

解决方案：1、断网：控制面板禁用以太网。2、关闭软件，详见方案二。
恢复方案：在回收站恢复删除，几秒后立马被控。

#### 方案二、关闭软件

1，使用密码退出，默认密码为 OSeasy。
2，使用其他软件强制关闭。
3，使用任务管理器 + 断网关闭，网上有教程。
缺点：在教师端显示离线

#### 方案三、断网，不赘述。

#### 方案四、修改配置文件

![](https://re.0824.uk/wzzy/network-asset-network-asset-image-4-1024x724-20251118144802-6zclw4z.png)

打开图上任意程序，点击保存后，无法连接到教师端。
缺：教师端显示下线，万一收发作业等等，没救。（让朋友帮你交）

#### 方案五、

使用浏览器访问教师端 ip+ 端口，教师端投屏瘫痪，详细端口号自行摸索，不提供端口号。缺：全部学生脱控，没有隐蔽性。教师端没有提示，重启教师端恢复。
