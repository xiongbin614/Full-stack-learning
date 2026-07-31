# apps

多个客户端，**共用** `../server` 后端。分两期：主线五端先做完，选修技术以后再补。

## 一期主线（先做这些）

| 目录 | 定位 | 技术栈 | 顺序 |
|------|------|--------|------|
| [`web-pc`](./web-pc/README.md) | PC 业务主站 | **Vue3 + Vite 全家桶** + Element Plus | ① |
| [`web-admin`](./web-admin/README.md) | 管理后台 | **React + Vite + Ant Design** | ② |
| [`web-h5`](./web-h5/README.md) | 移动 H5 / 深链 | **Vue3 + Vant 4** | ② |
| [`web-app`](./web-app/README.md) | 小程序（可兼 App） | **uni-app（Vue3）** | ③ |
| [`web-desktop`](./web-desktop/README.md) | 桌面壳 | **Tauri 2 + Vue3**（复用 pc 思路） | ②～③ |

```
apps/web-pc       ─┐
apps/web-admin    ─┤
apps/web-h5       ─┼─→  server (/api/...)  ─→  MySQL / Redis
apps/web-app      ─┤
apps/web-desktop  ─┘
```

### 一期怎么排

1. **web-pc**：登录 Session + 用户列表，跑通全家桶与联调  
2. **web-admin** 或 **web-h5**：同一 API，换栈/换场景  
3. **web-desktop**：pc 页面思路包进 Tauri  
4. **web-app**：uni-app；通常需后端补 JWT 后再对接  

重复代码多了再抽 `packages/`，别提前造轮子。

---

## 二期选修（主线做完再开）

见 [`optional/README.md`](./optional/README.md)。

| 目录 | 练什么 | 何时做 |
|------|--------|--------|
| [`optional/web-ssr`](./optional/web-ssr/README.md) | Next **或** Nuxt 二选一（SSR/SEO） | 一期五端跑通后 |
| [`optional/web-electron`](./optional/web-electron/README.md) | Electron，对比 Tauri | 桌面有余力时 |

更远期（只了解、不单独立项也行）：微前端、RN/Flutter、Three.js、游戏引擎等——见 optional 说明。
