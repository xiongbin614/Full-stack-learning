import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getModules } from '@/data'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hidden?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/modules/M00',
    children: [
      {
        path: 'modules/:id',
        name: 'ModuleDetail',
        component: () => import('@/views/module/index.vue'),
        meta: { title: '组件开发' },
        beforeEnter(to) {
          const id = String(to.params.id || '')
          const mod = getModules().find((m) => m.id === id)
          if (!mod) return { path: '/modules/M00' }
          to.meta.title = `${mod.id} ${mod.name}`
          return true
        },
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

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · 组件练习` : '组件练习后台'
})

export default router
