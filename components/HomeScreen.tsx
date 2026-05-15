'use client'
import { motion } from 'framer-motion'
import { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  onSelect: (cat: Category) => void
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
}

export default function HomeScreen({ categories, onSelect }: Props) {
  return (
    <div className="p-4 pb-8">
      <motion.div
        className="grid grid-cols-2 gap-3"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            variants={item}
            whileTap={{ scale: 0.93 }}
            className="aspect-square flex flex-col items-center justify-center gap-2 rounded-3xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 shadow-sm transition-colors relative"
            onClick={() => onSelect(cat)}
          >
            <span className="text-5xl">{cat.emoji}</span>
            <span className="text-base font-semibold text-gray-700">{cat.name}</span>
            {cat.isCustom && (
              <span className="absolute top-2 right-2 text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                ของฉัน
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
