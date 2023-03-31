import {
  useUpdateUserMutation,
  useUserById,
  useCreateUserMutation,
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
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

interface UserModelProps {
  userId?: string
  isOpen: boolean
  onClose: () => void
}

interface CreateUserRequest {
  id?: string
  name: string
  email?: string
  phoneNumber?: string
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
  const mutate = userId ? updateMutate : createMutate
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
  const onSubmit = (data: CreateUserRequest) => {
    mutate(replaceObjectWithNull(data) as CreateUserRequest, {
      onSuccess: () => {
        onClose()
      },
    })
  }
  const fields = watch(['email', 'phoneNumber'])
  const isDisabled = fields.every((x) => x === '')
  const onClose = () => {
    reset()
    closeModal()
  }
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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <UserForm
          userId={userId}
          title={title}
          defaultValues={{
            id: userId,
            name: '',
            email: null,
            phoneNumber: null,
          }}
          closeModal={onClose}
        />
      </ModalContent>
    </Modal>
  )
}
