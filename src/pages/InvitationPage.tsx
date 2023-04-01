import { UpdateCreateInvitationModal } from '../components/invite'
import { SmartTable } from '../components/smart-table'
import {
  useDeleteInvitation,
  useInvitationQuery,
  useUsersQuery,
} from '../data-access'
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Spacer,
  Table,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import { BiTrash } from 'react-icons/bi'

const formatDate = (dateString: string) => (
  <Text>{format(parseISO(dateString), 'PP HH:mm')}</Text>
)

export const InvitationPage = () => {
  const [inviteId, setInviteId] = useState<string | undefined>(undefined)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const usersQuery = useUsersQuery()
  const { data, isLoading } = useInvitationQuery()
  const { mutate: deleteMutate, isLoading: isDeleting } = useDeleteInvitation()

  const records = (data ?? []).map((row) => ({
    ...row,
    users:
      row.userIds
        .map((userId) => usersQuery.data?.find((x) => x.id === userId))
        .filter(Boolean) ?? [],
  }))
  const deleteRow = (id: string) => deleteMutate(id)
  const columns = [
    {
      key: 'users',
      display: 'Users',
      render: (_, row) => row.users.map((x) => x.email).join(),
    },
    {
      key: 'fromDate',
      display: 'From Date',
      render: formatDate,
    },
    {
      key: 'toDate',
      display: 'To Date',
      render: formatDate,
    },
    {
      display: 'Action',
      key: 'action',
      render: (_, row) => (
        <Center>
          <IconButton
            aria-label="delete-invite"
            variant="ghost"
            colorScheme="red"
            icon={<BiTrash />}
            onClick={() => deleteRow(row.id)}
            isLoading={isDeleting}
          />
        </Center>
      ),
    },
  ]
  return (
    <Box w="full" h="full" p="5">
      <UpdateCreateInvitationModal
        inviteId={inviteId}
        isOpen={isOpen}
        closeModal={onClose}
      />
      <Flex pb="5">
        <Box>
          <Text as="h3">Invitation</Text>
        </Box>
        <Spacer />
        <Box>
          <Button size="sm" onClick={onOpen}>
            Create invite
          </Button>
        </Box>
      </Flex>
      <SmartTable data={records} columns={columns} isLoading={isLoading} />
    </Box>
  )
}
