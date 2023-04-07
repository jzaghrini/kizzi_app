import { useDeleteTopicMutation, useTopicsQuery } from '../../data-access'
import { SmartTable } from '../smart-table'
import { TopicModal } from './TopicModal'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BiEdit, BiTrash } from 'react-icons/bi'

export const TopicsPage = () => {
  const { data, isLoading } = useTopicsQuery()
  const { mutate, isLoading: isDeleting } = useDeleteTopicMutation()
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: false })
  const [topicId, setTopicId] = useState<string | null>(null)

  const columns = [
    { key: 'name', display: 'Name' },
    { key: 'keyword', display: 'Keyword' },
    { key: 'topicText', display: 'Text' },
    { key: 'disabled', display: 'Disabled' },
    {
      key: 'actions',
      display: '',
      render: (_, row) => (
        <ButtonGroup>
          <IconButton
            colorScheme="gray"
            aria-label="edit-user"
            variant="ghost"
            disabled={isDeleting}
            onClick={() => setTopicId(row.id)}
            icon={<BiEdit />}
          />
          {!row.deleted && (
            <IconButton
              colorScheme="red"
              aria-label="delete-user"
              variant="ghost"
              isLoading={isDeleting}
              icon={<BiTrash />}
              onClick={() =>
                mutate(row.id, { onSuccess: (data) => console.log(data) })
              }
            />
          )}
        </ButtonGroup>
      ),
    },
  ]

  useEffect(() => {
    if (topicId) onOpen()
  }, [topicId, onOpen])

  return (
    <Box h="full" w="full" p="5">
      <TopicModal
        topicId={topicId}
        isOpen={isOpen}
        onClose={() => {
          setTopicId(null)
          onClose()
        }}
      />
      <Flex pb="5">
        <Text fontWeight="bold" fontSize="lg">
          Topics
        </Text>
        <Spacer />
        <Button
          size="sm"
          onClick={onOpen}
          colorScheme="gray"
          leftIcon={<AiOutlinePlus />}
        >
          Create Topic
        </Button>
      </Flex>
      <SmartTable
        data={data}
        columns={columns}
        sx={{ height: 'full', overflowY: 'scroll' }}
        isLoading={isLoading}
        tableProps={{ size: 'sm' }}
        pb="10"
      />
    </Box>
  )
}
