<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { STATS, filterModules } from '@/data'
import type { Priority } from '@/types/module'

const props = defineProps<{
  modelValue: boolean
  keyword?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'update:keyword': [string]
}>()

const router = useRouter()
const priority = ref<Priority | 'ALL'>('ALL')
const localKeyword = ref(props.keyword || '')

watch(
  () => props.keyword,
  (v) => {
    localKeyword.value = v || ''
  },
)

const list = computed(() => filterModules(localKeyword.value, priority.value))

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

function onSearch() {
  emit('update:keyword', localKeyword.value)
}

function openModule(id: string) {
  visible.value = false
  router.push(`/modules/${id}`)
}
</script>

<template>
  <el-drawer v-model="visible" title="练习总览" size="480px" direction="rtl" append-to-body>
    <div class="drawer-body">
      <div class="stats">
        <div class="stat"><b>{{ STATS.moduleCount }}</b><span>组件</span></div>
        <div class="stat"><b>{{ STATS.requirementCount }}</b><span>需求</span></div>
        <div class="stat"><b>{{ STATS.totalHours }}h</b><span>约总工时</span></div>
      </div>

      <el-input
        v-model="localKeyword"
        clearable
        placeholder="搜索组件 / 需求"
        class="search"
        @keyup.enter="onSearch"
        @clear="onSearch"
      >
        <template #append>
          <el-button @click="onSearch">搜索</el-button>
        </template>
      </el-input>

      <el-radio-group v-model="priority" size="small" class="filters">
        <el-radio-button value="ALL">全部</el-radio-button>
        <el-radio-button value="P0">P0</el-radio-button>
        <el-radio-button value="P1">P1</el-radio-button>
        <el-radio-button value="P2">P2</el-radio-button>
      </el-radio-group>

      <div class="list">
        <div
          v-for="m in list"
          :key="m.id"
          class="item"
          @click="openModule(m.id)"
        >
          <div class="item-h">
            <el-tag size="small" effect="plain">{{ m.id }}</el-tag>
            <b>{{ m.name }}</b>
            <el-tag
              size="small"
              :type="m.priority === 'P0' ? 'danger' : m.priority === 'P1' ? 'warning' : 'info'"
            >
              {{ m.priority }}
            </el-tag>
          </div>
          <p>{{ m.category }} · {{ m.requirements.length }} 需求 · 约 {{ m.hours }}h</p>
          <p class="know">{{ m.knowledge }}</p>
        </div>
        <el-empty v-if="!list.length" description="没有匹配的组件" :image-size="64" />
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
.stats {
  display: flex;
  gap: 10px;
}
.stat {
  flex: 1;
  text-align: center;
  background: #f7f9fc;
  border-radius: 8px;
  padding: 8px;
}
.stat b {
  display: block;
  color: #1b4fd8;
  font-size: 16px;
}
.stat span {
  font-size: 11px;
  color: #93a0b4;
}
.search {
  width: 100%;
}
.filters {
  width: 100%;
}
.list {
  flex: 1;
  overflow: auto;
  padding-right: 4px;
}
.item {
  border: 1px solid #e3e8ef;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  cursor: pointer;
  background: #fff;
}
.item:hover {
  border-color: #2b6ef2;
  background: #f8fbff;
}
.item-h {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.item-h b {
  flex: 1;
  font-size: 13px;
}
.item p {
  margin: 0;
  font-size: 12px;
  color: #93a0b4;
}
.know {
  margin-top: 6px !important;
  color: #4b5563 !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
