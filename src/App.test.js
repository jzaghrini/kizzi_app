import Main from './Main'
import { render, screen } from '@testing-library/react'

test('renders learn react link', () => {
  render(<Main />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
