import { useAppContext } from '../../../context'
import { Flex, Icon, IconButton, useColorModeValue } from '@chakra-ui/react'
import React, { ReactNode } from 'react'
import { IoApps } from 'react-icons/io5'

export const AppNavbar = ({ children }: { children?: ReactNode }) => {
  const bgColor = useColorModeValue('white', 'black')
  const color = useColorModeValue('black', 'white')
  const {
    sidebar: { onToggle },
  } = useAppContext()
  return (
    <Flex
      alignItems="center"
      h="14"
      w="full"
      boxShadow="base"
      bgColor={{ base: 'brand.500', md: bgColor }}
      color={{ base: color, md: 'brand.500' }}
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyItems="center"
        w="14"
        display={{ base: 'inherit', md: 'none' }}
      >
        <IconButton
          aria-label="Toggle menu"
          colorScheme="brand"
          icon={<Icon as={IoApps} />}
          onClick={onToggle}
        />
      </Flex>
      <Flex alignItems="center" as="nav" flex="1" px={{ base: '4', md: '8' }}>
        {children}
      </Flex>
    </Flex>
  )
}
