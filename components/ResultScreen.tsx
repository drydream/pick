'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RotateCcw, Home } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  choices: string[]
  totalRounds: number
  category: Category
  onPlayAgain: () => void
  onGoHome: () => void
}

function computeWinner(choices: string[]): { item: string; count: number; isTie: boolean } {
  const counts: Record<string, number> = {}
  for (const c of choices) counts[c] = (counts[c] || 0) + 1
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return {
    item: sorted[0][0],
    count: sorted[0][1],
    isTie: sorted.length > 1 && sorted[0][1] === sorted[1][1],
  }
}

export default function ResultScreen({ choices, totalRounds, category, onPlayAgain, onGoHome }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const { item: winner, count: winCount, isTie } = computeWinner(choices)

  const handleShare = async () => {
    const text = isTie
      ? `ฉันเล่น PICK หมวด ${category.name} ครบ ${totalRounds} รอบแล้ว — ผลเสมอกัน! 🎯`
      : `ฉันเล่น PICK หมวด ${category.name} ครบ ${totalRounds} รอบ — ผู้ชนะคือ "${winner}" (${winCount}/${totalRounds} รอบ) 🏆`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PICK — ผลการเล่น!', text, url: window.location.href })
      } catch { /* dismissed */ }
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
      link.download = `pick-${winner.replace(/\s+/g, '-')}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white px-5 py-5">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 text-sm font-medium"
        >
          {isTie ? '🤝 ผลเสมอ!' : '🏆 ผู้ชนะ'}
        </motion.p>

        {/* Winner card — captured by html2canvas */}
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.6, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.06 }}
          className="w-full max-w-[240px] aspect-[3/4] rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 shadow-2xl flex flex-col items-center justify-center p-7 shrink-0"
        >
          <div className="text-6xl mb-4">{category.emoji}</div>
          <p className="text-white text-2xl font-extrabold text-center leading-tight drop-shadow-lg">
            {winner}
          </p>
          <div className="mt-4 px-3 py-1 bg-white/25 rounded-full">
            <span className="text-white text-xs font-bold">
              {winCount}/{totalRounds} รอบ
            </span>
          </div>
          <div className="mt-2 px-3 py-0.5 bg-white/15 rounded-full">
            <span className="text-white/70 text-xs">{category.name}</span>
          </div>
          <p className="mt-3 text-white/40 text-xs font-bold tracking-widest">PICK</p>
        </motion.div>

        {/* Round history */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full"
        >
          <p className="text-xs text-gray-400 text-center mb-2 font-medium">ประวัติการเลือก</p>
          <div className="flex flex-wrap justify-center gap-2">
            {choices.map((choice, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 200 }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  choice === winner
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span className="text-gray-400 font-normal">{i + 1}.</span>
                <span>{choice}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 shrink-0 pt-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            <Share2 size={17} />
            <span>{copied ? 'คัดลอกแล้ว!' : 'แชร์เลย'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform disabled:opacity-50"
          >
            <Download size={17} />
            <span>{saving ? 'กำลังบันทึก...' : 'บันทึกลงเครื่อง'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-100 text-indigo-700 font-bold active:scale-95 transition-transform"
          >
            <RotateCcw size={17} />
            <span>เล่นอีกครั้ง</span>
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-800 text-white font-bold active:scale-95 transition-transform"
          >
            <Home size={17} />
            <span>หน้าหลัก</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
