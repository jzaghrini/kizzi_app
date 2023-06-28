import { UpdateCreateInvitationModal } from '../components/invite'
import { SmartTable } from '../components/smart-table'
import {
  useCommunityQuery,
  useDeleteInvitation,
  useInvitationQuery,
  useSendInvitation,
  useUpdateInvitation,
  useUsersQuery,
} from '../data-access'
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import { BiTrash, BiSend } from 'react-icons/bi'

const formatDate = (dateString: string) => (
  <Text>{format(parseISO(dateString), 'PP HH:mm')}</Text>
)

const colorMapping = {
  pending: 'gray',
  sending: 'linkedin',
  sent: 'blue',
}
export const InvitationPage = () => {
  const [inviteId, setInviteId] = useState<string | undefined>(undefined)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const communityQuery = useCommunityQuery()
  const usersQuery = useUsersQuery()
  const { data, isLoading } = useInvitationQuery()
  const { mutate: updateMutate, isLoading: isUpdating } = useSendInvitation()
  const { mutate: deleteMutate, isLoading: isDeleting } = useDeleteInvitation()

  const records = (data ?? []).map((row) => ({
    ...row,
    users:
      row.userIds
        .map((userId) => usersQuery.data?.find((x) => x.id === userId))
        .filter(Boolean) ?? [],
    communities: row.communityIds.map((communityId) =>
      communityQuery.data?.find((x) => x.id === communityId)
    ),
  }))
  const deleteRow = (id: string) => deleteMutate(id)
  const sendRow = (id: string) => updateMutate({ id })
  const columns = [
    {
      key: 'communities',
      display: 'Communities',
      render: (communities, _) => (
        <Center>
          {communities.map((x) => (
            <Badge>{x.name}</Badge>
          ))}
        </Center>
      ),
    },
    {
      key: 'users',
      display: 'Users',
      render: (_, row) => row.users.map((x) => x.email).join(),
    },
    {
      key: 'status',
      display: 'Status',
      render: (status) => {
        const color = colorMapping[status]
        console.log(color, status)
        return <Badge colorScheme={color}>{status}</Badge>
      },
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
      render: (_, row) => {
        if (row.status === 'pending')
          return (
            <Center>
              <IconButton
                aria-label="delete-invite"
                variant="ghost"
                colorScheme="blue"
                icon={<BiSend />}
                onClick={() => sendRow(row.id)}
                isLoading={isUpdating}
              />
              <IconButton
                aria-label="delete-invite"
                variant="ghost"
                colorScheme="red"
                icon={<BiTrash />}
                onClick={() => deleteRow(row.id)}
                isLoading={isDeleting}
              />
            </Center>
          )
        return null
      },
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
