import { useGameStore } from '../stores/gameStore'
import { THEMES } from '../styles/themes'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useGameStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs opacity-60">主题</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="text-xs px-2 py-1 rounded border border-current border-opacity-30 bg-transparent cursor-pointer"
      >
        {Object.values(THEMES).map((t) => (
          <option key={t.name} value={t.name} className="bg-gray-800 text-white">
            {t.displayName}
          </option>
        ))}
      </select>
    </div>
  )
}
