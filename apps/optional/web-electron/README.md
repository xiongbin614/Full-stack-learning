# web-electron（二期选修）

桌面端对照项。一期桌面主线是 `../web-desktop`（Tauri）；本目录用于补 **Electron** 存量生态。

## 技术栈建议

| 类别 | 选型 |
|------|------|
| 壳 | Electron |
| 前端 | Vue3 + Vite（复用 web-pc 思路） |
| 对比点 | 包体积、内存、主/渲染进程、自动更新、打包 |

## 建议练什么

1. 同一套业务页分别跑在 Tauri 与 Electron  
2. 记一篇对比笔记（体积、启动、API 差异）  
3. 不必两套都做完整功能，Electron 做「能装、能调 API」的 Demo 即可  

## 何时开始

`web-desktop`（Tauri）已经能打包运行之后。

## 状态

目录预留，未初始化代码。
