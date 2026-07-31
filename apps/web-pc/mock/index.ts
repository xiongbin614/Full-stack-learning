/**
 * mock/index.ts — web-pc Mock 插件（开发模式拦截 /api 请求）
 *
 * 机制：vite dev server 中间件，在代理之前拦截所有 /api 请求，
 * 按路由表匹配并返回与后端一致的 Result<T> JSON。
 *
 * 切换真实后端：将 .env.development 的 VITE_USE_MOCK 改为 false，
 * 请求即走 vite.config.ts 中的 /api 代理到真实 server。
 */

import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { routes, type MockContext } from './routes'
import { isMockToken, sleep } from './db'

/** 无需登录态即可访问的路径 */
const PUBLIC_PATHS = [/^\/api\/auth\/login$/]

function isPublic(path: string) {
  return PUBLIC_PATHS.some((p) => p.test(path))
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
    name: 'web-pc-mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = (req.url || '').split('?')[0]
        // 仅拦截 /api 请求，其余交给 vite（静态资源等）
        if (!url.startsWith('/api/')) {
          return next()
        }

        const method = (req.method || 'GET').toUpperCase()

        // 登录态校验（模拟后端 401）
        if (!isPublic(url)) {
          const auth = req.headers['authorization'] || ''
          const token = auth.replace(/^Bearer\s+/i, '')
          if (!isMockToken(token)) {
            // 与后端 ResultCode.UNAUTHORIZED 对齐
            return sendJson(res, 401, {
              code: 401,
              message: '暂未登录或 token 已过期',
              data: null,
              timestamp: Date.now(),
            })
          }
        }

        // 路由匹配
        const route = routes.find((r) => r.method === method && r.pattern.test(url))
        if (!route) {
          return sendJson(res, 404, {
            code: 404,
            message: `Mock 未实现: ${method} ${url}`,
            data: null,
            timestamp: Date.now(),
          })
        }

        // 解析 query / body / params
        const query: Record<string, string> = {}
        const queryStr = (req.url || '').split('?')[1]
        if (queryStr) {
          for (const pair of queryStr.split('&')) {
            const [k, v] = pair.split('=')
            if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '')
          }
        }

        const rawBody = await readBody(req)
        const body = rawBody ? JSON.parse(rawBody) : {}

        const match = route.pattern.exec(url)!
        const ctx: MockContext = {
          params: match.slice(1).map((s) => s ?? ''),
          query,
          body,
          headers: req.headers as Record<string, string | undefined>,
        }

        try {
          // 给处理器一个默认 2 秒的兜底超时，避免卡死 dev server
          const result = await Promise.race([
            Promise.resolve(route.handler(ctx)),
            sleep(2000).then(() => ({ code: 500, message: 'Mock 处理超时', data: null, timestamp: Date.now() })),
          ])
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
