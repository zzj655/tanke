import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { getTheme } from '../styles/themes'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function MenuPage() {
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()
  const { username, startGame, loading, logout, theme: themeName } = useGameStore()
  const theme = getTheme(themeName)

  const handleStart = async () => {
    const name = playerName.trim() || '李明'
    await startGame(name)
    navigate('/game')
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.cssClass} p-4`}>
      <div className={`max-w-md w-full ${theme.cardBg} rounded-2xl p-8 border ${theme.border} border-opacity-30 shadow-2xl`}>
        <div className="flex justify-end mb-4">
          <ThemeSwitcher />
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎖️</div>
          <h1 className={`text-3xl font-bold ${theme.primary}`}>军训模拟器</h1>
          <p className={`text-sm mt-2 ${theme.dim}`}>欢迎，{username}！</p>
        </div>

        <div className="space-y-3 mb-4">
          <label className={`text-xs ${theme.dim}`}>输入你的名字</label>
          <input
            type="text"
            placeholder="李明"
            value={playerName}
            maxLength={10}
            onChange={(e) => setPlayerName(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border ${theme.border} border-opacity-30 bg-transparent ${theme.text} text-sm focus:outline-none focus:ring-1 focus:ring-current`}
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={handleStart}
            disabled={loading}
            className={`w-full py-3 rounded-lg ${theme.buttonBg} ${theme.text} text-sm font-bold border ${theme.border} border-opacity-30 disabled:opacity-50`}
          >
            {loading ? '加载中...' : '🚀 开始新游戏'}
          </button>
          <button
            onClick={() => navigate('/saves')}
            className={`w-full py-3 rounded-lg ${theme.buttonBg} ${theme.text} text-sm font-medium border ${theme.border} border-opacity-30`}
          >
            💾 存档管理
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className={`w-full py-2.5 rounded-lg ${theme.text} text-xs opacity-60 hover:opacity-100`}
          >
            退出登录
          </button>
        </div>

        <div className={`mt-6 pt-4 border-t ${theme.border} border-opacity-20`}>
          <p className={`text-xs ${theme.dim} text-center`}>
            7天军训 · 76个事件 · 23种结局 · 5套主题
          </p>
        </div>
      </div>
    </div>
  )
}
