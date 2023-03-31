import { useUsersQuery } from '../../data-access'
import { SmartTable } from '../smart-table'
import { UserModal } from './UserModal'
import {
  Badge,
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'

export const UserPage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })
  const [userId, setUserId] = useState<string | null>(null)
  const { data, isLoading } = useUsersQuery()

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
  return (
    <Box h="full" w="full">
      <UserModal isOpen={isOpen} onClose={onClose} />
      <Flex pb="5">
        <Text as="h3" fontWeight="bold" fontSize="lg">
          Users
        </Text>
        <Spacer />
        <Button
          size="sm"
          onClick={onOpen}
          colorScheme="gray"
          leftIcon={<AiOutlinePlus />}
        >
          Create User
        </Button>
      </Flex>
      <SmartTable
        data={data}
        columns={columns}
        sx={{ height: 'full', overflowY: 'scroll' }}
      />
    </Box>
  )
}
