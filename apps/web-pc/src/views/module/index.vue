<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getModuleById } from '@/data'

const route = useRoute()

const module = computed(() => getModuleById(String(route.params.id || '')))
</script>

<template>
  <div v-if="module" class="workspace">
    <div class="workspace-hint">
      <div>
        <h3>{{ module.id }} · {{ module.name }} · 开发区</h3>
        <p>
          主区域留给你写真实练习页面。需求说明请点右上角
          <el-icon><Document /></el-icon>
          ；组件总览请点
          <el-icon><Grid /></el-icon>
          。
        </p>
      </div>
      <el-tag
        size="small"
        :type="module.priority === 'P0' ? 'danger' : module.priority === 'P1' ? 'warning' : 'info'"
      >
        {{ module.priority }}
      </el-tag>
    </div>

    <!-- 后续在此挂载各模块真实练习 UI -->
    <div class="workspace-canvas">
      <el-empty description="开发占位：在这里实现当前模块的练习页面">
        <template #image>
          <div class="placeholder-box">DEV</div>
        </template>
      </el-empty>
    </div>
  </div>

  <el-empty v-else description="未找到该组件模块" />
</template>

<style scoped>
.workspace {
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.workspace-hint {
  background: #fff;
  border: 1px solid #e3e8ef;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.workspace-hint h3 {
  margin: 0 0 4px;
  font-size: 14px;
}
.workspace-hint p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
}
.workspace-canvas {
  flex: 1;
  min-height: 420px;
  background: #fff;
  border: 1px dashed #c9d4e5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-box {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e8f0ff, #f3f6fb);
  color: #1b4fd8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0 auto 8px;
}
</style>
