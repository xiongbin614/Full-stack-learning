# web-pc

PC 业务主站（**学习主线**）。对接 `../../server`。  
定位：**AI 业务面**——知识库 RAG、智能体、技能、对话及扩展能力；不做权限后台（归 web-admin）。

## 技术栈（Vue3 全家桶）

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3（`<script setup>`） |
| 构建 | Vite |
| 语言 | TypeScript |
| 路由 | Vue Router 4 |
| 状态 | Pinia |
| 请求 | Axios |
| UI | Element Plus |

约定：**Vue3 + Vite + TS + Vue Router + Pinia + Axios + Element Plus**。

---

## 功能清单（已纳入规划）

### P0 — 基础（可先无 AI）

- [ ] 登录 / 退出登录（Session，后续可切 JWT）
- [ ] 工作台入口：知识广场、智能体、技能、新对话、工作流（后开）
- [ ] 展示当前用户；无权限提示找管理员

### P1 — AI 主干

- [ ] **知识广场**：知识库 CRUD、文档上传、可见范围（个人/组织）
- [ ] **RAG 检索**：提问 → 命中片段 → 答案
- [ ] **智能体**：列表、创建/编辑（人设、绑定技能/知识库）
- [ ] **技能管理**：列表、入参说明、启用/停用
- [ ] **新对话**：多轮、流式输出、工具调用展示

### P2 — 体验补齐（强烈建议）

- [ ] **会话历史**：列表、重命名、删除、继续聊
- [ ] **消息反馈**：赞/踩、复制、重新生成
- [ ] **引用展示**：来源文档片段可点击
- [ ] **技能调用确认**：写操作需用户确认
- [ ] **用量统计**：今日对话次数、Token 粗估

### P3 — 进阶衔接

- [ ] **MCP 说明页**：已挂载能力 / Cursor 使用方式
- [ ] **模型配置只读**：当前模型、温度等（修改归 admin）
- [ ] **分享对话**：只读分享链接

### P4 — AI 累加能力（主线跑通后再做）

- [ ] **多模型切换**：对话内切换模型或档位（自动/便宜/强）
- [ ] **Prompt 模板**：模板库、一键套用
- [ ] **人机协同**：Agent 中途暂停，改参数后继续
- [ ] **工作流编排**：检索 → 总结 → 调技能（可先接 Dify）
- [ ] **知识库增强**：解析状态、失败重试、分段预览、混合检索开关
- [ ] **语音输入**：语音转文字再发送
- [ ] **文件对话**：单次上传 PDF/图片，不入库也可问
- [ ] **对比模式**：同一问题双模型/双 Agent 并排答
- [ ] **记忆**：用户/项目级长期记忆（可开关）
- [ ] **技能市场感**：分类浏览、一键绑定到 Agent
- [ ] **安全护栏**：敏感拦截提示、越权拒绝原因
- [ ] **导出**：对话导出 Markdown / PDF

> 顺序建议：`P0 → P1 → P2`，再按兴趣从 P4 每次加一块并对接后端；P3 可与 P4 穿插。

### 不做（归其他端）

- 角色 / 权限 / 用户 CRUD / 操作日志 → **web-admin**
- CI/CD 可视化部署 → **web-admin P2**
- 完整评测平台、多租户计费、模型训练 → 超出本站范围

---

## 本地开发

```bash
cd apps/web-pc
npm install
npm run dev        # http://localhost:5173
```

### Mock 账号（当前阶段：不联调后端）

| 账号 | 密码 | 角色 |
|------|------|------|
| `admin` | `admin123` | 管理员 |
| `alice` | `123456` | 普通用户 |
| `bob` | `123456` | 普通用户 |

### Mock 说明

- 开发模式下默认启用 Mock：`mock/` 下实现了一个 Vite 中间件插件，拦截 `/api/*` 请求并返回与后端一致的 `Result<T>` / `PageResult<T>` 结构。
- 响应体契约与 `server`（Spring Boot）对齐：`{ code, message, data, timestamp }`、分页 `{ list, total, pageNum, pageSize }`。
- 登录态模拟：前端生成 `mock-token-{username}` 存 `localStorage`，请求头带 `Authorization: Bearer <token>`；未登录访问受保护接口返回 401 并跳转登录页。

### 切换真实后端（联调）

1. 将 `.env.development` 中 `VITE_USE_MOCK` 改为 `false`；
2. 保持 `VITE_PROXY_TARGET=http://localhost:8080`（或改为实际后端地址），`/api` 请求经 Vite 代理转发；
3. 后端登录返回真实 token 后，调整 `src/stores/user.ts` 的 `login()` 改为使用后端返回的 token（当前为 `mock-token-{username}` 占位）。

### 目录结构

```
apps/web-pc/
├── mock/                  # Mock 层（Vite 插件 + 内存数据 + 路由表）
│   ├── index.ts           # 插件入口：拦截 /api、鉴权校验
│   ├── routes.ts          # 接口路由表与处理逻辑
│   └── db.ts              # 内存种子数据
└── src/
    ├── api/               # 接口封装（auth/knowledge/agent/skill/chat/dashboard）
    ├── layouts/           # 主布局（侧边栏 + 顶栏）
    ├── router/            # 路由 + 登录守卫
    ├── stores/            # Pinia（user store）
    ├── styles/            # 全局样式
    ├── types/             # 类型定义（对齐后端契约）
    ├── utils/             # axios 封装
    └── views/             # 页面（login/dashboard/knowledge/agents/skills/chat/error）
```

## 状态

- ✅ 脚手架与框架（Vue3 + Vite + TS + Vue Router + Pinia + Axios + Element Plus）
- ✅ 登录 / 退出登录（Mock Session 模拟，可切换 JWT）
- ✅ 工作台入口：知识广场、智能体、技能、新对话
- ✅ 展示当前用户；Mock 数据可增删改查
- ⏳ 联调真实后端（`server`），对接后移除 Mock
