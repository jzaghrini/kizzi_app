import {
  useCreateInvitationMutation,
  useInvitationByIdQuery,
  useCommunityQuery,
  useTopicsQuery,
  TopicResponse,
  CreateTopicRequest,
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
  Select,
  Spinner,
  Switch,
  VStack,
} from '@chakra-ui/react'
import {
  addHours,
  format,
  isValid,
  parseISO,
  setHours,
  setMinutes,
  startOfHour,
} from 'date-fns'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { AiOutlineDelete } from 'react-icons/ai'

const CommunitySelect = ({
  targetKeys,
  onChange,
}: {
  targetKeys: Array<string>
  onChange: (userIds: Array<string>) => void
}) => {
  const { data, isLoading } = useCommunityQuery()
  return (
    <Box height={200}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {(data ?? []).map((row) => (
            <FormControl id={row.id} key={row.id}>
              <Switch
                size="sm"
                isChecked={targetKeys.includes(row.id)}
                onChange={(e) => {
                  let keys = [...targetKeys, row.id]
                  if (targetKeys.includes(row.id)) {
                    keys = targetKeys.filter((x) => x !== row.id)
                  }
                  onChange(keys)
                }}
              >
                {row.name}
              </Switch>
            </FormControl>
          ))}
        </div>
      )}
    </Box>
  )
}

const setHourAndMinute = (date: Date, existing: Date): Date =>
  setMinutes(setHours(date, existing.getHours()), existing.getMinutes())
const AvailabilityOptionRow = ({
  data,
  index,
  updateRow,
  removeRow,
  topics,
}: {
  index: number
  data: RowInterface
  updateRow: (index: number, data: RowInterface) => void
  removeRow: (index: number) => void
  topics: Array<TopicResponse>
}) => {
  const { register } = useFormContext()
  const today = new Date()
  return (
    <HStack>
      <VStack style={{ paddingBottom: 20, display: 'flex' }}>
        <HStack w="full" spacing="2">
          <FormControl id="fromDate">
            <Input
              {...register(`options.${index}.fromDate`, {
                onChange: (e) => {
                  const value = parseISO(e.target.value)
                  if (isValid(value)) return format(value, 'yyyy-MM-ddTHH:mm')
                  return value
                },
              })}
              placeholder="Start date"
            />
          </FormControl>
          <FormControl id="fromDate">
            <Input
              {...register(`options.${index}.toDate`)}
              placeholder="End date"
            />
          </FormControl>
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
        </HStack>
        <HStack w="full" spacing="2">
          <Input placeholder="Location" w="full" />
          {topics.length && (
            <Select onChange={(e) => e.target.value} w="full">
              {topics.map((topic) => (
                <option value={topic.id} key={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>
          )}
        </HStack>
      </VStack>
      <Button
        onClick={() => removeRow(index)}
        variant="ghost"
        colorScheme="red"
      >
        <AiOutlineDelete />
      </Button>
    </HStack>
  )
}
const InviteForm = ({
  data,
  updateInviteData,
  addRow,
  updateRow,
  removeRow,
}: {
  data: InvitationData
  updateInviteData: (userIds: Array<string>) => void
  addRow: () => void
  removeRow: (index: number) => void
  updateRow: (index: number, data: RowInterface) => void
}) => {
  const { data: topics } = useTopicsQuery()
  return (
    <Box p="5">
      <FormControl>
        <FormLabel>Select Communities</FormLabel>
        <CommunitySelect
          targetKeys={data.communityIds}
          onChange={updateInviteData}
        />
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
            topics={topics ?? []}
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
  const form = useForm()
  const { data, isFetched } = useInvitationByIdQuery(inviteId)
  const { mutate, isLoading } = useCreateInvitationMutation()
  const [inviteData, setInviteData] = useState<InvitationData>({
    communityIds: [],
    userIds: [],
    options: [],
  })

  const today: Date = addHours(startOfHour(new Date()), 1)
  const resetForm = () =>
    setInviteData({ userIds: [], options: [], communityIds: [] })
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

  const onSubmit = (values) =>
    mutate({ ...inviteData, ...values }, { onSuccess: onClose })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ModalCloseButton />
            <ModalHeader>{title}</ModalHeader>
            <InviteForm
              data={inviteData}
              updateInviteData={(communityIds) =>
                setInviteData({
                  ...inviteData,
                  communityIds,
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
                <Button
                  type="submit"
                  colorScheme="green"
                  variant="ghost"
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  )
}
