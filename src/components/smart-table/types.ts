import { TableContainerProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export interface ColumnDisplay<T> {
  key: string
  display: string
  dataKey?: string
  renderer?: (row: T) => ReactNode
}
export interface SmartTableProps<T> extends TableContainerProps {
  data?: Array<T & { id: string }>
  columns: Array<ColumnDisplay<T>>
}
