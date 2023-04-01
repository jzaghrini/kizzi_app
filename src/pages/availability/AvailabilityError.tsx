import { Link, useRouteError } from 'react-router-dom'

export const AvailabilityError = () => {
  const error = useRouteError()
  console.error(error)
  return (
    <div id="availability-error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/signup">Back</Link>
    </div>
  )
}
