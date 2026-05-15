'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface Props {
  winner: string      // currentWinner — always shown on top (red)
  challenger: string  // nextChallenger — always shown on bottom (blue)
  currentIndex: number
  totalItems: number
  onChoose: (item: string) => void
  onBack: () => void
}

export default function GameNormalScreen({
  winner,
  challenger,
  currentIndex,
  totalItems,
  onChoose,
  onBack,
}: Props) {
  const [chosen, setChosen] = useState<'winner' | 'challenger' | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; side: 'winner' | 'challenger' } | null>(null)

  // currentIndex starts at 2 after setup; round 1 = currentIndex 2, round N = currentIndex N+1
  const roundNumber = currentIndex - 1        // 1-based round being played
  const totalRounds = totalItems - 1          // total rounds in tournament
  const progressPct = ((roundNumber - 1) / totalRounds) * 100  // % of rounds completed before this one

  const handleChoose = (side: 'winner' | 'challenger', e: React.MouseEvent<HTMLDivElement>) => {
    if (chosen) return
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, side })
    setChosen(side)
    setTimeout(() => onChoose(side === 'winner' ? winner : challenger), 750)
  }

  return (
    <div className="flex flex-col h-full select-none">
      {/* Progress bar — fills as rounds complete */}
      <div className="h-1.5 bg-gray-800 shrink-0 overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* ── WINNER (top / red) ─────────────────────────────────────── */}
      <motion.div
        className="flex-1 bg-red-500 flex items-center justify-center cursor-pointer relative overflow-hidden"
        // Enters from left on mount (new round), retreats left when it loses
        initial={{ opacity: 0, x: -24 }}
        animate={
          chosen === 'challenger'
            ? { opacity: 0.28, x: -24 }
            : { opacity: 1, x: 0 }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={(e) => handleChoose('winner', e)}
      >
        {/* Crown label */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10">
          <span className="text-xl leading-none">👑</span>
          <span className="text-white/60 text-xs font-semibold tracking-wide">ผู้ท้าชนะเดิม</span>
        </div>

        <motion.div
          className="text-center z-10 px-8"
          animate={chosen === 'winner' ? { scale: 1.08 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <p className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
            {winner}
          </p>
        </motion.div>

        {/* Ripple */}
        {ripple?.side === 'winner' && (
          <motion.div
            className="absolute rounded-full bg-white/25 pointer-events-none"
            style={{ left: ripple.x - 60, top: ripple.y - 60, width: 120, height: 120 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {/* Checkmark overlay */}
        {chosen === 'winner' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 220 }}
          >
            <span className="text-9xl drop-shadow-2xl">✓</span>
          </motion.div>
        )}
      </motion.div>

      {/* ── CENTER DIVIDER ────────────────────────────────────────────── */}
      <div className="h-14 bg-gray-900 flex items-center justify-between px-4 z-10 shrink-0">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
          onClick={onBack}
          aria-label="กลับ"
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

      {/* ── CHALLENGER (bottom / blue) ────────────────────────────────── */}
      <motion.div
        className="flex-1 bg-blue-600 flex items-center justify-center cursor-pointer relative overflow-hidden"
        // Enters rising from bottom on mount (new challenger), drops back down when it loses
        initial={{ opacity: 0, y: 24 }}
        animate={
          chosen === 'winner'
            ? { opacity: 0.28, y: 24 }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.06 }}
        onClick={(e) => handleChoose('challenger', e)}
      >
        {/* Challenger label */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <span className="text-white/60 text-xs font-semibold tracking-wide">ผู้ท้าชิง</span>
          <span className="text-xl leading-none">⚔️</span>
        </div>

        <motion.div
          className="text-center z-10 px-8"
          animate={chosen === 'challenger' ? { scale: 1.08 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <p className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
            {challenger}
          </p>
        </motion.div>

        {/* Ripple */}
        {ripple?.side === 'challenger' && (
          <motion.div
            className="absolute rounded-full bg-white/25 pointer-events-none"
            style={{ left: ripple.x - 60, top: ripple.y - 60, width: 120, height: 120 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.65 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        {/* Checkmark overlay */}
        {chosen === 'challenger' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 220 }}
          >
            <span className="text-9xl drop-shadow-2xl">✓</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
