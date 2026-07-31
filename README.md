# 程序员全路线学习地图（高级前端 → 全栈）

> 定位：**高级前端转全栈**。前端默认已具备；目标是摸清「程序员全栈/工程全路线」：后端、鉴权与单点登录、中间件、部署运维、多端，以及当前市场主流的 Agent / Skills / MCP / RAG。
>
> 用法：每个技能配小项目；清单可打勾。不必一次全学完，按「主线必须 → 进阶选学」推进。

---

## 全景图（先建立坐标）

```
产品 / 业务
    │
前端 / 多端 ─────────── 网关 / BFF ─────────── 后端服务
    │                      │                    │
桌面·小程序·App          鉴权·限流·路由         领域逻辑·API
    │                      │                    │
    └────────── SSO / OAuth / OIDC ─────────────┘
                           │
              MySQL · Redis · MQ · 对象存储
                           │
              Docker · CI/CD · Nginx · K8s · 云
                           │
              日志 · 监控 · 链路追踪 · 告警
                           │
              LLM · Skills · Agent · MCP · RAG
```

**建议主线：** 能独立交付「带登录的业务系统」→「能部署上线」→「能接 AI Agent」。  
**进阶线：** SSO、消息队列、微服务、K8s、可观测、多端、企业级 Agent。

## 仓库结构（1 后端 + 多端）

```
CMCCPC_WEB/
├── README.md
├── server/                 # 统一后端 Spring Boot
├── apps/
│   ├── web-pc/             # ① Vue3 + Vite 全家桶 SPA（主线）
│   ├── web-admin/          # ② React + Vite + Ant Design
│   ├── web-h5/             # ② Vue3 + Vant（移动 H5）
│   ├── web-app/            # ③ uni-app（小程序）
│   ├── web-desktop/        # ②～③ Tauri + Vue3（桌面）
│   └── optional/           # 二期：SSR / Electron 等（主线后再做）
└── packages/               # （预留）共享前端包
```

- 前端总览：[apps/README.md](./apps/README.md)（含一期顺序 + 二期选修）
- 后端说明：[server/PROJECT.md](./server/PROJECT.md)

---

## 你已具备（默认跳过）

- Vue3 / 组件化 / 状态管理 / 路由
- TypeScript、Vite、现代前端工程化
- 作为调用方对接 HTTP / 鉴权
- Git、Code Review、前端测试与规范

只补「转全栈必须」和「市场流行、值得刻意练」的部分。

---

## 阶段 1：前端补盲（按需穿插）

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| npm 发包 | 版本语义、changelog、发布 | 发布一个工具包 | 高 |
| Web Worker | 消息协议、可取消任务 | CSV / 大文件解析 | 中 |
| BFF 意识 | 聚合接口、裁剪字段、鉴权下沉 | 给看板加一层轻量 Node/Java BFF | 中 |
| 桌面壳 | Electron / Tauri | 已有 Vue 包桌面端 | 选学 |

---

## 阶段 2：后端核心（主战场）

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| Java 基础 | 集合、流、异常、并发入门 | 命令行 CRUD | 高 |
| Spring Boot | 分层、DI、校验、统一异常 | 用户 + 任务 REST API | 高 |
| 持久层 | MyBatis 或 JPA（先精通一个） | 完整 Repository | 高 |
| MySQL | 表设计、索引、事务、联表、迁移 | ER 图 + Flyway/Liquibase | 高 |
| Redis | 缓存、Token、限流、简单锁 | 登录态 + 热点缓存 | 高 |
| 接口设计 | 分页、幂等、错误码、OpenAPI | 前后端契约文档 | 高 |
| 文件 / 对象存储 | 上传、鉴权 URL、MinIO/OSS | 头像与附件 | 中 |

**阶段项目：** Vue 任务看板 + Spring Boot + MySQL + Redis 联调跑通。

### 转栈要建立的后端意识

1. 先数据模型与约束，再接口  
2. 事务 vs 最终一致  
3. 超时 / 重试 / 幂等 / 部分失败  
4. 鉴权、越权、敏感字段、注入  
5. 配置外置、环境隔离、可排障日志  

---

## 阶段 3：鉴权、权限与单点登录（SSO）

