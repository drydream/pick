'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Gamepad2 } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  category: Category
  mode: 'normal' | 'camera'
  maxItems: number
  onSelect: (itemCount: number) => void
}

const OPTIONS = [
  { value: 5,  rounds: 4, desc: 'เล่น 4 รอบ · เร็วทันใจ' },
  { value: 10, rounds: 9, desc: 'เล่น 9 รอบ · ท้าทายกว่า' },
]

export default function RoundSelectScreen({ category, mode, maxItems, onSelect }: Props) {
  const [selected, setSelected] = useState(5)

  const ModeIcon = mode === 'camera' ? Camera : Gamepad2
  const modeName = mode === 'camera' ? 'โหมดกล้อง' : 'โหมดปกติ'
  const selectedRounds = OPTIONS.find(o => o.value === selected)!.rounds

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-7">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-2xl bg-gray-100 overflow-hidden">
          {category.iconDataUrl
            ? <img src={category.iconDataUrl} className="w-full h-full object-cover" />
            : <span className="text-5xl">{category.emoji}</span>
          }
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">เลือกจำนวนไอเทม</h2>
        <p className="text-gray-500 text-sm mt-1">ผู้รอดจะกลายเป็นแชมเปี้ยน</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <ModeIcon size={14} className="text-gray-400" />
          <span className="text-gray-400 text-sm">{category.name} · {modeName}</span>
        </div>
      </motion.div>

      {/* Item count toggle */}
      <motion.div
        className="w-full flex gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {OPTIONS.map((opt, i) => {
          const disabled = opt.value > maxItems
          const active = selected === opt.value && !disabled
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: disabled ? 0.4 : 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.08, type: 'spring', stiffness: 200 }}
              whileTap={disabled ? {} : { scale: 0.94 }}
              disabled={disabled}
              onClick={() => { if (!disabled) setSelected(opt.value) }}
              className={`flex-1 py-7 rounded-3xl flex flex-col items-center gap-1.5 border-2 transition-all duration-200 ${
                disabled
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                  : active
                  ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className={`text-5xl font-extrabold leading-none tabular-nums ${
                active ? 'text-white' : 'text-gray-800'
              }`}>{opt.value}</span>
              <span className={`text-sm font-bold ${active ? 'text-indigo-100' : 'text-gray-500'}`}>
                รายการ
              </span>
              <span className={`text-xs text-center leading-snug px-2 mt-0.5 ${
                active ? 'text-indigo-200' : 'text-gray-400'
              }`}>
                {disabled ? `ต้องการ ${opt.value} ไอเทม` : opt.desc}
              </span>
              {active && (
                <motion.div
                  layoutId="item-check"
                  className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center mt-1"
                  initial={false}
                >
                  <span className="text-white text-xs font-black">✓</span>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 w-full"
      >
        <span className="text-lg shrink-0">⚔️</span>
        <p className="text-xs text-gray-500 leading-relaxed">
          ไอเทม 1 ต่อสู้กับไอเทม 2 → ผู้ชนะสู้กับไอเทม 3 → ... → แชมเปี้ยน!
        </p>
      </motion.div>

      {/* Start button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.96 }}
        className="w-full py-5 rounded-3xl bg-gray-900 text-white font-extrabold text-lg shadow-lg active:shadow-sm transition-shadow"
        onClick={() => onSelect(selected)}
      >
        เริ่มเล่น {selectedRounds} รอบ 🏆
      </motion.button>
    </div>
  )
}
