'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RotateCcw, Home } from 'lucide-react'
import { Category } from '@/lib/types'

interface Props {
  winner: string
  category: Category
  totalItems: number
  winHistory: string[]
  onPlayAgain: () => void
  onGoHome: () => void
}

export default function ResultScreen({ winner, category, totalItems, winHistory, onPlayAgain, onGoHome }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const totalRounds = totalItems - 1

  const handleShare = async () => {
    const text = `🏆 My PICK Champion คือ "${winner}" จาก ${category.name}! ผ่าน ${totalRounds} Rounds มาแล้ว แล้วคุณล่ะ? 🎯`
    if (navigator.share) {
      try { await navigator.share({ title: 'PICK — Champion!', text, url: window.location.href }) }
      catch { /* dismissed */ }
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
        backgroundColor: null, scale: 3, useCORS: true, logging: false,
      })
      const link = document.createElement('a')
      link.download = `pick-champion-${winner.replace(/\s+/g, '-')}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white px-5 py-5">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-0.5">
            ผ่าน {totalRounds} Rounds มาแล้ว 🔥
          </p>
          <p className="text-2xl font-extrabold text-gray-800">🏆 Champion!</p>
        </motion.div>

        {/* Champion card — captured by html2canvas */}
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.55, opacity: 0, rotate: -7 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 155, damping: 13, delay: 0.06 }}
          className="w-full max-w-[240px] aspect-[3/4] rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 shadow-2xl flex flex-col items-center justify-center p-7 shrink-0"
        >
          <div className="text-5xl mb-1">🏆</div>
          {category.iconDataUrl
            ? <img src={category.iconDataUrl} className="w-14 h-14 rounded-2xl object-cover mb-4 mx-auto" />
            : <div className="text-5xl mb-4">{category.emoji}</div>
          }
          <p className="text-white text-2xl font-extrabold text-center leading-tight drop-shadow-lg">
            {winner}
          </p>
          <div className="mt-4 px-3 py-1 bg-white/25 rounded-full">
            <span className="text-white text-xs font-bold">Survived {totalRounds} Rounds</span>
          </div>
          <div className="mt-2 px-3 py-0.5 bg-white/15 rounded-full">
            <span className="text-white/70 text-xs">{category.name}</span>
          </div>
          <p className="mt-3 text-white/40 text-xs font-bold tracking-widest">PICK</p>
        </motion.div>

        {/* Round history chips */}
        {winHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <p className="text-xs text-gray-400 text-center mb-2 font-medium">Round History</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {winHistory.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.42 + i * 0.04, type: 'spring', stiffness: 200 }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item === winner
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-gray-300 font-normal">{i + 1}.</span>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="space-y-3 shrink-0 pt-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            <Share2 size={17} />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform disabled:opacity-50"
          >
            <Download size={17} />
            <span>{saving ? 'Saving...' : 'Save Image'}</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-100 text-indigo-700 font-bold active:scale-95 transition-transform"
          >
            <RotateCcw size={17} />
            <span>Play Again</span>
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-800 text-white font-bold active:scale-95 transition-transform"
          >
            <Home size={17} />
            <span>Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
