import type { FlexProps } from '@chakra-ui/react'
import { Center } from '@chakra-ui/react'
import { Flex, Icon, Box } from '@chakra-ui/react'
import React from 'react'

interface NavItemProps extends FlexProps {
  isActive?: boolean
  icon?: React.ComponentType
  badge?: React.ReactElement
  iconMargin?: string
  full: boolean
  children: React.ReactNode
}

export const NavItem = ({
  icon,
  children,
  full,
  isActive,
  iconMargin = '4',
  badge,
  ...rest
}: NavItemProps) => {
  return (
    <Flex
      align="center"
      px="4"
      py="4"
      cursor="pointer"
      _hover={{
        bg: 'brand.600',
      }}
      _before={
        isActive
          ? {
              content: `""`,
              position: 'absolute',
              left: 0,
              h: '7',
              border: '2px solid white',
              borderRightRadius: 'full',
            }
          : undefined
      }
      role="group"
      transition=".15s ease"
      bgColor={isActive ? 'brand.600' : 'transparent'}
      {...rest}
    >
      {icon && (
        <Center position="relative" mr={iconMargin}>
          <Icon boxSize="6" as={icon} fill="white" />
          {badge &&
            React.cloneElement(badge, {
              mr: -1,
              right: 0,
              position: 'absolute',
            })}
        </Center>
      )}
      <Box
        as="span"
        display={full ? 'initial' : { base: 'none', lg: 'initial' }}
        noOfLines={1}
        whiteSpace="nowrap"
      >
        {children}
      </Box>
    </Flex>
  )
}
