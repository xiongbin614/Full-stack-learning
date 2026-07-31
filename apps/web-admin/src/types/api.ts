/**
 * 后端统一响应结构（与 server 端 Result<T> 对应）
 */
export interface ApiResult<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * 后端分页响应（与 server 端 PageResult<T> 对应）
 */
export interface ApiPageResult<T> {
  total: number
  pageNum: number
  pageSize: number
  list: T[]
}

/** 业务状态码（与 server 端 ResultCode 对应） */
export enum ApiCode {
  SUCCESS = 200,
  FAILED = 500,
  VALIDATE_FAILED = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}
