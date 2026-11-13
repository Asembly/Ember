import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Achievements from './pages/Achievements'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import { setUnauthorizedHandler } from './api/client'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'

function RequireAuth({ children }) {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function PublicOnly({ children }) {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  if (status === 'authenticated') {
    const from = location.state?.from
    return <Navigate to={from && from !== '/login' ? from : '/'} replace />
  }

  return children
}

export default function App() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      useAuthStore.getState().handleUnauthorized()
    })

    return () => setUnauthorizedHandler(null)
  }, [])

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="history" element={<History />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
