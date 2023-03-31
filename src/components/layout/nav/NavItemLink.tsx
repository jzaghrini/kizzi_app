import { NavItem } from './NavItem'
import { Skeleton, SkeletonCircle } from '@chakra-ui/react'
import { ComponentType, ReactElement, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface NavItemLink {
  isLoading?: boolean
  to: string
  icon?: ComponentType
  badge?: ReactElement
  iconMargin?: string
  full: boolean
  children: ReactNode
}

export const NavItemLink = ({
  isLoading,
  children,
  to,
  icon,
  badge,
  iconMargin,
  full,
}: NavItemLink) => {
  return !isLoading ? (
    // Always force reload of ember route when navigating from the sidebar
    <NavLink to={to} state={{ reload: true }}>
      {({ isActive }) => (
        <NavItem
          icon={icon}
          badge={badge}
          iconMargin={iconMargin}
          full={full}
          isActive={isActive}
        >
          {children}
        </NavItem>
      )}
    </NavLink>
  ) : (
    <NavItem icon={SkeletonCircle} full={full}>
      <Skeleton height={4}>{children}</Skeleton>
    </NavItem>
  )
}
