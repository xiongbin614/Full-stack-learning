import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 侧边栏菜单名（缺省取 title） */
    menuTitle?: string
    /** 菜单图标组件名（@element-plus/icons-vue） */
    icon?: string
    /** 不在侧边栏显示 */
    hidden?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台', menuTitle: '工作台', icon: 'HomeFilled' },
      },
      {
        path: 'knowledge',
        name: 'Knowledge',
        component: () => import('@/views/knowledge/index.vue'),
        meta: { title: '知识广场', menuTitle: '知识广场', icon: 'Collection' },
      },
      {
        path: 'agents',
        name: 'Agents',
        component: () => import('@/views/agents/index.vue'),
        meta: { title: '智能体', menuTitle: '智能体', icon: 'MagicStick' },
      },
      {
        path: 'skills',
        name: 'Skills',
        component: () => import('@/views/skills/index.vue'),
        meta: { title: '技能管理', menuTitle: '技能', icon: 'Cpu' },
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
        meta: { title: '新对话', menuTitle: '对话', icon: 'ChatDotRound' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '页面不存在', hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局守卫：未登录跳登录页，已登录访问 /login 回工作台
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.isLoggedIn && to.name !== 'Login') {
    return { path: '/login', query: to.fullPath === '/' ? {} : { redirect: to.fullPath } }
  }
  if (userStore.isLoggedIn && to.name === 'Login') {
    return { path: '/dashboard' }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · CMCCPC` : 'CMCCPC · AI 业务工作台'
})

export default router
