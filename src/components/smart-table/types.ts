import { ReactNode } from 'react'

export interface ColumnDisplay<T> {
  key: string
  display: string
  dataKey?: string
  renderer?: (row: T) => ReactNode
}
export interface SmartTableProps<T> {
  data?: Array<T & { id: string }>
  columns: Array<ColumnDisplay<T>>
}
