import { AppLayout } from './components/layout'
import {
  Admin,
  Availability,
  AvailabilityError,
  ErrorPage,
  InvitationPage,
  Login,
  Logout,
  ThrowErrorPage,
} from './components/page'
import { Dashboard } from './components/page/Dashboard'
import { localStorageKey } from './data-access'
import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

const appRoutes = [
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
  {
    path: 'admin',
    element: <Admin />,
  },
]
const privateRoutes = [
  {
    path: '/',
    element: <AppLayout />,
    children: appRoutes,
  },
]
const publicRoutes = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'logout',
    element: <Logout />,
  },
  ...privateRoutes,
]
const router = createBrowserRouter(publicRoutes)
export default router
