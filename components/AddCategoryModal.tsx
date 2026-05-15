'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  onClose: () => void
  onAdd: (cat: Category) => void
}

const EMOJIS = ['🎯', '🌟', '🎲', '🎪', '🎭', '🎨', '🎬', '🎤', '🍕', '🚀', '🏆', '💡']

export default function AddCategoryModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [pairs, setPairs] = useState<[string, string][]>([['', '']])

  const handlePairChange = (i: number, side: 0 | 1, val: string) => {
    setPairs((prev) =>
      prev.map((pair, idx) =>
        idx === i ? (side === 0 ? [val, pair[1]] : [pair[0], val]) : pair
      )
    )
  }

  const handleRemovePair = (i: number) => {
    setPairs((prev) => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = () => {
    const validPairs = pairs.filter(([a, b]) => a.trim() && b.trim()) as [string, string][]
    if (!name.trim() || validPairs.length === 0) return
    onAdd({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      emoji,
      pairs: validPairs,
      isCustom: true,
    })
  }

  const isValid = name.trim() && pairs.some(([a, b]) => a.trim() && b.trim())

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[88vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="p-6 pb-8">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-800">เพิ่มหมวดหมู่ใหม่</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="ปิด"
            >
              <X size={18} />
            </button>
          </div>

          {/* Emoji picker */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-500 mb-2 block">ไอคอนหมวดหมู่</label>
            <div className="flex gap-2 flex-wrap">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-blue-100 ring-2 ring-blue-400 scale-110'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-500 mb-2 block">ชื่อหมวดหมู่</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น ภาพยนตร์โปรด"
              className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-base outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
              maxLength={20}
            />
          </div>

          {/* Pairs */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-500 mb-3 block">คู่คำถาม</label>
            <div className="space-y-3">
              {pairs.map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={pair[0]}
                    onChange={(e) => handlePairChange(i, 0, e.target.value)}
                    placeholder="ตัวเลือก A"
                    className="flex-1 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-red-300 transition-shadow"
                  />
                  <span className="text-gray-400 text-xs font-medium shrink-0">vs</span>
                  <input
                    type="text"
                    value={pair[1]}
                    onChange={(e) => handlePairChange(i, 1, e.target.value)}
                    placeholder="ตัวเลือก B"
                    className="flex-1 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
                  />
                  {pairs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePair(i)}
                      className="text-red-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="ลบคู่นี้"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPairs((prev) => [...prev, ['', '']])}
              className="mt-3 flex items-center gap-1.5 text-blue-500 text-sm font-semibold hover:text-blue-700 transition-colors"
            >
              <Plus size={16} />
              เพิ่มคู่คำถาม
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full py-4 rounded-2xl bg-blue-500 text-white font-extrabold text-base disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-lg shadow-blue-200"
          >
            บันทึกหมวดหมู่
          </button>
        </div>
      </motion.div>
    </>
  )
}
