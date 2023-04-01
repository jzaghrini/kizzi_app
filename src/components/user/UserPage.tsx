import { useDeleteUserMutation, useUsersQuery } from '../../data-access'
import { SmartTable } from '../smart-table'
import { UserModal } from './UserModal'
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BiTrash, BiEdit } from 'react-icons/bi'

export const UserPage = () => {
  const { data, isLoading } = useUsersQuery()
  const { mutate, isLoading: isDeleting } = useDeleteUserMutation()
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })
  const [userId, setUserId] = useState<string | null>(null)

  const columns = [
    { key: 'name', display: 'Name' },
    { key: 'email', display: 'Email' },
    { key: 'phoneNumber', display: 'Phone Number' },
    {
      key: 'deletedAt',
      display: 'Deleted',
      render: (deletedAt) =>
        deletedAt ? (
          <Badge colorScheme="red">{format(deletedAt, 'PP HH:mm')}</Badge>
        ) : null,
    },
    {
      key: 'type',
      display: 'Type',
      render: (type) => (
        <Badge colorScheme={type === 'admin' ? 'red' : 'green'}>{type}</Badge>
      ),
    },
    {
      key: 'actions',
      display: '',
      render: (_, row) => (
        <ButtonGroup>
          <IconButton
            colorScheme="gray"
            aria-label="edit-user"
            variant="ghost"
            disabled={isDeleting}
            onClick={() => setUserId(row.id)}
            icon={<BiEdit />}
          />
          {!row.deleted && (
            <IconButton
              colorScheme="red"
              aria-label="delete-user"
              variant="ghost"
              isLoading={isDeleting}
              icon={<BiTrash />}
              onClick={() =>
                mutate(row.id, { onSuccess: (data) => console.log(data) })
              }
            />
          )}
        </ButtonGroup>
      ),
    },
  ]

  useEffect(() => {
    if (userId) onOpen()
  }, [userId, onOpen])

  return (
    <Box h="full" w="full" p="5">
      <UserModal
        userId={userId}
        isOpen={isOpen}
        onClose={() => {
          setUserId(null)
          onClose()
        }}
      />
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
        isLoading={isLoading}
        tableProps={{ size: 'sm' }}
      />
    </Box>
  )
}