> 高级前端多半「接过登录」，转全栈要会「设计登录与跨系统身份」。

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| 会话 vs JWT | Cookie Session、JWT 利弊、刷新 Token | 两套登录实现对比 | 高 |
| 密码安全 | 哈希（BCrypt）、防爆破、锁定策略 | 注册登录加固 | 高 |
| RBAC / 权限模型 | 用户-角色-权限、菜单与接口鉴权 | 管理员 / 普通用户分权 | 高 |
| OAuth2 / OIDC | 授权码模式、ID Token、第三方登录 | 「用 GitHub / 企业微信登录」 | 高 |
| SSO 单点登录 | 统一认证中心、Ticket / Token 换票、登出同步 | 两个子系统共用一个认证中心 | 高 |
| 常见方案了解 | CAS、Keycloak、Authing、自建 Auth Server | 本地起 Keycloak 接一个 Demo | 中 |
| 前端配合 | 静默续期、跨域 Cookie、路由守卫、401 处理 | 看板完整登录体验 | 高 |

**阶段项目：**  
1）本系统 JWT + RBAC；  
2）再做一个简易 SSO：`auth-center` + `app-a` + `app-b`，登录一次两边可用。

---

## 阶段 4：中间件与后端进阶（选学加深）

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| 消息队列 | 异步解耦、削峰、至少一次投递 | RabbitMQ / Kafka：注册发邮件/站内信 | 中 |
| 定时任务 | 调度、失败重试、幂等 | 每日报表 / 过期清理 | 中 |
| API 网关 | 路由、限流、鉴权转发 | Nginx / Spring Cloud Gateway 入门 | 中 |
| 搜索 | 倒排、分词入门 | Elasticsearch 做任务全文搜（可选） | 选学 |
| 微服务意识 | 拆分边界、服务发现、配置中心（先理解再上） | 把「用户服务 / 任务服务」逻辑拆分演练 | 选学 |
| 分布式事务入门 | 本地消息表 / 最终一致 | 下单扣库存类 Demo（概念练） | 选学 |

先把单体 Spring Boot 做扎实，再碰拆分；避免过早微服务。

---

## 阶段 5：测试、质量与可观测

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| 后端测试 | 单测、接口测、Testcontainers | 登录 + CRUD 测试 | 高 |
| 结构化日志 | 请求 ID、分级、脱敏 | 一次请求可追踪 | 高 |
| 监控指标 | JVM / QPS / 错误率 | Prometheus + Grafana 入门 | 中 |
| 链路追踪 | TraceId 跨服务 | SkyWalking / Zipkin 尝鲜 | 选学 |
| 安全扫描入门 | 依赖漏洞、基础渗透意识 | Dependabot / 简单 OWASP 检查 | 中 |

---

## 阶段 6：部署、运维与上线（必修）

> 「能跑在自己电脑」不算全栈闭环；要会让别人访问到稳定服务。

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| Linux 基础 | 进程、端口、权限、journal | 云主机上手常用命令 | 高 |
| Nginx | 反向代理、HTTPS、静态资源、gzip | 前端静态 + 后端反向代理 | 高 |
| Docker | Dockerfile、多阶段构建、镜像精简 | 前后端分别镜像化 | 高 |
| Docker Compose | 多容器编排 | MySQL + Redis + 后端 + Nginx 一键起 | 高 |
| CI/CD | 自动测试、构建、发布 | GitHub Actions：push → build → 部署 | 高 |
| 环境管理 | dev / test / prod、配置与密钥 | `.env` + 密钥不进仓库 | 高 |
| HTTPS / 域名 | 证书、DNS、跨域策略 | 个人域名挂 Demo | 中 |
| 云厂商入门 | 一台 ECS / 对象存储 / CDN | 阿里云 / 腾讯云 / AWS 任选 | 中 |
| K8s 入门 | Pod / Service / Ingress 概念 | 把 Compose 项目迁一个最小 K8s（选学） | 选学 |
| 发布策略 | 蓝绿、滚动、回滚意识 | 文档级理解 + 一次回滚演练 | 选学 |

**阶段项目：** 任务看板公网可访问：Compose + Nginx + HTTPS + CI 自动部署。

---

## 阶段 7：多端扩展（用前端优势加速）

选一条主线即可，重点是「复用同一套后端 / SSO」。

