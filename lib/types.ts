export interface Category {
  id: string
  name: string
  emoji: string
  pairs: [string, string][]
  isCustom?: boolean
}

export type Screen = 'home' | 'mode-select' | 'game-normal' | 'game-camera' | 'result'
