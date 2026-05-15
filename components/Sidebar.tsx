'use client'
import { motion } from 'framer-motion'
import { FolderOpen, Globe, HelpCircle, LogIn, X } from 'lucide-react'

interface Props {
  onClose: () => void
  onManageCategories: () => void
}

const MENU_ITEMS = [
  { icon: FolderOpen, label: 'Manage Categories', action: 'manage', color: 'text-blue-500' },
  { icon: Globe,      label: 'Language',          action: 'lang',   color: 'text-green-500' },
  { icon: HelpCircle, label: 'How to Play',       action: 'howto',  color: 'text-orange-500' },
  { icon: LogIn,      label: 'Sign In',           action: 'login',  color: 'text-purple-500' },
]

export default function Sidebar({ onClose, onManageCategories }: Props) {
  const handleItem = (action: string) => {
    if (action === 'manage') {
      onManageCategories()
    }
  }

  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/40 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="absolute left-0 top-0 bottom-0 w-72 bg-white z-40 flex flex-col shadow-2xl"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.28 }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">PICK</span>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.action}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
              onClick={() => handleItem(item.action)}
            >
              <item.icon size={22} className={item.color} />
              <span className="text-base font-medium text-gray-700">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 leading-relaxed">
            Categories ที่สร้างจะถูก Save ไว้บน Device นี้ก่อน
            Sign In เพื่อ Sync ข้าม Device ได้เลย
          </p>
        </div>
      </motion.div>
    </>
  )
}
