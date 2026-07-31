import { useMemo, useState } from 'react'
import { Layout, Menu, Dropdown, Avatar, Space, Breadcrumb, theme, type MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined as SettingIcon,
  DashboardOutlined,
  FileTextOutlined,
  KeyOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePermissionStore } from '@/store/permissionStore'

const { Header, Sider, Content } = Layout

/** 菜单图标名 → 组件映射（与后端权限数据 icon 字段对应） */
const iconMap: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SettingOutlined: <SettingIcon />,
  FileTextOutlined: <FileTextOutlined />,
  KeyOutlined: <KeyOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserOutlined: <UserOutlined />,
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const menus = usePermissionStore((s) => s.menus)

  /** 权限树 → AntD Menu items */
  const menuItems: MenuProps['items'] = useMemo(
    () =>
      menus.map((m) => ({
        key: m.key,
        icon: m.icon ? iconMap[m.icon] ?? iconMap[m.key] : undefined,
        label: m.label,
        children: m.children?.map((c) => ({
          key: c.key,
          label: c.label,
        })),
      })),
    [menus],
  )

  const selectedKeys = useMemo(() => {
    // 取当前路径匹配的菜单 key（支持 /system/user 这类二级路径）
    const parts = location.pathname.split('/').filter(Boolean)
    for (let i = parts.length; i > 0; i--) {
      const key = '/' + parts.slice(0, i).join('/')
      if (menus.some((m) => m.key === key || m.children?.some((c) => c.key === key))) {
        return [key]
      }
    }
    return [location.pathname]
  }, [location.pathname, menus])

  const openKeys = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    return parts.length > 1 ? ['/' + parts[0]] : []
  }, [location.pathname])

  const breadcrumbItems = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const items: { title: string }[] = [{ title: '首页' }]
    let current = ''
    for (const part of parts) {
      current += '/' + part
      const hit = menus.find((m) => m.key === current) || menus.find((m) => m.children?.some((c) => c.key === current))
      if (hit) {
        items.push({ title: hit.children?.some((c) => c.key === current) ? hit.label : hit.label })
        const child = hit.children?.find((c) => c.key === current)
        if (child) items.push({ title: child.label })
      } else if (part === 'dashboard') {
        items.push({ title: '工作台' })
      }
    }
    return items
  }, [location.pathname, menus])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const userMenu: MenuProps = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') handleLogout()
    },
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220} theme="dark">
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 600,
            letterSpacing: 1,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? 'CMS' : 'CMCCPC 管理后台'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: token.colorBgContainer,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
            height: 56,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setCollapsed(false)} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => setCollapsed(true)} />
            )}
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <Space size="middle">
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ background: token.colorPrimary }} />
                <span>{user?.nickname || user?.username || '未登录'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 16, padding: 24, background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
