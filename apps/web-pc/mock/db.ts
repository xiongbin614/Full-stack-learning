/**
 * mock/db.ts — 内存数据源
 *
 * 模拟后端数据库：登录用户、知识库、智能体、技能、会话、消息、工作台统计。
 * 仅存在于 dev server 进程内存中，重启即重置，符合"先不联调后端"的 Mock 定位。
 *
 * 数据形状与前端 src/types 保持一致（并尽量贴近后端 Result/PageResult 契约）。
 */

export interface MockUser {
  id: number
  username: string
  password: string
  nickname: string
  role: 'ADMIN' | 'USER'
  email: string
  avatar?: string
}

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

export interface Conversation {
  id: number
  title: string
  agentId?: number
  messageCount: number
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: number
  conversationId: number
  role: 'user' | 'assistant' | 'tool'
  content: string
  toolCalls?: { name: string; params: Record<string, string> }[]
  createdAt: string
}

export interface DashboardStats {
  todayConversations: number
  todayMessages: number
  todayTokens: number
  knowledgeBaseCount: number
  agentCount: number
  skillCount: number
  recentConversations: Conversation[]
}

// ---------- 种子数据 ----------

export const users: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    role: 'ADMIN',
    email: 'admin@cmccpc.local',
  },
  {
    id: 2,
    username: 'alice',
    password: '123456',
    nickname: '张小明',
    role: 'USER',
    email: 'alice@cmccpc.local',
  },
  {
    id: 3,
    username: 'bob',
    password: '123456',
    nickname: '李华',
    role: 'USER',
    email: 'bob@cmccpc.local',
  },
]

export const knowledgeBases: KnowledgeBase[] = [
  {
    id: 1,
    name: 'RAG 架构设计文档',
    description: '检索增强生成（RAG）系统的架构设计、检索策略与评测方法汇总。',
    docCount: 128,
    visibility: 'org',
    status: 'ready',
    createdAt: '2026-05-12 10:20',
    updatedAt: '2026-07-30 09:15',
  },
  {
    id: 2,
    name: '公司规章制度',
    description: '考勤、报销、信息安全与办公规范等制度文件。',
    docCount: 45,
    visibility: 'org',
    status: 'ready',
    createdAt: '2026-03-02 14:00',
    updatedAt: '2026-07-28 18:40',
  },
  {
    id: 3,
    name: '前端开发规范',
    description: 'TypeScript / Vue3 / 工程化最佳实践与代码风格约束。',
    docCount: 32,
    visibility: 'org',
    status: 'ready',
    createdAt: '2026-04-18 09:30',
    updatedAt: '2026-07-25 16:05',
  },
  {
    id: 4,
    name: '产品需求文档库',
    description: '各迭代版本 PRD、原型说明与评审纪要（个人可见）。',
    docCount: 18,
    visibility: 'personal',
    status: 'ready',
    createdAt: '2026-06-01 11:12',
    updatedAt: '2026-07-22 10:30',
  },
  {
    id: 5,
    name: '客服话术手册',
    description: '常见问题应答模板与升级流程，正在增量导入。',
    docCount: 210,
    visibility: 'org',
    status: 'indexing',
    createdAt: '2026-07-01 08:00',
    updatedAt: '2026-07-31 08:05',
  },
  {
    id: 6,
    name: '竞品分析报告',
    description: '头部 Agent 产品的功能对比与体验复盘（个人可见）。',
    docCount: 7,
    visibility: 'personal',
    status: 'ready',
    createdAt: '2026-06-20 15:45',
    updatedAt: '2026-07-10 13:22',
  },
]

export const knowledgeDocs: KnowledgeDoc[] = [
  { id: 1, kbId: 1, name: 'RAG 检索流程.md', type: 'md', size: 48213, status: 'ready', chunks: 36, createdAt: '2026-07-30 09:10' },
  { id: 2, kbId: 1, name: '混合检索策略.pdf', type: 'pdf', size: 1203456, status: 'ready', chunks: 24, createdAt: '2026-07-29 14:22' },
  { id: 3, kbId: 1, name: '评测指标说明.docx', type: 'docx', size: 896512, status: 'ready', chunks: 18, createdAt: '2026-07-28 11:03' },
  { id: 4, kbId: 5, name: 'FAQ-2026Q3.xlsx', type: 'xlsx', size: 2201400, status: 'parsing', chunks: 0, createdAt: '2026-07-31 08:05' },
  { id: 5, kbId: 5, name: '升级流程 SOP.md', type: 'md', size: 20148, status: 'parsing', chunks: 0, createdAt: '2026-07-31 08:05' },
]

