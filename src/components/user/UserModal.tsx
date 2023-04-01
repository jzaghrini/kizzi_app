import {
  useUpdateUserMutation,
  useUserById,
  useCreateUserMutation,
  CreateUserRequest,
  UpdateUserRequest,
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
import React from 'react'
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
}: UserFormProps) => {
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
  const onSubmit = (data: CreateUserRequest) => {
    const submitData = replaceObjectWithNull(data)
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
  const { data, isLoading } = useUserById(userId)
  const title = userId ? 'Update user' : 'Create User'
  const defaultValues = userId
    ? data
    : {
        name: '',
        email: null,
        phoneNumber: null,
      }
  console.log(data)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {isLoading ? (
          <Spinner />
        ) : (
          <UserForm
            userId={userId}
            title={title}
            defaultValues={defaultValues}
            closeModal={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
