import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from './components/layout/DashboardLayout'
import TopProgressBar from './components/ui/TopProgressBar'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import HackathonsPage from './pages/HackathonsPage'
import TeamsPage from './pages/TeamsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import SubmissionsPage from './pages/SubmissionsPage'
import ProfilePage from './pages/ProfilePage'

// Optional: network banner (safe)
import { apiGet } from './utils/api'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const GlobalNetworkBanner = () => {
  const [isDisconnected, setIsDisconnected] = React.useState(false)

  React.useEffect(() => {
    const handleDisconnect = () => setIsDisconnected(true)
    window.addEventListener('api_disconnected', handleDisconnect)

    let interval
    if (isDisconnected) {
      interval = setInterval(async () => {
        try {
          const res = await apiGet('/health')
          if (res?.status === 'OK') {
            setIsDisconnected(false)
            window.dispatchEvent(new Event('api_reconnected'))
          }
        } catch {}
      }, 5000)
    }

    return () => {
      window.removeEventListener('api_disconnected', handleDisconnect)
      clearInterval(interval)
    }
  }, [isDisconnected])

  if (!isDisconnected) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-[9999] flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <AlertTriangle size={20} />
        <span>System Disconnected - Reconnecting...</span>
      </div>
      <RefreshCw size={18} className="animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <TopProgressBar />
          <GlobalNetworkBanner />

          <AppProvider>
            <Routes>

              {/* ✅ Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ✅ Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="hackathons" element={<HackathonsPage />} />
                <Route path="hackathons/:id" element={<HackathonsPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route path="submissions" element={<SubmissionsPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* ✅ FIXED fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </AppProvider>

        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
