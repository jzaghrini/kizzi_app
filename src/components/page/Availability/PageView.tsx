import { useAppContext } from '../../../context'
import { useAvailabilityQuery } from '../../../data-access'
import { UpdateCreateInvitationModal } from '../../invite'
import { Box, Button, Table } from '@chakra-ui/react'
import { useState } from 'react'

export const PageView = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { data, isLoading } = useAvailabilityQuery()
  const { user } = useAppContext()
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
