# web-pc

**组件练习后台（骨架）**。数据来自仓库根目录：

- `组件练习后台原型.html`
- `中间件练习路线表.xlsx`

定位：左侧选模块，**主区域留给开发**；总览 / 需求说明收在右上角图标抽屉里。  
当前**不接后端**；后续在模块开发区补真实练习 UI。

## 技术栈

Vue 3 + Vite + TypeScript + Vue Router + Pinia + Axios + Element Plus

## 本地开发

```bash
cd apps/web-pc
npm install
npm run dev
```

默认：<http://localhost:5173/>（进入 `M00` 开发区）

## 交互

- 右上角 **网格图标**：练习总览抽屉（搜索 / P0·P1·P2）
- 右上角 **文档图标**：当前模块需求说明抽屉
- 主区：开发占位，写真实练习页面用

## 目录要点

```
src/
  data/modules.json              # 原型抽取的模块与需求
  components/OverviewDrawer.vue  # 总览抽屉
  components/RequirementDrawer.vue
  views/module                   # 模块开发区（主内容）
  layouts/MainLayout             # 左导航 + 右上角入口
```

权限后台仍归 `web-admin`。
