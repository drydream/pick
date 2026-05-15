'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  customCats: Category[]
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function ManageCategoriesScreen({ customCats, onEdit, onDelete, onAdd }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <p className="text-gray-500 text-sm">
          {customCats.length > 0
            ? `${customCats.length} Custom Categories`
            : 'No custom categories yet'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence initial={false}>
          {customCats.map(cat => {
            const itemCount = cat.items?.length ?? cat.pairs.flat().length
            const confirming = deletingId === cat.id
            return (
              <motion.div key={cat.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-2"
              >
                <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {cat.iconDataUrl
                      ? <img src={cat.iconDataUrl} className="w-full h-full object-cover" />
                      : <span className="text-2xl">{cat.emoji}</span>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-bold truncate">{cat.name}</p>
                    <p className="text-gray-400 text-xs">{itemCount} Items</p>
                  </div>

                  {/* Actions */}
                  {confirming ? (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => { onDelete(cat.id); setDeletingId(null) }}
                        className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => onEdit(cat)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit2 size={11} />Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 text-red-500 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 size={11} />Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {customCats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">📦</span>
            <p className="text-gray-400 text-sm text-center leading-relaxed">
              No custom categories yet<br />
              สร้างอันแรกของคุณ ได้เลย! 🎯
            </p>
          </div>
        )}
      </div>

      {/* Add button */}
      <div className="px-4 pb-6 pt-3 shrink-0 border-t border-gray-100 bg-white">
        <button
          onClick={onAdd}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
        >
          <Plus size={18} />New Category
        </button>
      </div>
    </div>
  )
}
