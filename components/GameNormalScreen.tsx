'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface Props {
  optionA: string
  optionB: string
  categoryName: string
  pairIndex: number
  totalPairs: number
  onChoose: (item: string) => void
  onBack: () => void
}

export default function GameNormalScreen({
  optionA,
  optionB,
  categoryName,
  pairIndex,
  totalPairs,
  onChoose,
  onBack,
}: Props) {
  const [chosen, setChosen] = useState<'A' | 'B' | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; side: 'A' | 'B' } | null>(null)

  const handleChoose = (side: 'A' | 'B', e: React.MouseEvent<HTMLDivElement>) => {
    if (chosen) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, side })
    setChosen(side)
    setTimeout(() => onChoose(side === 'A' ? optionA : optionB), 750)
  }

  return (
    <div className="flex flex-col h-full select-none">
      {/* Option A — Red */}
      <motion.div
        className="flex-1 bg-red-500 flex items-center justify-center cursor-pointer relative overflow-hidden"
        onClick={(e) => handleChoose('A', e)}
        animate={chosen === 'B' ? { opacity: 0.35 } : { opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="text-center z-10 px-8"
          animate={chosen === 'A' ? { scale: 1.06 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        >
          <p className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
            {optionA}
          </p>
        </motion.div>

        {ripple?.side === 'A' && (
          <motion.div
            className="absolute rounded-full bg-white/25 pointer-events-none"
            style={{
              left: ripple.x - 60,
              top: ripple.y - 60,
              width: 120,
              height: 120,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {chosen === 'A' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
          >
            <span className="text-9xl drop-shadow-2xl">✓</span>
          </motion.div>
        )}
      </motion.div>

      {/* Center Divider */}
      <div className="h-14 bg-gray-900 flex items-center justify-between px-4 z-10 shrink-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          onClick={onBack}
          aria-label="กลับ"
        >
          <ArrowLeft size={16} className="text-white" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gray-600" />
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg border-2 border-yellow-300">
            <span className="text-gray-900 font-black text-sm">VS</span>
          </div>
          <div className="h-px w-12 bg-gray-600" />
        </div>

        <span className="text-gray-500 text-xs text-right">
          {pairIndex + 1}/{totalPairs}
        </span>
      </div>

      {/* Option B — Blue */}
      <motion.div
        className="flex-1 bg-blue-600 flex items-center justify-center cursor-pointer relative overflow-hidden"
        onClick={(e) => handleChoose('B', e)}
        animate={chosen === 'A' ? { opacity: 0.35 } : { opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="text-center z-10 px-8"
          animate={chosen === 'B' ? { scale: 1.06 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        >
          <p className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
            {optionB}
          </p>
        </motion.div>

        {ripple?.side === 'B' && (
          <motion.div
            className="absolute rounded-full bg-white/25 pointer-events-none"
            style={{
              left: ripple.x - 60,
              top: ripple.y - 60,
              width: 120,
              height: 120,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {chosen === 'B' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
          >
            <span className="text-9xl drop-shadow-2xl">✓</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
