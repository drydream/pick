'use client'
import { Menu, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  coins: number
  onMenuClick: () => void
  onBack?: () => void
}

export default function TopBar({ title, coins, onMenuClick, onBack }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-20 relative shrink-0">
      <button
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        onClick={onBack ?? onMenuClick}
        aria-label={onBack ? 'Back' : 'Menu'}
      >
        {onBack ? <ArrowLeft size={22} /> : <Menu size={22} />}
      </button>

      <motion.h1
        key={title}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-lg font-semibold text-gray-800"
      >
        {title}
      </motion.h1>

      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 min-w-[60px] justify-center">
        <span className="text-base leading-none">🪙</span>
        <span className="text-sm font-bold text-yellow-700 tabular-nums">{coins}</span>
      </div>
    </div>
  )
}
