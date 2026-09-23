---
title: Meting-API-使用指南
published: 2026-07-26
image: /assets/images/posts/tech-05-meting-api-guide.png
order: 1
tags:
  - 宝塔面板
  - 音乐
  - 指南
description: 介绍如何使用Meting-API
---

> 多平台音乐 API 代理服务，支持网易云、QQ音乐、酷狗、百度、酷我。

## 基础信息

| 项目 | 说明 |
|------|------|
| API 地址 | `https://你的域名/api` |
| 请求方式 | GET |
| 响应格式 | JSON / 重定向 / 纯文本 |
| 鉴权方式 | HMAC-SHA1 Token |

## 支持的平台

| 平台 | server 参数 | 说明 |
|------|------------|------|
| 网易云音乐 | `netease` | 功能完整 |
| QQ音乐 | `tencent` | 功能完整 |
| 酷狗音乐 | `kugou` | 功能完整 |
| 百度音乐 | `baidu` | 功能完整 |
| 酷我音乐 | `kuwo` | 功能完整 |

## API 接口

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `server` | string | 是 | 音乐平台 |
| `type` | string | 是 | 操作类型 |
| `id` | string | 是 | 资源 ID 或搜索关键词 |
| `auth` | string | 条件 | 鉴权令牌（敏感操作需要） |

### 操作类型

| type | 说明 | 需要鉴权 | 返回格式 |
|------|------|----------|----------|
| `search` | 搜索歌曲 | ❌ | JSON 数组 |
| `song` | 获取歌曲详情 | ❌ | JSON 数组 |
| `album` | 获取专辑 | ❌ | JSON 数组 |
| `artist` | 获取歌手作品 | ❌ | JSON 数组 |
| `playlist` | 获取歌单 | ❌ | JSON 数组 |
| `lrc` | 获取歌词 | ✅ | LRC 纯文本 |
| `url` | 获取播放链接 | ✅ | 302 重定向 |
| `pic` | 获取封面图片 | ✅ | 302 重定向 |

---

## 使用示例

### 1. 搜索歌曲

```bash
# 网易云搜索
curl "https://你的域名/api?server=netease&type=search&id=周杰伦"

# QQ音乐搜索
curl "https://你的域名/api?server=tencent&type=search&id=周杰伦"

# 酷狗搜索
curl "https://你的域名/api?server=kugou&type=search&id=稻香"
```

**响应示例：**

```json
[
  {
    "title": "稻香",
    "author": "周杰伦",
    "url": "https://你的域名/api?server=netease&type=url&id=185790&auth=xxx",
    "pic": "https://你的域名/api?server=netease&type=pic&id=109951171358446171&auth=xxx",
    "lrc": "https://你的域名/api?server=netease&type=lrc&id=185790&auth=xxx"
  }
]
```

### 2. 获取歌词

```bash
curl "https://你的域名/api?server=netease&type=lrc&id=185790&auth=你的token"
```

**响应示例（LRC 格式）：**

```
[00:00.000] 稻香 - 周杰伦
[00:01.000] 词：周杰伦
[00:02.000] 曲：周杰伦
[00:18.500] 对这个世界如果你有太多的抱怨
[00:21.500] 跌倒了就不敢继续往前走
```

### 3. 获取播放链接

```bash
curl -L "https://你的域名/api?server=netease&type=url&id=185790&auth=你的token"
```

**说明：** 会返回 302 重定向到实际音乐文件地址。

### 4. 获取封面图片

```bash
curl -L "https://你的域名/api?server=netease&type=pic&id=109951171358446171&auth=你的token"
```

**说明：** 会返回 302 重定向到实际图片地址。

### 5. 获取歌单

```bash
curl "https://你的域名/api?server=netease&type=playlist&id=24381616"
```

### 6. 获取专辑

```bash
curl "https://你的域名/api?server=netease&type=album&id=34819136"
```

### 7. 获取歌手作品

```bash
curl "https://你的域名/api?server=netease&type=artist&id=6452"
```

---

## Token 计算方法

敏感操作（`lrc`、`url`、`pic`）需要提供鉴权 Token。

### 计算公式

```
token = HMAC-SHA1(secret, server + type + id)
```

### JavaScript 示例

