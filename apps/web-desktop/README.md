# web-desktop

桌面端（Windows / macOS / Linux）。对接 `../../server`。  
技术：**Tauri 2 + Vue3**，页面思路复用 web-pc。

## 技术栈

| 类别 | 选型 |
|------|------|
| 桌面壳 | **Tauri 2** |
| 前端 | Vue3 + Vite + TS + Router + Pinia + Axios |
| UI | Element Plus（可与 pc 一致） |
| 系统 API | `@tauri-apps/api`（托盘、文件、通知） |
| 环境 | 需安装 Rust toolchain |

> 与 `optional/web-electron` 对比：一期用 Tauri；二期有余力再补 Electron（存量项目多见）。

## 建议功能

1. 登录与业务页（对齐 web-pc）
2. 系统托盘 / 未读提示
3. 本地选文件上传
4. 离线草稿（差异化）
5. （进阶）自动更新

## 建议顺序

web-pc 页面成型后，再包 Tauri 壳。

## 本地开发（脚手架就绪后）

```bash
cd apps/web-desktop
pnpm install
pnpm tauri dev
```

## 状态

占位中（由原 `web-tauri` 目录更名），待官方 Tauri + Vue3 模板初始化。
