import { http } from '@/utils/request'
import type { PageResult, PageQuery } from '@/types/api'
import type { KnowledgeBase, KnowledgeDoc } from '@/types/business'

/** 知识库分页列表 */
export function getKnowledgeBases(params: PageQuery = {}) {
  return http<PageResult<KnowledgeBase>>({ url: '/knowledge', method: 'GET', params })
}

/** 创建知识库 */
export function createKnowledgeBase(data: { name: string; description?: string; visibility?: 'personal' | 'org' }) {
  return http<KnowledgeBase>({ url: '/knowledge', method: 'POST', data })
}

/** 更新知识库 */
export function updateKnowledgeBase(id: number, data: Partial<Pick<KnowledgeBase, 'name' | 'description' | 'visibility'>>) {
  return http<KnowledgeBase>({ url: `/knowledge/${id}`, method: 'PUT', data })
}

/** 删除知识库 */
export function deleteKnowledgeBase(id: number) {
  return http<null>({ url: `/knowledge/${id}`, method: 'DELETE' })
}

/** 知识库文档分页列表 */
export function getKnowledgeDocs(kbId: number, params: PageQuery = {}) {
  return http<PageResult<KnowledgeDoc>>({ url: `/knowledge/${kbId}/docs`, method: 'GET', params })
}

/** 上传文档（mock：记录一条解析任务） */
export function uploadKnowledgeDoc(kbId: number, data: { name: string; type?: string; size?: number }) {
  return http<KnowledgeDoc>({ url: `/knowledge/${kbId}/docs`, method: 'POST', data })
}
