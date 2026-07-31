import { http } from '@/utils/request'
import type { DashboardStats } from '@/types/business'

/** 工作台统计 */
export function getDashboardStats() {
  return http<DashboardStats>({ url: '/dashboard/stats', method: 'GET' })
}
