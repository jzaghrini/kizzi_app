import {
  useAvailabilityById,
  useAvailabilityBySlug,
  useUserById,
} from '../../../data-access'
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
  return <>AvailabilityById</>
}
