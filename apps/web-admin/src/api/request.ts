import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import type { ApiResult } from '@/types/api'

/**
 * Axios 封装
 * - baseURL: /api（Vite dev 代理 → server 后端）
 * - withCredentials: 携带 Session Cookie（server 使用 Session 认证）
 * - 响应拦截器：解包 ApiResult，code !== 200 统一提示；401 跳登录页
 */

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
})

// 请求拦截器：预留 token 附加位（后端切 JWT 后启用）
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 响应拦截器：统一处理业务码
service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResult
    // 非标准响应（如文件流）直接返回
    if (res === null || typeof res !== 'object' || !('code' in res)) {
      return response.data
    }
    if (res.code === 200) {
      return res.data as never
    }
    if (res.code === 401) {
      message.error('登录已过期，请重新登录')
      redirectToLogin()
      return Promise.reject(new Error(res.message))
    }
    message.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message))
  },
  (error: AxiosError<ApiResult>) => {
    const status = error.response?.status
    const msg = error.response?.data?.message || error.message || '网络异常'
    if (status === 401) {
      message.error('登录已过期，请重新登录')
      redirectToLogin()
    } else {
      message.error(msg)
    }
    return Promise.reject(error)
  },
)

function redirectToLogin() {
  // 避免在登录页重复跳转
  if (!window.location.pathname.startsWith('/login')) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.href = `/login?redirect=${redirect}`
  }
}

/** 泛型请求方法 */
export const http = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config) as Promise<T>
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config) as Promise<T>
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config) as Promise<T>
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config) as Promise<T>
  },
}

export default service
