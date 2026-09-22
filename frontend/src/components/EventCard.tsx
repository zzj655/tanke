import { getTheme } from '../styles/themes'
import { useGameStore } from '../stores/gameStore'
import { GameState } from '../api/client'

interface Props {
  state: GameState
}

const PHASE_NAMES: Record<string, string> = {
  morning: '早操',
  training: '训练',
  noon: '午间',
  afternoon: '下午',
  rest: '休息',
  evening: '晚点名',
  night: '夜间',
}

const WEATHER_NAMES: Record<string, string> = {
  sunny: '晴天',
  rain: '雨天',
  windy: '大风',
}

export default function EventCard({ state }: Props) {
  const theme = getTheme(useGameStore((s) => s.theme))
  const event = state.current_event
  const loading = useGameStore((s) => s.loading)
  const chooseOption = useGameStore((s) => s.chooseOption)

  if (!event) {
    return (
      <div className={`event-card ${theme.cardBg} rounded-xl p-6 border ${theme.border} border-opacity-30 shadow-lg`}>
        <p className="text-center opacity-60">暂无事件</p>
      </div>
    )
  }

  return (
    <div className={`event-card ${theme.cardBg} rounded-xl p-6 border ${theme.border} border-opacity-30 shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded ${theme.buttonBg} border ${theme.border} border-opacity-30`}>
            第{state.day}天
          </span>
          <span className={`text-xs px-2 py-1 rounded ${theme.buttonBg} border ${theme.border} border-opacity-30`}>
            {PHASE_NAMES[state.phase] || state.phase}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${theme.buttonBg} border ${theme.border} border-opacity-30`}>
            {WEATHER_NAMES[state.weather] || state.weather}
          </span>
        </div>
        {state.remark && (
          <span className="text-xs opacity-60 animate-fade-in">{state.remark}</span>
        )}
      </div>

      <h2 className={`text-xl font-bold mb-3 ${theme.primary}`}>{event.title}</h2>
      <p className={`text-sm leading-relaxed mb-5 ${theme.text} opacity-90`}>
        {event.description}
      </p>

      <div className="space-y-2">
        {event.options.map((opt, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => chooseOption(i)}
            className={`option-btn w-full text-left px-4 py-3 rounded-lg border ${theme.border} border-opacity-30 ${theme.buttonBg} ${theme.text} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.98] ${loading ? 'pointer-events-none' : ''}`}
          >
            <span className="text-sm flex items-center justify-between">
              <span>
                <span className="opacity-50 mr-2">{i + 1}.</span>
                {opt.text}
              </span>
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
