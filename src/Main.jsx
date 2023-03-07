import { App } from './App'
import './App.scss'
import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <App />,
    index: true,
  },
  {
    path: '/login',
    element: <div>login</div>,
  },
  {
    path: '*',
    element: <Navigate to="/signup" />,
  },
])

export const Main = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
