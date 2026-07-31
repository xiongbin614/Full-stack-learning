import { http } from '@/utils/request'
import type { PageResult, PageQuery } from '@/types/api'
import type { Skill } from '@/types/business'

/** 技能分页列表 */
export function getSkills(params: PageQuery = {}) {
  return http<PageResult<Skill>>({ url: '/skills', method: 'GET', params })
}

/** 启用 / 停用技能 */
export function updateSkillStatus(id: number, enabled: boolean) {
  return http<Skill>({ url: `/skills/${id}/status`, method: 'PUT', data: { enabled } })
}
