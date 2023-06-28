import { UpdateCreateInvitationModal } from '../../components/invite'
import { ColumnDisplay, SmartTable } from '../../components/smart-table'
import { useAppContext } from '../../context'
import { AvailabilityResponse, useAvailabilityQuery } from '../../data-access'
import {
  Badge,
  Box,
  Button,
  Center,
  IconButton,
  Table,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

export const PageView = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState<boolean>(false)
  const { data, isLoading } = useAvailabilityQuery()
  const { user } = useAppContext()
  const columns: Array<ColumnDisplay<AvailabilityResponse>> = [
    {
      key: 'slug',
      display: 'Id',
      render: (slug) => (
        <Text as="code" size="sm">
          {slug}
        </Text>
      ),
    },
    {
      key: 'status',
      display: 'Status',
      render: (status) => <Badge colorScheme="gray">{status}</Badge>,
    },
    {
      display: 'From',
      key: 'fromDate',
    },
    {
      key: 'actions',
      display: 'Actions',
      render: (_, row) => (
        <Center>
          <IconButton
            aria-label="delete-invite"
            variant="ghost"
            colorScheme="blue"
            icon={<BiEdit />}
            onClick={() => navigate(`/availability?slug=${row.slug}`)}
          />
        </Center>
      ),
    },
  ]
  return (
    <div>
      <UpdateCreateInvitationModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
      />
      <Box
        className="user-header"
        style={{ display: 'flex', paddingBottom: 5 }}
      >
        <Box>
          <h3>Availability</h3>
        </Box>
        {user?.type === 'admin' && (
          <Box style={{ marginLeft: 'auto' }}>
            <Button key="send-invite" onClick={() => setShowModal(true)}>
              Create invite
            </Button>
          </Box>
        )}
      </Box>
      <SmartTable
        columns={columns}
        isLoading={isLoading}
        data={data}
        rowActions={{
          onClick: (row) =>
            navigate(`/availability?slug=${row.slug}`, { replace: true }),
        }}
      />
      {/*<Table*/}
      {/*  dataSource={data}*/}
      {/*  columns={[*/}
      {/*    { title: 'Slug', key: 'slug', dataIndex: 'slug' },*/}
      {/*    { title: 'From', dataIndex: 'fromDate' },*/}
      {/*    { title: 'To', dataIndex: 'toDate' },*/}
      {/*  ]}*/}
      {/*  loading={isLoading}*/}
      {/*/>*/}
    </div>
  )
}
