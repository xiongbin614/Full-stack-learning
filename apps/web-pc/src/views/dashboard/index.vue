<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboardStats } from '@/api/dashboard'
import type { DashboardStats } from '@/types/business'

const router = useRouter()
const stats = ref<DashboardStats | null>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    stats.value = await getDashboardStats()
  } finally {
    loading.value = false
  }
})

const statCards = [
  { key: 'todayConversations', label: '今日对话', color: '#409eff', icon: 'ChatDotRound' },
  { key: 'todayMessages', label: '今日消息', color: '#67c23a', icon: 'ChatLineSquare' },
  { key: 'todayTokens', label: '今日 Token 估算', color: '#e6a23c', icon: 'DataAnalysis' },
  { key: 'knowledgeBaseCount', label: '知识库', color: '#909399', icon: 'Collection' },
  { key: 'agentCount', label: '智能体', color: '#f56c6c', icon: 'MagicStick' },
  { key: 'skillCount', label: '可用技能', color: '#9b59b6', icon: 'Cpu' },
] as const

function formatTokens(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}
</script>

<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16" v-loading="loading">
      <el-col v-for="card in statCards" :key="card.key" :span="8" class="stat-col">
        <div class="stat-card" @click="router.push(card.key === 'knowledgeBaseCount' ? '/knowledge' : card.key === 'agentCount' ? '/agents' : card.key === 'skillCount' ? '/skills' : '/chat')">
          <el-icon :size="28" :color="card.color"><component :is="card.icon" /></el-icon>
          <div class="stat-meta">
            <div class="stat-value">
              {{ card.key === 'todayTokens' ? formatTokens(stats?.[card.key] ?? 0) : stats?.[card.key] ?? '-' }}
            </div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="16" class="quick-row">
      <el-col :span="8">
        <div class="quick-card" @click="router.push('/chat')">
          <el-icon :size="24" color="#409eff"><ChatDotRound /></el-icon>
          <div>
            <div class="quick-title">新对话</div>
            <div class="quick-desc">与智能体开始一次多轮对话</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="quick-card" @click="router.push('/knowledge')">
          <el-icon :size="24" color="#67c23a"><Collection /></el-icon>
          <div>
            <div class="quick-title">知识广场</div>
            <div class="quick-desc">管理知识库与文档，为 RAG 提供数据</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="quick-card" @click="router.push('/agents')">
          <el-icon :size="24" color="#f56c6c"><MagicStick /></el-icon>
          <div>
            <div class="quick-title">智能体</div>
            <div class="quick-desc">创建 / 编排绑定知识库与技能</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 最近会话 -->
    <div class="page-card recent-card">
      <div class="recent-head">
        <span class="recent-title">最近会话</span>
        <el-button link type="primary" @click="router.push('/chat')">全部会话</el-button>
      </div>
      <el-empty v-if="!loading && !stats?.recentConversations.length" description="暂无会话" :image-size="80" />
      <div v-else class="recent-list">
        <div
          v-for="conv in stats?.recentConversations"
          :key="conv.id"
          class="recent-item"
          @click="router.push('/chat')"
        >
          <el-icon color="#409eff"><ChatLineSquare /></el-icon>
          <span class="recent-name">{{ conv.title }}</span>
          <span class="recent-time">{{ conv.updatedAt }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-col {
  margin-bottom: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}

.quick-row {
  margin-bottom: 16px;
}

.quick-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.quick-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.quick-title {
  font-weight: 600;
  color: #303133;
}

.quick-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.recent-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.recent-title {
  font-weight: 600;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.recent-item:hover {
  background: #f5f7fa;
}

.recent-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-time {
  font-size: 12px;
  color: #909399;
}
</style>
