# web-admin

管理后台（中后台）。对接 `../../server`。  
定位：**权限与系统治理** + 补 React 生态；与 web-pc（AI 业务站）分工明确。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | **React 18+** |
| 构建 | Vite |
| 语言 | TypeScript |
| 路由 | React Router |
| 状态 | Zustand（推荐）或 Redux Toolkit |
| 请求 | Axios / fetch 封装 |
| UI | **Ant Design 5** |

## 与 web-pc 分工

| | web-pc | web-admin |
|--|--------|-----------|
| 用户 | 业务 / AI 使用者 | 管理员 / 运维 |
| 主功能 | 知识库、智能体、技能、对话 | 权限、用户、角色、日志、（后期）部署 |
| 技术 | Vue3 全家桶 | React + Ant Design |

---

## 功能清单

### P0（先做）

| 模块 | 功能点 |
|------|--------|
| 登录 | 登录 / 退出；仅管理员可进（路由 + 后端角色） |
| 用户管理 | 列表、创建、编辑、禁用/启用、重置密码、分配角色 |
| 角色管理 | 角色 CRUD；绑定权限点 |
| 权限管理 | 权限点 / 菜单树配置；接口权限码与菜单对应 |
| 布局 | 侧栏菜单（按权限动态渲染）+ 顶栏 |

### P1（权限闭环补齐）

| 模块 | 功能点 |
|------|--------|
| 日志管理 | 登录日志、操作日志（谁在何时做了什么）；筛选、详情 |
| 个人中心 | 改密、基本资料 |
| 字典 / 配置 | 简单系统参数（如站点名、AI 开关）——方便后面接运维 |

### P2（为 CI/CD 可视化预留，后做）

| 模块 | 功能点 | 学习收益 |
|------|--------|----------|
| 应用 / 环境 | 登记应用（web-pc、server…）、环境（dev/test/prod） | 配置模型 |
| 流水线 | 触发构建、看步骤状态（排队/成功/失败） | 对接 GitHub Actions / Jenkins API 或自建回调 |
| 部署记录 | 版本号、操作人、结果、回滚入口（可先做假数据） | 发布与回滚意识 |
| 制品 / 镜像 | 镜像 tag 列表（可对接 Harbor/本地 registry 概念） | 容器化衔接 |
| 告警通知 | 构建失败通知（站内信即可） | 可观测入门 |

> P2 不要和 P0 并行；等权限体系 + Docker 部署跑通过后再开「部署中心」菜单。

### 可不做（控制范围）

- 完整 CMDB / 多租户计费  
- 自研完整 CI 引擎（优先**对接**现有 CI，做可视化与触发）  
- 与 web-pc 重复的 AI 对话页  

## 建议顺序

1. 登录 + 用户/角色/权限 + 动态菜单  
2. 操作日志  
3. Docker/Compose 能部署 server 与前端后 → **部署中心（P2）**

## 状态

✅ **已初始化**（React 18 + Vite 7 + TypeScript + Ant Design 5 + React Router + Zustand + Axios）。

- 已实现 P0：登录/退出、动态菜单布局、用户管理、角色管理、权限管理
- 已实现 P1：操作日志（列表 / 关键字与模块筛选 / 分页）、工作台统计
- 启动：`npm install && npm run dev`（dev server: http://localhost:5174）

### 当前阶段：前端 Mock（后端未实现）

- 全部 `/api` 请求由 `mock/`（Vite 中间件插件）拦截并返回数据，**不联调后端**；
- 响应结构沿用后端契约 `Result<T>` / `PageResult<T>`：`{ code, message, data, timestamp }`、分页 `{ list, total, pageNum, pageSize }`；
- **接口契约 = 后端实现蓝本**：见 `mock/routes.ts` 顶部注释与路由表（URL、方法、请求、响应）。后端按该契约实现后，前端无需改动。

### Mock 账号

| 账号 | 密码 | 角色 | 权限 |
|------|------|------|------|
| `admin` | `admin123` | 管理员 | 全部权限（权限码 `*`） |
| `alice` | `123456` | 运营人员 | 用户管理（不含角色/权限管理） |
| `bob` | `123456` | 访客（已禁用示例） | 仅日志管理 |

### 切换真实后端（联调）

1. 将 `.env.development` 中 `VITE_USE_MOCK` 改为 `false`；
2. 保持 `VITE_PROXY_TARGET=http://localhost:8080`（或改为实际后端地址）；
3. 登录返回真实 token 后，调整 `src/store/authStore.ts` 的 `login()` 使用后端返回的 token（当前为 `mock-token-{username}` 占位）。

### 目录结构

```
apps/web-admin/
├── mock/                  # Mock 层（Vite 插件 + 内存数据 + 路由表 = 后端契约）
│   ├── index.ts           # 插件入口：拦截 /api、Bearer 鉴权、写操作自动记日志
│   ├── routes.ts          # 接口路由表与处理逻辑（auth/users/roles/permissions/logs/dashboard）
│   └── db.ts              # 内存种子数据（用户/角色/权限/日志）
└── src/
    ├── api/               # 接口封装（auth/user/system）
    ├── layouts/           # 主布局（动态菜单 + 顶栏）
    ├── pages/             # login/dashboard/system(user|role|permission)/log/error
    ├── router/            # 路由 + AuthGuard（登录守卫）
    ├── store/             # Zustand（authStore/permissionStore）
    ├── styles/            # 全局样式
    └── types/             # 类型定义（对齐后端契约）
```
