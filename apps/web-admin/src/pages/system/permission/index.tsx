import { useCallback, useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import * as systemApi from '@/api/system'
import type { Permission } from '@/types/user'

const TYPE_OPTIONS = [
  { value: 'menu', label: '菜单' },
  { value: 'perm', label: '按钮权限' },
]

export default function PermissionManagePage() {
  const { message } = App.useApp()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Permission | null>(null)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const list = await systemApi.getPermissions()
      setPermissions(list)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ parentId: 1, type: 'menu', sort: 1 })
    setModalOpen(true)
  }

  const openEdit = (record: Permission) => {
    setEditing(record)
    form.setFieldsValue({
      parentId: record.parentId,
      name: record.name,
      code: record.code,
      type: record.type,
      path: record.path,
      icon: record.icon,
      sort: record.sort,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      if (editing) {
        await systemApi.updatePermission(editing.id, values)
        message.success('权限更新成功')
      } else {
        await systemApi.createPermission(values)
        message.success('权限创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch {
      // 忽略
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await systemApi.deletePermission(id)
      message.success('删除成功')
      fetchData()
    } catch {
      // 忽略
    }
  }

  const columns: ColumnsType<Permission> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 110,
      render: (t: string) => (t === 'menu' ? <Tag color="blue">菜单</Tag> : <Tag color="orange">按钮权限</Tag>),
    },
    { title: '名称', dataIndex: 'name', width: 160 },
    {
      title: '权限码',
      dataIndex: 'code',
      width: 200,
      render: (v) => <Tag>{v}</Tag>,
    },
    { title: '父级 ID', dataIndex: 'parentId', width: 90, render: (v) => (v === 0 ? '-' : v) },
    { title: '路由', dataIndex: 'path', width: 160, render: (v) => v || '-' },
    { title: '图标', dataIndex: 'icon', width: 120, render: (v) => v || '-' },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="确定删除该权限？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="权限管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新增权限
        </Button>
      }
    >
      <Table<Permission>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={permissions}
        expandable={{ defaultExpandAllRows: false }}
        pagination={false}
      />

      <Modal
        title={editing ? '编辑权限' : '新增权限'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="parentId" label="父级 ID" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0 表示根节点" />
          </Form.Item>
          <Form.Item name="name" label="权限名称" rules={[{ required: true, message: '请输入权限名称' }]}>
            <Input placeholder="如：用户管理" maxLength={32} />
          </Form.Item>
          <Form.Item name="code" label="权限码" rules={[{ required: true, message: '请输入权限码' }]}>
            <Input placeholder="如：system:user:create" maxLength={64} />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select options={TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="path"
            label="前端路由"
            dependencies={['type']}
            rules={[({ getFieldValue }) => ({
              validator: (_, value) =>
                getFieldValue('type') === 'menu' && !value
                  ? Promise.reject(new Error('菜单类型需填写路由'))
                  : Promise.resolve(),
            })]}
          >
            <Input placeholder="如：/system/user" />
          </Form.Item>
          <Form.Item name="icon" label="图标名">
            <Input placeholder="如：SettingOutlined（菜单类型）" />
          </Form.Item>
          <Form.Item name="sort" label="排序" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
