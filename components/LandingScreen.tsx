'use client'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

const DECO = [
  { e: '🍕', x: '8%',  y: '12%', s: 48, d: 0.10 },
  { e: '⚽', x: '78%', y: '10%', s: 40, d: 0.18 },
  { e: '🏆', x: '86%', y: '36%', s: 32, d: 0.24 },
  { e: '🦁', x: '4%',  y: '46%', s: 38, d: 0.14 },
  { e: '💎', x: '12%', y: '74%', s: 30, d: 0.28 },
  { e: '🎮', x: '80%', y: '70%', s: 40, d: 0.06 },
  { e: '🎵', x: '74%', y: '55%', s: 28, d: 0.32 },
  { e: '🌺', x: '6%',  y: '30%', s: 28, d: 0.20 },
]

interface Props {
  onStart: () => void
}

export default function LandingScreen({ onStart }: Props) {
  return (
    <div className="h-full flex flex-col bg-gray-950 relative overflow-hidden select-none">

      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-24 w-56 h-56 rounded-full bg-yellow-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      {/* Floating decorative emojis */}
      {DECO.map((d, i) => (
        <motion.span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{ left: d.x, top: d.y, fontSize: d.s }}
          initial={{ opacity: 0, scale: 0, rotate: -15 }}
          animate={{ opacity: 0.28, scale: 1, rotate: 0 }}
          transition={{ delay: d.d + 0.4, duration: 0.5, type: 'spring', stiffness: 130 }}
        >
          {d.e}
        </motion.span>
      ))}

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-7">

        {/* Logo block */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="text-8xl mb-3 leading-none"
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ delay: 0.85, duration: 0.65 }}
          >
            🎯
          </motion.div>
          <h1 className="text-[80px] font-black text-white tracking-tighter leading-none">
            PICK
          </h1>
          <motion.div
            className="h-1.5 bg-yellow-400 rounded-full mx-auto mt-2"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="text-center space-y-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
        >
          <p className="text-gray-200 text-xl font-semibold">
            เลือกสิ่งที่ใช่ 🏆
          </p>
          <p className="text-gray-500 text-sm tracking-wide">
            This or That · Survivor Style
          </p>
        </motion.div>

        {/* How it works — 3 pills */}
        <motion.div
          className="flex gap-2 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          {['เลือก Category', 'Battle Rounds', 'ได้ Champion!'].map((label, i) => (
            <span key={i} className="text-xs text-gray-400 border border-gray-700 bg-gray-800/60 px-3 py-1.5 rounded-full font-medium">
              {i + 1}. {label}
            </span>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.button
          className="w-full py-5 rounded-3xl bg-yellow-400 text-gray-900 font-extrabold text-xl flex items-center justify-center gap-2.5 shadow-2xl shadow-yellow-500/20 active:scale-95 transition-transform mt-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          onClick={onStart}
          whileTap={{ scale: 0.95 }}
        >
          <Play size={22} fill="currentColor" />
          เริ่มเล่น เลย!
        </motion.button>

      </div>

      {/* Footer */}
      <motion.p
        className="text-gray-700 text-xs text-center pb-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        PICK · v1.4 · Made with ❤️
      </motion.p>
    </div>
  )
}
