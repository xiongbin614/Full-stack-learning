import { http } from './request'
import type { ApiPageResult } from '@/types/api'
import type { ResetPasswordRequest, User, UserCreateRequest, UserUpdateRequest } from '@/types/user'

/** 分页查询用户 */
export function getUsers(params: { page?: number; size?: number; username?: string }) {
  return http.get<ApiPageResult<User>>('/users', { params })
}

/** 按 ID 查询用户 */
export function getUser(id: number) {
  return http.get<User>(`/users/${id}`)
}

/** 创建用户 */
export function createUser(data: UserCreateRequest) {
  return http.post<User>('/users', data)
}

/** 编辑用户（昵称/邮箱/手机号） */
export function updateUser(id: number, data: UserUpdateRequest) {
  return http.put<User>(`/users/${id}`, data)
}

/** 删除用户 */
export function deleteUser(id: number) {
  return http.delete<void>(`/users/${id}`)
}

/** 禁用 / 启用 */
export function updateUserStatus(id: number, status: number) {
  return http.put<void>(`/users/${id}/status`, { status })
}

/** 重置密码 */
export function resetPassword(id: number, data: ResetPasswordRequest) {
  return http.put<void>(`/users/${id}/password`, data)
}

/** 分配角色（后端 RBAC 实现后启用） */
export function assignRoles(id: number, roleIds: number[]) {
  return http.put<void>(`/users/${id}/roles`, { roleIds })
}
