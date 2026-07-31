import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi, getMe } from '@/api/auth'
import { TOKEN_KEY } from '@/utils/request'
import type { UserInfo } from '@/types/api'

const USER_KEY = 'web-pc-user'

function readStoredUser(): UserInfo | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as UserInfo) : null
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    userInfo: readStoredUser(),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    nickname: (state) => state.userInfo?.nickname || state.userInfo?.username || '',
    role: (state) => state.userInfo?.role || 'USER',
  },

  actions: {
    /** 登录：mock 阶段前端生成 token，联调后端后改为使用后端返回的 token */
    async login(username: string, password: string) {
      const data = await loginApi({ username, password })
      // Mock 阶段：token 格式为 mock-token-{username}（后端联调后改为 data.token）
      this.token = `mock-token-${data.username}`
      localStorage.setItem(TOKEN_KEY, this.token)
      this.userInfo = {
        username: data.username,
        nickname: data.nickname,
        role: data.role,
      }
      localStorage.setItem(USER_KEY, JSON.stringify(this.userInfo))
    },

    /** 刷新用户信息（页面刷新后恢复登录态） */
    async fetchUserInfo() {
      if (!this.token) return
      try {
        this.userInfo = await getMe()
        localStorage.setItem(USER_KEY, JSON.stringify(this.userInfo))
      } catch {
        // 401 时 request 拦截器已跳转登录
      }
    },

    /** 退出登录 */
    async logout() {
      try {
        await logoutApi()
      } catch {
        // 忽略登出接口异常，本地照常清理
      }
      this.reset()
    },

    /** 清理本地登录态（token 过期 / 退出） */
    reset() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
