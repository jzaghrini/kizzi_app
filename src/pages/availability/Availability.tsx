import { AvailabilityById } from './AvailabilityById'
import { PageView } from './PageView'
import { useSearchParams } from 'react-router-dom'

export const Availability = () => {
  const [searchParams, _] = useSearchParams()
  const id = searchParams.get('id')
  const slug = searchParams.get('slug')
  if (!slug && !id) return <PageView />
  return <AvailabilityById slug={slug} id={id} />
}
