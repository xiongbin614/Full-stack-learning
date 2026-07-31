# Server — 统一后端 API

> 学习地图见 [../README.md](../README.md)。  
> 仓库布局：一个 `server` + 多个 `apps/web-*`。

本目录是 Spring Boot 单体后端，供多个 Web 系统共用（当前对接 `apps/web-todo`）。

## 技术栈

| 分类 | 组件 | 状态 |
|------|------|------|
| 基础框架 | Spring Boot 3.5.16（Java 17，Maven） | ✅ |
| Web | Spring Web (MVC) + Validation | ✅ |
| 持久层 | Spring Data JPA（Hibernate 6） | ✅ |
| 数据库 | MySQL 8（mysql profile）/ H2（dev 默认） | ✅ |
| 缓存 | Spring Data Redis (Lettuce)，默认启用（`spring.data.redis.enabled` 可关） | ✅ |
| 安全 | Spring Security（数据库用户 + BCrypt + Session） | ✅ |
| 邮件 | Spring Mail | ❌ 已移除（未使用，需要时再加） |
| AOP | Spring AOP（请求日志切面，敏感字段脱敏） | ✅ |
| 监控 | Spring Boot Actuator（默认仅 health/info） | ✅ |
| API 文档 | springdoc-openapi（Session Cookie 说明） | ✅ |
| 测试 | Spring Boot Test + JUnit 5（test profile 可无 Redis） | ✅ |
| 工具 | Lombok、devtools、configuration-processor | ✅ |

## 仓库结构

```
CMCCPC_WEB/
├── README.md                 # 学习地图
├── server/                   # 统一后端（本项目）
│   ├── pom.xml               # artifact: cmccpc-server
│   └── src/...
├── apps/
│   ├── web-todo/             # 学习主线 Web（待办）
│   ├── web-admin/            # （预留）管理端
│   └── web-portal/           # （预留）另一业务端
└── packages/                 # （预留）多端共享前端包
```

## Java 包结构

```
com.cmccpc.fullstack
├── FullstackServerApplication.java
├── aspect/          # AOP
├── common/          # Result / 异常
├── config/
├── controller/
├── dto/
├── entity/
├── repository/
├── security/
├── service/
└── util/
```

## 快速开始

> 默认（mysql profile）连接**本地 MySQL + Redis**，连接凭据从 `server/.env` 读取（gitignore，不入库）。
> 模板：`cp .env.example .env`（或直接创建，格式见下）。

```bash
# 1. 准备本地数据库（首次）
mysql -u root -p -e "CREATE DATABASE cmccpc DEFAULT CHARACTER SET utf8mb4;"

# 2. 配置本地连接凭据（server/.env，勿提交仓库）
# MYSQL_HOST=127.0.0.1 / MYSQL_PORT=3306 / MYSQL_DATABASE=cmccpc
# MYSQL_USERNAME=root / MYSQL_PASSWORD=你的密码
# REDIS_HOST=127.0.0.1 / REDIS_PORT=6379 / REDIS_PASSWORD=你的密码

# 3. 启动（自动建表 + 首次自动创建管理员 admin/admin123）
cd server
mvn spring-boot:run

# 验证
curl http://localhost:8080/api/demo/info
curl -c cookies.txt -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
curl -b cookies.txt http://localhost:8080/api/users
curl -b cookies.txt "http://localhost:8080/api/demo/redis?key=hello&value=world"   # Redis 读写演示
```

> 无本地 MySQL 时可切 H2 内存库：`mvn spring-boot:run -Dspring-boot.run.profiles=dev`（开箱即用，数据不持久）。

### 常用地址

| 地址 | 说明 |
|------|------|
| `http://localhost:8080/api/swagger-ui.html` | Swagger |
| `http://localhost:8080/api/v3/api-docs` | OpenAPI |
| `http://localhost:8080/api/actuator/health` | 健康检查 |
| `http://localhost:8080/api/h2-console` | H2 控制台 |
| `http://localhost:8080/api/demo/info` | 公开 Demo |
| `http://localhost:8080/api/demo/redis` | Redis Demo |

### 切换 MySQL

默认（mysql profile）即连接本地 MySQL。若需换库/换机：

```bash
# 数据库已存在：CREATE DATABASE cmccpc DEFAULT CHARACTER SET utf8mb4;
# 凭据在 server/.env 修改，或环境变量覆盖（MYSQL_USERNAME/MYSQL_PASSWORD/...）
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

### 测试

```bash
mvn test   # test profile 使用 H2，且不启用 Redis（spring.data.redis.enabled=false）
```

## 已实现能力

- 统一响应体 `Result<T>`
- 全局异常处理（登录失败与未登录文案区分）
- Session 登录鉴权 + `role` 字段（ADMIN/USER）+ `@PreAuthorize`
- 接口返回 `UserResponse`，不泄露密码哈希
- AOP 请求日志脱敏
- Redis 可选：无 Redis 时核心接口仍可启动；演示接口按需降级
- CORS 读取 `cmccpc.cors.allowed-origins`
- 登出返回统一 JSON

## 扩展指引

- JWT、完整 RBAC 表、Flyway、MQ 等见学习地图；按阶段往主线项目加能力即可。
