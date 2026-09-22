export interface ThemeConfig {
  name: string
  displayName: string
  cssClass: string
  bg: string
  cardBg: string
  primary: string
  accent: string
  highlight: string
  text: string
  dim: string
  border: string
  buttonBg: string
  buttonHover: string
  progressBar: (value: number) => string
}

export const THEMES: Record<string, ThemeConfig> = {
  military: {
    name: 'military',
    displayName: '军训迷彩',
    cssClass: 'theme-military',
    bg: 'bg-[#1a2e1a]',
    cardBg: 'bg-[#1f3a1f]/90',
    primary: 'text-[#8bb04a]',
    accent: 'border-[#4a7c2c]',
    highlight: 'text-[#8bb04a]',
    text: 'text-[#e8f0d8]',
    dim: 'text-[#7a9a5a]',
    border: 'border-[#4a7c2c]',
    buttonBg: 'bg-[#2d5016] hover:bg-[#3d6020]',
    buttonHover: 'hover:bg-[#3d6020]',
    progressBar: (v) => v >= 70 ? 'bg-green-500' : v >= 40 ? 'bg-yellow-600' : 'bg-red-600',
  },
  desert: {
    name: 'desert',
    displayName: '沙漠风暴',
    cssClass: 'theme-desert',
    bg: 'bg-[#2b2200]',
    cardBg: 'bg-[#3a2e10]/90',
    primary: 'text-[#daa520]',
    accent: 'border-[#8b6914]',
    highlight: 'text-[#daa520]',
    text: 'text-[#f5e6c8]',
    dim: 'text-[#9a8050]',
    border: 'border-[#8b6914]',
    buttonBg: 'bg-[#5c4416] hover:bg-[#6c5420]',
    buttonHover: 'hover:bg-[#6c5420]',
    progressBar: (v) => v >= 70 ? 'bg-yellow-500' : v >= 40 ? 'bg-orange-600' : 'bg-red-700',
  },
  forest: {
    name: 'forest',
    displayName: '森林绿意',
    cssClass: 'theme-forest',
    bg: 'bg-[#0d1f0d]',
    cardBg: 'bg-[#1a3d1a]/90',
    primary: 'text-[#5cb85c]',
    accent: 'border-[#2d6a2d]',
    highlight: 'text-[#5cb85c]',
    text: 'text-[#d4e8d4]',
    dim: 'text-[#5a8a5a]',
    border: 'border-[#2d6a2d]',
    buttonBg: 'bg-[#1a3d1a] hover:bg-[#2a5d2a]',
    buttonHover: 'hover:bg-[#2a5d2a]',
    progressBar: (v) => v >= 70 ? 'bg-green-400' : v >= 40 ? 'bg-lime-600' : 'bg-red-600',
  },
  simple: {
    name: 'simple',
    displayName: '简约白',
    cssClass: 'theme-simple',
    bg: 'bg-[#f5f5f5]',
    cardBg: 'bg-white/95',
    primary: 'text-[#333]',
    accent: 'border-[#666]',
    highlight: 'text-[#0099cc]',
    text: 'text-[#222]',
    dim: 'text-[#999]',
    border: 'border-[#ddd]',
    buttonBg: 'bg-[#eee] hover:bg-[#ddd]',
    buttonHover: 'hover:bg-[#ddd]',
    progressBar: (v) => v >= 70 ? 'bg-green-500' : v >= 40 ? 'bg-yellow-500' : 'bg-red-500',
  },
  night: {
    name: 'night',
    displayName: '夜间模式',
    cssClass: 'theme-night',
    bg: 'bg-[#0a0a1a]',
    cardBg: 'bg-[#1a1a3a]/90',
    primary: 'text-[#5588dd]',
    accent: 'border-[#2a4a8a]',
    highlight: 'text-[#5588dd]',
    text: 'text-[#d0d0f0]',
    dim: 'text-[#5a5a8a]',
    border: 'border-[#2a4a8a]',
    buttonBg: 'bg-[#1a1a3a] hover:bg-[#2a2a5a]',
    buttonHover: 'hover:bg-[#2a2a5a]',
    progressBar: (v) => v >= 70 ? 'bg-blue-400' : v >= 40 ? 'bg-indigo-500' : 'bg-red-500',
  },
}

export const getTheme = (name: string): ThemeConfig => THEMES[name] || THEMES.military
