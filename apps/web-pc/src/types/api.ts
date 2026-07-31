/** 后端统一响应体 Result<T>（与 server Result.java 对齐） */
export interface Result<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
}

/** 分页结果 PageResult<T>（与 server PageResult.java 对齐） */
export interface PageResult<T> {
  total: number
  pageNum: number
  pageSize: number
  list: T[]
}

/** 分页查询参数 */
export interface PageQuery {
  page?: number
  size?: number
  keyword?: string
}

/** 登录响应 */
export interface LoginResponse {
  username: string
  nickname: string
  role: 'ADMIN' | 'USER'
  message?: string
}

/** 当前用户信息（GET /api/auth/me） */
export type UserInfo = Omit<LoginResponse, 'message'>
