import { http } from '@/utils/request'
import type { Conversation, ChatMessage } from '@/types/business'

/** 会话列表（按更新时间倒序） */
export function getConversations() {
  return http<Conversation[]>({ url: '/conversations', method: 'GET' })
}

/** 新建会话 */
export function createConversation(data: { title?: string; agentId?: number }) {
  return http<Conversation>({ url: '/conversations', method: 'POST', data })
}

/** 删除会话 */
export function deleteConversation(id: number) {
  return http<null>({ url: `/conversations/${id}`, method: 'DELETE' })
}

/** 会话消息列表 */
export function getMessages(conversationId: number) {
  return http<ChatMessage[]>({ url: `/conversations/${conversationId}/messages`, method: 'GET' })
}

/** 发送消息（mock：同步返回助手回复） */
export function sendMessage(data: { content: string; conversationId?: number; agentId?: number }) {
  return http<ChatMessage & { conversationId: number }>({ url: '/chat', method: 'POST', data })
}