| 方向 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| 桌面 | Electron / Tauri、本地能力、自动更新 | 桌面版看板 / 笔记 | 选学 |
| 小程序 | uni-app / 微信原生、登录差异 | 打卡 / 报名 | 选学 |
| App | uni-app / RN / Flutter（选一） | 移动端看板内测包 | 选学 |

---

## 阶段 8：AI 全路线（市场流行能力）

> 顺序建议：先会调模型 → 会挂工具（Skills / Function Calling）→ 会编排 Agent → 会用 MCP 接外部系统 → 会做 RAG → 再碰低代码平台与多 Agent。

### 8.1 基础能力

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| LLM API | Chat、流式 SSE、Token、温度 | 站内流式聊天助手 | 高 |
| Prompt / 结构化输出 | 系统提示、JSON Schema、少样本 | 「把自然语言转成建任务 JSON」 | 高 |
| Function Calling / Tools | 模型选工具、参数校验、执行回灌 | 助手可查任务列表、创建任务 | 高 |
| 安全与成本 | 提示注入、权限、限流、账单 | 工具调用必须走后端鉴权 | 高 |

### 8.2 Skills（可复用技能包）

Skills = 把「某一类能力」封装成可被 Agent / IDE / 平台调用的技能单元。

| 方向 | 代表形态 | 练什么 | 建议小项目 |
|------|----------|--------|------------|
| 业务 Skills | 自研 tool / skill 目录 | 描述、入参、出参、副作用 | `task.create` / `task.search` / `doc.summarize` |
| Cursor Skills | `SKILL.md` + 脚本约定 | 让 Agent 按技能说明执行 | 为本仓库写 1～2 个 Cursor Skill |
| 平台 Skills | Dify / Coze 插件与工具 | 可视化挂载 HTTP / 代码工具 | 把你的任务 API 挂成平台工具 |
| 调用关系 | Agent → Skills → 后端 API / MCP | 技能不直连数据库（推荐经 API） | 画一张调用链并实现 |

### 8.3 Agent（智能体编排）

| 类型 | 市场常见方案 | 适合场景 | 练习建议 |
|------|--------------|----------|----------|
| 低代码 / 可视化 | **Dify**、**Coze**、n8n AI 节点 | 快速 Demo、运营可配 | 先用 Dify 搭一个「任务助手」工作流 |
| 生产级编排（Python） | **LangGraph**（主流）、LlamaIndex Workflows | 有状态、可恢复、人机协同 | 实现「规划 → 调工具 → 确认 → 写库」 |
| 多 Agent 协作 | **CrewAI**、AutoGen/AG2 | 角色分工原型 | 研究员 + 执行员两个角色 Demo |
| 官方 SDK | **OpenAI Agents SDK**、**Claude Agent SDK**、Google ADK | 紧跟模型厂商能力 | 任选一个跑通 tool + 流式 |
| TS 优先 | **Mastra**、LangGraph.js | 前端背景友好 | 用 TS 写一个站内 Agent |
| 企业 / .NET | Microsoft Agent Framework（Semantic Kernel 一脉） | 微软技术栈 | 了解即可 |

**最小自研 Agent 闭环：**  
用户自然语言 → 规划 → 调用 Skills/Tools →（可选）人机确认 → 写你的 MySQL → 返回结果。

### 8.4 MCP（Model Context Protocol）

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| MCP 概念 | Host / Client / Server、Tools/Resources/Prompts | 读官方概念并画图 | 高 |
| 写 MCP Server | 把已有能力暴露给 Cursor / Claude 等 | `tasks` MCP：列表 / 创建（走你的 API） | 高 |
| 消费 MCP | 在 Agent 或 IDE 里挂载 Server | Cursor 里调用自己的 MCP | 高 |
| 与 Skills 分工 | Skills≈技能说明与封装；MCP≈标准协议连接器 | 同一任务能力同时提供 Skill + MCP | 中 |

### 8.5 RAG（检索增强）

| 技能 | 练什么 | 建议小项目 | 优先级 |
|------|--------|------------|--------|
| 文档处理 | 切分、清洗、元数据 | 导入 README / 业务文档 | 高 |
| 向量库 | embedding、相似度检索 | pgvector / Milvus / 云向量库任选 | 高 |
| 检索策略 | TopK、重排、混合检索（关键词+向量） | 对比「纯模型胡答」vs「有检索」 | 高 |
| RAG + Agent | 先检索再决策 / 工具 | 「文档问答 + 必要时建任务」 | 中 |

