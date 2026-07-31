# optional（二期选修）

> **先做完** `web-pc` / `web-admin` / `web-h5` / `web-app` / `web-desktop`，再开这里。  
> 目的：补市场上仍常见、但非全栈主线刚需的前端能力。

## 已建目录（有余力再初始化代码）

| 目录 | 技术 | 练什么 |
|------|------|--------|
| [`web-ssr`](./web-ssr/README.md) | **Next.js 或 Nuxt 二选一** | SSR、SEO、官网/营销站 |
| [`web-electron`](./web-electron/README.md) | Electron + Vue3 | 对比 Tauri，覆盖桌面存量生态 |

## 更远期（不单独立项也行，了解即可）

| 方向 | 代表技术 | 说明 |
|------|----------|------|
| 微前端 | qiankun / Module Federation | 中大厂协作场景，先看概念 |
| 跨端 App | React Native / Flutter | 要深原生 App 再开；现有 uni-app 已覆盖轻量 |
| 3D / 可视化 | Three.js、ECharts 大屏 | 专项岗，与鉴权/CRUD 主线无关 |
| 编译型框架 | SvelteKit | 拓宽视野，非国内业务主流 |
| 静态岛屿 | Astro | 与 SSR 选修重叠，有 web-ssr 即可 |
| 小游戏 | PixiJS 等 | 娱乐向，可跳过 |

## 原则

1. 一期五端 + 统一 `server` 闭环优先  
2. 二期每个目录只练一个差异点（SSR 或 Electron），不要平行开一堆  
3. SSR 框架 **Next 与 Nuxt 只深做一个**  