export const agents: Agent[] = [
  {
    id: 1,
    name: '文档问答助手',
    description: '基于知识库 RAG 检索的问答智能体，引用来源并给出置信度。',
    knowledgeBaseIds: [1, 3],
    skillIds: [1, 2],
    model: 'deepseek-v3.2',
    temperature: 0.3,
    status: 'enabled',
    updatedAt: '2026-07-29 10:00',
  },
  {
    id: 2,
    name: '周报小助手',
    description: '汇总本周提交记录与任务进展，自动生成结构化周报。',
    knowledgeBaseIds: [],
    skillIds: [3, 6],
    model: 'deepseek-v3.2',
    temperature: 0.7,
    status: 'enabled',
    updatedAt: '2026-07-26 17:30',
  },
  {
    id: 3,
    name: '代码审查专家',
    description: '按团队规范审查 MR，输出问题清单与修改建议。',
    knowledgeBaseIds: [3],
    skillIds: [4],
    model: 'deepseek-v3.2',
    temperature: 0.2,
    status: 'enabled',
    updatedAt: '2026-07-24 09:45',
  },
  {
    id: 4,
    name: '客服机器人',
    description: '接待一线咨询，命中话术手册时自动应答。',
    knowledgeBaseIds: [5],
    skillIds: [1, 5],
    model: 'deepseek-v3.2',
    temperature: 0.5,
    status: 'disabled',
    updatedAt: '2026-07-20 14:00',
  },
  {
    id: 5,
    name: '产品需求分析师',
    description: '从需求描述中抽取用户故事、验收标准与风险点。',
    knowledgeBaseIds: [4],
    skillIds: [2],
    model: 'deepseek-v3.2',
    temperature: 0.4,
    status: 'enabled',
    updatedAt: '2026-07-18 16:20',
  },
]

export const skills: Skill[] = [
  {
    id: 1,
    name: 'knowledge.search',
    description: '知识库语义检索：按关键词/向量在指定知识库中检索片段。',
    endpoint: '/api/knowledge/search',
    method: 'POST',
    params: ['knowledgeBaseId', 'query', 'topK'],
    status: 'enabled',
    usageCount: 1320,
    updatedAt: '2026-07-15 10:00',
  },
  {
    id: 2,
    name: 'doc.summarize',
    description: '文档摘要：对传入文本或文档 ID 生成结构化摘要。',
    endpoint: '/api/doc/summarize',
    method: 'POST',
    params: ['docId', 'maxLength'],
    status: 'enabled',
    usageCount: 876,
    updatedAt: '2026-07-14 11:20',
  },
  {
    id: 3,
    name: 'task.create',
    description: '创建任务：写入任务列表并返回任务 ID。',
    endpoint: '/api/tasks',
    method: 'POST',
    params: ['title', 'assignee', 'dueDate'],
    status: 'enabled',
    usageCount: 452,
    updatedAt: '2026-07-13 09:00',
  },
  {
    id: 4,
    name: 'web.fetch',
    description: '网页抓取：抓取指定 URL 的正文并清洗为 Markdown。',
    endpoint: '/api/web/fetch',
    method: 'POST',
    params: ['url', 'maxChars'],
    status: 'disabled',
    usageCount: 321,
    updatedAt: '2026-07-12 15:40',
  },
  {
    id: 5,
    name: 'mail.send',
    description: '发送邮件：经审批后向指定收件人发送邮件。',
    endpoint: '/api/mail/send',
    method: 'POST',
    params: ['to', 'subject', 'body'],
    status: 'enabled',
    usageCount: 210,
    updatedAt: '2026-07-11 10:10',
  },
  {
    id: 6,
    name: 'calc.execute',
    description: '表达式计算：安全执行简单算术表达式。',
    endpoint: '/api/calc',
    method: 'POST',
    params: ['expr'],
    status: 'enabled',
    usageCount: 189,
    updatedAt: '2026-07-10 08:30',
  },
]

