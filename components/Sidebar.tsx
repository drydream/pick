'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Globe, HelpCircle, LogIn, X, Shield, ChevronDown } from 'lucide-react'
import { isAdminAuthenticated } from '@/lib/adminAuth'

interface Props {
  onClose: () => void
  onManageCategories: () => void
}

const HOW_TO_STEPS = [
  { num: '1', label: 'เลือก Category', desc: 'เลือกหมวดหมู่ที่อยากจะ Battle' },
  { num: '2', label: 'เลือก Mode & Rounds', desc: 'Normal หรือ Camera — กี่ Items' },
  { num: '3', label: 'Battle!', desc: 'แตะซ้าย/ขวาเพื่อเลือก Winner ในแต่ละ Round' },
  { num: '4', label: 'ได้ Champion 🏆', desc: 'Item ที่ชนะทุก Round คือ Champion ของคุณ' },
]

export default function Sidebar({ onClose, onManageCategories }: Props) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showHowTo, setShowHowTo] = useState(false)

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated())
  }, [])

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
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
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

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">

          {/* Manage Categories */}
          <button
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
            onClick={onManageCategories}
          >
            <FolderOpen size={22} className="text-blue-500 shrink-0" />
            <span className="text-base font-medium text-gray-700">Manage Categories</span>
          </button>

          {/* How to Play — expandable */}
          <div>
            <button
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
              onClick={() => setShowHowTo(v => !v)}
            >
              <HelpCircle size={22} className="text-orange-500 shrink-0" />
              <span className="flex-1 text-base font-medium text-gray-700">How to Play</span>
              <motion.div animate={{ rotate: showHowTo ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {showHowTo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="mx-2 mb-2 bg-orange-50 rounded-2xl px-4 py-3 space-y-3">
                    {HOW_TO_STEPS.map(s => (
                      <div key={s.num} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-orange-400 text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {s.num}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{s.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sign In — <a> tag, guaranteed navigation */}
          <a
            href="/admin/login"
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
          >
            <LogIn size={22} className="text-purple-500 shrink-0" />
            <span className="text-base font-medium text-gray-700">Sign In</span>
          </a>

          {/* Admin Panel — only when logged in as admin */}
          {isAdmin && (
            <a
              href="/admin"
              className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-yellow-50 hover:bg-yellow-100 active:bg-yellow-200 transition-colors text-left border border-yellow-200"
            >
              <Shield size={22} className="text-yellow-600 shrink-0" />
              <span className="flex-1 text-base font-medium text-gray-700">Admin Panel</span>
              <span className="text-xs bg-yellow-400 text-gray-900 font-bold px-1.5 py-0.5 rounded-full">ADMIN</span>
            </a>
          )}

        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400 leading-relaxed">
            Categories ที่สร้างจะถูก Save ไว้บน Device นี้ก่อน
            Sign In เพื่อ Sync ข้าม Device ได้เลย
          </p>
        </div>
      </motion.div>
    </>
  )
}
