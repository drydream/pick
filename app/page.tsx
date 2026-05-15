'use client'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DEFAULT_CATEGORIES } from '@/lib/data'
import { Category, Screen } from '@/lib/types'
import TopBar from '@/components/TopBar'
import Sidebar from '@/components/Sidebar'
import HomeScreen from '@/components/HomeScreen'
import ModeSelectScreen from '@/components/ModeSelectScreen'
import RoundSelectScreen from '@/components/RoundSelectScreen'
import GameNormalScreen from '@/components/GameNormalScreen'
import GameCameraScreen from '@/components/GameCameraScreen'
import ResultScreen from '@/components/ResultScreen'
import AddCategoryModal from '@/components/AddCategoryModal'

// Non-game screens use a slide transition
const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
}

// Game screens use a fast fade so per-half animations inside the component are visible
const fade = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit:  () => ({ opacity: 0 }),
}

const GAME_SCREENS: Screen[] = ['game-normal', 'game-camera']

export default function Home() {
  const [screen, setScreen]         = useState<Screen>('home')
  const [dir, setDir]               = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addCatOpen, setAddCatOpen]   = useState(false)
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [selectedMode, setSelectedMode] = useState<'normal' | 'camera'>('normal')
  const [coins, setCoins]           = useState(0)
  const [customCats, setCustomCats] = useState<Category[]>([])

  // ── Survivor game state ────────────────────────────────────────────
  const [gameItems, setGameItems]         = useState<string[]>([])
  const [currentWinner, setCurrentWinner] = useState('')
  const [nextChallenger, setNextChallenger] = useState('')
  const [currentIndex, setCurrentIndex]   = useState(2)   // next item slot to bring in
  const [totalItems, setTotalItems]       = useState(5)
  const [winHistory, setWinHistory]       = useState<string[]>([])
  // ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const cats = localStorage.getItem('pick_custom_cats')
      if (cats) setCustomCats(JSON.parse(cats))
      const c = localStorage.getItem('pick_coins')
      if (c) setCoins(parseInt(c, 10))
    } catch {}
  }, [])

  const navigate = useCallback((to: Screen, direction = 1) => {
    setDir(direction)
    setScreen(to)
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────

  const handleCategorySelect = (cat: Category) => {
    setSelectedCat(cat)
    navigate('mode-select')
  }

  const handleModeSelect = (mode: 'normal' | 'camera') => {
    setSelectedMode(mode)
    navigate('round-select')
  }

  const handleRoundSelect = (itemCount: number) => {
    if (!selectedCat) return
    // Flatten all pairs into a flat item list, then slice to requested count
    const items = selectedCat.pairs.flat().slice(0, itemCount)
    setGameItems(items)
    setCurrentWinner(items[0])
    setNextChallenger(items[1])
    setCurrentIndex(2)   // next item to challenge starts at index 2
    setTotalItems(itemCount)
    setWinHistory([])
    navigate(selectedMode === 'camera' ? 'game-camera' : 'game-normal')
  }

  const handleChoose = (item: string) => {
    const newHistory = [...winHistory, item]
    setWinHistory(newHistory)

    const newCoins = coins + 1
    setCoins(newCoins)
    try { localStorage.setItem('pick_coins', String(newCoins)) } catch {}

    if (currentIndex >= gameItems.length) {
      // No more challengers — this item is the champion
      setCurrentWinner(item)
      navigate('result')
    } else {
      // Advance: winner stays, next item becomes the new challenger
      setCurrentWinner(item)
      setNextChallenger(gameItems[currentIndex])
      setCurrentIndex(prev => prev + 1)
      navigate(selectedMode === 'camera' ? 'game-camera' : 'game-normal')
    }
  }

  const handlePlayAgain = () => {
    setCurrentWinner('')
    setNextChallenger('')
    setCurrentIndex(2)
    setWinHistory([])
    navigate('round-select', -1)
  }

  const handleAddCategory = (cat: Category) => {
    const updated = [...customCats, cat]
    setCustomCats(updated)
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(updated)) } catch {}
    setAddCatOpen(false)
  }

  // ── Derived values ─────────────────────────────────────────────────

  const allCategories = [...DEFAULT_CATEGORIES, ...customCats]
  const isGameScreen  = GAME_SCREENS.includes(screen)

  const topBarTitle =
    screen === 'home'         ? 'หมวดหมู่' :
    screen === 'mode-select'  ? (selectedCat?.name ?? '') :
    screen === 'round-select' ? 'จำนวนไอเทม' :
    screen === 'result'       ? 'ผลการเล่น' : ''

  const topBarBack =
    screen === 'home'         ? undefined :
    screen === 'mode-select'  ? () => navigate('home', -1) :
    screen === 'round-select' ? () => navigate('mode-select', -1) :
    screen === 'result'       ? () => navigate('home', -1) :
    undefined

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full font-sarabun overflow-hidden">

      {/* ── Overlays ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar key="sidebar"
            onClose={() => setSidebarOpen(false)}
            onAddCategory={() => { setSidebarOpen(false); setAddCatOpen(true) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addCatOpen && (
          <AddCategoryModal key="addcat"
            onClose={() => setAddCatOpen(false)}
            onAdd={handleAddCategory}
          />
        )}
      </AnimatePresence>

      {/* ── Top bar (hidden during gameplay) ──────────────────────── */}
      <AnimatePresence>
        {!isGameScreen && (
          <motion.div key="topbar"
            initial={{ y: -56 }} animate={{ y: 0 }} exit={{ y: -56 }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <TopBar
              title={topBarTitle}
              coins={coins}
              onMenuClick={() => setSidebarOpen(true)}
              onBack={topBarBack}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Screen area ────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>

          {screen === 'home' && (
            <motion.div key="home"
              custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <HomeScreen categories={allCategories} onSelect={handleCategorySelect} />
            </motion.div>
          )}

          {screen === 'mode-select' && selectedCat && (
            <motion.div key="mode-select"
              custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <ModeSelectScreen category={selectedCat} onSelect={handleModeSelect} />
            </motion.div>
          )}

          {screen === 'round-select' && selectedCat && (
            <motion.div key="round-select"
              custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <RoundSelectScreen
                category={selectedCat}
                mode={selectedMode}
                onSelect={handleRoundSelect}
              />
            </motion.div>
          )}

          {screen === 'game-normal' && currentWinner && nextChallenger && (
            <motion.div
              key={`game-normal-${currentIndex}`}
              custom={dir} variants={fade} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.14 }}
              className="absolute inset-0"
            >
              <GameNormalScreen
                winner={currentWinner}
                challenger={nextChallenger}
                currentIndex={currentIndex}
                totalItems={totalItems}
                onChoose={handleChoose}
                onBack={() => navigate('round-select', -1)}
              />
            </motion.div>
          )}

          {screen === 'game-camera' && currentWinner && nextChallenger && (
            <motion.div
              key={`game-camera-${currentIndex}`}
              custom={dir} variants={fade} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.14 }}
              className="absolute inset-0"
            >
              <GameCameraScreen
                winner={currentWinner}
                challenger={nextChallenger}
                currentIndex={currentIndex}
                totalItems={totalItems}
                onChoose={handleChoose}
                onBack={() => navigate('round-select', -1)}
              />
            </motion.div>
          )}

          {screen === 'result' && currentWinner && selectedCat && (
            <motion.div key="result"
              custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <ResultScreen
                winner={currentWinner}
                category={selectedCat}
                totalItems={totalItems}
                winHistory={winHistory}
                onPlayAgain={handlePlayAgain}
                onGoHome={() => navigate('home', -1)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
