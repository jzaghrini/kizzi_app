import { AppLayout } from './components/layout'
import { localStorageKey } from './data-access'
import {
  Admin,
  Availability,
  AvailabilityError,
  ErrorPage,
  InvitationPage,
  Login,
  Logout,
  ThrowErrorPage,
} from './page'
import { Dashboard } from './page/Dashboard'
import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const token = localStorage.getItem(localStorageKey)
  if (token) return <Navigate to="/dashboard" />
  return <Navigate to="/login" />
}

const appRoutes = [
  {
    path: 'main',
    element: <Dashboard />,
    index: true,
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
  { index: true, element: <PrivateRoute /> },
  {
    path: '/dashboard',
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
