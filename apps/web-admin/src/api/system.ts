import type { Role, Permission } from '@/types/user'

/**
 * 角色 / 权限 API
 *
 * ⚠️ 注意：server 后端暂未实现 RBAC（角色/权限）模型，以下接口使用内存 mock 数据，
 * 保证页面可完整演示。后端实现后，将下方函数体替换为 http 请求即可，签名不变。
 */

/** 模拟延迟，贴近真实请求 */
function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms))
}

const mockRoles: Role[] = [
  { id: 1, name: '超级管理员', code: 'ADMIN', description: '拥有全部权限', permissionIds: [], status: 1 },
  { id: 2, name: '运营人员', code: 'OPERATOR', description: '管理用户与内容', permissionIds: [1, 2, 3, 4], status: 1 },
  { id: 3, name: '访客', code: 'GUEST', description: '只读权限', permissionIds: [2], status: 1 },
]

const mockPermissions: Permission[] = [
  { id: 1, parentId: 0, name: '系统管理', code: 'system', type: 'menu', path: '/system', icon: 'SettingOutlined', sort: 1 },
  { id: 2, parentId: 1, name: '用户管理', code: 'system:user', type: 'menu', path: '/system/user', sort: 1 },
  { id: 3, parentId: 2, name: '创建用户', code: 'system:user:create', type: 'perm', sort: 1 },
  { id: 4, parentId: 2, name: '删除用户', code: 'system:user:delete', type: 'perm', sort: 2 },
  { id: 5, parentId: 2, name: '重置密码', code: 'system:user:reset-password', type: 'perm', sort: 3 },
  { id: 6, parentId: 1, name: '角色管理', code: 'system:role', type: 'menu', path: '/system/role', sort: 2 },
  { id: 7, parentId: 1, name: '权限管理', code: 'system:permission', type: 'menu', path: '/system/permission', sort: 3 },
  { id: 8, parentId: 0, name: '日志管理', code: 'log', type: 'menu', path: '/log', icon: 'FileTextOutlined', sort: 2 },
]

// ---------- 角色 ----------

export function getRoles() {
  return delay<Role[]>(mockRoles)
}

export function createRole(data: Omit<Role, 'id' | 'createTime'>) {
  mockRoles.push({ ...data, id: Date.now() })
  return delay<void>(undefined)
}

export function updateRole(id: number, data: Partial<Role>) {
  const idx = mockRoles.findIndex((r) => r.id === id)
  if (idx >= 0) mockRoles[idx] = { ...mockRoles[idx], ...data }
  return delay<void>(undefined)
}

export function deleteRole(id: number) {
  const idx = mockRoles.findIndex((r) => r.id === id)
  if (idx >= 0) mockRoles.splice(idx, 1)
  return delay<void>(undefined)
}

// ---------- 权限 ----------

export function getPermissions() {
  return delay<Permission[]>(mockPermissions)
}

export function createPermission(data: Omit<Permission, 'id'>) {
  mockPermissions.push({ ...data, id: Date.now() })
  return delay<void>(undefined)
}

export function updatePermission(id: number, data: Partial<Permission>) {
  const idx = mockPermissions.findIndex((p) => p.id === id)
  if (idx >= 0) mockPermissions[idx] = { ...mockPermissions[idx], ...data }
  return delay<void>(undefined)
}

export function deletePermission(id: number) {
  const idx = mockPermissions.findIndex((p) => p.id === id)
  if (idx >= 0) mockPermissions.splice(idx, 1)
  return delay<void>(undefined)
}
