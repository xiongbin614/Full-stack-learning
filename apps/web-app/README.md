# web-app

小程序为主（可兼出 App）。对接 `../../server`。  
技术：**uni-app（Vue3）** —— 国内多端刚需。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | **uni-app（Vue3 + `<script setup>`）** |
| 语言 | TypeScript（推荐） |
| 构建 | Vite（官方 Vue3 模板） |
| 状态 | Pinia |
| UI | uni-ui 或 uView Plus |
| 目标端 | 微信小程序优先；有余力再 App |

## 鉴权注意

后端默认 Session + Cookie，小程序支持弱。本端上线前建议后端补 **JWT**，请求头带 Token。  
这是多端共用后端时的必练点。

## 建议功能

1. 登录 / 绑定
2. 待办列表
3. 扫码 / 打卡（uni 能力）
4. （进阶）订阅消息 / App 推送

## 建议顺序

web-pc 跑通 → 后端 JWT 就绪 → 再深做本端。

## 状态

占位中，待用官方 uni-app Vue3 模板初始化。
