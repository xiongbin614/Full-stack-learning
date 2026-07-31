<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  getKnowledgeBases,
  getKnowledgeDocs,
  updateKnowledgeBase,
  uploadKnowledgeDoc,
} from '@/api/knowledge'
import type { KnowledgeBase, KnowledgeDoc } from '@/types/business'

// ---------- 列表 ----------
const loading = ref(false)
const list = ref<KnowledgeBase[]>([])
const total = ref(0)
const query = reactive({ page: 1, size: 10, keyword: '' })

async function loadList() {
  loading.value = true
  try {
    const res = await getKnowledgeBases(query)
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

function handleReset() {
  query.keyword = ''
  query.page = 1
  loadList()
}

// ---------- 新建 / 编辑 ----------
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<FormInstance>()
const submitting = ref(false)
const form = reactive({ name: '', description: '', visibility: 'personal' as 'personal' | 'org' })

const rules: FormRules = {
  name: [{ required: true, message: '请输入知识库名称', trigger: 'blur' }],
}

function openCreate() {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.visibility = 'personal'
  dialogVisible.value = true
}

function openEdit(row: KnowledgeBase) {
  editingId.value = row.id
  form.name = row.name
  form.description = row.description
  form.visibility = row.visibility
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (editingId.value) {
      await updateKnowledgeBase(editingId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createKnowledgeBase(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadList()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: KnowledgeBase) {
  try {
    await ElMessageBox.confirm(`确定删除知识库「${row.name}」吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  await deleteKnowledgeBase(row.id)
  ElMessage.success('删除成功')
  loadList()
}

// ---------- 文档抽屉 ----------
const drawerVisible = ref(false)
const docsLoading = ref(false)
const currentKb = ref<KnowledgeBase | null>(null)
const docs = ref<KnowledgeDoc[]>([])
const uploadLoading = ref(false)

async function openDocs(row: KnowledgeBase) {
  currentKb.value = row
  drawerVisible.value = true
  await loadDocs()
}

async function loadDocs() {
  if (!currentKb.value) return
  docsLoading.value = true
  try {
    const res = await getKnowledgeDocs(currentKb.value.id, { page: 1, size: 50 })
    docs.value = res.list
  } finally {
    docsLoading.value = false
  }
}

async function handleUpload(file: UploadFile) {
  if (!currentKb.value) return false
  uploadLoading.value = true
  try {
    const name = file.name || '未命名文档'
    const type = name.split('.').pop()?.toLowerCase() || 'md'
    await uploadKnowledgeDoc(currentKb.value.id, { name, type, size: file.size || 0 })
    ElMessage.success('上传成功，解析中…')
    // 2 秒后刷新文档列表（mock 解析完成）
    setTimeout(loadDocs, 2200)
    loadDocs()
  } finally {
    uploadLoading.value = false
  }
  return false
}

function formatSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${size} B`
}

onMounted(loadList)
</script>

<template>
  <div class="page-container">
    <!-- 工具栏 -->
    <div class="page-card toolbar">
      <el-input
        v-model="query.keyword"
        placeholder="搜索知识库名称 / 描述"
        clearable
        style="width: 260px"
        @keyup.enter="handleSearch"
        @clear="handleReset"
      >
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
      <div class="toolbar-spacer" />
      <el-button type="primary" :icon="'Plus'" @click="openCreate">新建知识库</el-button>
    </div>

    <!-- 列表 -->
    <div class="page-card table-card">
      <el-table v-loading="loading" :data="list">
        <el-table-column prop="name" label="名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
        <el-table-column prop="docCount" label="文档数" width="90" align="center" />
        <el-table-column label="可见范围" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.visibility === 'org' ? 'primary' : 'info'" effect="plain" size="small">
              {{ row.visibility === 'org' ? '组织' : '个人' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ready' ? 'success' : row.status === 'indexing' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'ready' ? '已就绪' : row.status === 'indexing' ? '索引中' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="150" align="center" />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDocs(row)">文档</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 新建 / 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑知识库' : '新建知识库'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="如：RAG 架构设计文档" maxlength="40" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="一句话说明知识库用途" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="可见范围">
          <el-radio-group v-model="form.visibility">
            <el-radio value="personal">个人可见</el-radio>
            <el-radio value="org">组织可见</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 文档抽屉 -->
    <el-drawer v-model="drawerVisible" :title="`文档 · ${currentKb?.name || ''}`" size="520px">
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleUpload"
        accept=".md,.txt,.pdf,.docx,.xlsx"
        class="upload-area"
      >
        <el-button type="primary" :loading="uploadLoading" :icon="'UploadFilled'">上传文档（Mock）</el-button>
      </el-upload>
      <el-table v-loading="docsLoading" :data="docs" size="small" class="docs-table">
        <el-table-column prop="name" label="文件名" min-width="160" show-overflow-tooltip />
        <el-table-column label="大小" width="90" align="right">
          <template #default="{ row }">{{ formatSize(row.size) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ready' ? 'success' : 'warning'" size="small">
              {{ row.status === 'ready' ? `${row.chunks} 片段` : '解析中' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!docsLoading && docs.length === 0" description="暂无文档，点击上方按钮上传" :image-size="80" />
    </el-drawer>
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

.pager {
  margin-top: 16px;
  justify-content: flex-end;
}

.upload-area {
  margin-bottom: 16px;
}

.docs-table {
  width: 100%;
}
</style>
