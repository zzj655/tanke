import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { getTheme } from '../styles/themes'
import AttributeBar from '../components/AttributeBar'
import EventCard from '../components/EventCard'
import ThemeSwitcher from '../components/ThemeSwitcher'

const SCENE_IMAGES: Record<string, string> = {
  'day0_prepare': '/images/scene_prepare.jpg',
  'day1_start': '/images/scene_uniform.jpg',
  'opening_ceremony': '/images/scene_ceremony.jpg',
  'morning_jog': '/images/scene_morning.jpg',
  'train_junzi': '/images/scene_junzi.jpg',
  'train_zhengbuzou': '/images/scene_zhengbu.jpg',
  'train_qibuzou': '/images/scene_qibu.jpg',
  'choose_formation': '/images/scene_formation.jpg',
  'gun_train_basic': '/images/scene_gun.jpg',
  'gun_train_march': '/images/scene_gun.jpg',
  'stick_train_basic': '/images/scene_stick.jpg',
  'stick_train_formation': '/images/scene_stick.jpg',
  'random_canteen': '/images/scene_canteen.jpg',
  'random_dormitory_check': '/images/scene_dormitory.jpg',
  'normal_train_emergency': '/images/scene_emergency.jpg',
  'random_rain': '/images/scene_rain.jpg',
  'final_parade': '/images/scene_parade.jpg',
  'ending_evaluation': '/images/scene_farewell.jpg',
  'special_fire_drill': '/images/scene_emergency.jpg',
  'special_choose_pacesetter': '/images/scene_parade.jpg',
  'special_become_monitor': '/images/scene_dormitory.jpg',
  'special_first_aid': '/images/scene_emergency.jpg',
  'special_hiking': '/images/scene_morning.jpg',
  'life_room_inspection': '/images/scene_dormitory.jpg',
}

export default function GamePage() {
  const navigate = useNavigate()
  const { gameState, loading, error, theme: themeName, saveGame } = useGameStore()
  const theme = getTheme(themeName)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!gameState) {
      navigate('/menu')
    }
  }, [gameState, navigate])

  useEffect(() => {
    if (gameState?.game_over) {
      const timer = setTimeout(() => navigate('/ending'), 1500)
      return () => clearTimeout(timer)
    }
  }, [gameState?.game_over, navigate])

  useEffect(() => {
    setImgLoaded(false)
    setImgError(false)
  }, [gameState?.current_event?.id])

  if (!gameState) return null

  const sceneImage = gameState.current_event
    ? SCENE_IMAGES[gameState.current_event.id] || '/images/scene_default.jpg'
    : '/images/scene_default.jpg'

  const handleSave = async () => {
    try {
      const msg = await saveGame(1)
      alert(msg)
    } catch {
      alert('保存失败')
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.cssClass}`}>
      {/* Top bar */}
      <div className={`sticky top-0 z-10 ${theme.cardBg} border-b ${theme.border} border-opacity-30 px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${theme.primary}`}>
            {gameState.player_name}
          </span>
          <span className="text-xs opacity-50">|</span>
          <span className="text-xs opacity-70">第{gameState.day}天</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <button onClick={handleSave} className="text-xs px-2 py-1 rounded opacity-70 hover:opacity-100">💾保存</button>
          <button onClick={() => navigate('/saves')} className="text-xs px-2 py-1 rounded opacity-70 hover:opacity-100">📦存档</button>
        </div>
      </div>

      {/* Scene image */}
      <div className="relative h-36 overflow-hidden">
        {!imgLoaded && !imgError && (
          <div className={`absolute inset-0 ${theme.cardBg} animate-pulse`} />
        )}
        {!imgError && (
          <img
            src={sceneImage}
            alt="scene"
            loading="lazy"
            className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true) }}
          />
        )}
        <div className={`absolute inset-0 ${theme.bg} opacity-20`} />
        <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${theme.bg} to-transparent`} />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4 space-y-4 -mt-6 relative">
        {error && (
          <div className="bg-red-900/50 text-red-200 text-xs px-3 py-2 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}

        {/* Attribute bars */}
        <div className={`${theme.cardBg} rounded-xl p-4 border ${theme.border} border-opacity-30 shadow-lg space-y-2.5`}>
          <AttributeBar label="体力" value={gameState.attributes.stamina} icon="💪" />
          <AttributeBar label="纪律" value={gameState.attributes.discipline} icon="📋" />
          <AttributeBar label="心情" value={gameState.attributes.mood} icon="😊" />
          <AttributeBar label="教官好感" value={gameState.attributes.instructor_favor} icon="👨‍🏫" />
          <AttributeBar label="同学关系" value={gameState.attributes.classmate_relation} icon="🤝" />
          <AttributeBar label="健康" value={gameState.attributes.health} icon="❤️" />
          <AttributeBar label="口渴度" value={gameState.attributes.thirst} icon="🥤" invert />
        </div>

        {/* Event card */}
        <EventCard state={gameState} />

        {gameState.game_over && (
          <div className={`text-center py-4 ${theme.primary} animate-pulse`}>
            游戏结束，即将跳转...
          </div>
        )}

        {/* Flags display */}
        {Object.keys(gameState.flags).filter(k => gameState.flags[k] === true || (k === 'formation' && gameState.flags[k])).length > 0 && (
          <div className={`${theme.cardBg} rounded-xl p-3 border ${theme.border} border-opacity-30`}>
            <div className="flex flex-wrap gap-2">
              {gameState.flags.has_uniform && <span className="text-xs px-2 py-0.5 rounded bg-green-900/50">军服</span>}
              {gameState.flags.is_monitor && <span className="text-xs px-2 py-0.5 rounded bg-blue-900/50">班长</span>}
              {gameState.flags.is_pacesetter && <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/50">标兵</span>}
              {gameState.flags.injured && <span className="text-xs px-2 py-0.5 rounded bg-red-900/50">受伤</span>}
              {gameState.flags.formation === 'gun' && <span className="text-xs px-2 py-0.5 rounded bg-purple-900/50">持枪方阵</span>}
              {gameState.flags.formation === 'stick' && <span className="text-xs px-2 py-0.5 rounded bg-orange-900/50">防暴棍方阵</span>}
              {gameState.flags.formation === 'normal' && <span className="text-xs px-2 py-0.5 rounded bg-gray-700/50">正常连队</span>}
              {gameState.flags.well_prepared && <span className="text-xs px-2 py-0.5 rounded bg-teal-900/50">准备充分</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
