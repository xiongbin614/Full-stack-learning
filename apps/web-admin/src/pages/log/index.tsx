import { Card, Empty, Tag } from 'antd'

/**
 * 日志管理（P1）
 * 登录日志 / 操作日志：后端实现后对接 /logs 接口
 */
export default function LogPage() {
  return (
    <Card title="日志管理" extra={<Tag>P1 · 待后端实现</Tag>}>
      <Empty description="登录日志与操作日志功能开发中，后端接口就绪后在此展示" />
    </Card>
  )
}
