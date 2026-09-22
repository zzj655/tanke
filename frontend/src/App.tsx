import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGameStore } from './stores/gameStore'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import GamePage from './pages/GamePage'
import EndingPage from './pages/EndingPage'
import SavePage from './pages/SavePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const theme = useGameStore((s) => s.theme)

  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
          <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="/ending" element={<ProtectedRoute><EndingPage /></ProtectedRoute>} />
          <Route path="/saves" element={<ProtectedRoute><SavePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
