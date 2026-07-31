import { Card, Col, Row, Statistic, Tag } from 'antd'
import {
  TeamOutlined,
  SafetyOutlined,
  KeyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>
          欢迎回来，{user?.nickname || user?.username || '管理员'} 👋
        </h2>
        <p style={{ color: '#666' }}>
          当前时间：{dayjs().format('YYYY年MM月DD日 HH:mm:ss')}
          &nbsp;&nbsp;<Tag color="green">系统运行正常</Tag>
        </p>
      </Card>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="用户总数" value={0} prefix={<TeamOutlined />} suffix="人" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="角色数量" value={0} prefix={<SafetyOutlined />} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="权限点" value={0} prefix={<KeyOutlined />} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日操作日志" value={0} prefix={<ThunderboltOutlined />} suffix="条" />
          </Card>
        </Col>
      </Row>

      <Card title="开发进度" style={{ marginTop: 16 }}>
        <ul style={{ paddingLeft: 20, lineHeight: 2.2, color: '#555' }}>
          <li>✅ P0：登录 / 用户管理 / 角色管理 / 权限管理 / 动态菜单</li>
          <li>🔄 P1：日志管理（占位）、个人中心、系统参数</li>
          <li>⏳ P2：部署中心（等 Docker 部署跑通后开发）</li>
          <li>📌 说明：角色/权限接口当前为前端 mock，待 server 实现 RBAC 后对接</li>
        </ul>
      </Card>
    </div>
  )
}
