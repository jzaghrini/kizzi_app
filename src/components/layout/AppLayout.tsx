import { AppContextProvider } from '../../context'
import { AppSidebar } from './AppSideBar'
import { AppNavbar } from './nav/AppNavbar'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const AppLayout = () => {
  return (
    <AppContextProvider>
      <Flex as="section" minH="100vh">
        <AppSidebar />
        <Flex
          flex="1"
          direction="column"
          transition=".3s ease"
          h="100vh"
          className="main-content-wrap"
        >
          <Box as="main" flex="1" w="full">
            <Flex direction="column" flexBasis="8" zIndex="1000">
              <AppNavbar />
            </Flex>
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </AppContextProvider>
  )
}
// let upperMenu = [
//   { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
//   {
//     key: 'availability',
//     label: 'Availability',
//     icon: <UserOutlined />,
//     onClick: () => navigate('/availability'),
//   },
// ]
// if (isAdmin) {
//   upperMenu.push({
//     key: 'invites',
//     label: 'Invitations',
//     icon: <MailOutlined />,
//     onClick: () => navigate('/invitation'),
//   })
// }
