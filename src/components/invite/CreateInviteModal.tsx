import {
  useCreateInvitationMutation,
  useInvitationByIdQuery,
  useUsersQuery,
} from '../../data-access'
import { InvitationData, RowInterface } from './types'
import { DeleteOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  TimePicker,
  Tooltip,
  Transfer,
} from 'antd'
import { addHours, startOfHour } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

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
  removeRow: (index: number) => void
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
      <Form.Item label="Select Users">
        <UserSelect targetKeys={data.userIds} onChange={updateUserIds} />
      </Form.Item>
      <Form.Item label="Availability Options">
        {data.options.map((row, index) => (
          <AvailabilityOptionRow
            key={`ao-${index}`}
            data={row}
            index={index}
            updateRow={updateRow}
            removeRow={removeRow}
          />
        ))}
      </Form.Item>
      <Button onClick={addRow}>Add</Button>
    </Form>
  )
}

const findNextDay = (
  today: dayjs.Dayjs,
  rows: Array<RowInterface>
): dayjs.Dayjs => {
  const existingDays = rows.map((x) => x.fromDate.toISOString())
  let currentDate = today
  while (existingDays.includes(currentDate.toISOString())) {
    currentDate = currentDate.add(1, 'hour')
  }
  return currentDate
}
export const UpdateCreateInvitationModal = ({
  inviteId,
  open,
  closeModal,
}: {
  inviteId?: string
  open: boolean
  closeModal: () => void
}) => {
  const { data, isFetched } = useInvitationByIdQuery(inviteId)
  const { mutate, isLoading } = useCreateInvitationMutation()
  const [inviteData, setInviteData] = useState<InvitationData>({
    userIds: [],
    options: [],
  })

  const today: dayjs.Dayjs = dayjs(addHours(startOfHour(new Date()), 1))
  const resetForm = () => setInviteData({ userIds: [], options: [] })
  useEffect(() => {
    if (data && isFetched) {
      setInviteData({
        ...data,
        options: data.options.map((x) => ({
          ...x,
          fromDate: dayjs(x.fromDate),
          toDate: dayjs(x.toDate),
        })),
      })
    }
  }, [])
  return (
    <Modal
      title="Create invitation"
      open={open}
      onOk={() => {
        mutate(inviteData, {
          onSuccess: () => {
            resetForm()
            closeModal()
          },
        })
      }}
      okText="Save"
      confirmLoading={isLoading}
      onCancel={() => {
        resetForm()
        closeModal()
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
          const nextDay = findNextDay(today, inviteData.options)
          setInviteData({
            ...inviteData,
            options: [
              ...inviteData.options,
              { fromDate: nextDay, toDate: nextDay.add(1, 'hour') },
            ],
          })
        }}
        updateRow={(index, data) => {
          const newData = { ...inviteData }
          newData.options[index] = data
          setInviteData(newData)
        }}
        removeRow={(index: number) =>
          setInviteData({
            ...inviteData,
            options: inviteData.options.filter((x, i) => i !== index),
          })
        }
      />
    </Modal>
  )
}
