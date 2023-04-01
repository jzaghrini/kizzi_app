import { SmartTableProps } from './types'
import {
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'

export const SmartTable = <T,>({
  data,
  columns,
  tableProps,
  isLoading,
  ...rest
}: SmartTableProps<T>) => {
  if (isLoading)
    return (
      <Center height={500} w="full">
        <Spinner />
      </Center>
    )
  return (
    <TableContainer {...rest}>
      <Table colorScheme="gray" {...tableProps}>
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
                    {col.render ? col.render(row[dataKey], row) : row[dataKey]}
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
