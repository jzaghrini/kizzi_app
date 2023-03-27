import { localStorageKey } from '../../data-access'
import { Layout, Menu, theme } from 'antd'
import { useState } from 'react'
import { Columns, BoxArrowLeft, People } from 'react-bootstrap-icons'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Footer, Sider, Content } = Layout
export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem(localStorageKey)
    navigate('/')
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsed={collapsed} onCollapse={(v) => setCollapsed(v)}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          <h3 style={{ textAlign: 'center' }}>Kizzi</h3>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}
        >
          <div>
            <Menu
              theme="dark"
              mode="inline"
              items={[
                { key: 'dashboard', label: 'Dashboard', icon: <Columns /> },
                {
                  key: 'availability',
                  label: 'Availability',
                  icon: <People />,
                  onClick: () => navigate('/availability'),
                },
              ]}
            />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Menu
              mode="inline"
              items={[
                {
                  key: 'logout',
                  label: 'Logout',
                  icon: <BoxArrowLeft />,
                  onClick: logout,
                },
              ]}
            />
          </div>
        </div>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>
          <div
            style={{
              margin: 16,
              padding: 24,
              height: '100%',
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  )
}
