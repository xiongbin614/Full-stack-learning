import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useMock = env.VITE_USE_MOCK !== 'false'

  // mock 插件仅在开发模式 + VITE_USE_MOCK=true 时加载，
  // 关闭它（VITE_USE_MOCK=false）即可走下方 /api 代理联调真实后端。
  const plugins = [vue()]
  if (useMock) {
    const { mockPlugin } = await import('./mock')
    plugins.push(mockPlugin())
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        // 代理到 server 后端（Spring Boot，context-path=/api）。
        // 注意：mock 中间件优先于代理生效，useMock=true 时不会真正转发。
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
    },
  }
})
