/** 业务类型定义（与 mock 数据形状一致） */

/** 知识库 */
export interface KnowledgeBase {
  id: number
  name: string
  description: string
  docCount: number
  visibility: 'personal' | 'org'
  status: 'indexing' | 'ready' | 'failed'
  createdAt: string
  updatedAt: string
}

/** 知识库文档 */
export interface KnowledgeDoc {
  id: number
  kbId: number
  name: string
  type: string
  size: number
  status: 'parsing' | 'ready' | 'failed'
  chunks: number
  createdAt: string
}

/** 智能体 */
export interface Agent {
  id: number
  name: string
  description: string
  knowledgeBaseIds: number[]
  skillIds: number[]
  model: string
  temperature: number
  status: 'enabled' | 'disabled'
  updatedAt: string
}

/** 技能 */
export interface Skill {
  id: number
  name: string
  description: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params: string[]
  status: 'enabled' | 'disabled'
  usageCount: number
  updatedAt: string
}

/** 会话 */
export interface Conversation {
  id: number
  title: string
  agentId?: number
  messageCount: number
  createdAt: string
  updatedAt: string
}

/** 消息 */
export interface ChatMessage {
  id: number
  conversationId: number
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolCalls?: { name: string; params: Record<string, string> }[]
  createdAt: string
}

/** 工作台统计 */
export interface DashboardStats {
  todayConversations: number
  todayMessages: number
  todayTokens: number
  knowledgeBaseCount: number
  agentCount: number
  skillCount: number
  recentConversations: Conversation[]
}
