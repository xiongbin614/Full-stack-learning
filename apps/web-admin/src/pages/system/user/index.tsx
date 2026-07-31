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
  Switch,
  Table,
  Tag,
  Tooltip,
  type TableProps,
} from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import * as userApi from '@/api/user'
import type { User, UserCreateRequest, UserUpdateRequest } from '@/types/user'

interface QueryParams {
  page: number
  size: number
  username?: string
}

export default function UserManagePage() {
  const { message } = App.useApp()
  const [searchForm] = Form.useForm()

  // 列表数据
  const [data, setData] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<QueryParams>({ page: 0, size: 10 })

  // 弹窗状态
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [modalForm] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  // 重置密码弹窗
  const [pwdUser, setPwdUser] = useState<User | null>(null)
  const [pwdForm] = Form.useForm()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userApi.getUsers(query)
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
    setQuery((prev) => ({ ...prev, page: 0, username: values.username || undefined }))
  }

  const onReset = () => {
    searchForm.resetFields()
    setQuery({ page: 0, size: 10 })
  }

  // ---------- 创建 / 编辑 ----------
  const openCreate = () => {
    setEditing(null)
    modalForm.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: User) => {
    setEditing(record)
    modalForm.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      email: record.email,
      phone: record.phone,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await modalForm.validateFields()
    setSubmitting(true)
    try {
      if (editing) {
        const payload: UserUpdateRequest = {
          nickname: values.nickname,
          email: values.email,
          phone: values.phone,
        }
        await userApi.updateUser(editing.id, payload)
        message.success('编辑成功')
      } else {
        const payload: UserCreateRequest = {
          username: values.username,
          password: values.password,
          nickname: values.nickname,
          email: values.email,
          phone: values.phone,
        }
        await userApi.createUser(payload)
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch {
      // 拦截器已提示
    } finally {
      setSubmitting(false)
    }
  }

  // ---------- 禁用 / 启用 ----------
  const handleStatusChange = async (record: User, checked: boolean) => {
    try {
      await userApi.updateUserStatus(record.id, checked ? 1 : 0)
      message.success(checked ? '已启用' : '已禁用')
      fetchData()
    } catch {
      // 拦截器已提示
    }
  }

  // ---------- 删除 ----------
  const handleDelete = async (id: number) => {
    try {
      await userApi.deleteUser(id)
      message.success('删除成功')
      fetchData()
    } catch {
      // 拦截器已提示
    }
  }

  // ---------- 重置密码 ----------
  const handleResetPassword = async () => {
    if (!pwdUser) return
    const values = await pwdForm.validateFields()
    try {
      await userApi.resetPassword(pwdUser.id, { password: values.password })
      message.success('密码已重置')
      setPwdUser(null)
      pwdForm.resetFields()
    } catch {
      // 拦截器已提示
    }
  }

  const columns: ColumnsType<User> = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '用户名', dataIndex: 'username', width: 140 },
    { title: '昵称', dataIndex: 'nickname', width: 120, render: (v) => v || '-' },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.status === 1}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: '角色',
      dataIndex: 'roleNames',
      width: 160,
      render: (roles?: string[]) =>
        roles?.length ? (
          roles.map((r) => (
            <Tag color="blue" key={r}>
              {r}
            </Tag>
          ))
        ) : (
          <Tag>未分配</Tag>
        ),
    },
    { title: '邮箱', dataIndex: 'email', width: 180, render: (v) => v || '-' },
    { title: '手机号', dataIndex: 'phone', width: 130, render: (v) => v || '-' },
    { title: '创建时间', dataIndex: 'createTime', width: 170, render: (v) => v?.replace('T', ' ') || '-' },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 260,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Tooltip title="重置密码">
            <Button size="small" icon={<KeyOutlined />} onClick={() => setPwdUser(record)} />
          </Tooltip>
          <Tooltip title="分配角色（待后端 RBAC）">
            <Button size="small" icon={<UserSwitchOutlined />} disabled />
          </Tooltip>
          <Popconfirm title="确定删除该用户？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const pagination: TableProps<User>['pagination'] = {
    current: query.page + 1,
    pageSize: query.size,
    total,
    showSizeChanger: true,
    showTotal: (t) => `共 ${t} 条`,
    onChange: (page, size) => setQuery((prev) => ({ ...prev, page: page - 1, size })),
  }

  return (
    <Card
      title="用户管理"
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新建用户
          </Button>
        </Space>
      }
    >
      {/* 搜索栏 */}
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="username" label="用户名">
          <Input placeholder="输入用户名搜索" allowClear style={{ width: 200 }} onPressEnter={onSearch} />
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

      <Table<User>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        scroll={{ x: 1100 }}
      />

      {/* 创建 / 编辑弹窗 */}
      <Modal
        title={editing ? '编辑用户' : '新建用户'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={480}
      >
        <Form form={modalForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input disabled={!!editing} placeholder="3-32 位字母数字" maxLength={32} />
          </Form.Item>
          {!editing && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[
                { required: true, message: '请输入初始密码' },
                { min: 6, message: '密码至少 6 位' },
              ]}
            >
              <Input.Password placeholder="至少 6 位" />
            </Form.Item>
          )}
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="可选" maxLength={64} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input placeholder="可选" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}
          >
            <Input placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title={`重置密码 - ${pwdUser?.username ?? ''}`}
        open={!!pwdUser}
        onOk={handleResetPassword}
        onCancel={() => {
          setPwdUser(null)
          pwdForm.resetFields()
        }}
        width={400}
      >
        <Form form={pwdForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password placeholder="至少 6 位" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
