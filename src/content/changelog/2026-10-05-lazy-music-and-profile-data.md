---
version: "v1.57.2"
date: 2026-10-05
time: "22:54"
type: improvement
description: 音乐歌单与资料卡数据改为按需拉静态 JSON，每一页少 140KB 内联数据
---

## 大块数据按需拉取：每页少 140KB

- **音乐播放列表**：bangumi 的 music 条目（约 30KB）原先**内联进每一页**，而且是三份
  （悬浮坞的 MusicPlayer、侧栏 Music 小组件、MusicManager）。现在只在 `/music-playlist.json`
  输出一次——构建逻辑统一到 `src/utils/music-playlist.ts`（顺手去掉客户端不用的 `published`），
  `MusicManager` 在 `init()` 时拉一次；`MusicPlayer` 那套「外部歌单注入」路径（`externalPlaylist`
  / `metingApiBase`）已删除，init 后由 `fm:init` 事件同步 UI。播放行为不变。
- **资料卡「点格子看当月文章」**：今年 364 篇的 `postsByMonth`（约 51KB）原先内联在 `data-posts`，
  现在改为 `/profile-posts.json`，卡片脚本**首次点格子**时才拉并缓存；热力图本身仍是服务端渲染
  （只有 12×4 个数字），页面加载时不发这个请求。
- **Spine 看板娘**：关闭状态下不再把那 12KB 配置塞进每页的 `define:vars`（脚本照旧早退）。

| 页面 | 改前 | 改后 | 省下 |
|---|---|---|---|
| 首页 | 557.7KB | 417.5KB | −140.2KB |
| /projects/ | 599.4KB | 459.2KB | −140.2KB |
| 文章列表 | 714.3KB | 574.1KB | −140.2KB |
| /moments/ | 899.8KB | 759.6KB | −140.2KB |
| 文章页（样本） | 981.9KB | 841.8KB | −140.1KB |

> 验证：pnpm check 0 错误；pnpm build 通过；改动文件的 biome（LF 副本）干净。
> 新接口：/music-playlist.json（94 首，27.8KB / gzip 4.1KB）、/profile-posts.json（12 个月 364 篇，43.4KB / gzip 8.7KB）。
> 浏览器实测（生产预览 4322）：歌单加载 94 首并成功播放（isPlaying、进度在走、歌词 44 行）；
> 资料卡页面加载时**不**请求 profile-posts.json，点格子后才请求并渲染出当月 3 篇。
