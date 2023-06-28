import { AppLayout } from './components/layout'
import { TopicsPage } from './components/topics'
import { UserPage } from './components/user'
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
  Dashboard,
} from './pages'
import React from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const token = localStorage.getItem(localStorageKey)
  if (token) return <Navigate to="/availability" />
  return <Navigate to="/login" />
}

const appRoutes = [
  {
    path: 'error',
    element: <ThrowErrorPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'availability',
    element: <Availability />,
    index: true,
    errorElement: <AvailabilityError />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: 'invitation',
    element: <InvitationPage />,
  },
  { path: 'users', element: <UserPage /> },
  { path: 'topics', element: <TopicsPage /> },
  {
    path: 'admin',
    element: <Admin />,
  },
]
const privateRoutes = [
  { index: true, element: <PrivateRoute /> },
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