### 8.6 阶段综合项目（AI）

**「智能任务工作台」一条龙：**

1. 后端已有任务 API + 登录鉴权  
2. 封装 3 个 Skills（查 / 建 / 摘要）  
3. 自研或 LangGraph / Dify 做一个 Agent 调用这些 Skills  
4. 再提供一个 MCP Server 给 Cursor 用  
5. 加上 RAG：上传项目文档可问答  
6. 全链路权限：Agent 只能以当前用户身份操作数据  

---

## 推荐练习顺序（转栈实战版）

```
Vue 看板壳（极短）
  → Java + Spring Boot + MySQL 第一版 API
  → Redis + JWT + RBAC
  → 前后端联调成型
  → Docker Compose + Nginx 部署上线
  → CI/CD
  → SSO / OAuth2（两个子系统单点登录）
  → 穿插：npm 发包、Worker
  → MQ / 网关（按需）
  → 多端选一
  → LLM 流式聊天
  → Function Calling / Skills
  → Agent（Dify 快速体验 + LangGraph 或 TS 自研二选一加深）
  → MCP Server
  → RAG
  →（选学）K8s、微服务、可观测全家桶
```

---

## 当前仓库练习清单

### 前端补盲
- [ ] npm 工具包发布
- [ ] Web Worker
- [ ] （可选）BFF / 桌面壳

### 后端核心
- [ ] Java
- [ ] Spring Boot
- [ ] MySQL
- [ ] Redis
- [ ] 接口规范 / OpenAPI

### 鉴权与 SSO
- [ ] JWT + 刷新 Token
- [ ] RBAC 权限
- [ ] OAuth2 / OIDC 第三方登录
- [ ] SSO 单点登录（双应用）

### 部署运维
- [ ] Docker + Compose
- [ ] Nginx 反代
- [ ] CI/CD
- [ ] 域名 + HTTPS 上线
- [ ] （选）K8s 入门

### 中间件进阶（选学）
- [ ] 消息队列
- [ ] 定时任务
- [ ] API 网关

### 多端（一期主线）
- [ ] PC（`apps/web-pc` · Vue3 全家桶）
- [ ] Admin（`apps/web-admin` · React + Ant Design）
- [ ] H5（`apps/web-h5` · Vant）
- [ ] 小程序（`apps/web-app` · uni-app）
- [ ] 桌面（`apps/web-desktop` · Tauri）

### 多端（二期选修，主线后再做）
- [ ] SSR（`apps/optional/web-ssr` · Next 或 Nuxt 二选一）
- [ ] Electron（`apps/optional/web-electron` · 对比 Tauri）

### AI
- [ ] LLM 流式 API
- [ ] Skills（业务技能 + 可选 Cursor Skill）
- [ ] Agent（Dify/Coze 体验 + 代码编排加深）
- [ ] MCP Server
- [ ] RAG
- [ ] Agent 鉴权闭环（以用户身份调 API）

---

## 学习原则

1. **主线闭环优先**：业务 API → 登录权限 → 部署上线 → 再 AI。  
2. **每项一个可演示项目**，能给别人点开看，比只看文档更有效。  
3. **SSO、部署、Agent 都要碰到真实调用链**，不要停在名词。  
4. **AI 能力挂在你自己的后端与权限上**，才算全栈 AI，而不是聊天 Demo。  
5. **清单打勾 + Git 提交** 跟踪进度；进阶项可后置，不必焦虑求全。

---

## 可选延伸（了解即可，不必立刻练）

- 前端二期：见 [apps/optional](./apps/optional/README.md)（SSR、Electron；更远期微前端 / RN / Three 等）
- 架构：DDD 入门、CQRS、事件驱动  
- 数据：读写分离、分库分表意识、数据仓库入门  
- 安全：OWASP Top 10、渗透测试基础、密钥轮转  
- 协作：技术方案、评审、Oncall、SLO  
- AI 生态：A2A（Agent 间协议）、评测（eval）、Guardrails、人机协同审批流  
