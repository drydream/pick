'use client'
import { motion } from 'framer-motion'
import { Camera, Gamepad2 } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  category: Category
  onSelect: (mode: 'normal' | 'camera') => void
}

export default function ModeSelectScreen({ category, onSelect }: Props) {
  const itemCount = category.items?.length ?? category.pairs.flat().length

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-3 rounded-3xl bg-gray-100 overflow-hidden">
          {category.iconDataUrl
            ? <img src={category.iconDataUrl} className="w-full h-full object-cover" />
            : <span className="text-5xl">{category.emoji}</span>
          }
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">{category.name}</h2>
        <p className="text-gray-500 mt-1 text-sm">{itemCount} ไอเทม · เลือกโหมดการเล่น</p>
      </motion.div>

      <div className="w-full space-y-4">
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-7 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex flex-col items-center gap-1.5 shadow-lg shadow-indigo-200 active:shadow-sm transition-shadow"
          onClick={() => onSelect('camera')}
        >
          <Camera size={34} strokeWidth={1.8} />
          <span className="text-xl font-extrabold tracking-tight">เล่นแบบเปิดกล้อง</span>
          <span className="text-sm opacity-75">ใช้กล้องหน้าแสดงตัวเอง</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 180 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-7 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 text-white flex flex-col items-center gap-1.5 shadow-lg shadow-red-200 active:shadow-sm transition-shadow"
          onClick={() => onSelect('normal')}
        >
          <Gamepad2 size={34} strokeWidth={1.8} />
          <span className="text-xl font-extrabold tracking-tight">เล่นโหมดปกติ</span>
          <span className="text-sm opacity-75">หน้าจอแบ่งสีแดง vs น้ำเงิน</span>
        </motion.button>
      </div>
    </div>
  )
}
