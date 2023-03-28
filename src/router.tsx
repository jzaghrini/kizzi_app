import { AppLayout } from './components/layout'
import {
  Availability,
  AvailabilityError,
  ErrorPage,
  InvitationPage,
  Login,
  ThrowErrorPage,
} from './components/page'
import { Dashboard } from './components/page/Dashboard'
import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

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
  {
    path: 'invitation',
    element: <InvitationPage />,
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
export default router
