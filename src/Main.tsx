import router from './router'
import theme from './theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      useErrorBoundary: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

export const Main = () => (
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
)
