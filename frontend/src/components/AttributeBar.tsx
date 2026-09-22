import { getTheme } from '../styles/themes'
import { useGameStore } from '../stores/gameStore'

interface Props {
  label: string
  value: number
  icon: string
  invert?: boolean
}

export default function AttributeBar({ label, value, icon, invert = false }: Props) {
  const theme = getTheme(useGameStore((s) => s.theme))
  const displayValue = Math.round(value)
  const color = theme.progressBar(invert ? 100 - value : value)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-5 text-center">{icon}</span>
      <span className="text-xs w-16 text-right opacity-80">{label}</span>
      <div className={`flex-1 h-3 rounded-full bg-black/20 overflow-hidden border ${theme.border} border-opacity-30`}>
        <div
          className={`h-full progress-bar ${color} rounded-full`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
      <span className="text-xs w-8 font-mono font-bold">{displayValue}</span>
    </div>
  )
}
