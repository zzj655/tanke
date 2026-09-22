import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { getTheme } from '../styles/themes'
import ThemeSwitcher from '../components/ThemeSwitcher'

const GRADE_COLORS: Record<string, string> = {
  'S': 'text-yellow-400',
  'A': 'text-green-400',
  'B': 'text-blue-400',
  'C': 'text-gray-400',
  'D': 'text-red-400',
}

export default function EndingPage() {
  const navigate = useNavigate()
  const { gameState, theme: themeName } = useGameStore()
  const theme = getTheme(themeName)

  if (!gameState || !gameState.endings) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
        <button onClick={() => navigate('/menu')} className={`${theme.text} underline`}>
          返回主菜单
        </button>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.cssClass} p-4`}>
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex justify-end mb-4">
          <ThemeSwitcher />
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="text-6xl mb-4">🎖️</div>
          <h1 className={`text-4xl font-bold ${theme.primary} mb-2`}>游戏结束</h1>
          <p className={`text-lg ${theme.highlight}`}>军训结束</p>
          <p className={`text-sm mt-2 ${theme.dim}`}>你坚持完成了7天军训！</p>
        </div>

        {/* Score */}
        <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} border-opacity-30 shadow-lg mb-6 text-center`}>
          <p className={`text-sm ${theme.dim} mb-2`}>最终评分</p>
          <div className="flex items-center justify-center gap-4">
            <span className={`text-5xl font-bold ${GRADE_COLORS[gameState.grade || 'D'] || 'text-gray-400'}`}>
              {gameState.grade || 'D'}
            </span>
            <div className="text-left">
              <div className={`text-3xl font-bold ${theme.highlight}`}>{gameState.score}</div>
              <div className={`text-xs ${theme.dim}`}>/ 100</div>
            </div>
          </div>
        </div>

        {/* Endings */}
        <div className="space-y-4 mb-8">
          <h2 className={`text-lg font-bold ${theme.primary} text-center`}>你的军训结局</h2>
          {gameState.endings.map((ending, i) => (
            <div
              key={i}
              className={`event-card ${theme.cardBg} rounded-xl p-5 border ${theme.border} border-opacity-30 shadow-lg`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{['🏆', '🌟', '💪'][i] || '✨'}</span>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold ${theme.highlight} mb-2`}>{ending.title}</h3>
                  <p className={`text-sm leading-relaxed ${theme.text} opacity-90`}>
                    {ending.description}
                  </p>
                  {ending.tags && ending.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {ending.tags.map((tag, ti) => (
                        <span key={ti} className="text-xs px-2 py-0.5 rounded-full bg-white/10 opacity-70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Player summary */}
        <div className={`${theme.cardBg} rounded-xl p-4 border ${theme.border} border-opacity-30 mb-6`}>
          <h3 className={`text-sm font-bold ${theme.primary} mb-3`}>角色：{gameState.player_name}</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>体力: {gameState.attributes.stamina}</div>
            <div>纪律: {gameState.attributes.discipline}</div>
            <div>心情: {gameState.attributes.mood}</div>
            <div>教官好感: {gameState.attributes.instructor_favor}</div>
            <div>同学关系: {gameState.attributes.classmate_relation}</div>
            <div>健康: {gameState.attributes.health}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/menu')}
            className={`px-6 py-2.5 rounded-lg ${theme.buttonBg} ${theme.text} text-sm font-medium border ${theme.border} border-opacity-30`}
          >
            返回主菜单
          </button>
          <button
            onClick={() => navigate('/saves')}
            className={`px-6 py-2.5 rounded-lg ${theme.buttonBg} ${theme.text} text-sm font-medium border ${theme.border} border-opacity-30`}
          >
            存档管理
          </button>
        </div>
      </div>
    </div>
  )
}
