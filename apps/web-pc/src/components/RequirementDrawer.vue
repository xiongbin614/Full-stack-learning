<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PracticeModule, Requirement } from '@/types/module'

const props = defineProps<{
  modelValue: boolean
  module: PracticeModule | null
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const activeReq = ref<string>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const expanded = computed({
  get: () => (activeReq.value ? [activeReq.value] : []),
  set: (val: string[]) => {
    activeReq.value = val[0]
  },
})

function toggleReq(req: Requirement) {
  activeReq.value = activeReq.value === req.id ? undefined : req.id
}
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="module ? `${module.id} 需求说明` : '需求说明'"
    size="520px"
    direction="rtl"
    append-to-body
  >
    <template v-if="module">
      <div class="meta">
        <el-tag size="small" effect="plain">{{ module.priority }}</el-tag>
        <span>前置：{{ module.prereq || '无' }}</span>
        <span>{{ module.requirements.length }} 个需求</span>
        <span>约 {{ module.hours }}h</span>
      </div>
      <div class="know">
        <b>覆盖知识点</b>
        {{ module.knowledge }}
      </div>

      <el-collapse v-model="expanded" accordion class="req-list">
        <el-collapse-item
          v-for="req in module.requirements"
          :key="req.id"
          :name="req.id"
        >
          <template #title>
            <div class="req-title" @click.stop="toggleReq(req)">
              <el-tag size="small" effect="plain" type="primary">{{ req.pageType || '需求' }}</el-tag>
              <b>{{ req.id }} {{ req.title }}</b>
              <span class="hrs">{{ req.hours }}</span>
            </div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="需求描述">{{ req.desc }}</el-descriptions-item>
            <el-descriptions-item label="关键字段 / 交互">{{ req.fields || '—' }}</el-descriptions-item>
            <el-descriptions-item label="接口 / 入口">
              <code>{{ req.api }}</code>
            </el-descriptions-item>
            <el-descriptions-item label="异常与边界">{{ req.edge || '—' }}</el-descriptions-item>
            <el-descriptions-item label="验收标准">{{ req.acceptance }}</el-descriptions-item>
            <el-descriptions-item label="覆盖知识点">{{ req.knowledge }}</el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
    </template>
    <el-empty v-else description="请先选择左侧组件模块" />
  </el-drawer>
</template>

<style scoped>
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
  align-items: center;
}
.know {
  font-size: 12px;
  color: #4b5563;
  background: #f7f9fc;
  border-left: 3px solid #2b6ef2;
  padding: 8px 10px;
  border-radius: 0 6px 6px 0;
  line-height: 1.6;
  margin-bottom: 14px;
}
.know b {
  color: #1b4fd8;
  margin-right: 6px;
}
.req-title {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding-right: 8px;
}
.req-title b {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hrs {
  font-size: 12px;
  color: #93a0b4;
  flex-shrink: 0;
}
code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  background: #f3f6fb;
  padding: 2px 6px;
  border-radius: 4px;
  word-break: break-all;
}
:deep(.el-collapse-item__header) {
  height: auto;
  min-height: 44px;
  line-height: 1.4;
}
</style>