```javascript
const crypto = require('crypto');

function generateToken(server, type, id, secret = '你的密钥') {
  const message = `${server}${type}${id}`;
  return crypto.createHmac('sha1', secret).update(message).digest('hex');
}

// 示例
const token = generateToken('netease', 'url', '185790');
console.log(token);
```

### Python 示例

```python
import hmac
import hashlib

def generate_token(server, type, id, secret='你的密钥'):
    message = f'{server}{type}{id}'
    return hmac.new(secret.encode(), message.encode(), hashlib.sha1).hexdigest()

# 示例
token = generate_token('netease', 'url', '185790')
print(token)
```

### PHP 示例

```php
<?php
function generateToken($server, $type, $id, $secret = '你的密钥') {
    $message = $server . $type . $id;
    return hash_hmac('sha1', $message, $secret);
}

// 示例
$token = generateToken('netease', 'url', '185790');
echo $token;
?>
```

---

## 前端集成示例

### HTML Audio 播放器

```html
<!DOCTYPE html>
<html>
<head>
    <title>音乐播放器</title>
</head>
<body>
    <input type="text" id="keyword" placeholder="搜索歌曲">
    <button onclick="search()">搜索</button>
    <div id="results"></div>
    <audio id="player" controls></audio>

    <script>
        const API = 'https://你的域名/api';

        async function search() {
            const keyword = document.getElementById('keyword').value;
            const res = await fetch(`${API}?server=netease&type=search&id=${keyword}`);
            const songs = await res.json();

            const html = songs.map((song, i) => `
                <div onclick="play('${song.url}', '${song.lrc}')">
                    ${i + 1}. ${song.title} - ${song.author}
                </div>
            `).join('');

            document.getElementById('results').innerHTML = html;
        }

        async function play(url, lrc) {
            const player = document.getElementById('player');
            player.src = url;
            player.play();

            // 获取歌词
            const res = await fetch(lrc);
            const text = await res.text();
            console.log('歌词:', text);
        }
    </script>
</body>
</html>
```

### Vue.js 示例

```vue
<template>
  <div>
    <input v-model="keyword" @keyup.enter="search" placeholder="搜索歌曲">
    <button @click="search">搜索</button>

    <div v-for="(song, index) in songs" :key="index" @click="play(song)">
      {{ index + 1 }}. {{ song.title }} - {{ song.author }}
    </div>

    <audio ref="player" controls></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      API: 'https://你的域名/api',
      keyword: '',
      songs: []
    }
  },
  methods: {
    async search() {
      const res = await fetch(`${this.API}?server=netease&type=search&id=${this.keyword}`);
      this.songs = await res.json();
    },
    async play(song) {
      this.$refs.player.src = song.url;
      this.$refs.player.play();
    }
  }
}
</script>
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 302 | 重定向到资源（url/pic 类型） |
| 400 | 参数错误 |
| 401 | 鉴权失败（Token 无效） |
| 404 | 资源不存在 |
| 500 | 上游 API 调用失败 |

---

## 使用注意事项

### 1. 缓存机制

- URL 缓存 10 分钟
- 其他数据缓存 1 小时
- 响应头 `x-cache` 显示缓存状态

### 2. 请求频率

建议控制请求频率，避免被上游平台限流：

```javascript
// 添加延迟
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 使用
await search('歌曲1');
await delay(1000); // 等待 1 秒
await search('歌曲2');
```

### 3. 跨域问题

API 已配置 CORS，支持跨域请求。

### 4. HTTPS 要求

- 现代浏览器要求音频必须通过 HTTPS 播放
- 确保使用 HTTPS 地址访问 API

---

## 常见问题

### Q1: Token 计算错误怎么办？

确保：
- 密钥与部署时设置的 `METING_TOKEN` 一致
- 拼接顺序是 `server + type + id`
- 使用 HMAC-SHA1 算法

### Q2: 某些歌曲搜索不到？

不同平台版权不同，可以：
- 换个平台搜索
- 尝试不同的关键词

### Q3: 播放链接失效？

- URL 有缓存，可能已过期
- 重新获取最新链接

### Q4: 歌词乱码？

歌词是 UTF-8 编码，确保：
- 响应正确解码
- 前端使用 UTF-8 显示

---

## 相关资源

- [Meting-API GitHub](https://github.com/metowolf/Meting-API)
- [@meting/core](https://www.npmjs.com/package/@meting/core)
- [HMAC-SHA1 算法说明](https://en.wikipedia.org/wiki/HMAC)
