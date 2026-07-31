<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createAgent, deleteAgent, getAgents, updateAgent } from '@/api/agent'
import { getKnowledgeBases } from '@/api/knowledge'
import { getSkills } from '@/api/skill'
import type { Agent, KnowledgeBase, Skill } from '@/types/business'

// ---------- 列表 ----------
const loading = ref(false)
const list = ref<Agent[]>([])
const total = ref(0)
const query = reactive({ page: 1, size: 12, keyword: '' })

async function loadList() {
  loading.value = true
  try {
    const res = await getAgents(query)
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

// ---------- 新建 / 编辑 ----------
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  description: '',
  model: 'deepseek-v3.2',
  temperature: 0.3,
  knowledgeBaseIds: [] as number[],
  skillIds: [] as number[],
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入智能体名称', trigger: 'blur' }],
}

const kbOptions = ref<KnowledgeBase[]>([])
const skillOptions = ref<Skill[]>([])

async function openCreate() {
  editingId.value = null
  Object.assign(form, { name: '', description: '', model: 'deepseek-v3.2', temperature: 0.3, knowledgeBaseIds: [], skillIds: [] })
  dialogVisible.value = true
}

function openEdit(row: Agent) {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    description: row.description,
    model: row.model,
    temperature: row.temperature,
    knowledgeBaseIds: [...row.knowledgeBaseIds],
    skillIds: [...row.skillIds],
  })
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (editingId.value) {
      await updateAgent(editingId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createAgent(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadList()
  } finally {
    submitting.value = false
  }
}

// ---------- 启停 / 删除 ----------
async function handleStatusChange(row: Agent) {
  try {
    await updateAgent(row.id, { status: row.status === 'enabled' ? 'disabled' : 'enabled' })
    row.status = row.status === 'enabled' ? 'disabled' : 'enabled'
    ElMessage.success(row.status === 'enabled' ? '已启用' : '已停用')
  } catch {
    loadList()
  }
}

async function handleDelete(row: Agent) {
  try {
    await ElMessageBox.confirm(`确定删除智能体「${row.name}」吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  await deleteAgent(row.id)
  ElMessage.success('删除成功')
  loadList()
}

function kbName(id: number) {
  return kbOptions.value.find((k) => k.id === id)?.name || `#${id}`
}

function skillName(id: number) {
  return skillOptions.value.find((s) => s.id === id)?.name || `#${id}`
}

onMounted(async () => {
  loadList()
  const [kbs, skills] = await Promise.all([getKnowledgeBases({ page: 1, size: 100 }), getSkills({ page: 1, size: 100 })])
  kbOptions.value = kbs.list
  skillOptions.value = skills.list
})
</script>

<template>
  <div class="page-container">
    <!-- 工具栏 -->
    <div class="page-card toolbar">
      <el-input
        v-model="query.keyword"
        placeholder="搜索智能体名称 / 描述"
        clearable
        style="width: 260px"
        @keyup.enter="handleSearch"
        @clear="handleSearch"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <div class="toolbar-spacer" />
      <el-button type="primary" :icon="'Plus'" @click="openCreate">新建智能体</el-button>
    </div>

    <!-- 卡片列表 -->
    <div v-loading="loading" class="agent-grid">
      <div v-for="agent in list" :key="agent.id" class="agent-card">
        <div class="agent-head">
          <el-avatar :size="40" class="agent-avatar">{{ agent.name.slice(0, 1) }}</el-avatar>
          <div class="agent-meta">
            <div class="agent-name">{{ agent.name }}</div>
            <div class="agent-model">{{ agent.model }} · temp {{ agent.temperature }}</div>
          </div>
          <el-switch
            :model-value="agent.status === 'enabled'"
            @change="handleStatusChange(agent)"
          />
        </div>
        <div class="agent-desc">{{ agent.description || '暂无描述' }}</div>
        <div class="agent-tags">
          <el-tag v-for="id in agent.knowledgeBaseIds" :key="`kb-${id}`" type="primary" size="small" effect="plain">
            {{ kbName(id) }}
          </el-tag>
          <el-tag v-for="id in agent.skillIds" :key="`s-${id}`" type="success" size="small" effect="plain">
            {{ skillName(id) }}
          </el-tag>
          <span v-if="!agent.knowledgeBaseIds.length && !agent.skillIds.length" class="text-muted">未绑定知识库 / 技能</span>
        </div>
        <div class="agent-foot">
          <span class="text-muted">{{ agent.updatedAt }}</span>
          <span>
            <el-button link type="primary" @click="openEdit(agent)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(agent)">删除</el-button>
          </span>
        </div>
      </div>
    </div>
    <el-empty v-if="!loading && list.length === 0" description="暂无智能体" />

    <el-pagination
      v-if="total > query.size"
      v-model:current-page="query.page"
      :page-size="query.size"
      :total="total"
      layout="total, prev, pager, next"
      class="pager"
      @current-change="loadList"
    />

    <!-- 新建 / 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑智能体' : '新建智能体'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="如：文档问答助手" maxlength="30" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="人设与职责说明" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="模型">
          <el-select v-model="form.model" style="width: 220px">
            <el-option label="deepseek-v3.2" value="deepseek-v3.2" />
            <el-option label="deepseek-v3.2-lite" value="deepseek-v3.2-lite" />
            <el-option label="qwen-plus" value="qwen-plus" />
          </el-select>
        </el-form-item>
        <el-form-item label="温度">
          <el-slider v-model="form.temperature" :min="0" :max="1" :step="0.1" show-input style="width: 300px" />
        </el-form-item>
        <el-form-item label="知识库">
          <el-select v-model="form.knowledgeBaseIds" multiple placeholder="选择绑定的知识库" style="width: 100%">
            <el-option v-for="kb in kbOptions" :key="kb.id" :label="kb.name" :value="kb.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="技能">
          <el-select v-model="form.skillIds" multiple placeholder="选择可调用的技能" style="width: 100%">
            <el-option v-for="s in skillOptions" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
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

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.agent-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.15s;
}

.agent-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.agent-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar {
  background: linear-gradient(135deg, #409eff, #9b59b6);
  flex-shrink: 0;
}

.agent-meta {
  flex: 1;
  min-width: 0;
}

.agent-name {
  font-weight: 600;
  font-size: 15px;
}

.agent-model {
  font-size: 12px;
  color: #909399;
}

.agent-desc {
  margin: 12px 0;
  font-size: 13px;
  color: #606266;
  min-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.agent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.agent-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0f2f5;
  padding-top: 10px;
  font-size: 12px;
}

.pager {
  margin-top: 16px;
  justify-content: flex-end;
}
</style>
