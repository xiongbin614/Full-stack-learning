/**
 * mock/routes.ts — web-admin 接口路由表（后端实现蓝本）
 *
 * 所有接口返回统一 Result 结构 `{ code, message, data, timestamp }`，
 * 分页返回 `{ list, total, pageNum, pageSize }`（与 server Result/PageResult 对齐）。
 *
 * 契约清单（后端按此实现）：
 *  POST /api/auth/login {username,password} → {username,nickname,role,message}
 *  POST /api/auth/logout → null
 *  GET  /api/auth/me → User
 *  GET  /api/auth/permissions → string[] 当前用户权限码（ADMIN → ['*']）
 *  GET  /api/users?page&size&username → PageResult<User>
 *  POST /api/users → User；PUT /api/users/{id} → User；DELETE /api/users/{id} → null
 *  PUT  /api/users/{id}/status {status} → null；PUT /api/users/{id}/password {password} → null
 *  PUT  /api/users/{id}/roles {roleIds} → null
 *  GET  /api/roles → Role[]；POST/PUT/DELETE /api/roles → null
 *  GET  /api/permissions → Permission[]；POST/PUT/DELETE → null
 *  GET  /api/logs?page&size&keyword&module → PageResult<OperationLog>
 *  GET  /api/dashboard/stats → {userTotal,roleCount,permissionCount,todayLogs}
 */

import {
  users,
  roles,
  permissions,
  logs,
  sleep,
  tokenUsername,
  type DashboardStats,
  type MockLog,
  type MockUser,
} from './db'

export interface MockContext {
  params: string[]
  query: Record<string, string>
  body: any
  headers: Record<string, string | undefined>
}

export type MockHandler = (ctx: MockContext) => Promise<unknown> | unknown

export interface MockRoute {
  method: string
  pattern: RegExp
  handler: MockHandler
}

// ---------- 统一响应体（与后端 Result<T> 对齐） ----------

function ok<T>(data: T, message = '操作成功') {
  return { code: 200, message, data, timestamp: Date.now() }
}

function fail(code: number, message: string) {
  return { code, message, data: null, timestamp: Date.now() }
}

/** 分页切片（兼容 page 从 0 或 1 开始） */
function slicePage<T>(arr: T[], page: number, size: number) {
  const num = Math.max(1, page || 1)
  const sz = Math.max(1, size || 10)
  return { list: arr.slice((num - 1) * sz, num * sz), total: arr.length, pageNum: num, pageSize: sz }
}

function paging(ctx: MockContext) {
  return { page: Number(ctx.query.page || 1), size: Number(ctx.query.size || 10) }
}

// ---------- 数据组装 ----------

interface UserView {
  id: number
  username: string
  nickname?: string
  email?: string
  phone?: string
  status: number
  createTime?: string
  roleNames?: string[]
}

function toUserView(u: MockUser): UserView {
  return {
    id: u.id,
    username: u.username,
    nickname: u.nickname,
    email: u.email,
    phone: u.phone,
    status: u.status,
    createTime: u.createTime,
    roleNames: u.roleIds.map((rid) => roles.find((r) => r.id === rid)?.name).filter(Boolean) as string[],
  }
}

function isAdminUser(u: MockUser): boolean {
  return u.roleIds.includes(1)
}

/** 计算用户权限码集合（ADMIN 角色 → ['*']） */
function permissionCodesOf(u: MockUser): string[] {
  if (isAdminUser(u)) return ['*']
  const ids = new Set<number>()
  u.roleIds.forEach((rid) => roles.find((r) => r.id === rid)?.permissionIds.forEach((pid) => ids.add(pid)))
  return permissions.filter((p) => ids.has(p.id)).map((p) => p.code)
}

let userSeq = users.reduce((m, x) => Math.max(m, x.id), 0)
let roleSeq = roles.reduce((m, x) => Math.max(m, x.id), 0)
let permSeq = permissions.reduce((m, x) => Math.max(m, x.id), 0)
let logSeq = logs.reduce((m, x) => Math.max(m, x.id), 0)

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

function fmtTime(iso: string) {
  return iso.replace('T', ' ')
}

// ---------- 路由表 ----------

