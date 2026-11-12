<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGroups, getModuleById } from '@/data'
import OverviewDrawer from '@/components/OverviewDrawer.vue'
import RequirementDrawer from '@/components/RequirementDrawer.vue'

const route = useRoute()
const router = useRouter()
const groups = getGroups()

const overviewOpen = ref(false)
const requirementOpen = ref(false)
const overviewKeyword = ref('')

const activeMenu = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? `/modules/${id}` : route.path
})

const currentModule = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? getModuleById(id) || null : null
})

function openOverview() {
  overviewOpen.value = true
}

function openRequirements() {
  if (!currentModule.value) {
    overviewOpen.value = true
    return
  }
  requirementOpen.value = true
}
</script>

<template>
  <el-container class="layout">
    <el-aside width="250px" class="layout-aside">
      <div class="logo" @click="router.push('/modules/M00')">
        <span class="logo-mark">练</span>
        <div class="logo-text">
          <b>组件练习后台</b>
          <small>主区留给开发</small>
        </div>
      </div>

      <el-scrollbar class="aside-scroll">
        <div v-for="g in groups" :key="g.name" class="nav-group">
          <div class="grp">{{ g.name }}</div>
          <el-menu :default-active="activeMenu" router class="layout-menu">
            <el-menu-item
              v-for="m in g.modules"
              :key="m.id"
              :index="`/modules/${m.id}`"
            >
              <span class="mid">{{ m.id }}</span>
              <span class="nm">{{ m.name }}</span>
              <el-tag
                size="small"
                effect="plain"
                :type="m.priority === 'P0' ? 'danger' : m.priority === 'P1' ? 'warning' : 'info'"
              >
                {{ m.priority }}
              </el-tag>
            </el-menu-item>
          </el-menu>
        </div>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="layout-header" height="56px">
        <div class="header-title">
          <span>{{ route.meta.title || '组件练习' }}</span>
          <el-tag size="small" type="info" effect="plain">开发区</el-tag>
        </div>

        <div class="header-actions">
          <el-tooltip content="当前模块需求说明" placement="bottom">
            <el-button circle @click="openRequirements">
              <el-icon :size="18"><Document /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="练习总览" placement="bottom">
            <el-button circle type="primary" @click="openOverview">
              <el-icon :size="18"><Grid /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>

    <OverviewDrawer v-model="overviewOpen" v-model:keyword="overviewKeyword" />
    <RequirementDrawer v-model="requirementOpen" :module="currentModule" />
  </el-container>
</template>

<style scoped>
.layout {
  height: 100%;
  background: #eef1f6;
}
.layout-aside {
  background: #fff;
  border-right: 1px solid #e3e8ef;
  display: flex;
  flex-direction: column;
}
.logo {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px 14px 10px;
  cursor: pointer;
  border-bottom: 1px solid #eef1f6;
}
.logo-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2b6ef2, #4f9bff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.logo-text b {
  font-size: 14px;
}
.logo-text small {
  color: #93a0b4;
  font-size: 11px;
  margin-top: 2px;
}
.aside-scroll {
  flex: 1;
  padding-bottom: 24px;
}
.grp {
  font-size: 11px;
  color: #93a0b4;
  letter-spacing: 0.5px;
  padding: 14px 14px 6px;
}
.layout-menu {
  border-right: none;
  background: transparent;
}
.layout-menu :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  margin: 0 8px;
  border-radius: 8px;
  padding: 0 10px !important;
  display: flex;
  gap: 8px;
}
.layout-menu :deep(.el-menu-item.is-active) {
  background: #e8f0ff;
  color: #1b4fd8;
  font-weight: 600;
}
.mid {
  width: 28px;
  font-size: 11px;
  color: #93a0b4;
  flex-shrink: 0;
}
.nm {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}
.layout-header {
  background: #fff;
  border-bottom: 1px solid #e3e8ef;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
}
.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
.layout-main {
  padding: 16px 20px 24px;
  height: calc(100% - 56px);
  overflow: auto;
}
</style>
