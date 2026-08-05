/**
 * mock/db.ts — web-admin Mock 内存数据源
 *
 * 模拟后端数据库：用户、角色、权限点、操作日志、工作台统计。
 * 数据形状与 src/types 一致；接口契约见 routes.ts（后端按此实现）。
 */

export interface MockUser {
  id: number
  username: string
  password: string
  nickname: string
  email: string
  phone: string
  /** 0-禁用 1-启用 */
  status: number
  /** 关联角色 id */
  roleIds: number[]
  createTime: string
}

export interface MockRole {
  id: number
  name: string
  code: string
  description: string
  permissionIds: number[]
  status: number
  createTime: string
}

export interface MockPermission {
  id: number
  parentId: number
  name: string
  code: string
  type: 'menu' | 'perm'
  path?: string
  icon?: string
  sort: number
}

export interface MockLog {
  id: number
  operator: string
  module: string
  action: string
  method: string
  url: string
  /** 0-失败 1-成功 */
  status: number
  ip: string
  cost: number
  createTime: string
}

export interface DashboardStats {
  userTotal: number
  roleCount: number
  permissionCount: number
  todayLogs: number
}

// ---------- 种子数据 ----------

export const users: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nickname: '系统管理员',
    email: 'admin@cmccpc.local',
    phone: '13800000001',
    status: 1,
    roleIds: [1],
    createTime: '2026-01-01T09:00:00',
  },
  {
    id: 2,
    username: 'alice',
    password: '123456',
    nickname: '张小明',
    email: 'alice@cmccpc.local',
    phone: '13800000002',
    status: 1,
    roleIds: [2],
    createTime: '2026-03-15T10:30:00',
  },
  {
    id: 3,
    username: 'bob',
    password: '123456',
    nickname: '李华',
    email: 'bob@cmccpc.local',
    phone: '13800000003',
    status: 0,
    roleIds: [3],
    createTime: '2026-05-20T14:20:00',
  },
  {
    id: 4,
    username: 'carol',
    password: '123456',
    nickname: '王芳',
    email: 'carol@cmccpc.local',
    phone: '13800000004',
    status: 1,
    roleIds: [3],
    createTime: '2026-06-10T08:45:00',
  },
]

export const roles: MockRole[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'ADMIN',
    description: '拥有全部权限，不可删除',
    permissionIds: [9, 1, 2, 3, 4, 5, 6, 7, 8],
    status: 1,
    createTime: '2026-01-01T09:00:00',
  },
  {
    id: 2,
    name: '运营人员',
    code: 'OPERATOR',
    description: '管理用户与内容',
    permissionIds: [9, 1, 2, 3, 4, 8],
    status: 1,
    createTime: '2026-01-10T11:00:00',
  },
  {
    id: 3,
    name: '访客',
    code: 'GUEST',
    description: '只读权限',
    permissionIds: [9, 8],
    status: 1,
    createTime: '2026-02-01T16:00:00',
  },
]

export const permissions: MockPermission[] = [
  { id: 9, parentId: 0, name: '首页', code: 'dashboard', type: 'menu', path: '/dashboard', icon: 'DashboardOutlined', sort: 0 },
  { id: 1, parentId: 0, name: '系统管理', code: 'system', type: 'menu', path: '/system', icon: 'SettingOutlined', sort: 1 },
  { id: 2, parentId: 1, name: '用户管理', code: 'system:user', type: 'menu', path: '/system/user', icon: 'UserOutlined', sort: 1 },
  { id: 3, parentId: 2, name: '创建用户', code: 'system:user:create', type: 'perm', sort: 1 },
  { id: 4, parentId: 2, name: '删除用户', code: 'system:user:delete', type: 'perm', sort: 2 },
  { id: 5, parentId: 2, name: '重置密码', code: 'system:user:reset-password', type: 'perm', sort: 3 },
  { id: 6, parentId: 1, name: '角色管理', code: 'system:role', type: 'menu', path: '/system/role', icon: 'TeamOutlined', sort: 2 },
  { id: 7, parentId: 1, name: '权限管理', code: 'system:permission', type: 'menu', path: '/system/permission', icon: 'KeyOutlined', sort: 3 },
  { id: 8, parentId: 0, name: '日志管理', code: 'log', type: 'menu', path: '/log', icon: 'FileTextOutlined', sort: 2 },
]

const logActions: Array<Pick<MockLog, 'operator' | 'module' | 'action' | 'method' | 'url' | 'ip'>> = [
  { operator: 'admin', module: '用户管理', action: '创建用户', method: 'POST', url: '/api/users', ip: '10.0.0.10' },
  { operator: 'admin', module: '用户管理', action: '重置密码', method: 'PUT', url: '/api/users/3/password', ip: '10.0.0.10' },
  { operator: 'alice', module: '角色管理', action: '更新角色', method: 'PUT', url: '/api/roles/2', ip: '10.0.0.11' },
  { operator: 'admin', module: '权限管理', action: '新增权限', method: 'POST', url: '/api/permissions', ip: '10.0.0.10' },
  { operator: 'admin', module: '用户管理', action: '禁用用户', method: 'PUT', url: '/api/users/3/status', ip: '10.0.0.10' },
  { operator: 'alice', module: '日志管理', action: '查询日志', method: 'GET', url: '/api/logs', ip: '10.0.0.11' },
  { operator: 'admin', module: '认证', action: '登录', method: 'POST', url: '/api/auth/login', ip: '10.0.0.10' },
  { operator: 'bob', module: '认证', action: '登录失败', method: 'POST', url: '/api/auth/login', ip: '10.0.0.12' },
]

export const logs: MockLog[] = Array.from({ length: 46 }, (_, i) => {
  const base = logActions[i % logActions.length]
  const hour = String(9 + (i % 9)).padStart(2, '0')
  const minute = String((i * 7) % 60).padStart(2, '0')
  return {
    id: i + 1,
    ...base,
    status: i % 11 === 3 ? 0 : 1,
    cost: Math.floor(Math.random() * 120) + 5,
    createTime: `2026-07-${String(30 - (i % 5)).padStart(2, '0')}T${hour}:${minute}:00`,
  }
})

// ---------- 工具 ----------

export function isMockToken(token?: string): boolean {
  return !!token && token.startsWith('mock-token-')
}

export function tokenUsername(token: string): string {
  return token.replace(/^Bearer\s+/i, '').replace(/^mock-token-/, '')
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
