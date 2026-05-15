'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CameraOff } from 'lucide-react'
import { getItemImage } from '@/lib/data'

interface Props {
  winner: string
  challenger: string
  currentIndex: number
  totalItems: number
  winnerColor: 'red' | 'blue'
  winnerCameFromBottom: boolean
  itemImages?: Record<string, string>
  onChoose: (item: string) => void
  onBack: () => void
}

const CARD_HEIGHT = '46%'

export default function GameCameraScreen({
  winner,
  challenger,
  currentIndex,
  totalItems,
  winnerColor,
  itemImages,
  onChoose,
  onBack,
}: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const [chosen, setChosen] = useState<'winner' | 'challenger' | null>(null)

  useEffect(() => {
    let active = true
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false,
        })
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch {
        if (active) setCameraError(true)
      }
    }
    startCamera()
    return () => { active = false; streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  const handleChoose = (side: 'winner' | 'challenger') => {
    if (chosen) return
    setChosen(side)
    setTimeout(() => onChoose(side === 'winner' ? winner : challenger), 700)
  }

  const roundNumber = currentIndex - 1
  const totalRounds = totalItems - 1
  const progressPct = ((roundNumber - 1) / totalRounds) * 100

  const challengerColor: 'red' | 'blue' = winnerColor === 'red' ? 'blue' : 'red'

  const winnerGlow    = winnerColor    === 'red' ? 'shadow-red-500/60'  : 'shadow-blue-500/60'
  const challengerGlow = challengerColor === 'red' ? 'shadow-red-500/60' : 'shadow-blue-500/60'

  const winnerOverlay    = winnerColor    === 'red' ? 'bg-red-600/50'  : 'bg-blue-700/50'
  const challengerOverlay = challengerColor === 'red' ? 'bg-red-600/50' : 'bg-blue-700/50'

  const winnerDot    = winnerColor    === 'red' ? '🔴' : '🔵'
  const challengerDot = challengerColor === 'red' ? '🔴' : '🔵'

  return (
    <div className="relative h-full bg-black overflow-hidden select-none">

      {/* ── Camera feed ───────────────────────────────────────── */}
      {!cameraError ? (
        <video ref={videoRef} autoPlay playsInline muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3">
          <CameraOff size={52} className="text-gray-500" />
          <p className="text-gray-300 text-base font-semibold">Camera Access Denied</p>
          <p className="text-gray-500 text-sm px-8 text-center">
            กรุณา Allow camera access ในเบราว์เซอร์ก่อนนะ
          </p>
        </div>
      )}

      {/* ── Vignette — heavier at bottom so cards pop ─────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 28%, transparent 40%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.72) 100%)'
        }}
      />

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
        <motion.div className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* ── Top bar ───────────────────────────────────────────── */}
      <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-4 z-30">
        <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full tabular-nums">
          Round {roundNumber}/{totalRounds}
        </span>
      </div>

      {/* ── Item names — float above the cards ────────────────── */}
      <div
        className="absolute left-0 right-0 z-20 flex items-end justify-between px-3 gap-12"
        style={{ bottom: `calc(${CARD_HEIGHT} + 10px)` }}
      >
        {/* Winner name (left) */}
        <motion.div
          className="flex-1"
          animate={chosen === 'challenger' ? { opacity: 0, x: -16 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-base leading-none">👑</span>
            <span className="text-white/80 text-[11px] font-bold tracking-wide">Defending Champ</span>
            <span className="text-xs leading-none">{winnerDot}</span>
          </div>
          <p className="text-[22px] font-extrabold text-white leading-tight"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8)' }}>
            {winner}
          </p>
          {chosen === 'winner' && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="text-yellow-300 text-sm font-extrabold mt-1">✓ Winner!</motion.p>
          )}
        </motion.div>

        {/* Challenger name (right) */}
        <motion.div
          className="flex-1 text-right"
          animate={chosen === 'winner' ? { opacity: 0, x: 16 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-1.5 mb-1 justify-end">
            <span className="text-xs leading-none">{challengerDot}</span>
            <span className="text-white/80 text-[11px] font-bold tracking-wide">Challenger</span>
            <span className="text-base leading-none">⚔️</span>
          </div>
          <p className="text-[22px] font-extrabold text-white leading-tight"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8)' }}>
            {challenger}
          </p>
          {chosen === 'challenger' && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="text-yellow-300 text-sm font-extrabold mt-1 text-right">✓ Winner!</motion.p>
          )}
        </motion.div>
      </div>

      {/* ── Invisible full-half tap zones (above the cards too) ── */}
      <div className="absolute inset-0 z-10 flex">
        <div className="flex-1 h-full cursor-pointer" onClick={() => handleChoose('winner')} />
        <div className="flex-1 h-full cursor-pointer" onClick={() => handleChoose('challenger')} />
      </div>

      {/* ── VS badge (floats at top edge of cards) ────────────── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-30"
        style={{ bottom: `calc(${CARD_HEIGHT} - 20px)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 220 }}
      >
        <div className="w-10 h-10 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/40 flex items-center justify-center border-2 border-white">
          <span className="font-black text-gray-900 text-[11px]">VS</span>
        </div>
      </motion.div>

      {/* ── Bottom cards ──────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 flex z-20" style={{ height: CARD_HEIGHT }}>

        {/* LEFT — Winner card */}
        <motion.div
          className={`flex-1 relative overflow-hidden cursor-pointer shadow-2xl ${winnerGlow}`}
          style={{ borderTopRightRadius: '20px' }}
          initial={{ y: 80, opacity: 0 }}
          animate={
            chosen === 'challenger'
              ? { opacity: 0.18, x: -24, y: 0, scale: 0.96 }
              : chosen === 'winner'
              ? { opacity: 1, scale: 1.03, y: 0, x: 0 }
              : { y: 0, opacity: 1, scale: 1, x: 0 }
          }
          transition={{ duration: 0.36, ease: 'easeOut' }}
          onClick={() => handleChoose('winner')}
        >
          <img
            src={getItemImage(winner, itemImages)}
            alt={winner}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="eager"
          />
          {/* Color overlay */}
          <div className={`absolute inset-0 ${winnerOverlay}`} />
          {/* Bottom gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Chosen checkmark */}
          {chosen === 'winner' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white/12 z-20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <motion.span className="text-8xl drop-shadow-2xl"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, delay: 0.08 }}>✓</motion.span>
            </motion.div>
          )}
        </motion.div>

        {/* Center gap (VS badge sits above this) */}
        <div className="w-10 shrink-0 bg-transparent" />

        {/* RIGHT — Challenger card */}
        <motion.div
          className={`flex-1 relative overflow-hidden cursor-pointer shadow-2xl ${challengerGlow}`}
          style={{ borderTopLeftRadius: '20px' }}
          initial={{ y: 80, opacity: 0 }}
          animate={
            chosen === 'winner'
              ? { opacity: 0.18, x: 24, y: 0, scale: 0.96 }
              : chosen === 'challenger'
              ? { opacity: 1, scale: 1.03, y: 0, x: 0 }
              : { y: 0, opacity: 1, scale: 1, x: 0 }
          }
          transition={{ duration: 0.36, ease: 'easeOut', delay: 0.05 }}
          onClick={() => handleChoose('challenger')}
        >
          <img
            src={getItemImage(challenger, itemImages)}
            alt={challenger}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="eager"
          />
          {/* Color overlay */}
          <div className={`absolute inset-0 ${challengerOverlay}`} />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Chosen checkmark */}
          {chosen === 'challenger' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white/12 z-20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <motion.span className="text-8xl drop-shadow-2xl"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 240, delay: 0.08 }}>✓</motion.span>
            </motion.div>
          )}
        </motion.div>
      </div>

    </div>
  )
}
