'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Gamepad2 } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  category: Category
  mode: 'normal' | 'camera'
  onSelect: (rounds: number) => void
}

const OPTIONS = [
  { value: 5, desc: 'เล่นสั้น ๆ รวดเร็ว' },
  { value: 10, desc: 'ท้าทายมากขึ้น' },
]

export default function RoundSelectScreen({ category, mode, onSelect }: Props) {
  const [selected, setSelected] = useState(5)

  const ModeIcon = mode === 'camera' ? Camera : Gamepad2
  const modeName = mode === 'camera' ? 'โหมดกล้อง' : 'โหมดปกติ'

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-7">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-6xl mb-3">{category.emoji}</div>
        <h2 className="text-2xl font-extrabold text-gray-800">เลือกจำนวนรอบ</h2>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <ModeIcon size={14} className="text-gray-400" />
          <span className="text-gray-400 text-sm">{category.name} · {modeName}</span>
        </div>
      </motion.div>

      {/* Round toggle */}
      <motion.div
        className="w-full flex gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {OPTIONS.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 200 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setSelected(opt.value)}
            className={`flex-1 py-8 rounded-3xl flex flex-col items-center gap-2 border-2 transition-all duration-200 ${
              selected === opt.value
                ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <span
              className={`text-5xl font-extrabold leading-none tabular-nums ${
                selected === opt.value ? 'text-white' : 'text-gray-800'
              }`}
            >
              {opt.value}
            </span>
            <span
              className={`text-base font-bold ${
                selected === opt.value ? 'text-indigo-100' : 'text-gray-600'
              }`}
            >
              รอบ
            </span>
            <span
              className={`text-xs px-3 text-center leading-snug ${
                selected === opt.value ? 'text-indigo-200' : 'text-gray-400'
              }`}
            >
              {opt.desc}
            </span>
            {selected === opt.value && (
              <motion.div
                layoutId="round-check"
                className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1"
                initial={false}
              >
                <span className="text-white text-xs font-black">✓</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.96 }}
        className="w-full py-5 rounded-3xl bg-gray-900 text-white font-extrabold text-lg shadow-lg active:shadow-sm transition-shadow"
        onClick={() => onSelect(selected)}
      >
        เริ่มเล่นเลย {selected} รอบ 🎯
      </motion.button>
    </div>
  )
}
