import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, type ReactNode } from 'react'
import { Spin } from 'antd'
import { useAuthStore } from '@/store/authStore'
import { usePermissionStore } from '@/store/permissionStore'

interface AuthGuardProps {
  children: ReactNode
}

/**
 * 登录守卫
 * - 未登录 → 跳转 /login 并携带 redirect 参数
 * - 已登录 → 首次进入时加载权限与动态菜单
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const loaded = usePermissionStore((s) => s.loaded)
  const load = usePermissionStore((s) => s.load)
  const location = useLocation()

  useEffect(() => {
    if (isLoggedIn && !loaded) {
      load().catch(() => {
        // 权限加载失败不阻塞页面
      })
    }
  }, [isLoggedIn, loaded, load])

  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  if (!loaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载权限中..." />
      </div>
    )
  }

  return <>{children}</>
}
