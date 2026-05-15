export interface CategoryItem {
  name: string
  imageDataUrl?: string
}

export interface Category {
  id: string
  name: string
  emoji: string
  iconDataUrl?: string
  pairs: [string, string][]
  items?: CategoryItem[]
  isCustom?: boolean
}

export type Screen =
  | 'home'
  | 'mode-select'
  | 'round-select'
  | 'game-normal'
  | 'game-camera'
  | 'result'
  | 'manage-categories'
