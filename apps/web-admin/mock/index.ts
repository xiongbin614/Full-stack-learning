/**
 * mock/index.ts — web-admin Mock 插件（开发模式拦截 /api 请求）
 *
 * 机制：vite dev server 中间件，在代理之前拦截所有 /api 请求，
 * 按路由表匹配并返回与后端一致的 Result<T> JSON。
 *
 * 切换真实后端：将 .env.development 的 VITE_USE_MOCK 改为 false，
 * 请求即走 vite.config.ts 中的 /api 代理到真实 server。
 */

import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { routes, pushLog, type MockContext } from './routes'
import { isMockToken, sleep } from './db'

/** 无需登录态即可访问的路径 */
const PUBLIC_PATHS = [/^\/api\/auth\/login$/]

const MODULE_MAP: Array<[RegExp, string]> = [
  [/^\/api\/users/, '用户管理'],
  [/^\/api\/roles/, '角色管理'],
  [/^\/api\/permissions/, '权限管理'],
  [/^\/api\/logs/, '日志管理'],
  [/^\/api\/auth/, '认证'],
  [/^\/api\/dashboard/, '工作台'],
]

function isPublic(path: string) {
  return PUBLIC_PATHS.some((p) => p.test(path))
}

function moduleOf(path: string): string {
  const hit = MODULE_MAP.find(([re]) => re.test(path))
  return hit ? hit[1] : '其他'
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk: Buffer) => {
      raw += chunk
      if (raw.length > 1024 * 1024) {
        resolve('')
        req.destroy()
      }
    })
    req.on('end', () => resolve(raw))
    req.on('error', () => resolve(''))
  })
}

export function mockPlugin(): Plugin {
  return {
    name: 'web-admin-mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = (req.url || '').split('?')[0]
        if (!url.startsWith('/api/')) {
          return next()
        }

        const method = (req.method || 'GET').toUpperCase()

        // 登录态校验（模拟后端 401）
        if (!isPublic(url)) {
          const auth = req.headers['authorization'] || ''
          const token = auth.replace(/^Bearer\s+/i, '')
          if (!isMockToken(token)) {
            return sendJson(res, 401, {
              code: 401,
              message: '暂未登录或 token 已过期',
              data: null,
              timestamp: Date.now(),
            })
          }
        }

        const route = routes.find((r) => r.method === method && r.pattern.test(url))
        if (!route) {
          return sendJson(res, 404, {
            code: 404,
            message: `Mock 未实现: ${method} ${url}`,
            data: null,
            timestamp: Date.now(),
          })
        }

        // 解析 query
        const query: Record<string, string> = {}
        const queryStr = (req.url || '').split('?')[1]
        if (queryStr) {
          for (const pair of queryStr.split('&')) {
            const [k, v] = pair.split('=')
            if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '')
          }
        }

        // 解析 body
        const rawBody = await readBody(req)
        let body: Record<string, unknown> = {}
        if (rawBody) {
          try {
            body = JSON.parse(rawBody)
          } catch {
            body = {}
          }
        }

        const match = route.pattern.exec(url)!
        const ctx: MockContext = {
          params: match.slice(1).map((s) => s ?? ''),
          query,
          body,
          headers: req.headers as Record<string, string | undefined>,
        }

        try {
          const result = await Promise.race([
            Promise.resolve(route.handler(ctx)),
            sleep(2000).then(() => ({ code: 500, message: 'Mock 处理超时', data: null, timestamp: Date.now() })),
          ])
          // 写操作成功后追加操作日志（演示用）
          if (method !== 'GET' && url !== '/api/auth/login' && result && (result as { code: number }).code === 200) {
            const operator = isMockToken(req.headers['authorization'] || '')
              ? String(req.headers['authorization']).replace(/^Bearer mock-token-/, '')
              : 'anonymous'
            pushLog({ operator, module: moduleOf(url), action: `${method} ${url}`, method, url })
          }
          return sendJson(res, 200, result)
        } catch (err) {
          return sendJson(res, 500, {
            code: 500,
            message: `Mock 内部错误: ${err instanceof Error ? err.message : String(err)}`,
            data: null,
            timestamp: Date.now(),
          })
        }
      })
    },
  }
}
