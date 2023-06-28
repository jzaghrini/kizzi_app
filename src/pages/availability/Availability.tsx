import { AvailabilityBySlug } from './AvailabilityBySlug'
import { PageView } from './PageView'
import { useSearchParams } from 'react-router-dom'

export const Availability = () => {
  const [searchParams, _] = useSearchParams()
  const slug = searchParams.get('slug')
  if (!slug) return <PageView />
  return <AvailabilityBySlug slug={slug} />
}
