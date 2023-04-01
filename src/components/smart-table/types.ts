import { TableContainerProps, TableProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export interface ColumnDisplay<T> {
  key: string
  display: string
  dataKey?: string
  render?: (element: any, row: T) => ReactNode
}
export interface SmartTableProps<T> extends TableContainerProps {
  data?: Array<T & { id: string }>
  columns: Array<ColumnDisplay<T>>
  tableProps?: TableProps
  isLoading: boolean
}
