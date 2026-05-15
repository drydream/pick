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
  onChoose: (item: string) => void
  onBack: () => void
}

export default function GameCameraScreen({
  winner,
  challenger,
  currentIndex,
  totalItems,
  winnerColor,
  winnerCameFromBottom,
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
    setTimeout(() => onChoose(side === 'winner' ? winner : challenger), 750)
  }

  const roundNumber = currentIndex - 1
  const totalRounds = totalItems - 1
  const progressPct = ((roundNumber - 1) / totalRounds) * 100

  const challengerColor: 'red' | 'blue' = winnerColor === 'red' ? 'blue' : 'red'

  // Card bg: semi-transparent color tint
  const winnerCardBg    = winnerColor    === 'red' ? 'bg-red-600/85'  : 'bg-blue-700/85'
  const challengerCardBg = challengerColor === 'red' ? 'bg-red-600/85' : 'bg-blue-700/85'

  const winnerInitial = winnerCameFromBottom
    ? { opacity: 0, y: -24, x: 0 }
    : { opacity: 0, y: -24, x: 0 }  // both slide down from top for camera mode

  const winnerAnimateOut = winnerCameFromBottom
    ? { opacity: 0.2, y: -24, x: 0 }
    : { opacity: 0.2, y: -24, x: 0 }

  return (
    <div className="relative h-full bg-black overflow-hidden">
      {!cameraError ? (
        <video ref={videoRef} autoPlay playsInline muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-3">
          <CameraOff size={52} className="text-gray-500" />
          <p className="text-gray-400 text-base">ไม่สามารถเข้าถึงกล้องได้</p>
          <p className="text-gray-600 text-sm px-8 text-center">
            กรุณาอนุญาตการใช้กล้องในเบราว์เซอร์ของคุณ
          </p>
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/55 pointer-events-none" />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-30">
        <motion.div className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Back + round counter */}
      <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-4 z-20">
        <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          onClick={onBack} aria-label="กลับ">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full tabular-nums">
          รอบที่ {roundNumber}/{totalRounds}
        </span>
      </div>

      {/* ── WINNER — top ──────────────────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[44%] flex items-end justify-center pb-4 z-10 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={chosen === 'challenger' ? { opacity: 0.2, y: -20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        onClick={() => handleChoose('winner')}
      >
        <motion.div
          className={`${winnerCardBg} backdrop-blur-md rounded-2xl mx-6 shadow-xl overflow-hidden w-full`}
          animate={chosen === 'winner' ? { scale: 1.04 } : {}}
          transition={{ type: 'spring', stiffness: 220 }}
        >
          {/* Thumbnail image strip */}
          <div className="relative h-20 w-full overflow-hidden">
            <img src={getItemImage(winner)} alt={winner}
              className="w-full h-full object-cover" loading="eager" />
            <div className={`absolute inset-0 ${winnerCardBg} opacity-40`} />
            {/* Crown + color tag inside image */}
            <div className="absolute top-2 left-3 flex items-center gap-1">
              <span className="text-base leading-none">👑</span>
              <span className="text-white/80 text-xs font-semibold">ผู้ท้าชนะเดิม</span>
            </div>
            <div className="absolute top-2 right-3">
              <span className="text-sm">{winnerColor === 'red' ? '🔴' : '🔵'}</span>
            </div>
          </div>
          {/* Text */}
          <div className="px-4 py-2.5 text-center">
            <p className="text-xl font-extrabold text-white drop-shadow leading-tight">{winner}</p>
            {chosen === 'winner' && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-white text-sm mt-0.5">✓ ผ่านไปได้!</motion.p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* VS badge */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-yellow-400 shadow-xl flex items-center justify-center border-4 border-white">
          <span className="font-black text-gray-900 text-sm">VS</span>
        </div>
      </div>

      {/* ── CHALLENGER — bottom ──────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[44%] flex items-start justify-center pt-4 z-10 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={chosen === 'winner' ? { opacity: 0.2, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: 'easeOut', delay: 0.06 }}
        onClick={() => handleChoose('challenger')}
      >
        <motion.div
          className={`${challengerCardBg} backdrop-blur-md rounded-2xl mx-6 shadow-xl overflow-hidden w-full`}
          animate={chosen === 'challenger' ? { scale: 1.04 } : {}}
          transition={{ type: 'spring', stiffness: 220 }}
        >
          {/* Text */}
          <div className="px-4 py-2.5 text-center">
            <p className="text-xl font-extrabold text-white drop-shadow leading-tight">{challenger}</p>
            {chosen === 'challenger' && (
              <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-white text-sm mt-0.5">✓ ผ่านไปได้!</motion.p>
            )}
          </div>
          {/* Thumbnail image strip */}
          <div className="relative h-20 w-full overflow-hidden">
            <img src={getItemImage(challenger)} alt={challenger}
              className="w-full h-full object-cover" loading="eager" />
            <div className={`absolute inset-0 ${challengerCardBg} opacity-40`} />
            <div className="absolute top-2 right-3 flex items-center gap-1">
              <span className="text-white/80 text-xs font-semibold">ผู้ท้าชิง</span>
              <span className="text-base leading-none">⚔️</span>
            </div>
            <div className="absolute top-2 left-3">
              <span className="text-sm">{challengerColor === 'red' ? '🔴' : '🔵'}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
