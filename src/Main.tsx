import './App.scss'
import { AppLayout } from './components/layout'
import {
  Availability,
  AvailabilityError,
  ErrorPage,
  Login,
  ThrowErrorPage,
} from './components/page'
import { Dashboard } from './components/page/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App, ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

dayjs.extend(isSameOrBefore)

const appRoutes = [
  {
    index: true,
    element: <Navigate to="/login" />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: 'error',
    element: <ThrowErrorPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'availability',
    element: <Availability />,
    errorElement: <AvailabilityError />,
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: appRoutes,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

const client = new QueryClient()

export const Main = () => (
  <React.StrictMode>
    <ConfigProvider>
      <App>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </App>
    </ConfigProvider>
  </React.StrictMode>
)
