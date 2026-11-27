# 内容库（Obsidian + Git）整体迁移到 B 盘，与博客仓无损分离

> 日期：2026-11-27
> 目标：把 `E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content` **整体**（含 `.git`、`.obsidian`、全部私有目录）搬到 `B:\Obsidian Vault Collection\Obsidian Vault content`，博客仓通过 junction 继续使用，全程不丢任何文件、不丢 Git 历史、不改 URL。
> 本次只做迁移。发布脚本、PagesCMS、AstrBot、友链 workflow 不在范围。

## 1. 判定标准

迁移成功的定义：

1. 源目录 2513 个文件（含隐藏）在目标目录一个不少，内容哈希逐一相同。
2. 备份仓 `content-backup` 的 HEAD 仍是 `b1c7bc7`，`git fsck --full` 无错误，2387 个跟踪文件不变。
3. 博客仓 `git ls-files src/content` 仍是 698 个文件，`pnpm build` 的路由清单与迁移前完全一致。
4. Obsidian 打开新路径后，插件、主题、工作区、附件目录规则与迁移前一致。
5. 同步插件（Self-hosted LiveSync）只在上述全部通过后才重新开启，开启后文件数不减少。

任何一条不满足 → 走 §7 回滚，不继续。

## 2. 已核对的环境事实

| 项 | 值 |
|---|---|
| 源 | `E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content`（E: 本地盘） |
| 目标 | `B:\Obsidian Vault Collection\Obsidian Vault content`（B: **本地固定 NTFS 盘**，214 GB 空闲，目标目录已存在且为空） |
| 库内文件 / 占用 | 2513 个（含隐藏）/ 约 0.7 GB |
| 最长路径 | 159 字符（不会撞 260 限制） |
| 隐藏项 | 只有 `.git` 是隐藏目录；`.obsidian` 可见 |
| 备份仓 HEAD | `b1c7bc7`，跟踪 2387 个文件，pack 353.69 MB |
| 备份仓脏文件 | `.obsidian/plugins/wechat-converter/data.json` |
| 博客仓 HEAD | `0fdc679a`，跟踪 `src/content` 698 个文件 |
| 博客仓脏文件 | `.agents/skills/note-organizer/SKILL.md`、`.gitignore`、`public/footprint/static/js/footprintmap.js`、`src/constants/icons.ts` + 2 个未跟踪内容文件 + 2 个根目录未跟踪目录 |
| 同步 | Self-hosted LiveSync 插件 v1.0.52（本机该库 `data.json` 的 remote 字段为空，迁移前先确认是否真的连着） |
| 历史 Syncthing | `%LOCALAPPDATA%\Syncthing\config.xml` 有旧 folder 定义，无进程/无服务/无自启 —— **全程不要启动** |

## 3. 决策

