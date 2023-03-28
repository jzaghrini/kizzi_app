import './App.scss'
import router from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App, ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React from 'react'
import { RouterProvider } from 'react-router-dom'

dayjs.extend(isSameOrBefore)

const client = new QueryClient()

export const Main = () => (
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <ConfigProvider>
        <App>
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
