import {
  useTopicById,
  useCreateTopicMutation,
  CreateTopicRequest,
  UpdateTopicRequest,
  useUpdateTopicMutation,
} from '../../data-access'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

interface TopicModalProps {
  topicId?: string
  isOpen: boolean
  onClose: () => void
}

interface TopicFormProps {
  topicId?: string
  title: string
  defaultValues: CreateTopicRequest
  closeModal: () => void
}
const replaceObjectWithNull = (data) =>
  Object.entries(data).reduce((acc, cur) => {
    const [key, value] = cur
    acc[key] = value !== '' ? value : null
    return acc
  }, {})
const TopicForm = ({
  topicId,
  title,
  defaultValues,
  closeModal,
}: TopicFormProps) => {
  const { mutate: createMutate, isLoading: isCreating } =
    useCreateTopicMutation()
  const { mutate: updateMutate, isLoading: isUpdating } =
    useUpdateTopicMutation(topicId)
  const isSaving = isCreating || isUpdating
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTopicRequest>({
    defaultValues: defaultValues,
  })

  const onClose = () => {
    reset()
    closeModal()
  }
  const onSubmit = (data: CreateTopicRequest) => {
    const submitData = replaceObjectWithNull(data)
    if (topicId) {
      updateMutate(submitData as UpdateTopicRequest, { onSuccess: onClose })
      return
    }
    createMutate(submitData as CreateTopicRequest, { onSuccess: onClose })
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
          <FormControl isInvalid={!!errors?.keyword}>
            <FormLabel>Keyword</FormLabel>
            <Input {...register('keyword', { required: true })} />
          </FormControl>
          <FormControl>
            <FormLabel>Text</FormLabel>
            <Textarea {...register('text')} />
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
          >
            Save
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </form>
  )
}
export const TopicModal = ({ topicId, isOpen, onClose }: TopicModalProps) => {
  const { data, isLoading } = useTopicById(topicId)
  const title = topicId ? 'Update topic' : 'Create topic'
  const defaultValues =
    topicId && data
      ? { name: data.name, keyword: data.keyword, text: data.topicText }
      : {
          name: '',
          keyword: '',
          text: '',
        }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {topicId && isLoading ? (
          <Spinner />
        ) : (
          <TopicForm
            topicId={topicId}
            title={title}
            defaultValues={defaultValues}
            closeModal={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
