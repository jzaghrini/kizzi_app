import { useAppContext } from '../../context'
import { MainLogo } from './MainLogo'
import { NavItem, NavItemLink } from './nav'
import type { BoxProps } from '@chakra-ui/react'
import {
  Box,
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Spacer,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  BiSubdirectoryLeft,
  BiCategory,
  BiMailSend,
  BiWrench,
  BiLeftArrowAlt,
  BiGroup,
  BiBook,
} from 'react-icons/bi'
import {
  IoChevronBack,
  IoChevronForward,
  IoPersonCircleOutline,
} from 'react-icons/io5'
import { useLocation, Location } from 'react-router-dom'

export interface DashboardSidebarProps extends BoxProps {
  full?: boolean
}

const getUpperMenu = (location: Location) => {
  const adminPaths = [
    { to: '/dashboard', display: 'Back', icon: BiSubdirectoryLeft },
    { to: '/invitation', display: 'Invites', icon: BiMailSend },
    { to: '/users', display: 'Users', icon: BiGroup },
    { to: '/topics', display: 'Topics', icon: BiBook },
  ]
  if (
    [
      ...adminPaths.filter((x) => x.to !== '/dashboard').map(({ to }) => to),
      '/admin',
    ].some((x) => location.pathname.includes(x))
  )
    return adminPaths
  return [{ to: '/dashboard', display: 'Dashboard', icon: BiCategory }]
}

const Sidebar = ({ full = false, ...props }: DashboardSidebarProps) => {
  const location = useLocation()
  const { toggleColorMode } = useColorMode()
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
  let lowerMenu = [
    {
      to: '/user',
      display: user?.name ?? user?.email ?? 'My Account',
      icon: IoPersonCircleOutline,
    },
  ]
  if (user?.type === 'admin') {
    lowerMenu.push({
      to: '/admin',
      display: 'Admin',
      icon: BiWrench,
    })
  }
  let upperMenu = getUpperMenu(location)
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
        {upperMenu.map(({ to, icon, display }) => (
          <NavItemLink
            key={to}
            to={to}
            icon={icon}
            full={full}
            isLoading={isLoading}
          >
            {display}
          </NavItemLink>
        ))}
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
      </Flex>
      <Spacer />
      <Flex direction="column" as="nav" fontSize="md">
        <Divider borderColor="brand.600" />
        {lowerMenu.map(({ to, icon, display }) => (
          <NavItemLink
            key={to}
            to={to}
            icon={icon}
            iconMargin="1"
            full={full}
            isLoading={isLoading}
          >
            {display}
          </NavItemLink>
        ))}
        <Divider borderColor="brand.600" />
        <NavItem icon={BiLeftArrowAlt} full={full} onClick={onLogout}>
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
