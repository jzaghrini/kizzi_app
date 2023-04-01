import { UserPage } from '../components/user'
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import React from 'react'

const adminTabs = [
  {
    label: 'Invitations',
    element: <div>Invites</div>,
  },
  {
    label: 'Users',
    element: <UserPage />,
  },
]
const AdminTabPanel = () => {
  return (
    <Tabs>
      <TabList>
        {adminTabs.map((tab, index) => (
          <Tab key={index}>{tab.label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {adminTabs.map((tab, index) => (
          <TabPanel key={index}>{tab.element}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}
export const Admin = () => {
  return (
    <Box>
      <AdminTabPanel />
    </Box>
  )
}
