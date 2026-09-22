import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface GameState {
  player_name: string
  attributes: {
    stamina: number
    discipline: number
    mood: number
    instructor_favor: number
    classmate_relation: number
    health: number
    thirst: number
  }
  flags: Record<string, any>
  day: number
  phase: string
  weather: string
  current_event: {
    id: string
    title: string
    description: string
    options: Array<{
      text: string
      effects?: Record<string, number>
      set_flags?: Record<string, any>
      chance?: number
      success_effects?: any
      fail_effects?: any
      success_remark?: string
      fail_remark?: string
    }>
  } | null
  remark: string | null
  endings: Array<{ title: string; description: string; tags: string[] }> | null
  score: number | null
  grade: string | null
  game_over: boolean
}

export interface SaveInfo {
  slot: number
  player_name: string
  day: number
  created_at: string
  updated_at: string
  exists: boolean
}

export const apiClient = {
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),

  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),

  startGame: (playerName: string, slot: number = 1) =>
    api.post<GameState>('/game/start', { player_name: playerName, slot }),

  chooseOption: (optionIndex: number) =>
    api.post<GameState>('/game/choose', { option_index: optionIndex }),

  getState: () =>
    api.get<GameState>('/game/state'),

  listSaves: () =>
    api.get<SaveInfo[]>('/game/saves'),

  saveGame: (slot: number) =>
    api.post('/game/save', { slot }),

  loadGame: (slot: number) =>
    api.post<GameState>('/game/load', { slot }),

  deleteSave: (slot: number) =>
    api.delete(`/game/saves/${slot}`),
}
