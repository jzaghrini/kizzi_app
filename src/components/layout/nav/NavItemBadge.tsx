import { Badge, Tooltip } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface NavItemLinkProps {
  tooltip?: string
  children: ReactNode
}

export function NavItemBadge({
  tooltip,
  children,
  ...props
}: NavItemLinkProps) {
  return (
    <Tooltip label={tooltip} position="absolute" right={0} mr={-1}>
      <Badge
        bgColor="error.400"
        color="white"
        borderRadius="full"
        border="1px"
        borderColor="brand.500"
        fontSize="xx-small"
        {...props}
      >
        {children}
      </Badge>
    </Tooltip>
  )
}
