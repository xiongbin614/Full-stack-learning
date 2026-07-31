/**
 * 用户 / 角色 / 权限 相关类型
 */

/** 用户实体（与 server 端 User 对应） */
export interface User {
  id: number
  username: string
  password?: string
  nickname?: string
  email?: string
  phone?: string
  /** 0-禁用 1-启用 */
  status: number
  createTime?: string
  updateTime?: string
  /** 角色名称列表（角色管理实现后由后端返回） */
  roleNames?: string[]
}

/** 创建用户请求 */
export interface UserCreateRequest {
  username: string
  password: string
  nickname?: string
  email?: string
  phone?: string
}

/** 编辑用户请求 */
export interface UserUpdateRequest {
  nickname?: string
  email?: string
  phone?: string
}

/** 重置密码请求 */
export interface ResetPasswordRequest {
  password: string
}

/** 登录请求 */
export interface LoginRequest {
  username: string
  password: string
}

/** 登录响应（server 当前返回用户信息 + 提示） */
export interface LoginResponse {
  username: string
  nickname?: string
  /** ADMIN / USER（由角色推导，后端联调后返回） */
  role?: 'ADMIN' | 'USER'
  message?: string
}

/** 角色 */
export interface Role {
  id: number
  name: string
  code: string
  description?: string
  /** 绑定的权限点 id 列表 */
  permissionIds: number[]
  status: number
  createTime?: string
}

/** 权限点 */
export interface Permission {
  id: number
  /** 父级 id，0 表示根节点 */
  parentId: number
  /** 权限名称 */
  name: string
  /** 权限码，如 system:user:create */
  code: string
  /** 菜单类型：menu-菜单 perm-按钮权限 */
  type: 'menu' | 'perm'
  /** 前端路由路径（菜单类型） */
  path?: string
  /** 图标名（菜单类型） */
  icon?: string
  /** 排序 */
  sort: number
}

/** 侧栏菜单项（由权限数据生成） */
export interface MenuItem {
  key: string
  label: string
  /** 图标名（与权限数据 icon 字段对应，渲染时映射为组件） */
  icon?: string
  path?: string
  children?: MenuItem[]
  /** 关联权限码 */
  permission?: string
}

/** 操作日志（登录/操作日志，后端实现后对接 /logs） */
export interface OperationLog {
  id: number
  /** 操作人用户名 */
  operator: string
  /** 模块，如：用户管理 */
  module: string
  /** 动作描述，如：创建用户 */
  action: string
  method: string
  url: string
  /** 0-失败 1-成功 */
  status: number
  ip: string
  /** 耗时 ms */
  cost: number
  createTime: string
}

/** 工作台统计 */
export interface DashboardStats {
  userTotal: number
  roleCount: number
  permissionCount: number
  todayLogs: number
}
