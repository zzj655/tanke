import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { getTheme } from '../styles/themes'
import { SaveInfo } from '../api/client'
import ThemeSwitcher from '../components/ThemeSwitcher'

export default function SavePage() {
  const navigate = useNavigate()
  const { theme: themeName, listSaves, loadGame, saveGame, deleteSave, gameState } = useGameStore()
  const theme = getTheme(themeName)
  const [saves, setSaves] = useState<SaveInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    try {
      const data = await listSaves()
      setSaves(data)
    } catch {
      // ignore
    }
  }

  const handleLoad = async (slot: number) => {
    setLoading(true)
    await loadGame(slot)
    setLoading(false)
    navigate('/game')
  }

  const handleSave = async (slot: number) => {
    if (!gameState) {
      alert('没有进行中的游戏')
      return
    }
    setLoading(true)
    try {
      const msg = await saveGame(slot)
      alert(msg)
      await refresh()
    } catch {
      alert('保存失败')
    }
    setLoading(false)
  }

  const handleDelete = async (slot: number) => {
    if (!confirm(`确定删除槽位${slot}的存档？`)) return
    await deleteSave(slot)
    await refresh()
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.cssClass} p-4`}>
      <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${theme.primary}`}>存档管理</h1>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <button onClick={() => navigate(gameState ? '/game' : '/menu')} className="text-xs opacity-70 hover:opacity-100">
              返回
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {saves.map((save) => (
            <div
              key={save.slot}
              className={`${theme.cardBg} rounded-xl p-4 border ${theme.border} border-opacity-30 shadow-lg flex items-center justify-between`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${theme.primary}`}>槽位 {save.slot}</span>
                  {save.exists ? (
                    <>
                      <span className={`text-sm ${theme.text}`}>{save.player_name}</span>
                      <span className="text-xs opacity-50">第{save.day}天</span>
                    </>
                  ) : (
                    <span className={`text-xs ${theme.dim}`}>空槽位</span>
                  )}
                </div>
                {save.exists && (
                  <p className="text-xs opacity-50">
                    {save.updated_at || save.created_at}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {save.exists && (
                  <>
                    <button
                      onClick={() => handleLoad(save.slot)}
                      disabled={loading}
                      className={`text-xs px-3 py-1.5 rounded ${theme.buttonBg} ${theme.text} border ${theme.border} border-opacity-30 disabled:opacity-50`}
                    >
                      读取
                    </button>
                    <button
                      onClick={() => handleDelete(save.slot)}
                      className="text-xs px-3 py-1.5 rounded bg-red-900/50 text-red-200 border border-red-500/30 hover:bg-red-900/70"
                    >
                      删除
                    </button>
                  </>
                )}
                {gameState && (
                  <button
                    onClick={() => handleSave(save.slot)}
                    disabled={loading}
                    className={`text-xs px-3 py-1.5 rounded ${theme.buttonBg} ${theme.text} border ${theme.border} border-opacity-30 disabled:opacity-50`}
                  >
                    {save.exists ? '覆盖' : '保存'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!gameState && (
          <p className={`text-center text-xs ${theme.dim} mt-6`}>
            开始游戏后才能保存进度
          </p>
        )}
      </div>
    </div>
  )
}
