import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { Result } from '@/types/api'

/** localStorage 中 token 的键名 */
export const TOKEN_KEY = 'web-pc-token'

/** 获取当前 token（mock 阶段为本地生成的 mock-token-*，联调后由后端返回） */
export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || ''
}

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  // 兼容后端 Session Cookie 模式；JWT 模式时保持 true 也无副作用
  withCredentials: true,
})

// 请求拦截：统一附加 Authorization
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function redirectToLogin() {
  const redirect = encodeURIComponent(window.location.pathname + window.location.search)
  localStorage.removeItem(TOKEN_KEY)
  window.location.href = `/login?redirect=${redirect}`
}

// 响应拦截：统一处理 Result<T> 与错误
request.interceptors.response.use(
  (response) => {
    // 二进制流（文件下载等）直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    const res = response.data as Result
    // 兼容非 Result 结构（如纯字符串）
    if (!res || typeof res !== 'object' || !('code' in res)) {
      return response.data
    }
    if (res.code === 200) {
      return response.data
    }
    if (res.code === 401) {
      ElMessage.error('登录已过期，请重新登录')
      redirectToLogin()
      return Promise.reject(new Error(res.message || '未登录'))
    }
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      redirectToLogin()
    } else {
      const msg = error.response?.data?.message || error.message || '网络异常'
      ElMessage.error(msg)
    }
    return Promise.reject(error)
  },
)

/** 泛型请求封装：返回 Result<T> 中的 data */
export async function http<T>(config: AxiosRequestConfig): Promise<T> {
  const res = await request.request<Result<T>>(config)
  // 拦截器已把业务失败 reject，走到这里必为成功
  return (res as unknown as Result<T>).data
}

export default request
