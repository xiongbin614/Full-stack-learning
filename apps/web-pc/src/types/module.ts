/** 中间件练习模块 / 需求（由原型 HTML 抽取） */

export type Priority = 'P0' | 'P1' | 'P2'

export interface Requirement {
  id: string
  title: string
  hours: string
  pageType: string
  desc: string
  fields: string
  api: string
  edge: string
  acceptance: string
  knowledge: string
}

export interface PracticeModule {
  id: string
  name: string
  priority: Priority
  category: string
  knowledge: string
  prereq: string
  reqCount: number
  hours: number
  requirements: Requirement[]
}

export interface ModuleGroup {
  name: string
  modules: Array<Pick<PracticeModule, 'id' | 'name' | 'priority'>>
}

export interface PracticeCatalog {
  groups: ModuleGroup[]
  modules: PracticeModule[]
}
