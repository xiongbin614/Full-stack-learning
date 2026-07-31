/**
 * mock/routes.ts — 接口路由表
 *
 * 每个路由：method + 正则匹配路径，handler 返回统一 Result 结构
 * `{ code, message, data, timestamp }`（与后端 Result<T> 对齐）。
 *
 * 路径参数通过 pattern 捕获组解析，示例：`^/api/knowledge/(\\d+)$` → params[0]
 */

import {
  users,
  knowledgeBases,
  knowledgeDocs,
  agents,
  skills,
  conversations,
  messages,
  nextDocId,
  nextConvId,
  nextMsgId,
  sleep,
  type Agent,
  type ChatMessage,
  type Conversation,
  type DashboardStats,
  type KnowledgeBase,
  type KnowledgeDoc,
} from './db'

export interface MockContext {
  /** URL 路径参数（正则捕获组） */
  params: string[]
  /** query string 解析结果 */
  query: Record<string, string>
  /** 请求体（JSON 已解析） */
  body: any
  /** 请求头（小写键名） */
  headers: Record<string, string | undefined>
}

export type MockHandler = (ctx: MockContext) => Promise<unknown> | unknown

export interface MockRoute {
  method: string
  pattern: RegExp
  handler: MockHandler
}

// ---------- 统一响应体（与后端 Result<T> 对齐） ----------

function ok<T>(data: T, message = '操作成功') {
  return { code: 200, message, data, timestamp: Date.now() }
}

function fail(code: number, message: string) {
  return { code, message, data: null, timestamp: Date.now() }
}

function pageResult<T>(list: T[], total: number, pageNum: number, pageSize: number) {
  return { list, total, pageNum, pageSize }
}

/** 把数组按 page/size 切片 */
function slicePage<T>(arr: T[], pageNum: number, pageSize: number) {
  const num = Math.max(1, pageNum)
  const size = Math.max(1, pageSize)
  return { list: arr.slice((num - 1) * size, num * size), total: arr.length, pageNum: num, pageSize: size }
}

/** 从 ctx 中取分页参数 */
function paging(ctx: MockContext) {
  return { page: Number(ctx.query.page || 1), size: Number(ctx.query.size || 10) }
}

/** 判断可见性：personal 仅当前 mock 用户可见（这里简化为都可见） */
function visibleKbs(): KnowledgeBase[] {
  return knowledgeBases
}

// ---------- 路由表 ----------