- **D1 目标路径**：`B:\Obsidian Vault Collection\Obsidian Vault content`。B: 是本地固定盘，符合要求；路径含空格，所有命令必须加引号。
- **D2 博客仓如何看到库**：`cmd /c mklink /J` 建 junction。git 会把 junction 当普通目录（跟踪为 `100644`，已实测），`src/content` 路径不变，Astro/CI/EdgeOne/PagesCMS 全部零改动。
- **D3 主仓跟踪策略**：`.gitignore` 的白名单**一字不改**，主仓继续跟踪 698 个公开内容文件。
- **D4 旧目录去向**：改名到 **仓库外** 的 `E:\GithubProgect\MyRunProject\content-rollback`（同盘瞬间完成）。不要留在 `src\` 下：`.gitignore` 的 `src/content/*` 匹配不到 `src/content.old`，会变成未跟踪目录，一次 `git add -A` 就把 0.7 GB 旧副本塞进公开仓。
- **D5 同步插件**：迁移前关闭 Obsidian 并在第三方插件里禁用 LiveSync；**只在 §6 全部验收通过后**再启用。LiveSync 的删除是双向的，「远端有、本地无」会被写成 tombstone，所以绝不能在拷贝不完整时打开新库。

## 4. 阶段 0：冻结（约 10 分钟）

1. **你来做**：Obsidian 里 设置 → 第三方插件 → 关闭 Self-hosted LiveSync；然后完全退出 Obsidian。确认任务管理器没有 `Obsidian.exe`，也没有 `syncthing` 进程。
2. 博客仓处理在飞的改动（**不替你做决定**）：
   - 3 个已跟踪文件（`.agents/skills/note-organizer/SKILL.md`、`.gitignore`、`public/footprint/static/js/footprintmap.js`、`src/constants/icons.ts`）提交或 stash；
   - 2 个未跟踪内容（`src/content/文章/技术分享/assets/未命名/`、`src/content/更新日志/2026-11-22-fix-place-photo-viewer-swup-leak.md`）决定提交还是保留——保留会在迁移后原样出现。
3. 备份仓提交脏文件，让两个仓都干净：

```powershell
cd "E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content"
git add ".obsidian/plugins/wechat-converter/data.json"
git commit -m "chore: 保存插件设置"
git status --short
```

4. 打锚点并推送：

```powershell
cd "E:\GithubProgect\MyRunProject\dumplingandcakeblog"
git -C "src/content" tag pre-decouple-vault
git -C "src/content" push origin pre-decouple-vault
git tag pre-decouple-blog
git push origin pre-decouple-blog
```

5. 记录基线（迁移后逐项比对）：

```powershell
$src = "E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content"
$vaultFiles = (Get-ChildItem $src -Recurse -File -Force).Count
$vaultBytes = (Get-ChildItem $src -Recurse -File -Force | Measure-Object Length -Sum).Sum
"files=$vaultFiles bytes=$vaultBytes"
git -C $src rev-parse HEAD
git ls-files "src/content" | Sort-Object | Set-Content "$env:TEMP\blog-content-files-before.txt"
(Get-ChildItem "dist" -Recurse -Filter index.html -ErrorAction SilentlyContinue | ForEach-Object { $_.FullName.Substring((Resolve-Path "dist").Path.Length) } | Sort-Object) | Set-Content "$env:TEMP\routes-before.txt"
```

> 若 `routes-before.txt` 为空，先在**迁移前**跑一次 `pnpm build` 再记录——迁移后的路由必须和这一份比。

## 5. 阶段 1：拷贝 + 逐文件哈希校验（约 15 分钟）

### 5.1 拷贝

```powershell
$src = "E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content"
$dst = "B:\Obsidian Vault Collection\Obsidian Vault content"

robocopy $src $dst /E /COPY:DAT /DCOPY:DAT /R:1 /W:1
"robocopy exit=$LASTEXITCODE"   # 0–7 成功；>=8 停下排查
```

用 `/COPY:DAT` 而不是 `/COPYALL`：复制数据、属性、时间戳就够了；ACL/属主在本地盘之间复制容易报 `ERROR 5` 噪声，对内容没有价值。`/E` 会带上隐藏的 `.git`，这是资源管理器 Ctrl+A 做不到的。

### 5.2 结构与字节校验

```powershell
$dst = "B:\Obsidian Vault Collection\Obsidian Vault content"
$src = "E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content"

(Get-ChildItem $dst -Recurse -File -Force).Count                     # 必须 2513
(Get-ChildItem $dst -Recurse -File -Force | Measure-Object Length -Sum).Sum   # 必须等于基线 bytes
(Get-ChildItem $dst -Force | Select-Object -ExpandProperty Name)      # 必须包含 .git 和 .obsidian
robocopy $src $dst /E /L /NJH /NJS /NDL /NP                           # 差异清单必须为空
```

### 5.3 哈希清单（唯一能证明「不丢」的检查）

在 Obsidian 关闭、没有任何 git 命令运行的状态下做，**先于**后面的 `git status`（`git status` 会改写 `.git/index` 的 stat 缓存，造成假差异）：

```powershell
function Get-Manifest($root) {
  Get-ChildItem $root -Recurse -File -Force | ForEach-Object {
    $rel = $_.FullName.Substring($root.Length)
    "$rel|$($_.Length)|$((Get-FileHash $_.FullName -Algorithm SHA256).Hash)"
  } | Sort-Object
}

$src = "E:\GithubProgect\MyRunProject\dumplingandcakeblog\src\content"
$dst = "B:\Obsidian Vault Collection\Obsidian Vault content"

Get-Manifest $src | Set-Content "$env:TEMP\content-manifest-src.txt"
Get-Manifest $dst | Set-Content "$env:TEMP\content-manifest-dst.txt"
Compare-Object (Get-Content "$env:TEMP\content-manifest-src.txt") (Get-Content "$env:TEMP\content-manifest-dst.txt")
```

**`Compare-Object` 必须零输出。** 有任何一行差异，查清楚原因（通常是文件被占用或 ACL 复制失败），重新拷该文件再比，不许「差不多就行」。

### 5.4 Git 完整性

```powershell
$dst = "B:\Obsidian Vault Collection\Obsidian Vault content"
git -C $dst rev-parse --short HEAD          # b1c7bc7
git -C $dst log --oneline -3
git -C $dst status --short                  # 应为空
git -C $dst fsck --full                     # 无 error / 无 missing
git -C $dst count-objects -vH               # pack 大小与源相近
git -C $dst remote -v                       # origin / ssh-backup 都在
```

## 6. 阶段 2：切换（5 分钟）

一条命令块内完成，避免中间状态被人误操作：

```powershell
cd "E:\GithubProgect\MyRunProject\dumplingandcakeblog"
Rename-Item "src\content" "E:\GithubProgect\MyRunProject\content-rollback"
cmd /c mklink /J "src\content" "B:\Obsidian Vault Collection\Obsidian Vault content"
Get-Item "src\content" | Select-Object Name,LinkType,Target
```

然后立刻验证博客仓视图：

```powershell
git status --porcelain -- src/content     # 只应出现阶段 0 决定保留的未跟踪文件
git ls-files "src/content" | Measure-Object      # 698
git check-ignore -v "src/content/文章/技术分享/x.md"      # 无输出
git check-ignore -v --no-index "src/content/学习笔记/x.md" # 有输出
```

如果出现大面积 `D`（删除）→ junction 没建对或盘符不对：**不要提交**，删 junction，把 `content-rollback` 改回 `src\content`，回阶段 1。

## 7. 阶段 3：功能验证

```powershell
cd "E:\GithubProgect\MyRunProject\dumplingandcakeblog"
pnpm dev     # 文章页 / 动态页 / 友链页各开一个，图片正常
pnpm build
(Get-ChildItem "dist" -Recurse -Filter index.html | ForEach-Object { $_.FullName.Substring((Resolve-Path "dist").Path.Length) } | Sort-Object) | Set-Content "$env:TEMP\routes-after.txt"
Compare-Object (Get-Content "$env:TEMP\routes-before.txt") (Get-Content "$env:TEMP\routes-after.txt")   # 零输出
```

Obsidian 侧：打开 `B:\Obsidian Vault Collection\Obsidian Vault content`，检查：

- 文件树完整、附件能打开；
- 插件列表、主题、快捷键、模板目录、附件目录规则（`./assets/{{noteFileName}}`）正常；
- obsidian-git 显示仓库正常、远端正常（先别手动 push）；
- 新建一篇测试笔记 → 保存 → `git -C $dst status` 能看到它 → 删掉测试笔记。

## 8. 阶段 4：重新开启同步（验收通过后）

1. 用 Obsidian 打开的是 **B 盘真实路径**，不要打开 `src\content` 这个 junction。
2. 启用 Self-hosted LiveSync，确认 Remote Database 地址正确，等首次全量比对跑完（2387 个文件，可能几分钟）。
3. **完成前不要**关 Obsidian、不要点 Rebuild、不要 Overwrite remote。
4. 立刻核对远端文件数没有减少（LiveSync 的 Hidden/Log 面板或 CouchDB 端计数）；手机端收到的文件数与 PC 一致。
5. 若首次比对出现异常：先 **Fetch remote**（以远端为准），不要 Overwrite remote。

只有这一步也通过了，才进入阶段 5。

## 9. 阶段 5：收尾（24–48 小时后）

1. 确认 obsidian-git 在新路径自动提交 + 推送各成功一次（`git -C $dst log --oneline -3` 有新提交、远端有对应提交）。
2. 删除回滚副本：`Remove-Item "E:\GithubProgect\MyRunProject\content-rollback" -Recurse -Force`。删之前最后跑一次 `git -C $dst fsck --full`。
3. 更新文档（只改路径描述）：
   - `CLAUDE.md` §23 双仓库模型、§5.17 同步范围；
   - 根 `AGENTS.md`、`src/content/AGENTS.md`；
   - `dumplingandcake-notes/DEPLOY.md`、`AGENTS.md`（其 `DEFAULT_SRC` 仍走旧路径，经过 junction 可用，但说明要更新）。
4. 检查 `.obsidian/plugins/*/data.json` 里写死的 `E:\...\dumplingandcakeblog\src\content`，改成新库路径。
5. 打 tag：`git -C $dst tag post-decouple-vault && git -C $dst push origin post-decouple-vault`。

## 10. 回滚

| 时机 | 操作 |
|---|---|
| 阶段 1（拷贝/校验失败） | 删 `B:\Obsidian Vault Collection\Obsidian Vault content` 内已拷内容，源目录未动，直接重来 |
| 阶段 2 切换后、未开 Obsidian | 删 junction → `Rename-Item "E:\GithubProgect\MyRunProject\content-rollback" "src\content"` |
| 阶段 3 验证不过 | 同上；若已 `git add` 过内容删除，`git reset` 后再回滚，别提交 |
| 阶段 4 同步已开启 | 数据以 CouchDB + B 盘副本为准；不要在两边同时操作。需要回 E 盘时把 B 盘目录搬回 `src\content` 并重开 Obsidian，LiveSync 会自行比对 |
| 主仓误提交了删除 | `git reset --hard pre-decouple-blog`（先确认没有新代码改动） |

回滚期间**始终不删** `content-rollback`，它是最后一道保险。

## 11. 风险与纪律

| 风险 | 触发场景 | 处置 |
|---|---|---|
| 拷贝漏掉 `.git` | 用资源管理器 Ctrl+A（隐藏项不选中） | 用 robocopy；§5.2 检查 `.git` 存在 + §5.4 校验 HEAD |
| LiveSync 把「本地缺失」当删除 | 拷贝未校验完就打开新库 | §5.3 哈希零差异后才切；切换前禁用插件 |
| 两个库同时连一个 CouchDB | 观察期内打开 `content-rollback` | 回滚目录放在仓库外，且绝不用 Obsidian 打开 |
| 误把 2387 个删除提交 | junction 断链（盘符变化/盘未挂载）时 `git add -A` | 提交前先看 `git status --short -- src/content`；出现大面积 `D` 先修 junction |
| `git clean -xdf` 删私有笔记 | 在博客仓清理未跟踪文件 | 禁止在仓库根跑 `git clean -xdf`；只对具体子路径用 |
| `git checkout`/`git stash` 改到库文件 | 博客仓回滚内容文件 | 两仓共用工作区，写操作前确认影响的是库 |
| 假差异 | 先跑 `git status` 再做哈希比对 | 哈希必须最先做；`.git/index` 会被刷新 |
| 盘符变化 | B 盘重命名/换机器盘符 | junction 失效 → 删除重建；数据在 B 盘不受影响 |
| `.gitignore` 铁律 | 在库根新建 `.gitignore` | 主仓会通过 junction 读到它，把集合目录整体忽略，仍然禁止 |
| 历史 Syncthing 并存 | 启动了旧 Syncthing folder | 不要启动，与 LiveSync 同时开会互相覆盖 |
| Windows CRLF 噪声 | 部分内容文件 `M` 但 diff 为空 | 现状既有问题，不修不提交 |

## 12. 验收清单

- [ ] LiveSync 已禁用、Obsidian 已退出、无 syncthing 进程
- [ ] 两仓干净，`pre-decouple-*` tag 已推送
- [ ] 目标文件数 2513、总字节与基线一致
- [ ] SHA256 清单 `Compare-Object` 零输出
- [ ] 备份仓 HEAD `b1c7bc7`、`fsck` 无错、远端配置在
- [ ] junction 指向 B 盘，`git ls-files src/content` = 698
- [ ] `pnpm build` 通过，路由清单零差异
- [ ] Obsidian 新路径打开正常，obsidian-git 正常
- [ ] 重新启用 LiveSync 后首次比对完成，远端/手机文件数未减
- [ ] obsidian-git 自动提交+推送各成功一次
- [ ] `content-rollback` 已删除，文档与插件路径已更新

## 13. 不在本次范围

- 每日自动推送脚本、计划任务
- 主仓是否停止跟踪内容 / 构建期注入 / EdgeOne token
- PagesCMS、AstrBot、友链截图与状态 workflow 适配
- `学习笔记 → dumplingandcake-notes` 同步源改造

## 14. 执行记录（2026-11-27）

迁移实际执行结果，供复盘：

| 步骤 | 结果 |
|---|---|
| 提交 | 博客仓 `e4ffaae7` / `b11eda5f` / `f866a970`；库仓 `5cb0124` / `ae3e00f`（关闭 LiveSync） |
| 锚点 | 库仓 tag `pre-decouple-vault`（`ae3e00f`，已推）；博客仓 tag `pre-decouple-blog`（`f866a970`） |
| 拷贝 | robocopy `/E /COPY:DAT /DCOPY:DAT`：2653 文件 / 473 目录 / 0 失败，退出码 1 |
| 哈希 | SHA256 逐文件比对：源 2653 项、目标 2653 项、**0 差异** |
| 库 Git | HEAD `ae3e00f`、跟踪 2387、`fsck` 仅 dangling blob、两个 remote 正常 |
| 构建基线 | 迁移前 `pnpm build`：291 页 / 290 个 `index.html`，清单存 `%TEMP%\routes-before.txt` |
| 切换 | 因 OpenCode 工作区句柄占用，重命名在应用内无法执行；由站长在应用外运行 `%TEMP%\opencode\switch-content.ps1` 完成 |
| 切换后 | `src\content` = Junction → B 盘；博客仓跟踪 700、`git status -- src/content` 空；库仓经 junction HEAD `ae3e00f`、2387 |
| 构建校验 | 切换后 `pnpm build`：291 页，路由清单与基线 **0 差异** |
| 待办 | Obsidian 打开 B 盘库；启用 LiveSync 并等首次比对；obsidian-git 自动提交推送验证；删 `content-rollback`；文档与插件绝对路径更新 |

> 踩坑记录：Windows PowerShell 5.1 读取无 BOM 的 UTF-8 脚本会按 GBK 解析，中文字符串直接导致语法错误。给用户执行的脚本一律用纯 ASCII。
