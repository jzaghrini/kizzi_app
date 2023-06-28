import {
  AvailabilityOptionResponse,
  AvailabilityResponse,
  useAvailabilityByIdMutation,
  useAvailabilityBySlug,
  useUserById,
} from '../../data-access'
import {
  Box,
  Button,
  Divider,
  HStack,
  Slider,
  Switch,
  Text,
} from '@chakra-ui/react'
import { addDays, differenceInDays, format } from 'date-fns'
import React, { useState } from 'react'

const availableDates = (startDate, endDate, excluded) => {
  return new Array(differenceInDays(endDate, startDate))
    .fill(null)
    .map((_, i) => addDays(startDate, i))
    .filter((x) => excluded.includes(x))
}
export const AvailabilityOptionRow = ({
  slugs,
  data,
  onChange,
}: {
  slugs: Array<string>
  onChange: (newSlug: string) => void
  data: AvailabilityResponse
}) => {
  return (
    <Box py={5}>
      <HStack spacing={2}>
        <Text>
          {`${format(data.fromDate, 'PP HH:mm')} - ${format(
            data.toDate,
            'PP HH:mm'
          )}`}
        </Text>
        <Switch
          isChecked={slugs.includes(data.slug)}
          onChange={() => onChange(data.slug)}
        />
      </HStack>
    </Box>
  )
}
export const AvailabilityBySlug = ({ slug }: { slug: string }) => {
  const { data, isLoading: isLoadingData } = useAvailabilityBySlug(slug)
  const { mutate, isLoading: isSaving } = useAvailabilityByIdMutation()
  const isLoading = isLoadingData || isSaving
  const [slugs, setSlugs] = useState<Array<string>>([])
  const onChange = (newSlug: string) => {
    let newSlugs = [...slugs, newSlug]
    if (slugs.includes(newSlug))
      newSlugs = newSlugs.filter((x) => x !== newSlug)
    setSlugs(newSlugs)
  }
  return (
    <Box p={5}>
      <Text as="h3" fontWeight="bold">
        Availability
      </Text>
      <Divider />
      {data?.map((data) => (
        <AvailabilityOptionRow
          key={data.slug}
          slugs={slugs}
          data={data}
          onChange={onChange}
        />
      ))}
      <Button
        colorScheme="green"
        onClick={() => {
          mutate({ id: data?.id as string, slugs: slugs })
        }}
        isDisabled={!data?.id}
        isLoading={isLoading}
      >
        Save
      </Button>
    </Box>
  )
}
