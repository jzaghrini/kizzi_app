import { useUsersQuery } from '../../data-access'
import { SmartTable } from '../smart-table'
import { Badge, Box, Button, Flex, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

const columns = [
  { key: 'name', display: 'Name' },
  { key: 'email', display: 'Email' },
  { key: 'phoneNumber', display: 'Phone Number' },
  {
    key: 'type',
    display: 'Type',
    renderer: (row) => (
      <Badge colorScheme={row.type === 'admin' ? 'red' : 'green'}>
        {row.type}
      </Badge>
    ),
  },
]

export const UserPage = () => {
  const { data, isLoading } = useUsersQuery()
  return (
    <Box>
      <Flex pb="5">
        <Text as="h3" fontWeight="bold" fontSize="lg">
          Users
        </Text>
        <Spacer />
        <Button size="sm">Create User</Button>
      </Flex>
      <SmartTable data={data} columns={columns} />
    </Box>
  )
}
