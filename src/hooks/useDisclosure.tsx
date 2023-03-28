import { useState } from 'react'

export const useDisclosure = (defaultIsOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!open)
  return {
    isOpen,
    open,
    toggle,
    close,
  }
}
