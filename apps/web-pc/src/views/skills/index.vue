<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getSkills, updateSkillStatus } from '@/api/skill'
import type { Skill } from '@/types/business'

const loading = ref(false)
const list = ref<Skill[]>([])
const total = ref(0)
const query = reactive({ page: 1, size: 10, keyword: '' })

async function loadList() {
  loading.value = true
  try {
    const res = await getSkills(query)
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  query.page = 1
  loadList()
}

async function handleStatusChange(row: Skill) {
  try {
    const next = row.status === 'enabled' ? false : true
    await updateSkillStatus(row.id, next)
    row.status = next ? 'enabled' : 'disabled'
    ElMessage.success(next ? '已启用' : '已停用')
  } catch {
    loadList()
  }
}

onMounted(loadList)
</script>

<template>
  <div class="page-container">
    <!-- 工具栏 -->
    <div class="page-card toolbar">
      <el-input
        v-model="query.keyword"
        placeholder="搜索技能名称 / 描述"
        clearable
        style="width: 260px"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <div class="toolbar-spacer" />
      <el-tooltip content="技能由后端注册，当前版本仅支持启停" placement="top">
        <span>
          <el-button disabled :icon="'Plus'">注册技能</el-button>
        </span>
      </el-tooltip>
    </div>

    <!-- 表格 -->
    <div class="page-card table-card">
      <el-table v-loading="loading" :data="list">
        <el-table-column label="技能" min-width="180">
          <template #default="{ row }">
            <div class="skill-name">{{ row.name }}</div>
            <div class="skill-desc">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="接口" min-width="220">
          <template #default="{ row }">
            <el-tag :type="row.method === 'GET' ? 'primary' : 'warning'" size="small">{{ row.method }}</el-tag>
            <code class="endpoint">{{ row.endpoint }}</code>
          </template>
        </el-table-column>
        <el-table-column label="参数" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="p in row.params" :key="p" size="small" effect="plain" class="param-tag">{{ p }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="调用次数" width="100" align="center" />
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch :model-value="row.status === 'enabled'" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="150" align="center" />
      </el-table>
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.size"
        :total="total"
        layout="total, prev, pager, next"
        class="pager"
        @current-change="loadList"
      />
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar-spacer {
  flex: 1;
}

.table-card {
  padding: 8px 16px 16px;
}

.skill-name {
  font-weight: 600;
}

.skill-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.endpoint {
  margin-left: 6px;
  font-size: 12px;
  color: #606266;
}

.param-tag {
  margin-right: 4px;
}

.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
