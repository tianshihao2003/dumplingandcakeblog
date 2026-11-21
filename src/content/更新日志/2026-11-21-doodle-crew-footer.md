---
version: "v1.66.0"
date: 2026-11-21
time: "17:10"
type: feature
description: 页脚换成手绘 Doodle Crew 风格，巨型字 + 六个角色 + 飘落涂鸦
---

## 手绘 Doodle Crew 页脚

- 页脚重做成「速写本最后一页」：`DUMPLING` 巨型干笔字、团子/啾啾/小菇/小满/阿飘/蛋糕六个手绘角色站在字母上，火焰、三明治、星星等涂鸦飘落。
- 进入视口后播一遍分镜：画地面 → 字母逐个盖章 → 角色登场 → 涂鸦起飞 → 文案逐字 → 按钮升起；之后眼睛跟随指针、会眨眼，字母 hover 抖动，点角色会跳一下并说一句话，戳涂鸦会炸开再回来。
- React 组件已移植成 Svelte 5（`src/components/layout/DoodleCrewFooter.svelte` + `doodle-crew-footer/`），不引入 React / shadcn；页脚在 Swup 容器外，`client:visible` 只水合一次。
- 内容集中在 `src/config/footerConfig.ts`：品牌、简介、四列链接、两个按钮、版权、ICP/公安备案、六个角色台词都可以直接改。旧的 `FooterConfig.html` 与 `enable/customHtml` 已删除。
- 页脚移到网格 / `max-w` 容器外，整屏宽；内部内容按 `--page-width` 居中，所以有左右侧栏的页面也不会再被挤压。`/guestbook/`、`/categories/` 图谱、`/music/` 继续按原规则隐藏页脚。
- 动效尊重 `prefers-reduced-motion`；JS 关闭时直接显示静态终态并隐藏涂鸦。样式在 `src/styles/components/doodle-crew-footer.css`，没有新增 `!important`。
- 顺手修了文章页封面/头像的 `import.meta.glob`：只匹配图片扩展名，避免 `src/content/公众号` 里的 `.py` 脚本把生产构建打成 `PARSE_ERROR`。
