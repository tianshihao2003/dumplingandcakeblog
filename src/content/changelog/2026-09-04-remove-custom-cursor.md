---
version: "v1.33.0"
date: 2026-09-04
type: removal
description: 移除全站自定义鼠标样式，恢复系统原生光标
---

## 移除自定义鼠标样式

- 全站光标不再替换为自定义图片（Simplify Handy Dark 主题），恢复系统原生光标——鼠标在链接、文本框、按钮等元素上的形态由系统统一管理，观感与系统一致。
- 同步移除了 `public/assets/cursors/` 下的 47 个光标图片资源（约 3.1MB），博客体积更轻、首屏样式表更精简。
- 相关样式文件 `src/styles/base/cursor.css` 与 `src/styles/main.css` 的导入已一并移除；各元素的指针形态由组件自身的 `cursor: pointer` 等原生规则接管，交互行为不受影响。
