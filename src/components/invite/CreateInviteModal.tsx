import {
  useCreateInvitationMutation,
  useInvitationByIdQuery,
  useUsersQuery,
} from '../../data-access'
import { InvitationData, RowInterface } from './types'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { addHours, parseISO, setHours, setMinutes, startOfHour } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'

const UserSelect = ({
  targetKeys,
  onChange,
}: {
  targetKeys: Array<string>
  onChange: (userIds: Array<string>) => void
}) => {
  const { data, isLoading } = useUsersQuery()
  return null
  // return (
  //   <Transfer
  //     dataSource={(data ?? []).map((x) => ({
  //       key: x.id,
  //       title: x.email ?? x.phoneNumber,
  //       chosen: targetKeys.includes(x.id),
  //     }))}
  //     targetKeys={targetKeys}
  //     disabled={isLoading}
  //     onChange={(targetKeys) => {
  //       onChange(targetKeys)
  //     }}
  //     oneWay
  //     render={(item) => item.title}
  //   />
  // )
}

const setHourAndMinute = (date: Date, existing: Date): Date =>
  setMinutes(setHours(date, existing.getHours()), existing.getMinutes())
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
    <VStack style={{ paddingBottom: 20, display: 'flex' }}>
      <HStack>
        {/*<DatePicker*/}
        {/*  value={data.fromDate}*/}
        {/*  onChange={(date) => {*/}
        {/*    updateRow(index, {*/}
        {/*      ...data,*/}
        {/*      fromDate: setHourAndMinute(date, data.fromDate),*/}
        {/*      toDate: setHourAndMinute(date, data.toDate),*/}
        {/*    })*/}
        {/*  }}*/}
        {/*  disabledDate={(d) => !d || d.isSameOrBefore(today.toISOString())}*/}
        {/*/>*/}
        {/*<RangePicker*/}
        {/*  value={[data.fromDate, data.toDate]}*/}
        {/*  minuteStep={5}*/}
        {/*  format="HH:mm"*/}
        {/*  onChange={(time) => {*/}
        {/*    const [fromDate, toDate] = time*/}
        {/*    updateRow(index, { ...data, fromDate: fromDate, toDate: toDate })*/}
        {/*  }}*/}
        {/*/>*/}
        <Input placeholder="Location" />
      </HStack>
      <Tooltip title="Delete">
        <Button onClick={() => removeRow(index)}>
          <AiOutlineDelete />
        </Button>
      </Tooltip>
    </VStack>
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
    <Box p="5">
      <FormControl>
        <FormLabel>Select Communities</FormLabel>
        <UserSelect targetKeys={data.userIds} onChange={updateUserIds} />
      </FormControl>
      <FormControl>
        <FormLabel>Availability Options</FormLabel>
        {data.options.map((row, index) => (
          <AvailabilityOptionRow
            key={`ao-${index}`}
            data={row}
            index={index}
            updateRow={updateRow}
            removeRow={removeRow}
          />
        ))}
      </FormControl>
      <Button onClick={addRow}>Add</Button>
    </Box>
  )
}

const findNextDay = (today: Date, rows: Array<RowInterface>): Date => {
  const existingDays = rows.map((x) => x.fromDate.toISOString())
  let currentDate = today
  while (existingDays.includes(currentDate.toISOString())) {
    currentDate = addHours(currentDate, 1)
  }
  return currentDate
}
export const UpdateCreateInvitationModal = ({
  inviteId,
  isOpen,
  closeModal,
}: {
  inviteId?: string
  isOpen: boolean
  closeModal: () => void
}) => {
  const { data, isFetched } = useInvitationByIdQuery(inviteId)
  const { mutate, isLoading } = useCreateInvitationMutation()
  const [inviteData, setInviteData] = useState<InvitationData>({
    userIds: [],
    options: [],
  })

  const today: Date = addHours(startOfHour(new Date()), 1)
  const resetForm = () => setInviteData({ userIds: [], options: [] })
  useEffect(() => {
    if (data && isFetched) {
      setInviteData({
        ...data,
        options: data.options.map((x) => ({
          ...x,
          fromDate: parseISO(x.fromDate),
          toDate: parseISO(x.toDate),
        })),
      })
    }
  }, [])
  const title = inviteId ? 'Update Invite' : 'Create Invite'
  let onClose = () => {
    resetForm()
    closeModal()
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form>
          <ModalCloseButton />
          <ModalHeader>{title}</ModalHeader>
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
                  { fromDate: nextDay, toDate: addHours(nextDay, 1) },
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
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose} variant="ghost">
                Close
              </Button>
              <Button colorScheme="green" variant="ghost">
                Save
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
