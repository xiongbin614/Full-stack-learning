import { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic, Tag } from 'antd'
import {
  TeamOutlined,
  SafetyOutlined,
  KeyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuthStore } from '@/store/authStore'
import { getDashboardStats } from '@/api/system'
import type { DashboardStats } from '@/types/user'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {
        // 拦截器已提示
      })
  }, [])

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>
          欢迎回来，{user?.nickname || user?.username || '管理员'} 👋
        </h2>
        <p style={{ color: '#666' }}>
          当前时间：{dayjs().format('YYYY年MM月DD日 HH:mm:ss')}
          &nbsp;&nbsp;<Tag color="green">系统运行正常</Tag>
          &nbsp;&nbsp;<Tag color="cyan">Mock 数据</Tag>
        </p>
      </Card>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats?.userTotal ?? 0}
              prefix={<TeamOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="角色数量"
              value={stats?.roleCount ?? 0}
              prefix={<SafetyOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="权限点"
              value={stats?.permissionCount ?? 0}
              prefix={<KeyOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日操作日志"
              value={stats?.todayLogs ?? 0}
              prefix={<ThunderboltOutlined />}
              suffix="条"
            />
          </Card>
        </Col>
      </Row>

      <Card title="开发进度" style={{ marginTop: 16 }}>
        <ul style={{ paddingLeft: 20, lineHeight: 2.2, color: '#555' }}>
          <li>✅ P0：登录 / 用户管理 / 角色管理 / 权限管理 / 动态菜单</li>
          <li>✅ P1：日志管理（操作日志列表 / 搜索 / 分页）</li>
          <li>🔄 P2：部署中心（等 Docker 部署跑通后开发）</li>
          <li>📌 说明：当前全部接口为前端 Mock（vite 插件拦截 /api），后端按
            <code> apps/web-admin/mock/routes.ts </code>
            契约实现后，将 <code>.env.development</code> 的 <code>VITE_USE_MOCK</code> 改为
            <code> false </code>即可联调
          </li>
        </ul>
      </Card>
    </div>
  )
}