export const routes: MockRoute[] = [
  // ===== 认证 =====
  {
    method: 'POST',
    pattern: /^\/api\/auth\/login$/,
    handler: async (ctx) => {
      await sleep(500)
      const { username = '', password = '' } = ctx.body || {}
      const user = users.find((u) => u.username === username && u.password === password)
      if (!user) {
        return fail(400, '用户名或密码错误')
      }
      return ok(
        {
          username: user.username,
          nickname: user.nickname,
          role: user.role,
          message: '登录成功（Mock）',
        },
        '登录成功',
      )
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/auth\/logout$/,
    handler: async () => {
      await sleep(200)
      return ok(null, '已退出登录')
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/auth\/me$/,
    handler: (ctx) => {
      const token = ctx.headers['authorization'] || ''
      const username = token.replace(/^Bearer mock-token-/, '')
      const user = users.find((u) => u.username === username) || users[0]
      return ok({ username: user.username, nickname: user.nickname, role: user.role })
    },
  },

  // ===== 知识广场 =====
  {
    method: 'GET',
    pattern: /^\/api\/knowledge$/,
    handler: async (ctx) => {
      await sleep(300)
      const { page, size } = paging(ctx)
      const keyword = (ctx.query.keyword || '').trim()
      let list = visibleKbs()
      if (keyword) {
        list = list.filter((kb) => kb.name.includes(keyword) || kb.description.includes(keyword))
      }
      const sliced = slicePage(list, page, size)
      return ok(pageResult(sliced.list, sliced.total, page, size))
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/knowledge$/,
    handler: async (ctx) => {
      await sleep(400)
      const { name, description = '', visibility = 'personal' } = ctx.body || {}
      if (!name) return fail(400, '知识库名称不能为空')
      const kb: KnowledgeBase = {
        id: knowledgeBases.reduce((max, k) => Math.max(max, k.id), 0) + 1,
        name,
        description,
        docCount: 0,
        visibility: visibility === 'org' ? 'org' : 'personal',
        status: 'ready',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }
      knowledgeBases.unshift(kb)
      return ok(kb, '创建成功')
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/knowledge\/(\d+)$/,
    handler: (ctx) => {
      const kb = visibleKbs().find((k) => k.id === Number(ctx.params[0]))
      return kb ? ok(kb) : fail(404, '知识库不存在')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/knowledge\/(\d+)$/,
    handler: (ctx) => {
      const kb = knowledgeBases.find((k) => k.id === Number(ctx.params[0]))
      if (!kb) return fail(404, '知识库不存在')
      const { name, description, visibility } = ctx.body || {}
      if (name) kb.name = name
      if (description !== undefined) kb.description = description
      if (visibility) kb.visibility = visibility
      kb.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16)
      return ok(kb, '更新成功')
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/knowledge\/(\d+)$/,
    handler: (ctx) => {
      const idx = knowledgeBases.findIndex((k) => k.id === Number(ctx.params[0]))
      if (idx === -1) return fail(404, '知识库不存在')
      knowledgeBases.splice(idx, 1)
      return ok(null, '删除成功')
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/knowledge\/(\d+)\/docs$/,
    handler: async (ctx) => {
      await sleep(300)
      const kbId = Number(ctx.params[0])
      const { page, size } = paging(ctx)
      const docs = knowledgeDocs.filter((d) => d.kbId === kbId)
      const sliced = slicePage(docs, page, size)
      return ok(pageResult(sliced.list, sliced.total, page, size))
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/knowledge\/(\d+)\/docs$/,
    handler: async (ctx) => {
      await sleep(600)
      const kbId = Number(ctx.params[0])
      const { name = '未命名文档', type = 'md', size = 0 } = ctx.body || {}
      if (!knowledgeBases.some((k) => k.id === kbId)) return fail(404, '知识库不存在')
      const doc: KnowledgeDoc = {
        id: nextDocId(),
        kbId,
        name,
        type,
        size,
        status: 'parsing',
        chunks: 0,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }
      knowledgeDocs.unshift(doc)
      // 模拟异步解析：2 秒后变为 ready，chunks 随机
      setTimeout(() => {
        doc.status = 'ready'
        doc.chunks = Math.floor(Math.random() * 40) + 5
        const kb = knowledgeBases.find((k) => k.id === kbId)
        if (kb) kb.docCount += 1
      }, 2000)
      return ok(doc, '上传成功，解析中')
    },
  },

  // ===== 智能体 =====
  {
    method: 'GET',
    pattern: /^\/api\/agents$/,
    handler: async (ctx) => {
      await sleep(300)
      const { page, size } = paging(ctx)
      const keyword = (ctx.query.keyword || '').trim()
      let list = agents
      if (keyword) list = agents.filter((a) => a.name.includes(keyword) || a.description.includes(keyword))
      const sliced = slicePage(list, page, size)
      return ok(pageResult(sliced.list, sliced.total, page, size))
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/agents$/,
    handler: async (ctx) => {
      await sleep(400)
      const { name, description = '', knowledgeBaseIds = [], skillIds = [], model = 'deepseek-v3.2', temperature = 0.3 } = ctx.body || {}
      if (!name) return fail(400, '智能体名称不能为空')
      const agent: Agent = {
        id: agents.reduce((max, a) => Math.max(max, a.id), 0) + 1,
        name,
        description,
        knowledgeBaseIds,
        skillIds,
        model,
        temperature,
        status: 'enabled',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }
      agents.unshift(agent)
      return ok(agent, '创建成功')
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/agents\/(\d+)$/,
    handler: (ctx) => {
      const agent = agents.find((a) => a.id === Number(ctx.params[0]))
      if (!agent) return fail(404, '智能体不存在')
      const { name, description, knowledgeBaseIds, skillIds, model, temperature, status } = ctx.body || {}
      if (name) agent.name = name
      if (description !== undefined) agent.description = description
      if (knowledgeBaseIds) agent.knowledgeBaseIds = knowledgeBaseIds
      if (skillIds) agent.skillIds = skillIds
      if (model) agent.model = model
      if (temperature !== undefined) agent.temperature = temperature
      if (status) agent.status = status
      agent.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16)
      return ok(agent, '更新成功')
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/agents\/(\d+)$/,
    handler: (ctx) => {
      const idx = agents.findIndex((a) => a.id === Number(ctx.params[0]))
      if (idx === -1) return fail(404, '智能体不存在')
      agents.splice(idx, 1)
      return ok(null, '删除成功')
    },
  },

  // ===== 技能管理 =====
  {
    method: 'GET',
    pattern: /^\/api\/skills$/,
    handler: async (ctx) => {
      await sleep(300)
      const { page, size } = paging(ctx)
      const keyword = (ctx.query.keyword || '').trim()
      let list = skills
      if (keyword) list = skills.filter((s) => s.name.includes(keyword) || s.description.includes(keyword))
      const sliced = slicePage(list, page, size)
      return ok(pageResult(sliced.list, sliced.total, page, size))
    },
  },
  {
    method: 'PUT',
    pattern: /^\/api\/skills\/(\d+)\/status$/,
    handler: (ctx) => {
      const skill = skills.find((s) => s.id === Number(ctx.params[0]))
      if (!skill) return fail(404, '技能不存在')
      const { enabled } = ctx.body || {}
      if (typeof enabled !== 'boolean') return fail(400, '参数错误')
      skill.status = enabled ? 'enabled' : 'disabled'
      skill.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16)
      return ok(skill, enabled ? '已启用' : '已停用')
    },
  },

  // ===== 会话 =====
  {
    method: 'GET',
    pattern: /^\/api\/conversations$/,
    handler: async () => {
      await sleep(200)
      return ok([...conversations].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)))
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/conversations$/,
    handler: (ctx) => {
      const { title = '新对话', agentId } = ctx.body || {}
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
      const conv: Conversation = {
        id: nextConvId(),
        title,
        agentId,
        messageCount: 0,
        createdAt: now,
        updatedAt: now,
      }
      conversations.unshift(conv)
      return ok(conv, '创建成功')
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/conversations\/(\d+)$/,
    handler: (ctx) => {
      const idx = conversations.findIndex((c) => c.id === Number(ctx.params[0]))
      if (idx === -1) return fail(404, '会话不存在')
      conversations.splice(idx, 1)
      return ok(null, '删除成功')
    },
  },
  {
    method: 'GET',
    pattern: /^\/api\/conversations\/(\d+)\/messages$/,
    handler: (ctx) => {
      const convId = Number(ctx.params[0])
      const list = messages.filter((m) => m.conversationId === convId)
      return ok(list)
    },
  },

  // ===== 对话 =====
  {
    method: 'POST',
    pattern: /^\/api\/chat$/,
    handler: async (ctx) => {
      await sleep(900)
      const { content = '', conversationId, agentId } = ctx.body || {}
      const text = String(content || '').trim()
      if (!text) return fail(400, '消息内容不能为空')

      const now = new Date().toISOString().replace('T', ' ').slice(0, 16)
      let convId = Number(conversationId)

      // 无会话则自动新建
      if (!convId || !conversations.some((c) => c.id === convId)) {
        const conv: Conversation = {
          id: nextConvId(),
          title: text.slice(0, 20) + (text.length > 20 ? '…' : ''),
          agentId: Number(agentId) || undefined,
          messageCount: 0,
          createdAt: now,
          updatedAt: now,
        }
        conversations.unshift(conv)
        convId = conv.id
      }

      // 用户消息入库
      const userMsg: ChatMessage = {
        id: nextMsgId(),
        conversationId: convId,
        role: 'user',
        content: text,
        createdAt: now,
      }
      messages.push(userMsg)
      const conv = conversations.find((c) => c.id === convId)
      if (conv) conv.messageCount += 1

      // 生成助手回复（关键词规则，模拟 RAG / 工具调用）
      const reply = buildReply(text)
      const assistantMsg: ChatMessage = {
        id: nextMsgId(),
        conversationId: convId,
        role: 'assistant',
        content: reply.content,
        toolCalls: reply.toolCalls,
        createdAt: now,
      }
      messages.push(assistantMsg)
      if (conv) {
        conv.messageCount += 1
        conv.updatedAt = now
      }

      return ok({ ...assistantMsg, conversationId: convId }, '发送成功')
    },
  },

  // ===== 工作台 =====
  {
    method: 'GET',
    pattern: /^\/api\/dashboard\/stats$/,
    handler: async () => {
      await sleep(250)
      const stats: DashboardStats = {
        todayConversations: 12,
        todayMessages: 86,
        todayTokens: 24800,
        knowledgeBaseCount: knowledgeBases.length,
        agentCount: agents.length,
        skillCount: skills.length,
        recentConversations: [...conversations]
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .slice(0, 5),
      }
      return ok(stats)
    },
  },
]

// ---------- 对话回复生成（简易规则） ----------

interface AssistantReply {
  content: string
  toolCalls?: ChatMessage['toolCalls']
}

function buildReply(text: string): AssistantReply {
  const lower = text.toLowerCase()
  if (lower.includes('rff') || lower.includes('rrf')) {
    return {
      content:
        'RRF（Reciprocal Rank Fusion）合并排序时 k 值通常取 60，实践中 20~100 均可接受；k 越大排序越平滑，反之越接近各自榜单的头部顺序。建议在评测集上对 k 扫一遍。',
      toolCalls: [{ name: 'knowledge.search', params: { knowledgeBaseId: '1', query: 'RRF k 值', topK: '3' } }],
    }
  }
  if (lower.includes('混合检索') || lower.includes('hybrid')) {
    return {
      content:
        '混合检索 = BM25 关键词 + 向量检索，常用 RRF 合并。推荐起点：关键词权重 0.3、向量权重 0.7，topK=10，之后按评测集调优。详见《RAG 检索流程.md》第 3 章。',
      toolCalls: [{ name: 'knowledge.search', params: { knowledgeBaseId: '1', query: '混合检索 权重配置', topK: '5' } }],
    }
  }
  if (lower.includes('周报') || lower.includes('weekly')) {
    return {
      content:
        '已为你生成周报草稿：\n\n## 本周进展\n1. 完成知识库上传链路（md/pdf/docx）\n2. 混合检索评测跑通，命中率提升 12%\n3. 智能体列表页与技能绑定\n\n## 下周计划\n- 会话历史与消息反馈\n- 技能调用确认流程',
      toolCalls: [{ name: 'task.create', params: { title: '整理周报', assignee: 'self' } }],
    }
  }
  if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi')) {
    return {
      content: '你好！我是 web-pc 的 Mock 助手。目前处于 Mock 数据阶段，尚未联调真实后端。你可以试试问我「混合检索怎么配置」「RRF k 值」或「帮我写周报」。',
    }
  }
  if (lower.includes('mr') || lower.includes('代码审查') || lower.includes('审查')) {
    return {
      content:
        '审查结果（Mock 示例）：\n\n- [P1] 登录接口未做防重提交，建议按钮 loading 态\n- [P2] 错误提示直接展示后端 message，建议统一文案\n- [P2] 路由守卫未处理 token 过期后的刷新场景',
      toolCalls: [{ name: 'web.fetch', params: { url: 'https://example.com/mr/123', maxChars: '20000' } }],
    }
  }
  return {
    content:
      '这是 Mock 回复：我已收到你的问题「' +
      text.slice(0, 50) +
      '」。当前处于前端 Mock 阶段，回答由本地规则生成；联调后端后将接入真实模型与 RAG 检索。',
  }
}
