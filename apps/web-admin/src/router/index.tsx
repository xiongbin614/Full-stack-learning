import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import AuthGuard from './AuthGuard'
import AdminLayout from '@/layouts/AdminLayout'

/** 懒加载包装：路由级代码分割 */
function lazyLoad(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 48 }}>
          <Spin size="large" />
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}

const Login = lazy(() => import('@/pages/login'))
const Dashboard = lazy(() => import('@/pages/dashboard'))
const UserManage = lazy(() => import('@/pages/system/user'))
const RoleManage = lazy(() => import('@/pages/system/role'))
const PermissionManage = lazy(() => import('@/pages/system/permission'))
const LogManage = lazy(() => import('@/pages/log'))
const Forbidden = lazy(() => import('@/pages/error/403'))
const NotFound = lazy(() => import('@/pages/error/404'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(Login),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: lazyLoad(Dashboard),
        handle: { title: '工作台' },
      },
      {
        path: 'system/user',
        element: lazyLoad(UserManage),
        handle: { title: '用户管理' },
      },
      {
        path: 'system/role',
        element: lazyLoad(RoleManage),
        handle: { title: '角色管理' },
      },
      {
        path: 'system/permission',
        element: lazyLoad(PermissionManage),
        handle: { title: '权限管理' },
      },
      {
        path: 'log',
        element: lazyLoad(LogManage),
        handle: { title: '日志管理' },
      },
    ],
  },
  {
    path: '/403',
    element: lazyLoad(Forbidden),
  },
  {
    path: '*',
    element: lazyLoad(NotFound),
  },
])

export default router
