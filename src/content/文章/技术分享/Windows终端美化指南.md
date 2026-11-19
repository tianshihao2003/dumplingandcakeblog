---
title: Windows 终端美化指南
published: 2026-11-19
tags:
  - 美化
image: 文章/技术分享/assets/Windows终端美化指南/file-20261119153317523.png
description:
---

> 目标：把 Windows Terminal 配成 **「浅色毛玻璃 + Frost 白底配色 + 自定义背景图 + Powerline 提示符」**。 全程照抄即可，不需要编程基础。每一步都标了「做什么」和「为什么」。

---

## 0. 先搞懂最终效果是怎么来的

| 想要的效果                 | 由什么控制                                       |
| --------------------- | ------------------------------------------- |
| 毛玻璃（半透明模糊）            | Windows Terminal 的「亚克力 Acrylic」材质 + 不透明度    |
| 白底黑字配色                | 自定义配色方案 `Frost`                             |
| 终端里的背景图               | 配置文件的 `backgroundImage`（画在毛玻璃**之上**，用透明度叠加） |
| Powerline 提示符（带箭头/图标） | Oh My Posh                                  |
| 提示符里的特殊图标             | Nerd Font 字体（`CaskaydiaCove NF`）            |

---

## 1. 准备工作

- **系统**：Windows 10（1809 及以上）或 Windows 11。
    
    - 毛玻璃（亚克力）需要 Win10 1809+；「纯透明不模糊」仅 Win11 支持。
        
- **winget**：在 PowerShell 里输入 `winget -v`，能出版本号就没问题。
    
    - 若提示找不到命令：去 Microsoft Store 搜索安装 **App Installer**。
        
- **背景图**：准备一张图，记住完整路径，例如 `C:\Users\你的用户名\Pictures\桌面壁纸\bj.jpg`
    

---

## 2. 安装 Windows Terminal

winget install --id Microsoft.WindowsTerminal -e

> 想装预览版就把 ID 换成 `Microsoft.WindowsTerminal.Preview`。

装完开始菜单里会出现 **Windows Terminal**（WT）。

---

## 3. 安装 Oh My Posh（提示符美化）

winget install --id JanDeDobbeleer.OhMyPosh -e

装完会出现 `oh-my-posh` 命令。

---

## 4. 安装字体 CaskaydiaCove NF（Nerd Font）

oh-my-posh font install CascadiaCode

看到类似下面的提示就成功了：

The following font families are now available for configuration:  
  • CaskaydiaCove NF  
  • CaskaydiaCove NFM  
  • CaskaydiaCove NFP

> **如果卡住/超时**（GitHub 在国内容易连不上）：见 **附录 A** 的镜像下载脚本。

---

## 5. 配置 PowerShell 提示符

Oh My Posh 是通过「PowerShell 配置文件」生效的。

### 方法 A：命令行一键写入（推荐）

在 **PowerShell** 里运行：

# 确保配置文件目录存在  
$dir = Split-Path -Parent $PROFILE  
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }  
​  
# 写入初始化命令（如果文件里还没有）  
Add-Content -Path $PROFILE -Value "`n# Oh My Posh`noh-my-posh init pwsh | Invoke-Expression"

### 方法 B：手动创建文件

用记事本/VS Code 创建下面任意一个文件（两个都建最保险），内容只有一行：

oh-my-posh init pwsh | Invoke-Expression

|Shell|配置文件路径|
|---|---|
|PowerShell 7（`pwsh`）|`C:\Users\你的用户名\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`|
|Windows PowerShell 5.1（`powershell`）|`C:\Users\你的用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`|

> 打开一个新的 PowerShell 窗口，提示符应该立刻变成 Powerline 样式。

### 换主题（可选）

Oh My Posh 默认主题就是 Powerline 风格。想看全部主题：

oh-my-posh themes

用某个主题时，把配置文件里那一行改成：

oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\主题名.omp.json" | Invoke-Expression

---

## 6. 配置 Windows Terminal

1. 打开 Windows Terminal
    
2. 按 `Ctrl + ,` 打开设置
    
3. 点左下角 **「打开 JSON 文件」**
    

> 文件默认路径： `%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json` （预览版把 `Microsoft.WindowsTerminal` 换成 `Microsoft.WindowsTerminalPreview`）

下面三段内容**合并**进你的 `settings.json`（不要把整个文件删掉重写，只加/改对应字段）。

### 6.1 全局主题设为「浅色」

