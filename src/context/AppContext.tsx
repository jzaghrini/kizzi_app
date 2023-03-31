import { localStorageKey, UserResponse, useUserQuery } from '../data-access'
import { UseDisclosureReturn } from '@chakra-ui/hooks/dist/use-disclosure'
import { useDisclosure } from '@chakra-ui/react'
import { AxiosError, isAxiosError } from 'axios'
import { createContext, ReactNode, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

interface IAppContext {
  isLoggedIn: () => boolean
  onLogout: () => void
  user?: UserResponse
  isLoading: boolean
  sidebar: UseDisclosureReturn
}

const AppContext = createContext<IAppContext | null>(null)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const sideBar = useDisclosure({ defaultIsOpen: false })
  const navigate = useNavigate()
  const token = localStorage.getItem(localStorageKey)
  const onLogout = () => {
    localStorage.removeItem(localStorageKey)
    navigate('/login')
  }
  const { data, isLoading } = useUserQuery({
    onError: (err: Error | AxiosError) => {
      if (isAxiosError(err)) {
        if (err.response.status == 401) navigate('/login')
        throw err
      }
      throw err
    },
  })
  return (
    <AppContext.Provider
      value={{
        isLoggedIn: () => !!token,
        onLogout,
        user: data,
        isLoading,
        sidebar: sideBar,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('Context must be defined within a provider')
  return context
}
