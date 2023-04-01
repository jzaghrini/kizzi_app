import { localStorageKey } from '../data-access'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Logout = () => {
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem(localStorageKey)
    navigate('/')
  }, [])
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: 'auto' }}>Logout</div>{' '}
    </div>
  )
}
