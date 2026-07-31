import { http } from './request'
import type { ApiPageResult } from '@/types/api'
import type { DashboardStats, OperationLog, Permission, Role } from '@/types/user'

/**
 * 角色 / 权限 / 日志 API
 *
 * 当前阶段由 Mock（vite 插件拦截 /api）提供数据，接口契约即后端实现蓝本：
 * 后端按 mock/routes.ts 中同路径、同请求、同响应结构实现即可，前端无需改动。
 */

// ---------- 角色 ----------

export function getRoles() {
  return http.get<Role[]>('/roles')
}

export function createRole(data: Omit<Role, 'id' | 'createTime'>) {
  return http.post<void>('/roles', data)
}

export function updateRole(id: number, data: Partial<Role>) {
  return http.put<void>(`/roles/${id}`, data)
}

export function deleteRole(id: number) {
  return http.delete<void>(`/roles/${id}`)
}

// ---------- 权限 ----------

export function getPermissions() {
  return http.get<Permission[]>('/permissions')
}

export function createPermission(data: Omit<Permission, 'id'>) {
  return http.post<void>('/permissions', data)
}

export function updatePermission(id: number, data: Partial<Permission>) {
  return http.put<void>(`/permissions/${id}`, data)
}

export function deletePermission(id: number) {
  return http.delete<void>(`/permissions/${id}`)
}

// ---------- 当前用户权限码 ----------

export function getCurrentUserPermissions() {
  return http.get<string[]>('/auth/permissions')
}

// ---------- 操作日志 ----------

export function getLogs(params: { page?: number; size?: number; keyword?: string; module?: string }) {
  return http.get<ApiPageResult<OperationLog>>('/logs', { params })
}

// ---------- 工作台统计 ----------

export function getDashboardStats() {
  return http.get<DashboardStats>('/dashboard/stats')
}
