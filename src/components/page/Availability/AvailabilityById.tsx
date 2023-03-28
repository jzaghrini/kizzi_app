import {
  useAvailabilityById,
  useAvailabilityBySlug,
  useUserById,
} from '../../../data-access'
import { Col, Row, Spin } from 'antd'
import { addDays, differenceInDays } from 'date-fns'

const availableDates = (startDate, endDate, excluded) => {
  return new Array(differenceInDays(endDate, startDate))
    .fill(null)
    .map((_, i) => addDays(startDate, i))
    .filter((x) => excluded.includes(x))
}
export const AvailabilityById = ({
  slug,
  id,
}: {
  slug?: string
  id?: string
}) => {
  const { data: byIdData, isLoading: byIdIsLoading } = useAvailabilityById(id)
  const { data: bySlugData, isLoading: bySlugIsLoading } =
    useAvailabilityBySlug(slug)
  const data = byIdData || bySlugData
  const { data: userData } = useUserById(data.userId)
  const foo = availableDates(data.startDate, data.endDate, data.excluded)
  console.log(data)
  if (!data && (byIdIsLoading || bySlugIsLoading))
    return (
      <Row style={{ minHeight: '80vh' }}>
        <Spin />
      </Row>
    )
  return (
    <Row>
      <Col></Col>
    </Row>
  )
}
