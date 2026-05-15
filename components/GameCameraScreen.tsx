'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CameraOff } from 'lucide-react'

interface Props {
  optionA: string
  optionB: string
  currentRound: number
  totalRounds: number
  onChoose: (item: string) => void
  onBack: () => void
}

export default function GameCameraScreen({
  optionA,
  optionB,
  currentRound,
  totalRounds,
  onChoose,
  onBack,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)
  const [chosen, setChosen] = useState<'A' | 'B' | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let active = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: false,
        })
        if (!active) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch {
        if (active) setCameraError(true)
      }
    }

    startCamera()
    return () => {
      active = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const handleChoose = (side: 'A' | 'B') => {
    if (chosen) return
    setChosen(side)
    setTimeout(() => onChoose(side === 'A' ? optionA : optionB), 750)
  }

  const progressPct = ((currentRound - 1) / totalRounds) * 100

  return (
    <div className="relative h-full bg-black overflow-hidden">
      {!cameraError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-30">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Back + round counter */}
      <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-4 z-20">
        <button
          className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
          onClick={onBack}
          aria-label="กลับ"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full tabular-nums">
          รอบที่ {currentRound}/{totalRounds}
        </span>
      </div>

      {/* Option A — top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[43%] flex items-center justify-center z-10 cursor-pointer"
        onClick={() => handleChoose('A')}
        animate={chosen === 'B' ? { opacity: 0.25 } : { opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="bg-red-500/80 backdrop-blur-md rounded-2xl px-7 py-4 mx-8 shadow-lg"
          animate={chosen === 'A' ? { scale: 1.06, backgroundColor: 'rgba(239,68,68,0.95)' } : {}}
          transition={{ type: 'spring', stiffness: 220 }}
        >
          <p className="text-2xl font-extrabold text-white text-center drop-shadow leading-tight">
            {optionA}
          </p>
          {chosen === 'A' && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-center text-base mt-1"
            >
              ✓ เลือกแล้ว!
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* VS badge */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-yellow-400 shadow-xl flex items-center justify-center border-4 border-white">
          <span className="font-black text-gray-900 text-sm">VS</span>
        </div>
      </div>

      {/* Option B — bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[43%] flex items-center justify-center z-10 cursor-pointer"
        onClick={() => handleChoose('B')}
        animate={chosen === 'A' ? { opacity: 0.25 } : { opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="bg-blue-600/80 backdrop-blur-md rounded-2xl px-7 py-4 mx-8 shadow-lg"
          animate={chosen === 'B' ? { scale: 1.06, backgroundColor: 'rgba(37,99,235,0.95)' } : {}}
          transition={{ type: 'spring', stiffness: 220 }}
        >
          <p className="text-2xl font-extrabold text-white text-center drop-shadow leading-tight">
            {optionB}
          </p>
          {chosen === 'B' && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-center text-base mt-1"
            >
              ✓ เลือกแล้ว!
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
