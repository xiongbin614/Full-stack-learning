import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Form, Input, Select, Space, Table, Tag, type TableProps } from 'antd'
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getLogs } from '@/api/system'
import type { OperationLog } from '@/types/user'

const MODULE_OPTIONS = [
  { value: '用户管理', label: '用户管理' },
  { value: '角色管理', label: '角色管理' },
  { value: '权限管理', label: '权限管理' },
  { value: '日志管理', label: '日志管理' },
  { value: '认证', label: '认证' },
  { value: '工作台', label: '工作台' },
  { value: '其他', label: '其他' },
]

export default function LogPage() {
  const [searchForm] = Form.useForm()

  const [data, setData] = useState<OperationLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<{ page: number; size: number; keyword?: string; module?: string }>({
    page: 0,
    size: 10,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getLogs(query)
      setData(res.list)
      setTotal(res.total)
    } catch {
      // 拦截器已提示
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onSearch = () => {
    const values = searchForm.getFieldsValue()
    setQuery((prev) => ({
      ...prev,
      page: 0,
      keyword: values.keyword || undefined,
      module: values.module || undefined,
    }))
  }

  const onReset = () => {
    searchForm.resetFields()
    setQuery({ page: 0, size: 10 })
  }

  const columns: ColumnsType<OperationLog> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '操作人', dataIndex: 'operator', width: 110 },
    { title: '模块', dataIndex: 'module', width: 110, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '动作', dataIndex: 'action', width: 160 },
    {
      title: '方法',
      dataIndex: 'method',
      width: 80,
      render: (v: string) => (
        <Tag color={v === 'GET' ? 'green' : v === 'POST' ? 'geekblue' : v === 'PUT' ? 'orange' : 'red'}>{v}</Tag>
      ),
    },
    { title: 'URL', dataIndex: 'url', ellipsis: true },
    {
      title: '结果',
      dataIndex: 'status',
      width: 80,
      render: (v: number) => (v === 1 ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag>),
    },
    { title: 'IP', dataIndex: 'ip', width: 110 },
    {
      title: '耗时',
      dataIndex: 'cost',
      width: 90,
      align: 'right',
      render: (v: number) => `${v}ms`,
    },
    { title: '时间', dataIndex: 'createTime', width: 170, render: (v: string) => v?.replace('T', ' ') },
  ]

  const pagination: TableProps<OperationLog>['pagination'] = {
    current: query.page + 1,
    pageSize: query.size,
    total,
    showSizeChanger: true,
    showTotal: (t) => `共 ${t} 条`,
    onChange: (page, size) => setQuery((prev) => ({ ...prev, page: page - 1, size })),
  }

  return (
    <Card
      title="日志管理"
      extra={
        <Space>
          <Tag color="cyan">Mock 数据</Tag>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            刷新
          </Button>
        </Space>
      }
    >
      {/* 搜索栏 */}
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="keyword" label="关键字">
          <Input
            placeholder="操作人 / 动作 / URL"
            allowClear
            style={{ width: 220 }}
            onPressEnter={onSearch}
          />
        </Form.Item>
        <Form.Item name="module" label="模块">
          <Select
            placeholder="全部模块"
            allowClear
            options={MODULE_OPTIONS}
            style={{ width: 140 }}
            onChange={onSearch}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table<OperationLog>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        scroll={{ x: 1200 }}
        size="small"
      />
    </Card>
  )
}
