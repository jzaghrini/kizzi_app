import { useAvailabilityQuery } from '../../../data-access/availability'
import { useCreateInvitationMutation } from '../../../data-access/mutations'
import { useUserQuery, useUsersQuery } from '../../../data-access/user'
import { DeleteOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  TimePicker,
  Tooltip,
  Transfer,
} from 'antd'
import { addHours, startOfHour } from 'date-fns'
import dayjs from 'dayjs'
import { useState } from 'react'

interface RowInterface {
  fromDate: dayjs.Dayjs
  toDate: dayjs.Dayjs
}

interface InvitationData {
  userIds: Array<string>
  availabilityOptions: Array<RowInterface>
}

const { Item } = Form
const setHourAndMinute = (date: dayjs.Dayjs, existing: dayjs.Dayjs) =>
  date.set('hour', existing.hour()).set('minute', existing.minute())
const AvailabilityOptionRow = ({
  data,
  index,
  updateRow,
  removeRow,
}: {
  index: number
  data: RowInterface
  updateRow: (index: number, data: RowInterface) => void
  removeRow: () => void
}) => {
  const today = new Date()
  return (
    <Space style={{ paddingBottom: 20, display: 'flex' }} size="large">
      <Space direction="vertical" size="small">
        <Space.Compact block>
          <DatePicker
            value={data.fromDate}
            onChange={(date) => {
              updateRow(index, {
                ...data,
                fromDate: setHourAndMinute(date, data.fromDate),
                toDate: setHourAndMinute(date, data.toDate),
              })
            }}
            disabledDate={(d) => !d || d.isSameOrBefore(today.toISOString())}
          />
          <TimePicker.RangePicker
            value={[data.fromDate, data.toDate]}
            minuteStep={5}
            format="HH:mm"
            onChange={(time) => {
              const [fromDate, toDate] = time
              updateRow(index, { ...data, fromDate: fromDate, toDate: toDate })
            }}
          />
        </Space.Compact>
        <Input placeholder="Location" />
      </Space>
      <Tooltip title="Delete">
        <Button
          danger
          type="text"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => removeRow(index)}
        />
      </Tooltip>
    </Space>
  )
}
const InviteForm = ({
  data,
  updateUserIds,
  addRow,
  updateRow,
  removeRow,
}: {
  data: InvitationData
  updateUserIds: (userIds: Array<string>) => void
  addRow: () => void
  removeRow: (index: number) => void
  updateRow: (index: number, data: RowInterface) => void
}) => {
  return (
    <Form layout="vertical">
      <Item label="Select Users">
        <UserSelect targetKeys={data.userIds} onChange={updateUserIds} />
      </Item>
      <Item label="Availability Options">
        {data.availabilityOptions.map((row, index) => (
          <AvailabilityOptionRow
            key={`ao-${index}`}
            data={row}
            index={index}
            updateRow={updateRow}
            removeRow={removeRow}
          />
        ))}
      </Item>
      <Button onClick={addRow}>Add</Button>
    </Form>
  )
}
const UserSelect = ({
  targetKeys,
  onChange,
}: {
  targetKeys: Array<string>
  onChange: (userIds: Array<string>) => void
}) => {
  const { data, isLoading } = useUsersQuery()
  return (
    <Transfer
      dataSource={(data ?? []).map((x) => ({
        key: x.id,
        title: x.email ?? x.phoneNumber,
        chosen: targetKeys.includes(x.id),
      }))}
      targetKeys={targetKeys}
      disabled={isLoading}
      onChange={(targetKeys) => {
        onChange(targetKeys)
      }}
      oneWay
      render={(item) => item.title}
    />
  )
}
const findNextDay = (
  today: dayjs.Dayjs,
  rows: Array<RowInterface>
): dayjs.Dayjs => {
  const existingDays = rows.map((x) => x.fromDate.toISOString())
  let currentDate = today
  console.log(currentDate, existingDays, existingDays.includes(currentDate))
  while (existingDays.includes(currentDate.toISOString())) {
    currentDate = currentDate.add(1, 'hour')
  }
  return currentDate
}

const CreateInvitationModal = ({
  open,
  options,
}: {
  open: boolean
  options: {
    isSaving: boolean
    onOk?: (data?: InvitationData) => void
    onCancel: () => void
  }
}) => {
  const [inviteData, setInviteData] = useState<InvitationData>({
    userIds: [],
    availabilityOptions: [],
  })
  const today: dayjs.Dayjs = dayjs(addHours(startOfHour(new Date()), 1))
  const resetForm = () =>
    setInviteData({ userIds: [], availabilityOptions: [] })
  return (
    <Modal
      title="Create invitation"
      open={open}
      onOk={() => {
        options.onOk ? options.onOk(inviteData) : options.onCancel()
      }}
      okText="Save"
      confirmLoading={options.isSaving}
      onCancel={() => {
        resetForm()
        options.onCancel()
      }}
    >
      <InviteForm
        data={inviteData}
        updateUserIds={(userIds) =>
          setInviteData({
            ...inviteData,
            userIds: userIds,
          })
        }
        addRow={() => {
          const nextDay = findNextDay(today, inviteData.availabilityOptions)
          setInviteData({
            ...inviteData,
            availabilityOptions: [
              ...inviteData.availabilityOptions,
              { fromDate: nextDay, toDate: nextDay.add(1, 'hour') },
            ],
          })
        }}
        updateRow={(index, data) => {
          const newData = { ...inviteData }
          newData.availabilityOptions[index] = data
          setInviteData(newData)
        }}
        removeRow={(index: number) =>
          setInviteData({
            ...inviteData,
            availabilityOptions: inviteData.availabilityOptions.filter(
              (x, i) => i !== index
            ),
          })
        }
      />
    </Modal>
  )
}
export const PageView = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { data, isLoading } = useAvailabilityQuery()
  const { data: userData } = useUserQuery()
  const { mutate, isLoading: isSaving } = useCreateInvitationMutation()
  return (
    <div>
      <CreateInvitationModal
        open={showModal}
        options={{
          isSaving,
          onCancel: () => setShowModal(false),
          onOk: (formData) =>
            mutate(formData, {
              onSuccess: () => {
                setShowModal(false)
              },
            }),
        }}
      />
      <Row className="user-header" style={{ display: 'flex' }}>
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
