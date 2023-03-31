import { Center, HStack, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { FiCoffee } from 'react-icons/fi'

export const MainLogo = ({ onClick }: { onClick: () => void }) => (
  <Center alignContent="center" onClick={onClick}>
    <HStack py={6}>
      <Icon as={FiCoffee} boxSize={8} />
      <Text as="span" fontSize="2xl" letterSpacing="wider" fontWeight="bold">
        Kizzi
      </Text>
    </HStack>
  </Center>
)
