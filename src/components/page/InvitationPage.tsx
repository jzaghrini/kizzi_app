import {
  useDeleteInvitation,
  useInvitationQuery,
  useUsersQuery,
} from '../../data-access'
import { useDisclosure } from '../../hooks'
import { UpdateCreateInvitationModal } from '../invite'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Col, Row, Space, Table } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'

const formatDate = (dateString: string) =>
  dayjs(dateString).format('dddd MMMM DD, YYYY H:mm')
export const InvitationPage = () => {
  const [inviteId, setInviteId] = useState<string | undefined>(undefined)
  const { isOpen, close, open } = useDisclosure()
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
        open={isOpen}
        closeModal={close}
      />
      <Row style={{ paddingBottom: 5 }}>
        <Col>
          <h3>Invitation</h3>
        </Col>
        <Col style={{ marginLeft: 'auto' }}>
          <Button key="send-invite" type="primary" onClick={open}>
            Create invite
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={records}
        columns={[
          {
            key: 'users',
            title: 'Users',
            dataIndex: 'users',
            render: (users) => users.map((x) => x.email).join(),
          },
          {
            key: 'fromDate',
            title: 'From Date',
            dataIndex: 'fromDate',
            render: formatDate,
          },
          {
            key: 'toDate',
            title: 'To Date',
            dataIndex: 'toDate',
            render: formatDate,
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => deleteRow(record.id)}
                  loading={isDeleting}
                />
                <a>Delete</a>
              </Space>
            ),
          },
        ]}
      />
    </div>
  )
}
