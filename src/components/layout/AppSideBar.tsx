import { useAppContext } from '../../context'
import { MainLogo } from './MainLogo'
import { NavItem, NavItemLink } from './nav'
import type { BoxProps } from '@chakra-ui/react'
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { Box, Flex, Divider, Spacer } from '@chakra-ui/react'
import { ReactNode, useEffect, useState } from 'react'
import { BiSubdirectoryRight } from 'react-icons/bi'
import {
  IoPersonCircleOutline,
  IoLogOutOutline,
  IoChevronForward,
  IoChevronBack,
  IoClose,
  IoSettingsOutline,
} from 'react-icons/io5'
import { MdAddLink } from 'react-icons/md'
import { useLocation } from 'react-router-dom'

export interface DashboardSidebarProps extends BoxProps {
  full?: boolean
}

export interface AppSidebarLayoutProps extends BoxProps {
  showCloseButton?: boolean
  onClose?: () => void
  children?: ReactNode
  overlap?: boolean
}

const Sidebar = ({ full = false, ...props }: DashboardSidebarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { onLogout, user, isLoading } = useAppContext()
  const [isCollapsed, setCollapsed] = useState<boolean>(false)
  const openDrawer = () => setCollapsed(false)
  const showCollapse = useBreakpointValue(
    { base: false, md: !full },
    { ssr: false }
  )
  const w = useBreakpointValue(
    { base: 0, md: 14, lg: isCollapsed ? 14 : 52 },
    { ssr: false }
  )
  const isSmallScreen = useBreakpointValue(
    { base: !full, lg: false },
    { ssr: false }
  )
  const isAdmin = user?.type === 'admin'

  return (
    <Box
      as="nav"
      pos="sticky"
      zIndex="sticky"
      h="100vh"
      bg="brand.500"
      transition="width 0.2s"
      w={full ? 'full' : w}
      display="flex"
      flexDirection="column"
      role="group"
      {...props}
    >
      <Flex h="56px" pos="relative" shadow="sm">
        <Flex px="4" align="center" overflowX="hidden">
          <MainLogo onClick={toggleColorMode} />
        </Flex>
        {showCollapse && (
          <IconButton
            pos="absolute"
            bottom={-4}
            right={-3}
            colorScheme="brand"
            size="sm"
            icon={
              isCollapsed || isSmallScreen ? (
                <IoChevronForward />
              ) : (
                <IoChevronBack />
              )
            }
            aria-label="Expand sidebar"
            rounded="full"
            opacity="0"
            zIndex="sticky"
            _groupHover={{ opacity: 1 }}
            onClick={() =>
              isSmallScreen ? openDrawer() : setCollapsed(!isCollapsed)
            }
          />
        )}
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="md"
        color="white"
        aria-label="Main Navigation"
        overflowY="auto"
      >
        <NavItemLink
          to="/dashboard/main"
          icon={BiSubdirectoryRight}
          full={full}
          isLoading={isLoading}
        >
          Pricing
        </NavItemLink>
      </Flex>
      <Divider borderColor="brand.600" />
      <Flex
        direction="column"
        as="nav"
        fontSize="md"
        color="white"
        flexShrink={1}
      >
        {/*<NavItemLink*/}
        {/*  to="/dashboard/user/accounts"*/}
        {/*  icon={MdLink}*/}
        {/*  badge={*/}
        {/*    invalidAccounts > 0 ? (*/}
        {/*      <NavItemBadge*/}
        {/*        tooltip={t('validation:brokenAccounts', {*/}
        {/*          count: invalidAccounts,*/}
        {/*        })}*/}
        {/*      >*/}
        {/*        {invalidAccounts}*/}
        {/*      </NavItemBadge>*/}
        {/*    ) : undefined*/}
        {/*  }*/}
        {/*  full={full}*/}
        {/*  isLoading={isLoading}*/}
        {/*>*/}
        {/*  {t('generic:dashboard.manageAccounts')}*/}
        {/*</NavItemLink>*/}
        <NavItemLink
          to="/dashboard/accounts"
          icon={MdAddLink}
          full={full}
          isLoading={isLoading}
        >
          Link Account
        </NavItemLink>
      </Flex>
      <Spacer />
      <Flex direction="column" as="nav" fontSize="md">
        <Divider borderColor="brand.600" />
        <NavItemLink
          to="/dashboard/user"
          icon={IoPersonCircleOutline}
          iconMargin="1"
          full={full}
          isLoading={isLoading}
        >
          {user?.name ?? user?.email ?? 'My account'}
        </NavItemLink>
        <Divider borderColor="brand.600" />
        {isAdmin && (
          <NavItemLink
            to="/dashboard/admin"
            icon={IoSettingsOutline}
            iconMargin="1"
            full={full}
            isLoading={isLoading}
          >
            Admin
          </NavItemLink>
        )}
        <NavItem icon={IoLogOutOutline} full={full} onClick={onLogout}>
          Logout
        </NavItem>
      </Flex>
    </Box>
  )
}

export const AppSidebar = () => {
  const {
    sidebar: { isOpen, onClose },
  } = useAppContext()
  const location = useLocation()

  useEffect(() => {
    onClose()
  }, [location, onClose])
  return (
    <>
      <Sidebar display={{ base: 'none', md: 'flex' }} />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="sidebar">
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar borderRight="none" full />
        </DrawerContent>
      </Drawer>
    </>
  )
}
