'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RefreshCw, Home } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  chosenItem: string
  category: Category
  onPlayAgain: () => void
  onNextPair: () => void
}

export default function ResultScreen({ chosenItem, category, onPlayAgain, onNextPair }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `ฉันเลือก "${chosenItem}" จากหมวด ${category.name} ในเกม PICK! แล้วคุณล่ะเลือกอะไร? 🎯`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PICK — ฉันเลือกแล้ว!', text, url: window.location.href })
      } catch {
        // user dismissed share sheet
      }
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = async () => {
    if (!cardRef.current || saving) return
    setSaving(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `pick-${chosenItem.replace(/\s+/g, '-')}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('html2canvas error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white px-6 py-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500 text-base font-medium"
        >
          คุณเลือก...
        </motion.p>

        {/* Result card — captured by html2canvas */}
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.08 }}
          className="w-full max-w-[280px] aspect-[3/4] rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 shadow-2xl flex flex-col items-center justify-center p-8"
        >
          <div className="text-7xl mb-5">{category.emoji}</div>
          <p className="text-white text-3xl font-extrabold text-center leading-tight drop-shadow-lg">
            {chosenItem}
          </p>
          <div className="mt-5 px-4 py-1.5 bg-white/25 rounded-full">
            <span className="text-white text-sm font-semibold">{category.name}</span>
          </div>
          <p className="mt-3 text-white/50 text-xs font-bold tracking-widest">PICK</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-gray-400 text-sm text-center px-4"
        >
          แตะ <span className="font-semibold text-gray-600">คู่ถัดไป</span> เพื่อเล่นต่อ
          หรือ <span className="font-semibold text-gray-600">หน้าหลัก</span> เพื่อเปลี่ยนหมวด
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3 shrink-0"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            <Share2 size={18} />
            <span>{copied ? 'คัดลอกแล้ว!' : 'แชร์เลย'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform disabled:opacity-50"
          >
            <Download size={18} />
            <span>{saving ? 'กำลังบันทึก...' : 'บันทึกลงเครื่อง'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onNextPair}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold active:scale-95 transition-transform"
          >
            <RefreshCw size={18} />
            <span>คู่ถัดไป</span>
          </button>
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-800 text-white font-bold active:scale-95 transition-transform"
          >
            <Home size={18} />
            <span>หน้าหลัก</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
