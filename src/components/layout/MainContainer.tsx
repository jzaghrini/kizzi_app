import { Center, Flex, useColorModeValue } from '@chakra-ui/react'
import type { ReactNode } from 'react'

export const MainContainer = ({ children }: { children: ReactNode }) => {
  const bg = useColorModeValue('gray.50', 'gray.950')
  const color = useColorModeValue('white', 'brand.800')
  return (
    <Center
      h="100vh"
      overflowY="auto"
      backgroundColor={bg}
      py={{ base: 0, lg: 1 }}
    >
      <Flex
        backgroundColor={color}
        rounded="base"
        shadow={{ base: 'none', md: 'lg' }}
        height={{ base: 'full', sm: 'auto' }}
        minH={{ sm: 'lg' }}
        maxW={{
          base: 'full',
          xl: 'container.lg',
        }}
        margin="auto"
      >
        {children}
      </Flex>
    </Center>
  )
}
