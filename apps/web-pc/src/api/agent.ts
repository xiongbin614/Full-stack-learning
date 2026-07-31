import { http } from '@/utils/request'
import type { PageResult, PageQuery } from '@/types/api'
import type { Agent } from '@/types/business'

/** 智能体分页列表 */
export function getAgents(params: PageQuery = {}) {
  return http<PageResult<Agent>>({ url: '/agents', method: 'GET', params })
}

/** 创建智能体 */
export function createAgent(data: Partial<Omit<Agent, 'id' | 'status' | 'updatedAt'>>) {
  return http<Agent>({ url: '/agents', method: 'POST', data })
}

/** 更新智能体 */
export function updateAgent(id: number, data: Partial<Omit<Agent, 'id'>>) {
  return http<Agent>({ url: `/agents/${id}`, method: 'PUT', data })
}

/** 删除智能体 */
export function deleteAgent(id: number) {
  return http<null>({ url: `/agents/${id}`, method: 'DELETE' })
}
