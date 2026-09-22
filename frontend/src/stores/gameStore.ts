import { create } from 'zustand'
import { apiClient, GameState, SaveInfo } from '../api/client'

interface GameStore {
  gameState: GameState | null
  loading: boolean
  error: string | null
  theme: string
  username: string | null

  setTheme: (theme: string) => void
  startGame: (playerName: string) => Promise<void>
  chooseOption: (index: number) => Promise<void>
  getState: () => Promise<void>
  saveGame: (slot: number) => Promise<string>
  loadGame: (slot: number) => Promise<void>
  listSaves: () => Promise<SaveInfo[]>
  deleteSave: (slot: number) => Promise<void>
  logout: () => void
}

const THEME_KEY = 'military_theme'

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  loading: false,
  error: null,
  theme: localStorage.getItem(THEME_KEY) || 'military',
  username: localStorage.getItem('username'),

  setTheme: (theme: string) => {
    localStorage.setItem(THEME_KEY, theme)
    set({ theme })
  },

  startGame: async (playerName: string) => {
    set({ loading: true, error: null })
    try {
      const res = await apiClient.startGame(playerName)
      set({ gameState: res.data, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e.response?.data?.detail || '启动游戏失败' })
    }
  },

  chooseOption: async (index: number) => {
    if (get().loading) return
    set({ loading: true, error: null })
    try {
      const res = await apiClient.chooseOption(index)
      set({ gameState: res.data, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e.response?.data?.detail || '操作失败，请重试' })
    }
  },

  getState: async () => {
    try {
      const res = await apiClient.getState()
      set({ gameState: res.data })
    } catch (e: any) {
      set({ error: e.response?.data?.detail || '获取状态失败' })
    }
  },

  saveGame: async (slot: number) => {
    const res = await apiClient.saveGame(slot)
    return res.data.message
  },

  loadGame: async (slot: number) => {
    set({ loading: true, error: null })
    try {
      const res = await apiClient.loadGame(slot)
      set({ gameState: res.data, loading: false })
    } catch (e: any) {
      set({ loading: false, error: e.response?.data?.detail || '加载存档失败' })
    }
  },

  listSaves: async () => {
    const res = await apiClient.listSaves()
    return res.data
  },

  deleteSave: async (slot: number) => {
    await apiClient.deleteSave(slot)
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    set({ username: null, gameState: null })
  },
}))
