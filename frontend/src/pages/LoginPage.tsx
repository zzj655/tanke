import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'
import { useGameStore } from '../stores/gameStore'
import { getTheme } from '../styles/themes'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const theme = getTheme(useGameStore((s) => s.theme))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const fn = mode === 'login' ? apiClient.login : apiClient.register
      const res = await fn(username.trim(), password)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('username', res.data.username)
      useGameStore.setState({ username: res.data.username })
      navigate('/menu')
    } catch (e: any) {
      setError(e.response?.data?.detail || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.cssClass} p-4`}>
      <div className={`max-w-md w-full ${theme.cardBg} rounded-2xl p-8 border ${theme.border} border-opacity-30 shadow-2xl`}>
        <div className="flex justify-end mb-2">
          <ThemeSwitcher />
        </div>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎖️</div>
          <h1 className={`text-3xl font-bold ${theme.primary}`}>军训模拟器</h1>
          <p className={`text-sm mt-2 ${theme.dim}`}>7天军训生活体验</p>
        </div>

        <div className={`flex gap-2 mb-4 p-1 rounded-lg ${theme.buttonBg}`}>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded text-sm font-medium transition ${mode === 'login' ? `${theme.highlight} bg-black/20` : 'opacity-50'}`}
          >
            登录
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded text-sm font-medium transition ${mode === 'register' ? `${theme.highlight} bg-black/20` : 'opacity-50'}`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border ${theme.border} border-opacity-30 ${theme.cardBg} ${theme.text} text-sm focus:outline-none focus:ring-1 focus:ring-current`}
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border ${theme.border} border-opacity-30 ${theme.cardBg} ${theme.text} text-sm focus:outline-none focus:ring-1 focus:ring-current`}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg ${theme.buttonBg} ${theme.text} text-sm font-medium border ${theme.border} border-opacity-30 disabled:opacity-50`}
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>
      </div>
    </div>
  )
}
