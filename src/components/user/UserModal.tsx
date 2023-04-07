import {
  useUpdateUserMutation,
  useUserById,
  useCreateUserMutation,
  CreateUserRequest,
  UpdateUserRequest,
  useCommunityQuery,
  CommunityResponse,
} from '../../data-access'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import { MultiSelect, useMultiSelect } from 'chakra-multiselect'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface UserModelProps {
  userId?: string
  isOpen: boolean
  onClose: () => void
}

interface UserFormProps {
  userId?: string
  title: string
  defaultValues: CreateUserRequest
  closeModal: () => void
  communities: Array<CommunityResponse>
}
const replaceObjectWithNull = (data) =>
  Object.entries(data).reduce((acc, cur) => {
    const [key, value] = cur
    acc[key] = value !== '' ? value : null
    return acc
  }, {})
const UserForm = ({
  userId,
  title,
  defaultValues,
  closeModal,
  communities,
}: UserFormProps) => {
  const [communityIds, setCommunityIds] = useState<Array<string>>(
    defaultValues.communityIds
  )
  const { mutate: createMutate, isLoading: isCreating } =
    useCreateUserMutation()
  const { mutate: updateMutate, isLoading: isUpdating } =
    useUpdateUserMutation(userId)
  const isSaving = isCreating || isUpdating
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserRequest>({
    defaultValues: defaultValues,
  })

  const onClose = () => {
    reset()
    closeModal()
  }
  const communityLookup = communities.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: cur.name, [cur.name]: cur.id }),
    {}
  )
  const onSubmit = (data: CreateUserRequest) => {
    const submitData = replaceObjectWithNull({ ...data, communityIds })
    if (userId) {
      updateMutate(submitData as UpdateUserRequest, { onSuccess: onClose })
      return
    }
    createMutate(submitData as CreateUserRequest, { onSuccess: onClose })
  }
  const fields = watch(['email', 'phoneNumber'])
  const isDisabled = fields.every((x) => x === '')
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <Box p={5}>
        <VStack spacing="5">
          <FormControl isInvalid={!!errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input {...register('name', { required: true })} />
          </FormControl>
          <FormControl isInvalid={!!errors?.phoneNumber}>
            <FormLabel>Phone Number</FormLabel>
            <InputGroup>
              <InputLeftAddon children="+1" />
              <Input
                type="tel"
                placeholder="Phone Number"
                {...register('phoneNumber', {
                  setValueAs: (v) => (!v ? v : `+1${v}`),
                })}
              />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              {...register('email', {
                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Communities</FormLabel>
            <MultiSelect
              onChange={(e) => {
                const ids = (e as Array<string>).map((x) => communityLookup[x])
                setCommunityIds(ids)
              }}
              value={communityIds.map((name) => communityLookup[name])}
              options={communities.map((x) => ({
                value: x.name,
                label: x.name,
              }))}
              w="full"
            />
          </FormControl>
        </VStack>
      </Box>
      <ModalFooter>
        <ButtonGroup>
          <Button onClick={onClose} colorScheme="gray" variant="ghost">
            Close
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            variant="ghost"
            isLoading={isSaving}
            isDisabled={isDisabled}
          >
            Save
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </form>
  )
}
export const UserModal = ({ userId, isOpen, onClose }: UserModelProps) => {
  const { data: communities, isLoading: communitiesIsLoading } =
    useCommunityQuery()
  const { data, isLoading: userIsLoading } = useUserById(userId)
  const title = userId ? 'Update user' : 'Create User'
  const isLoading = userIsLoading || communitiesIsLoading
  const defaultValues = userId
    ? data
    : {
        name: '',
        email: null,
        phoneNumber: null,
        communityIds: [],
      }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {userId && isLoading ? (
          <Spinner />
        ) : (
          <UserForm
            userId={userId}
            title={title}
            defaultValues={defaultValues}
            closeModal={onClose}
            communities={communities}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
