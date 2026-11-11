import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/api/auth'
import type { LoginRequest, LoginResponse } from '@/types/user'

/** localStorage 中 token 的键名（request.ts 请求拦截器读取） */
const TOKEN_KEY = 'admin_token'

interface AuthState {
  /** 当前登录用户 */
  user: LoginResponse | null
  /** 是否已登录 */
  isLoggedIn: boolean
  /** 认证 token（Mock 阶段为 mock-token-{username}，联调后由后端返回） */
  token: string
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
      token: '',

      async login(params) {
        const user = await authApi.login(params)
        // 后端尚未发 JWT：先用本地占位 token，请求头仍带 Authorization 方便后续接鉴权
        const token = `dev-token-${user.username}`
        localStorage.setItem(TOKEN_KEY, token)
        set({ user, isLoggedIn: true, token })
        return user
      },

      async logout() {
        try {
          await authApi.logout()
        } catch {
          // 后端登出失败不阻塞本地清理
        }
        localStorage.removeItem(TOKEN_KEY)
        set({ user: null, isLoggedIn: false, token: '' })
      },

      clear() {
        localStorage.removeItem(TOKEN_KEY)
        set({ user: null, isLoggedIn: false, token: '' })
      },
    }),
    {
      name: 'web-admin-auth', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isLoggedIn && state.user) {
          const token = state.token || `dev-token-${state.user.username}`
          if (!state.token) state.token = token
          localStorage.setItem(TOKEN_KEY, token)
        }
      },
    },
  ),
)
