import { SmartTableProps } from './types'
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

export const SmartTable = <T,>({ data, columns }: SmartTableProps<T>) => {
  return (
    <TableContainer>
      <Table colorScheme="brand">
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th key={column.key}>{column.display}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {(data ?? []).map((row, index) => (
            <Tr key={row.id}>
              {columns.map((col) => {
                const dataKey = col.dataKey ?? col.key
                return (
                  <Td key={`${row.id}-${col.key}`}>
                    {col.renderer ? col.renderer(row) : row[dataKey]}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
