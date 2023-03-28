import { useUserQuery, useAvailabilityQuery } from '../../../data-access'
import { UpdateCreateInvitationModal } from '../../invite'
import { Button, Col, Row, Table } from 'antd'
import { useState } from 'react'

export const PageView = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { data, isLoading } = useAvailabilityQuery()
  const { data: userData } = useUserQuery()
  return (
    <div>
      <UpdateCreateInvitationModal
        open={showModal}
        closeModal={() => setShowModal(false)}
      />
      <Row
        className="user-header"
        style={{ display: 'flex', paddingBottom: 5 }}
      >
        <Col>
          <h3>Availability</h3>
        </Col>
        {userData?.type === 'admin' && (
          <Col style={{ marginLeft: 'auto' }}>
            <Button
              key="send-invite"
              type="primary"
              onClick={() => setShowModal(true)}
            >
              Create invite
            </Button>
          </Col>
        )}
      </Row>
      <Table
        dataSource={data}
        columns={[
          { title: 'Slug', key: 'slug', dataIndex: 'slug' },
          { title: 'From', dataIndex: 'fromDate' },
          { title: 'To', dataIndex: 'toDate' },
        ]}
        loading={isLoading}
      />
    </div>
  )
}
