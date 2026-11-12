import catalog from './modules.json'
import type { PracticeCatalog, PracticeModule, Priority } from '@/types/module'

const data = catalog as PracticeCatalog

export function getGroups() {
  return data.groups
}

export function getModules() {
  return data.modules
}

export function getModuleById(id: string): PracticeModule | undefined {
  return data.modules.find((m) => m.id === id)
}

export function filterModules(keyword: string, priority?: Priority | 'ALL') {
  const q = keyword.trim().toLowerCase()
  return data.modules.filter((m) => {
    const hitPri = !priority || priority === 'ALL' || m.priority === priority
    if (!hitPri) return false
    if (!q) return true
    return (
      m.id.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.knowledge.toLowerCase().includes(q) ||
      m.requirements.some(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.knowledge.toLowerCase().includes(q),
      )
    )
  })
}

export const STATS = {
  moduleCount: data.modules.length,
  requirementCount: data.modules.reduce((n, m) => n + m.requirements.length, 0),
  totalHours: data.modules.reduce((n, m) => n + (m.hours || 0), 0),
  p0: data.modules.filter((m) => m.priority === 'P0').length,
  p1: data.modules.filter((m) => m.priority === 'P1').length,
  p2: data.modules.filter((m) => m.priority === 'P2').length,
}
