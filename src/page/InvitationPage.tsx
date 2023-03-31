import { UpdateCreateInvitationModal } from '../components/invite'
import {
  useDeleteInvitation,
  useInvitationQuery,
  useUsersQuery,
} from '../data-access'
import { Box, Button, Table, useDisclosure } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'

const formatDate = (dateString: string) =>
  format(parseISO(dateString), 'dddd MMMM DD, YYYY H:mm')
export const InvitationPage = () => {
  const [inviteId, setInviteId] = useState<string | undefined>(undefined)
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { data: users } = useUsersQuery()
  const { data } = useInvitationQuery()
  const { mutate: deleteMutate, isLoading: isDeleting } = useDeleteInvitation()

  const records = (data ?? []).map((row) => ({
    ...row,
    users: row.userIds
      .map((userId) => users?.find((x) => x.id === userId))
      .filter(Boolean),
  }))
  const deleteRow = (id: string) => deleteMutate(id)
  return (
    <div>
      <UpdateCreateInvitationModal
        inviteId={inviteId}
        isOpen={isOpen}
        closeModal={onClose}
      />
      <Box style={{ paddingBottom: 5 }}>
        <Box>
          <h3>Invitation</h3>
        </Box>
        <Box style={{ marginLeft: 'auto' }}>
          <Button key="send-invite" onClick={onOpen}>
            Create invite
          </Button>
        </Box>
      </Box>
      {/*<Table*/}
      {/*  dataSource={records}*/}
      {/*  columns={[*/}
      {/*    {*/}
      {/*      key: 'users',*/}
      {/*      title: 'Users',*/}
      {/*      dataIndex: 'users',*/}
      {/*      render: (users) => users.map((x) => x.email).join(),*/}
      {/*    },*/}
      {/*    {*/}
      {/*      key: 'fromDate',*/}
      {/*      title: 'From Date',*/}
      {/*      dataIndex: 'fromDate',*/}
      {/*      render: formatDate,*/}
      {/*    },*/}
      {/*    {*/}
      {/*      key: 'toDate',*/}
      {/*      title: 'To Date',*/}
      {/*      dataIndex: 'toDate',*/}
      {/*      render: formatDate,*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: 'Action',*/}
      {/*      key: 'action',*/}
      {/*      render: (_, record) => (*/}
      {/*        <Space size="middle">*/}
      {/*          <Button*/}
      {/*            icon={<DeleteOutlined />}*/}
      {/*            danger*/}
      {/*            onClick={() => deleteRow(record.id)}*/}
      {/*            loading={isDeleting}*/}
      {/*          />*/}
      {/*          <a>Delete</a>*/}
      {/*        </Space>*/}
      {/*      ),*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
    </div>
  )
}