export const routes: MockRoute[] = [
  // ===== 认证 =====
  {
    method: 'POST',
    pattern: /^\/api\/auth\/login$/,
    handler: async (ctx) => {
      await sleep(400)
      const { username = '', password = '' } = ctx.body || {}
      const user = users.find((u) => u.username === username && u.password === password)
      if (!user) {
        return fail(400, '用户名或密码错误')
      }
      if (user.status === 0) {
        return fail(403, '账号已被禁用，请联系管理员')
      }
      return ok(
        {
          username: user.username,
          nickname: user.nickname,
          role: isAdminUser(user) ? 'ADMIN' : 'USER',
          message: '登录成功（Mock）',
        },
        '登录成功',
      )
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/auth\/logout$/,
    handler: async () => {
      await sleep(150)
      return ok(null, '已退出登录')
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/auth\/me$/,
    handler: (ctx) => {
      const token = ctx.headers['authorization'] || ''
      const user = users.find((u) => u.username === tokenUsername(token)) || users[0]
      return ok(toUserView(user))
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/auth\/permissions$/,
    handler: (ctx) => {
      const token = ctx.headers['authorization'] || ''
      const user = users.find((u) => u.username === tokenUsername(token)) || users[0]
      return ok(permissionCodesOf(user))
    },
  },

  // ===== 用户管理 =====
  {
    method: 'GET',
    pattern: /^\/api\/users$/,
    handler: async (ctx) => {
      await sleep(300)
      const { page, size } = paging(ctx)
      const username = (ctx.query.username || '').trim()
      let list = users
      if (username) {
        list = users.filter((u) => u.username.includes(username) || u.nickname.includes(username))
      }
      const sliced = slicePage(list, page, size)
      return ok({
        list: sliced.list.map(toUserView),
        total: sliced.total,
        pageNum: sliced.pageNum,
        pageSize: sliced.pageSize,
      })
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/users$/,
    handler: (ctx) => {
      const { username, password, nickname = '', email = '', phone = '' } = ctx.body || {}
      if (!username || !password) return fail(400, '用户名与密码不能为空')
      if (users.some((u) => u.username === username)) return fail(400, '用户名已存在')
      const user: MockUser = {
        id: ++userSeq,
        username,
        password,
        nickname,
        email,
        phone,
        status: 1,
        roleIds: [],
        createTime: now(),
      }
      users.push(user)
      return ok(toUserView(user), '创建成功')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/users\/(\d+)$/,
    handler: (ctx) => {
      const user = users.find((u) => u.id === Number(ctx.params[0]))
      if (!user) return fail(404, '用户不存在')
      const { nickname, email, phone } = ctx.body || {}
      if (nickname !== undefined) user.nickname = nickname
      if (email !== undefined) user.email = email
      if (phone !== undefined) user.phone = phone
      return ok(toUserView(user), '更新成功')
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/users\/(\d+)$/,
    handler: (ctx) => {
      const id = Number(ctx.params[0])
      if (id === 1) return fail(400, '内置管理员不可删除')
      const idx = users.findIndex((u) => u.id === id)
      if (idx === -1) return fail(404, '用户不存在')
      users.splice(idx, 1)
      return ok(null, '删除成功')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/users\/(\d+)\/status$/,
    handler: (ctx) => {
      const user = users.find((u) => u.id === Number(ctx.params[0]))
      if (!user) return fail(404, '用户不存在')
      const { status } = ctx.body || {}
      if (status !== 0 && status !== 1) return fail(400, '状态参数错误')
      if (user.id === 1 && status === 0) return fail(400, '内置管理员不可禁用')
      user.status = status
      return ok(null, status === 1 ? '已启用' : '已禁用')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/users\/(\d+)\/password$/,
    handler: (ctx) => {
      const user = users.find((u) => u.id === Number(ctx.params[0]))
      if (!user) return fail(404, '用户不存在')
      const { password } = ctx.body || {}
      if (!password || password.length < 6) return fail(400, '密码至少 6 位')
      user.password = password
      return ok(null, '密码已重置')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/users\/(\d+)\/roles$/,
    handler: (ctx) => {
      const user = users.find((u) => u.id === Number(ctx.params[0]))
      if (!user) return fail(404, '用户不存在')
      const { roleIds } = ctx.body || {}
      if (!Array.isArray(roleIds)) return fail(400, 'roleIds 必须为数组')
      user.roleIds = roleIds
      return ok(null, '角色分配成功')
    },
  },

  // ===== 角色管理 =====
  {
    method: 'GET',
    pattern: /^\/api\/roles$/,
    handler: async () => {
      await sleep(250)
      return ok(roles.map((r) => ({ ...r, createTime: fmtTime(r.createTime) })))
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/roles$/,
    handler: (ctx) => {
      const { name, code, description = '', permissionIds = [], status = 1 } = ctx.body || {}
      if (!name || !code) return fail(400, '角色名称与编码不能为空')
      if (roles.some((r) => r.code === code)) return fail(400, '角色编码已存在')
      roles.push({ id: ++roleSeq, name, code, description, permissionIds, status, createTime: now() })
      return ok(null, '创建成功')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/roles\/(\d+)$/,
    handler: (ctx) => {
      const role = roles.find((r) => r.id === Number(ctx.params[0]))
      if (!role) return fail(404, '角色不存在')
      const { name, description, permissionIds, status } = ctx.body || {}
      if (name) role.name = name
      if (description !== undefined) role.description = description
      if (permissionIds) role.permissionIds = permissionIds
      if (status !== undefined) role.status = status
      return ok(null, '更新成功')
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/roles\/(\d+)$/,
    handler: (ctx) => {
      const id = Number(ctx.params[0])
      if (id === 1) return fail(400, '超级管理员角色不可删除')
      const idx = roles.findIndex((r) => r.id === id)
      if (idx === -1) return fail(404, '角色不存在')
      roles.splice(idx, 1)
      return ok(null, '删除成功')
    },
  },

  // ===== 权限管理 =====
  {
    method: 'GET',
    pattern: /^\/api\/permissions$/,
    handler: async () => {
      await sleep(250)
      return ok(permissions)
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/permissions$/,
    handler: (ctx) => {
      const { parentId = 0, name, code, type = 'menu', path, icon, sort = 1 } = ctx.body || {}
      if (!name || !code) return fail(400, '名称与权限码不能为空')
      if (permissions.some((p) => p.code === code)) return fail(400, '权限码已存在')
      permissions.push({ id: ++permSeq, parentId, name, code, type, path, icon, sort })
      return ok(null, '创建成功')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/permissions\/(\d+)$/,
    handler: (ctx) => {
      const perm = permissions.find((p) => p.id === Number(ctx.params[0]))
      if (!perm) return fail(404, '权限不存在')
      const { parentId, name, code, type, path, icon, sort } = ctx.body || {}
      if (parentId !== undefined) perm.parentId = parentId
      if (name) perm.name = name
      if (code) perm.code = code
      if (type) perm.type = type
      if (path !== undefined) perm.path = path
      if (icon !== undefined) perm.icon = icon
      if (sort !== undefined) perm.sort = sort
      return ok(null, '更新成功')
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/permissions\/(\d+)$/,
    handler: (ctx) => {
      const id = Number(ctx.params[0])
      const idx = permissions.findIndex((p) => p.id === id)
      if (idx === -1) return fail(404, '权限不存在')
      permissions.splice(idx, 1)
      return ok(null, '删除成功')
    },
  },

  // ===== 操作日志 =====
  {
    method: 'GET',
    pattern: /^\/api\/logs$/,
    handler: async (ctx) => {
      await sleep(300)
      const { page, size } = paging(ctx)
      const keyword = (ctx.query.keyword || '').trim()
      const module = (ctx.query.module || '').trim()
      let list: MockLog[] = [...logs].sort((a, b) => (a.id < b.id ? 1 : -1))
      if (keyword) {
        list = list.filter(
          (l) =>
            l.operator.includes(keyword) ||
            l.module.includes(keyword) ||
            l.action.includes(keyword) ||
            l.url.includes(keyword),
        )
      }
      if (module) list = list.filter((l) => l.module === module)
      const sliced = slicePage(list, page, size)
      return ok({
        list: sliced.list.map((l) => ({ ...l, createTime: fmtTime(l.createTime) })),
        total: sliced.total,
        pageNum: sliced.pageNum,
        pageSize: sliced.pageSize,
      })
    },
  },

  // ===== 工作台统计 =====
  {
    method: 'GET',
    pattern: /^\/api\/dashboard\/stats$/,
    handler: async () => {
      await sleep(250)
      const stats: DashboardStats = {
        userTotal: users.length,
        roleCount: roles.length,
        permissionCount: permissions.length,
        todayLogs: logs.filter((l) => l.createTime.startsWith('2026-07-31')).length + 3,
      }
      return ok(stats)
    },
  },
]

/** 追加一条操作日志（Mock 内部记录，供日志页演示） */
export function pushLog(partial: Pick<MockLog, 'operator' | 'module' | 'action' | 'method' | 'url'>) {
  logs.push({
    id: ++logSeq,
    ...partial,
    status: 1,
    ip: '127.0.0.1',
    cost: Math.floor(Math.random() * 60) + 5,
    createTime: now(),
  })
}
