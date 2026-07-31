import { create } from 'zustand'
import * as systemApi from '@/api/system'
import type { MenuItem, Permission, Role } from '@/types/user'

interface PermissionState {
  /** 全部权限点 */
  permissions: Permission[]
  /** 角色列表 */
  roles: Role[]
  /** 动态菜单（由权限数据生成） */
  menus: MenuItem[]
  /** 当前用户拥有权限码集合（ADMIN 视为全量） */
  permissionCodes: string[]
  /** 是否已加载 */
  loaded: boolean
  load: () => Promise<void>
  reload: () => Promise<void>
  hasPermission: (code: string) => boolean
  /** 重置（退出登录时调用） */
  reset: () => void
}

/** 将权限点构建为侧栏菜单树 */
function buildMenus(permissions: Permission[]): MenuItem[] {
  const menuPerms = permissions
    .filter((p) => p.type === 'menu')
    .sort((a, b) => a.sort - b.sort)

  const nodeMap = new Map<number, MenuItem>()
  menuPerms.forEach((p) => {
    nodeMap.set(p.id, {
      key: p.path || String(p.id),
      label: p.name,
      path: p.path,
      permission: p.code,
      children: [],
    })
  })

  const roots: MenuItem[] = []
  menuPerms.forEach((p) => {
    const node = nodeMap.get(p.id)!
    if (p.parentId === 0 || !nodeMap.has(p.parentId)) {
      roots.push(node)
    } else {
      nodeMap.get(p.parentId)!.children!.push(node)
    }
  })

  const clean = (items: MenuItem[]): MenuItem[] =>
    items
      .map((item) => ({ ...item, children: item.children?.length ? clean(item.children) : undefined }))
      .filter((item) => item.children !== undefined || item.path)

  return clean(roots)
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  roles: [],
  menus: [],
  permissionCodes: [],
  loaded: false,

  async load() {
    // 后端 RBAC 未实现：先拉取 mock 权限并视为全部放行
    const [permissions, roles] = await Promise.all([
      systemApi.getPermissions(),
      systemApi.getRoles(),
    ])
    set({
      permissions,
      roles,
      menus: buildMenus(permissions),
      // TODO: 后端返回当前用户角色后，按角色计算权限码集合
      permissionCodes: permissions.map((p) => p.code),
      loaded: true,
    })
  },

  async reload() {
    set({ loaded: false })
    await get().load()
  },

  hasPermission(code) {
    const codes = get().permissionCodes
    return codes.includes('*') || codes.includes(code)
  },

  reset() {
    set({ permissions: [], roles: [], menus: [], permissionCodes: [], loaded: false })
  },
}))
