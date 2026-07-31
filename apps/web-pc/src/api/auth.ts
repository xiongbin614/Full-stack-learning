import { http } from '@/utils/request'
import type { LoginResponse, UserInfo } from '@/types/api'

/** 登录 */
export function login(data: { username: string; password: string }) {
  return http<LoginResponse>({ url: '/auth/login', method: 'POST', data })
}

/** 退出登录 */
export function logout() {
  return http<null>({ url: '/auth/logout', method: 'POST' })
}

/** 获取当前用户信息 */
export function getMe() {
  return http<UserInfo>({ url: '/auth/me', method: 'GET' })
}
