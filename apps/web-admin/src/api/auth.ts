import { http } from './request'
import type { LoginRequest, LoginResponse, User } from '@/types/user'

/** 登录（Session 认证，成功后建立会话） */
export function login(data: LoginRequest) {
  return http.post<LoginResponse>('/auth/login', data)
}

/** 退出登录 */
export function logout() {
  return http.post<void>('/auth/logout')
}

/** 当前登录用户信息（预留：后端实现后启用） */
export function getCurrentUser() {
  return http.get<User>('/auth/me')
}
