'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getItemImage } from '@/lib/data'

interface Props {
  winner: string
  challenger: string
  currentIndex: number
  totalItems: number
  winnerColor: 'red' | 'blue'           // color follows the item, not the position
  winnerCameFromBottom: boolean          // true when challenger won last round
  onChoose: (item: string) => void
  onBack: () => void
}

export default function GameNormalScreen({
  winner,
  challenger,
  currentIndex,
  totalItems,
  winnerColor,
  winnerCameFromBottom,
  onChoose,
  onBack,
}: Props) {
  const [chosen, setChosen] = useState<'winner' | 'challenger' | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; side: 'winner' | 'challenger' } | null>(null)

  const roundNumber = currentIndex - 1
  const totalRounds = totalItems - 1
  const progressPct = ((roundNumber - 1) / totalRounds) * 100

  // Colors: winner keeps its color, challenger always gets the opposite
  const challengerColor: 'red' | 'blue' = winnerColor === 'red' ? 'blue' : 'red'

  const winnerOverlay  = winnerColor   === 'red' ? 'bg-red-600/60'  : 'bg-blue-700/60'
  const challengerOverlay = challengerColor === 'red' ? 'bg-red-600/60' : 'bg-blue-700/60'

  const winnerBorder  = winnerColor   === 'red' ? 'border-red-400'  : 'border-blue-400'
  const challengerBorder = challengerColor === 'red' ? 'border-red-400' : 'border-blue-400'

  const handleChoose = (side: 'winner' | 'challenger', e: React.MouseEvent<HTMLDivElement>) => {
    if (chosen) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, side })
    setChosen(side)
    setTimeout(() => onChoose(side === 'winner' ? winner : challenger), 750)
  }

  // Winner entrance: slides up from below when it came from bottom, from left when it stayed
  const winnerInitial = winnerCameFromBottom
    ? { opacity: 0, y: 60, x: 0 }
    : { opacity: 0, x: -24, y: 0 }

  const winnerAnimate = chosen === 'challenger'
    ? (winnerCameFromBottom ? { opacity: 0.25, y: 60, x: 0 } : { opacity: 0.25, x: -24, y: 0 })
    : { opacity: 1, x: 0, y: 0 }

  return (
    <div className="flex flex-col h-full select-none">

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-900 shrink-0 overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* ── WINNER (top) ─────────────────────────────────────────── */}
      <motion.div
        className="flex-1 relative overflow-hidden cursor-pointer"
        initial={winnerInitial}
        animate={winnerAnimate}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        onClick={(e) => handleChoose('winner', e)}
      >
        {/* Background photo */}
        <img
          src={getItemImage(winner)}
          alt={winner}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />

        {/* Color overlay — red or blue depending on which color this item carries */}
        <div className={`absolute inset-0 ${winnerOverlay}`} />

        {/* Crown badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
          <span className="text-xl leading-none drop-shadow">👑</span>
          <span className="text-white/80 text-xs font-semibold tracking-wide drop-shadow">
            ผู้ท้าชนะเดิม
          </span>
        </div>

        {/* Color tag (top-right) */}
        <div className={`absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full border ${winnerBorder} bg-white/10`}>
          <span className="text-white text-xs font-bold">
            {winnerColor === 'red' ? '🔴' : '🔵'}
          </span>
        </div>

        {/* Item name */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-8"
          animate={chosen === 'winner' ? { scale: 1.06 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <p className="text-4xl font-extrabold text-white text-center leading-tight drop-shadow-2xl">
            {winner}
          </p>
        </motion.div>

        {/* Ripple */}
        {ripple?.side === 'winner' && (
          <motion.div
            className="absolute rounded-full bg-white/20 pointer-events-none z-20"
            style={{ left: ripple.x - 60, top: ripple.y - 60, width: 120, height: 120 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {/* Checkmark */}
        {chosen === 'winner' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-white/10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.span
              className="text-9xl drop-shadow-2xl"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 220 }}
            >✓</motion.span>
          </motion.div>
        )}
      </motion.div>

      {/* ── CENTER DIVIDER ──────────────────────────────────────────── */}
      <div className="h-14 bg-gray-900 flex items-center justify-between px-4 z-10 shrink-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          onClick={onBack} aria-label="กลับ"
        >
          <ArrowLeft size={16} className="text-white" />
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-gray-600" />
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg border-2 border-yellow-300">
            <span className="text-gray-900 font-black text-sm">VS</span>
          </div>
          <div className="h-px w-10 bg-gray-600" />
        </div>

        <span className="text-yellow-400 text-xs font-semibold tabular-nums">
          รอบที่ {roundNumber}/{totalRounds}
        </span>
      </div>

      {/* ── CHALLENGER (bottom) ─────────────────────────────────────── */}
      <motion.div
        className="flex-1 relative overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 24, x: 0 }}
        animate={
          chosen === 'winner'
            ? { opacity: 0.25, y: 24, x: 0 }
            : { opacity: 1, y: 0, x: 0 }
        }
        transition={{ duration: 0.38, ease: 'easeOut', delay: 0.06 }}
        onClick={(e) => handleChoose('challenger', e)}
      >
        {/* Background photo */}
        <img
          src={getItemImage(challenger)}
          alt={challenger}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />

        {/* Color overlay */}
        <div className={`absolute inset-0 ${challengerOverlay}`} />

        {/* Challenger badge */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
          <span className="text-white/80 text-xs font-semibold tracking-wide drop-shadow">
            ผู้ท้าชิง
          </span>
          <span className="text-xl leading-none drop-shadow">⚔️</span>
        </div>

        {/* Color tag (top-left) */}
        <div className={`absolute top-4 left-4 z-10 px-2 py-0.5 rounded-full border ${challengerBorder} bg-white/10`}>
          <span className="text-white text-xs font-bold">
            {challengerColor === 'red' ? '🔴' : '🔵'}
          </span>
        </div>

        {/* Item name */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-8"
          animate={chosen === 'challenger' ? { scale: 1.06 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <p className="text-4xl font-extrabold text-white text-center leading-tight drop-shadow-2xl">
            {challenger}
          </p>
        </motion.div>

        {/* Ripple */}
        {ripple?.side === 'challenger' && (
          <motion.div
            className="absolute rounded-full bg-white/20 pointer-events-none z-20"
            style={{ left: ripple.x - 60, top: ripple.y - 60, width: 120, height: 120 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {/* Checkmark */}
        {chosen === 'challenger' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-white/10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.span
              className="text-9xl drop-shadow-2xl"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 220 }}
            >✓</motion.span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