export const conversations: Conversation[] = [
  {
    id: 1,
    title: 'RAG 混合检索怎么配？',
    agentId: 1,
    messageCount: 6,
    createdAt: '2026-07-30 09:12',
    updatedAt: '2026-07-30 09:18',
  },
  {
    id: 2,
    title: '帮我写本周周报',
    agentId: 2,
    messageCount: 4,
    createdAt: '2026-07-29 18:02',
    updatedAt: '2026-07-29 18:10',
  },
  {
    id: 3,
    title: '这份 MR 有什么问题？',
    agentId: 3,
    messageCount: 8,
    createdAt: '2026-07-29 11:30',
    updatedAt: '2026-07-29 11:45',
  },
  {
    id: 4,
    title: '新员工入职流程',
    agentId: 4,
    messageCount: 3,
    createdAt: '2026-07-28 16:00',
    updatedAt: '2026-07-28 16:05',
  },
]

export const messages: ChatMessage[] = [
  {
    id: 1,
    conversationId: 1,
    role: 'user',
    content: 'RAG 里混合检索一般怎么配置权重？',
    createdAt: '2026-07-30 09:12',
  },
  {
    id: 2,
    conversationId: 1,
    role: 'assistant',
    content:
      '混合检索通常组合「关键词检索（BM25）」与「向量检索」，再用 RRF（Reciprocal Rank Fusion）合并排序。\n\n推荐起点：关键词权重 0.3、向量权重 0.7，topK=10；之后根据评测集调优。详细说明见《RAG 检索流程.md》第 3 章。',
    toolCalls: [{ name: 'knowledge.search', params: { knowledgeBaseId: '1', query: '混合检索 权重', topK: '5' } }],
    createdAt: '2026-07-30 09:12',
  },
  {
    id: 3,
    conversationId: 1,
    role: 'user',
    content: 'RRF 的 k 值一般取多少？',
    createdAt: '2026-07-30 09:13',
  },
  {
    id: 4,
    conversationId: 1,
    role: 'assistant',
    content: 'RRF 的 k 值常用 60（BM25 论文默认），实践中 20~100 都可接受，越大越平滑。建议在评测集上扫一遍。',
    createdAt: '2026-07-30 09:13',
  },
  {
    id: 5,
    conversationId: 2,
    role: 'user',
    content: '请根据我这周的工作总结一篇周报。',
    createdAt: '2026-07-29 18:02',
  },
  {
    id: 6,
    conversationId: 2,
    role: 'assistant',
    content: '好的，已生成周报草稿：\n\n## 本周进展\n1. 完成知识库上传链路（支持 md/pdf/docx）\n2. 混合检索评测跑通，命中率提升 12%\n3. 搭建智能体列表页与技能绑定\n\n## 下周计划\n- 会话历史与消息反馈\n- 技能调用确认流程',
    toolCalls: [{ name: 'task.create', params: { title: '汇总周报', assignee: 'self' } }],
    createdAt: '2026-07-29 18:03',
  },
  {
    id: 7,
    conversationId: 3,
    role: 'user',
    content: '帮我看下 login 页这版 MR 有没有问题。',
    createdAt: '2026-07-29 11:30',
  },
  {
    id: 8,
    conversationId: 3,
    role: 'assistant',
    content: '审查结果：\n\n- [P1] 登录接口未做防重提交，建议按钮 loading 态\n- [P2] 错误提示直接展示后端 message，建议统一文案\n- [P2] 路由守卫未处理 token 过期后的刷新场景\n\n详见完整审查清单。',
    createdAt: '2026-07-29 11:31',
  },
  {
    id: 9,
    conversationId: 4,
    role: 'user',
    content: '新员工入职需要哪些材料？',
    createdAt: '2026-07-28 16:00',
  },
  {
    id: 10,
    conversationId: 4,
    role: 'assistant',
    content: '新员工入职需准备：身份证、学历学位证明、体检报告、银行卡信息。具体清单请咨询 HR。',
    createdAt: '2026-07-28 16:01',
  },
]

// ---------- 工具函数 ----------

let docSeq = knowledgeDocs.reduce((max, d) => Math.max(max, d.id), 0)
let convSeq = conversations.reduce((max, c) => Math.max(max, c.id), 0)
let msgSeq = messages.reduce((max, m) => Math.max(max, m.id), 0)

export function nextDocId() {
  return ++docSeq
}
export function nextConvId() {
  return ++convSeq
}
export function nextMsgId() {
  return ++msgSeq
}

/** 登录令牌校验：mock 阶段前端固定携带 `Bearer mock-token-*` */
export function isMockToken(token?: string): boolean {
  return !!token && token.startsWith('mock-token-')
}

/** 简易延迟，模拟网络往返 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
