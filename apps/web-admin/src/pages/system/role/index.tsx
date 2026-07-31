import { useCallback, useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tree,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import * as systemApi from '@/api/system'
import type { Permission, Role } from '@/types/user'

export default function RoleManagePage() {
  const { message } = App.useApp()
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)

  // 弹窗
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [form] = Form.useForm()
  const [checkedPermIds, setCheckedPermIds] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [roleList, permList] = await Promise.all([systemApi.getRoles(), systemApi.getPermissions()])
      setRoles(roleList)
      setPermissions(permList)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  /** 权限点 → Tree 节点 */
  const treeData: DataNode[] = (() => {
    const permNodes = permissions
      .filter((p) => p.type === 'menu' || p.type === 'perm')
      .sort((a, b) => a.sort - b.sort)
      .map((p) => ({
        key: p.id,
        title: `${p.name}${p.type === 'perm' ? `（${p.code}）` : ''}`,
      }))
    return permNodes.filter((node) => {
      // 只保留根节点（树默认只展开根，避免重复）
      const p = permissions.find((x) => x.id === node.key)
      return p && p.parentId === 0
    })
  })()

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setCheckedPermIds([])
    setModalOpen(true)
  }

  const openEdit = (record: Role) => {
    setEditing(record)
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description,
    })
    setCheckedPermIds(record.permissionIds)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    setSubmitting(true)
    try {
      if (editing) {
        await systemApi.updateRole(editing.id, {
          name: values.name,
          description: values.description,
          permissionIds: checkedPermIds,
        })
        message.success('角色更新成功')
      } else {
        await systemApi.createRole({
          name: values.name,
          code: values.code,
          description: values.description,
          permissionIds: checkedPermIds,
          status: 1,
        })
        message.success('角色创建成功')
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
      await systemApi.deleteRole(id)
      message.success('删除成功')
      fetchData()
    } catch {
      // 忽略
    }
  }

  const columns: ColumnsType<Role> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '角色名称', dataIndex: 'name', width: 150 },
    {
      title: '角色编码',
      dataIndex: 'code',
      width: 140,
      render: (v) => <Tag color="geekblue">{v}</Tag>,
    },
    { title: '描述', dataIndex: 'description', render: (v) => v || '-' },
    {
      title: '权限数',
      dataIndex: 'permissionIds',
      width: 100,
      render: (ids: number[]) => <Tag>{ids?.length ?? 0} 个权限</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v) => (v === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除该角色？"
            description="删除后绑定该角色的用户将失去对应权限"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="角色管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建角色
        </Button>
      }
    >
      <Table<Role> rowKey="id" loading={loading} columns={columns} dataSource={roles} />

      {/* 创建 / 编辑弹窗 */}
      <Modal
        title={editing ? '编辑角色' : '新建角色'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="如：运营人员" maxLength={32} />
          </Form.Item>
          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[A-Z_]+$/, message: '编码须为大写字母和下划线，如 ADMIN' },
            ]}
          >
            <Input placeholder="如：ADMIN" disabled={!!editing} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="可选" maxLength={200} />
          </Form.Item>
          <Form.Item label="绑定权限">
            <div
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                padding: 8,
                maxHeight: 260,
                overflow: 'auto',
              }}
            >
              <Tree
                checkable
                checkedKeys={checkedPermIds}
                onCheck={(checked) => setCheckedPermIds(checked as number[])}
                treeData={treeData}
                defaultExpandAll={false}
                selectable={false}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
              <SafetyOutlined /> 勾选该角色可访问的菜单与操作权限
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