在文件**最外层**（和 `"profiles"` 同级）加一行：

"theme": "light",

> 官方 Frost 主题就是浅色窗口。想跟随系统亮/暗色就用 `"system"`。

### 6.2 全局默认外观（毛玻璃 + 背景图 + 字体 + 配色）

找到 `"profiles"` 里面的 `"defaults": {}`，替换成：

"defaults": {
    "backgroundImage": "C:\\Users\\你的用户名\\Pictures\\桌面壁纸\\bj.jpg",
    "backgroundImageAlignment": "center",
    "backgroundImageOpacity": 0.5,
    "backgroundImageStretchMode": "uniformToFill",
    "colorScheme": "Frost",
    "cursorColor": "#000000",
    "font": {
        "face": "CaskaydiaCove NF"
    },
    "opacity": 70,
    "useAcrylic": true
}

**字段解释：**

|字段|含义|取值|
|---|---|---|
|`backgroundImage`|背景图路径（`\\` 是 JSON 转义，别写成 `\`）|图片路径 / `"desktopWallpaper"`|
|`backgroundImageOpacity`|背景图自身透明度|0~1，越大越实|
|`backgroundImageStretchMode`|填充方式|`none` / `fill` / `uniform` / `uniformToFill`|
|`backgroundImageAlignment`|对齐方式|`center` / `left` / `top` / `right` / `bottom` / `topLeft` …|
|`colorScheme`|配色方案名|必须是第 6.3 步里定义的名字|
|`font.face`|字体名|必须和已安装字体一致（`CaskaydiaCove NF`）|
|`opacity`|窗口不透明度（毛玻璃强度）|0~100，100 全不透明|
|`useAcrylic`|是否开启毛玻璃|`true` / `false`|

### 6.3 添加 Frost 配色方案

找到 `"schemes": []`，替换成下面内容（注意保留外层中括号）：

"schemes": [
    {
        "name": "Frost",
        "background": "#FFFFFF",
        "foreground": "#000000",
        "cursorColor": "#000000",
        "black": "#3C5712",
        "blue": "#17b2ff",
        "cyan": "#3C96A6",
        "green": "#6AAE08",
        "purple": "#991070",
        "red": "#8D0C0C",
        "white": "#6E386E",
        "yellow": "#991070",
        "brightBlack": "#749B36",
        "brightBlue": "#27B2F6",
        "brightCyan": "#13A8C0",
        "brightGreen": "#89AF50",
        "brightPurple": "#F2A20A",
        "brightRed": "#F49B36",
        "brightWhite": "#741274",
        "brightYellow": "#991070"
    }
]

> 如果你原来的 `"schemes"` 里已经有别的方案，把上面这个对象**追加**进去（注意逗号）。

### 6.4 保存

`Ctrl + S` 保存。WT 会**自动热加载**，不用重启也能看到大部分变化（字体/主题有时需要重启）。

---

## 7. 收尾：重启终端

**把所有 Windows Terminal 窗口全部关掉，再重新打开**，然后新建一个标签页。

应该看到：

- 浅色窗口
    
- 白色毛玻璃背景（隐约透出桌面）
    
- 背景图（半透明叠加）
    
- Powerline 提示符
    

---

## 8. 微调对照表

|想要……|改哪里|
|---|---|
|背景图更明显 / 更淡|`backgroundImageOpacity`（0~1）|
|毛玻璃更透 / 更实|`opacity`（0~100）|
|背景图位置|`backgroundImageAlignment`|
|背景图填充方式|`backgroundImageStretchMode`|
|换提示符主题|改 PowerShell 配置文件里的 `oh-my-posh init pwsh --config ...`|
|换字体|`font.face`|
|窗口跟随系统亮/暗色|`"theme": "system"`|

---

## 9. 常见问题

- **没任何变化** → 把 WT 全部关掉再开；再不行重启电脑。
    
- **提示符没变成 Powerline** → 新开一个 PowerShell 窗口；手动运行 `oh-my-posh init pwsh | Invoke-Expression` 看是否报错；确认配置文件路径正确。
    
- **提示符里的图标是方块/问号** → 字体没装成功，重跑第 4 步；或确认 `font.face` 写的是 `CaskaydiaCove NF`。
    
- **毛玻璃没生效** → 确认 `useAcrylic` 是 `true`，`opacity` 小于 100。
    
- **WT 提示配置有误** → 设置界面会红字提示哪一行，照着改；或把 JSON 贴到在线校验器检查。
    
- **背景图不显示** → 检查路径是否正确（注意 JSON 里用 `\\`）；图片格式支持 png/jpg/gif。
    

---

## 10. 可选：让背景图真正「透过毛玻璃」

WT 的**背景图是画在毛玻璃之上的**，所以它本身不会被毛玻璃模糊。如果你想要官方截图那种「图片透过毛玻璃模糊透出」的效果，需要把图片设为**桌面壁纸**：

Add-Type @'
using System;
using System.Runtime.InteropServices;
public class Wallpaper {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
}
'@
[Wallpaper]::SystemParametersInfo(20, 0, "C:\Users\你的用户名\Pictures\桌面壁纸\bj.jpg", 3)

> 如果不想改桌面壁纸，又想换背景图，把 WT 的 `backgroundImage` 指向 `"desktopWallpaper"` 也能直接跟随壁纸。

---

## 附录 A：字体下载超时（GitHub 被墙）的镜像方案

把下面内容保存为 `install-font.ps1`，右键「使用 PowerShell 运行」，或在该文件夹打开 PowerShell 执行 `powershell -ExecutionPolicy Bypass -File .\install-font.ps1`。

$ErrorActionPreference = 'Stop'
$version = 'v3.5.1'          # nerd-fonts 版本，必要时去 GitHub 查看最新
$archive = 'CascadiaCode.tar.xz'
$mirrors = @(
    'https://ghfast.top/https://github.com/ryanoasis/nerd-fonts/releases/download/{0}/{1}',
    'https://ghproxy.net/https://github.com/ryanoasis/nerd-fonts/releases/download/{0}/{1}',
    'https://gh.llkk.cc/https://github.com/ryanoasis/nerd-fonts/releases/download/{0}/{1}',
    'https://mirror.ghproxy.com/https://github.com/ryanoasis/nerd-fonts/releases/download/{0}/{1}',
    'https://github.com/ryanoasis/nerd-fonts/releases/download/{0}/{1}'
)
$out = Join-Path $env:TEMP 'CascadiaCode.tar.xz'
foreach ($m in $mirrors) {
    $u = $m -f $version, $archive
    Write-Output "尝试: $u"
    try {
        Invoke-WebRequest -Uri $u -OutFile $out -TimeoutSec 90 -UseBasicParsing
        Write-Output ("下载成功: " + (Get-Item $out).Length + " 字节")
        break
    } catch {
        Write-Output ("失败: " + $_.Exception.Message)
    }
}
if (-not (Test-Path $out)) { Write-Output '全部镜像失败'; exit 1 }

$extract = Join-Path $env:TEMP 'cascadia-nerd'
if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }
New-Item -ItemType Directory -Path $extract | Out-Null
tar -xf $out -C $extract

$zip = Join-Path $env:TEMP 'CascadiaCode.zip'
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $extract '*') -DestinationPath $zip -Force
oh-my-posh font install $zip

---

## 附录 B：一键安装脚本（可选）

把下面内容存成 `setup.ps1` 运行，可自动完成第 2~5 步（背景图/配色仍需按第 6 步手动合并 JSON）。

# 1. 安装 Windows Terminal
winget install --id Microsoft.WindowsTerminal -e

# 2. 安装 Oh My Posh
winget install --id JanDeDobbeleer.OhMyPosh -e

# 3. 安装字体
oh-my-posh font install CascadiaCode

# 4. 写入 PowerShell 提示符配置（PS7 与 5.1 都写）
$files = @(
    'C:\Users\你的用户名\Documents\PowerShell\Microsoft.PowerShell_profile.ps1',
    'C:\Users\你的用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1'
)
foreach ($f in $files) {
    $dir = Split-Path -Parent $f
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    if (-not (Test-Path $f)) { Set-Content -Path $f -Value "oh-my-posh init pwsh | Invoke-Expression" -Encoding UTF8 }
}

Write-Output '安装完成，接下来按第 6 步配置 settings.json'

---

## 附录 C：本文用到的关键路径速查

|项目|路径|
|---|---|
|WT 配置文件|`%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json`|
|WT 预览版配置|`%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json`|
|PS7 配置文件|`%USERPROFILE%\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`|
|PS5.1 配置文件|`%USERPROFILE%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`|
|用户字体目录|`%LOCALAPPDATA%\Microsoft\Windows\Fonts`|
|用户字体注册表|`HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts`|