<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteConversation, getConversations, getMessages, sendMessage } from '@/api/chat'
import type { ChatMessage, Conversation } from '@/types/business'

const conversations = ref<Conversation[]>([])
const currentId = ref<number | null>(null)
const messages = ref<ChatMessage[]>([])
const input = ref('')
const sending = ref(false)
const loadingConv = ref(false)
const loadingMsg = ref(false)
const messageListRef = ref<HTMLElement>()

// ---------- 会话列表 ----------
async function loadConversations() {
  loadingConv.value = true
  try {
    conversations.value = await getConversations()
  } finally {
    loadingConv.value = false
  }
}

async function openConversation(id: number) {
  currentId.value = id
  loadingMsg.value = true
  try {
    messages.value = await getMessages(id)
    scrollToBottom()
  } finally {
    loadingMsg.value = false
  }
}

async function handleNewConversation() {
  currentId.value = null
  messages.value = []
  input.value = ''
}

async function handleDeleteConversation(conv: Conversation) {
  try {
    await ElMessageBox.confirm(`确定删除会话「${conv.title}」吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  await deleteConversation(conv.id)
  ElMessage.success('删除成功')
  if (currentId.value === conv.id) {
    currentId.value = null
    messages.value = []
  }
  loadConversations()
}

// ---------- 发送消息 ----------
async function handleSend() {
  const content = input.value.trim()
  if (!content || sending.value) return

  sending.value = true
  // 乐观展示用户消息
  messages.value.push({
    id: -Date.now(),
    conversationId: currentId.value ?? 0,
    role: 'user',
    content,
    createdAt: '',
  })
  input.value = ''
  scrollToBottom()

  try {
    const res = await sendMessage({ content, conversationId: currentId.value ?? undefined })
    // 若为新会话，服务端自动创建并返回 conversationId
    if (currentId.value === null) {
      currentId.value = res.conversationId
    }
    messages.value.push({
      id: res.id,
      conversationId: res.conversationId,
      role: 'assistant',
      content: res.content,
      toolCalls: res.toolCalls,
      createdAt: res.createdAt,
    })
    loadConversations()
  } catch {
    // 拦截器已提示
  } finally {
    sending.value = false
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

onMounted(() => {
  loadConversations()
})
</script>

<template>
  <div class="chat-page">
    <!-- 左侧会话列表 -->
    <aside class="conv-panel">
      <el-button type="primary" class="new-conv-btn" :icon="'Plus'" @click="handleNewConversation">
        新对话
      </el-button>
      <div v-loading="loadingConv" class="conv-list">
        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="conv-item"
          :class="{ active: currentId === conv.id }"
          @click="openConversation(conv.id)"
        >
          <div class="conv-title">
            <el-icon><ChatLineSquare /></el-icon>
            <span class="conv-name">{{ conv.title }}</span>
          </div>
          <div class="conv-meta">
            <span>{{ conv.updatedAt }}</span>
            <el-button
              link
              type="danger"
              size="small"
              class="conv-del"
              @click.stop="handleDeleteConversation(conv)"
            >
              删除
            </el-button>
          </div>
        </div>
        <el-empty v-if="!loadingConv && conversations.length === 0" description="暂无会话" :image-size="60" />
      </div>
    </aside>

    <!-- 右侧对话区 -->
    <section class="chat-panel">
      <div ref="messageListRef" v-loading="loadingMsg" class="message-list">
        <el-empty
          v-if="!loadingMsg && messages.length === 0"
          description="开始你的第一段对话吧（Mock 回复）"
          :image-size="100"
        >
          <el-button type="primary" @click="input = '帮我配置混合检索，讲下要点'">示例：混合检索怎么配？</el-button>
        </el-empty>

        <template v-for="msg in messages" :key="msg.id">
          <!-- 用户消息 -->
          <div v-if="msg.role === 'user'" class="msg-row msg-user">
            <div class="bubble user-bubble">{{ msg.content }}</div>
          </div>
          <!-- 助手消息 -->
          <div v-else class="msg-row">
            <el-avatar :size="32" class="assistant-avatar"><el-icon><Cpu /></el-icon></el-avatar>
            <div class="assistant-body">
              <div v-if="msg.toolCalls?.length" class="tool-calls">
                <el-tag
                  v-for="t in msg.toolCalls"
                  :key="t.name"
                  type="warning"
                  size="small"
                  effect="light"
                  class="tool-tag"
                >
                  调用了 {{ t.name }}
                </el-tag>
              </div>
              <div class="bubble assistant-bubble">{{ msg.content }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- 输入区 -->
      <div class="input-area">
        <el-input
          v-model="input"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="输入消息，Enter 发送（Shift+Enter 换行）"
          @keydown.enter.exact.prevent="handleSend"
        />
        <div class="input-foot">
          <span class="text-muted">Mock 模式：回复由本地规则生成</span>
          <el-button type="primary" :loading="sending" :icon="'Promotion'" @click="handleSend">
            发送
          </el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  height: 100%;
  background: #f5f7fa;
}

.conv-panel {
  width: 260px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.new-conv-btn {
  width: 100%;
  margin-bottom: 12px;
}

.conv-list {
  flex: 1;
  overflow-y: auto;
}

.conv-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 4px;
}

.conv-item:hover {
  background: #f5f7fa;
}

.conv-item.active {
  background: #ecf5ff;
}

.conv-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #303133;
}

.conv-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
  padding-left: 22px;
}

.conv-del {
  visibility: hidden;
}

.conv-item:hover .conv-del {
  visibility: visible;
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.msg-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.msg-row.msg-user {
  justify-content: flex-end;
}

.assistant-avatar {
  background: linear-gradient(135deg, #409eff, #9b59b6);
  flex-shrink: 0;
}

.assistant-body {
  max-width: 70%;
}

.bubble {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.user-bubble {
  background: #409eff;
  color: #fff;
  border-top-right-radius: 2px;
  max-width: 60%;
}

.assistant-bubble {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-top-left-radius: 2px;
}

.tool-calls {
  margin-bottom: 6px;
}

.tool-tag {
  margin-right: 6px;
}

.input-area {
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
}

.input-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
</style>
