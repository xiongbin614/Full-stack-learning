<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏菜单：从路由表生成（隐藏的 / 无标题的不展示）
const menus = computed(() => {
  return (router.options.routes || [])
    .find((r) => r.path === '/')
    ?.children?.filter((c) => !c.meta?.hidden && c.meta?.menuTitle)
    .map((c) => ({ path: `/${c.path}`, title: c.meta!.menuTitle!, icon: c.meta!.icon }))
})

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => route.meta.title || '')

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '退出',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

onMounted(() => {
  // 刷新后若有 token 但缺用户信息，拉取一次（mock 阶段本地已有，此调用用于演示 401 链路）
  if (userStore.isLoggedIn && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})
</script>

<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="layout-aside">
      <div class="logo">
        <el-icon :size="22" color="#fff"><Cpu /></el-icon>
        <span class="logo-text">CMCCPC · AI 工作台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#001529"
        text-color="rgba(255,255,255,0.68)"
        active-text-color="#fff"
        class="layout-menu"
      >
        <el-menu-item v-for="m in menus" :key="m.path" :index="m.path">
          <el-icon><component :is="m.icon" /></el-icon>
          <span>{{ m.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶栏 -->
      <el-header class="layout-header" height="56px">
        <div class="header-title">{{ pageTitle }}</div>
        <el-dropdown trigger="click">
          <div class="user-info">
            <el-avatar :size="30" class="user-avatar">{{ userStore.nickname.slice(0, 1) }}</el-avatar>
            <span class="user-name">{{ userStore.nickname }}</span>
            <el-tag size="small" type="info" effect="plain" class="role-tag">{{ userStore.role }}</el-tag>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>账号：{{ userStore.userInfo?.username }}</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 主内容 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout {
  height: 100vh;
}

.layout-aside {
  background-color: #001529;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.logo-text {
  font-size: 14px;
  white-space: nowrap;
}

.layout-menu {
  border-right: none;
  flex: 1;
}

.layout-menu :deep(.el-menu-item.is-active) {
  background-color: #409eff;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.user-avatar {
  background-color: #409eff;
}

.user-name {
  font-size: 14px;
}

.role-tag {
  text-transform: lowercase;
}

.layout-main {
  background-color: #f5f7fa;
  padding: 0;
  overflow-y: auto;
}
</style>
