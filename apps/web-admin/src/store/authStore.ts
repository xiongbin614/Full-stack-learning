import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/api/auth'
import type { LoginRequest, LoginResponse } from '@/types/user'

interface AuthState {
  /** 当前登录用户 */
  user: LoginResponse | null
  /** 是否已登录 */
  isLoggedIn: boolean
  /** 登录 */
  login: (params: LoginRequest) => Promise<LoginResponse>
  /** 退出登录 */
  logout: () => Promise<void>
  /** 清空本地登录态（无后端交互） */
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      async login(params) {
        const user = await authApi.login(params)
        set({ user, isLoggedIn: true })
        return user
      },

      async logout() {
        try {
          await authApi.logout()
        } catch {
          // 后端登出失败不阻塞本地清理
        }
        set({ user: null, isLoggedIn: false })
        localStorage.removeItem('admin_token')
      },

      clear() {
        set({ user: null, isLoggedIn: false })
      },
    }),
    {
      name: 'web-admin-auth', // localStorage key
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    },
  ),
)
