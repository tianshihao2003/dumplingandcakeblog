---
title: 说说评论系统全面升级：每条说说独立评论区
published: 2026-07-27
tags:
  - Svelte
  - Waline
  - 说说
  - 评论系统
image: /assets/images/posts/tech-16-moment-comment-system.png
description: 为说说页面的每条动态适配独立评论区，实现自定义聊天室 UI、邮件通知导航到详情页等功能。
---

## 前言

博客的说说功能上线一段时间了，但之前只有留言板有评论区，说说页面的评论功能一直没有完善。这次花了点时间，给每条说说都加上了独立的评论区，并且重新设计了评论 UI，让整体体验更接近现代聊天应用。

## 功能概览

### 1. 每条说说独立评论区

点击说说卡片右下角的评论按钮，会弹出一个评论弹窗。每条说说的评论是独立的，通过 Waline 的 `path` 参数区分。

![511](https://img.tsh520.cn/file/blog/article/file-20260728015042792.png)

### 2. 自定义聊天室 UI

评论弹窗采用了留言板的聊天室风格：

- **气泡样式**：深色背景白色文字的聊天气泡
- **站长标识**：站长的消息显示在右侧，白色背景，并带有「站长」徽章
- **回复引用**：支持回复其他评论，引用内容以边框样式展示
- **日期居中**：每条评论的日期在消息上方居中显示

![437](https://img.tsh520.cn/file/blog/article/file-20260728015141435.png)

### 3. 赛车加载动画

评论弹窗打开时会显示一个赛车加载动画，最低展示 2 秒后才显示评论内容。

![460](https://img.tsh520.cn/file/blog/article/file-20260728015158486.png)

### 4. 邮件通知导航到详情页

当有人回复你的评论时，Waline 会发送邮件通知。邮件中的链接会直接跳转到对应的说说详情页（如 `/moments/2026-07-25/`），而不是动态列表页。

![466](https://img.tsh520.cn/file/blog/article/file-20260728015248762.png)

## 技术实现

### 评论弹窗组件

评论弹窗使用 Svelte 5 实现，核心是 `CommentModal.svelte` 组件：

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import CommentSidebarDesktop from "./CommentSidebarDesktop.svelte";
  import CommentSidebarMobile from "./CommentSidebarMobile.svelte";

  interface Props {
    serverURL: string;
    adminNicknames?: string[];
  }

  let { serverURL, adminNicknames = ["团子和蛋糕"] }: Props = $props();

  // 评论数据
  let comments: Comment[] = $state([]);
  let flatComments = $derived.by(() => {
    // 展平嵌套评论并按时间排序
  });

  // 弹窗状态
  let visible = $state(false);
  let phase = $state<"loader" | "comments">("loader");

  export function open(momentId: string, commentPath: string) {
    // 打开弹窗并加载评论
  }
</script>
```


### Waline API 集成

评论数据通过 Waline REST API 获取，而不是使用 Waline 的内置 UI：

```typescript
// 获取评论
const res = await fetch(`${serverURL}/api/comment?path=${encodeURIComponent(path)}&pageSize=100`);
const data = await res.json();
comments = data.data?.data || [];

// 发送评论
const body = {
  comment: `<p>${text.replace(/\n/g, "</p><p>")}</p>`,
  nick: nickText,
  mail: mailText,
  link: linkText,
  url: commentPath,
  ua: navigator.userAgent,
};
await fetch(`${serverURL}/api/comment`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
```

### 说说详情页

为了支持邮件通知中的链接跳转，创建了说说详情页 `src/pages/moments/[slug].astro`：

```astro
---
export async function getStaticPaths() {
  const moments = await getCollection("moments");
  return moments.map((moment) => ({
    params: { slug: moment.id },
    props: { moment },
  }));
}
---

<MomentCard moment={moment} detail={true} />
```

![177](https://img.tsh520.cn/file/blog/article/file-20260728015406150.png)

### 桌面端与移动端适配

评论弹窗在桌面端和移动端有不同的布局：

- **桌面端**：右侧固定显示评论成员列表
- **移动端**：成员列表默认隐藏，点击按钮后从右侧滑入

通过 CSS Grid 和媒体查询实现响应式布局：

```css
/* 桌面端：两列布局 */
.chat-workspace {
  display: grid;
  grid-template-columns: 1fr 11rem;
}

/* 移动端：单列布局 */
@media (max-width: 640px) {
  .chat-workspace { grid-template-columns: 1fr; }
  .sidebar-desktop { display: none; }
  .sidebar-mobile { display: block; }
}
```

![268](https://img.tsh520.cn/file/blog/article/file-20260728015459249.png)

## UI 设计细节

### 气泡样式

评论气泡参考了留言板的设计，使用 CSS 自定义属性适配深色/浅色主题：

```css
.msg-bubble {
  background: var(--guestbook-bubble);
  color: var(--guestbook-bubble-text);
  border-radius: var(--radius-medium);
  padding: var(--space-3) var(--space-4);
}

/* 站长消息 */
.msg.is-admin .msg-bubble {
  background: var(--guestbook-admin-bubble);
  color: var(--guestbook-admin-text);
}
```

### 回复引用

回复其他评论时，引用内容以边框样式显示在气泡内部：

```css
.msg-quote {
  border-left: 3px solid currentColor;
  padding: var(--space-2);
  opacity: 0.78;
  border-radius: var(--radius-small);
}
```

![398](https://img.tsh520.cn/file/blog/article/file-20260728015536115.png)

### 加载动画

使用了一个赛车动画作为加载指示器，动画颜色跟随主题：

```css
.loader > span {
  background: var(--deep-text);
}

.base span {
  border-right: 100px solid var(--deep-text);
}
```

## 总结

这次升级让说说页面的评论体验更加完整：

1. ✅ 每条说说都有独立评论区
2. ✅ 评论 UI 采用聊天室风格
3. ✅ 邮件通知可直接跳转到对应说说
4. ✅ 桌面端和移动端都有良好的体验

后续还计划添加评论点赞、表情包等功能，让互动更加丰富。

