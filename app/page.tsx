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

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
}

const GAME_SCREENS: Screen[] = ['game-normal', 'game-camera']

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home')
  const [dir, setDir] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addCatOpen, setAddCatOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [selectedMode, setSelectedMode] = useState<'normal' | 'camera'>('normal')
  const [pairIndex, setPairIndex] = useState(0)
  const [totalRounds, setTotalRounds] = useState(5)
  const [currentRound, setCurrentRound] = useState(1)
  const [choices, setChoices] = useState<string[]>([])
  const [coins, setCoins] = useState(0)
  const [customCats, setCustomCats] = useState<Category[]>([])

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

  const handleCategorySelect = (cat: Category) => {
    setSelectedCat(cat)
    setPairIndex(0)
    navigate('mode-select')
  }

  const handleModeSelect = (mode: 'normal' | 'camera') => {
    setSelectedMode(mode)
    navigate('round-select')
  }

  const handleRoundSelect = (rounds: number) => {
    setTotalRounds(rounds)
    setCurrentRound(1)
    setChoices([])
    navigate(selectedMode === 'camera' ? 'game-camera' : 'game-normal')
  }

  const handleChoose = (item: string) => {
    const newChoices = [...choices, item]
    setChoices(newChoices)

    const newCoins = coins + 1
    setCoins(newCoins)
    try { localStorage.setItem('pick_coins', String(newCoins)) } catch {}

    if (currentRound >= totalRounds) {
      navigate('result')
    } else {
      const nextRound = currentRound + 1
      const nextPairIdx = (pairIndex + 1) % (selectedCat?.pairs.length ?? 1)
      setCurrentRound(nextRound)
      setPairIndex(nextPairIdx)
      navigate(selectedMode === 'camera' ? 'game-camera' : 'game-normal')
    }
  }

  const handlePlayAgain = () => {
    setCurrentRound(1)
    setChoices([])
    setPairIndex(0)
    navigate('round-select', -1)
  }

  const handleAddCategory = (cat: Category) => {
    const updated = [...customCats, cat]
    setCustomCats(updated)
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(updated)) } catch {}
    setAddCatOpen(false)
  }

  const allCategories = [...DEFAULT_CATEGORIES, ...customCats]
  const currentPair = selectedCat?.pairs[pairIndex]
  const isGameScreen = GAME_SCREENS.includes(screen)

  const topBarTitle =
    screen === 'home' ? 'หมวดหมู่' :
    screen === 'mode-select' ? (selectedCat?.name ?? '') :
    screen === 'round-select' ? 'จำนวนรอบ' :
    screen === 'result' ? 'ผลการเล่น' : ''

  const topBarBack =
    screen === 'home' ? undefined :
    screen === 'mode-select' ? () => navigate('home', -1) :
    screen === 'round-select' ? () => navigate('mode-select', -1) :
    screen === 'result' ? () => navigate('home', -1) :
    undefined

  return (
    <div className="flex flex-col h-full font-sarabun overflow-hidden">
      {/* Overlays */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar
            key="sidebar"
            onClose={() => setSidebarOpen(false)}
            onAddCategory={() => { setSidebarOpen(false); setAddCatOpen(true) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addCatOpen && (
          <AddCategoryModal
            key="addcat"
            onClose={() => setAddCatOpen(false)}
            onAdd={handleAddCategory}
          />
        )}
      </AnimatePresence>

      {/* Top bar — hidden during gameplay */}
      <AnimatePresence>
        {!isGameScreen && (
          <motion.div
            key="topbar"
            initial={{ y: -56 }}
            animate={{ y: 0 }}
            exit={{ y: -56 }}
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

      {/* Screen area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {screen === 'home' && (
            <motion.div
              key="home"
              custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <HomeScreen categories={allCategories} onSelect={handleCategorySelect} />
            </motion.div>
          )}

          {screen === 'mode-select' && selectedCat && (
            <motion.div
              key="mode-select"
              custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <ModeSelectScreen category={selectedCat} onSelect={handleModeSelect} />
            </motion.div>
          )}

          {screen === 'round-select' && selectedCat && (
            <motion.div
              key="round-select"
              custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
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

          {screen === 'game-normal' && currentPair && (
            <motion.div
              key={`game-normal-${currentRound}`}
              custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <GameNormalScreen
                optionA={currentPair[0]}
                optionB={currentPair[1]}
                categoryName={selectedCat?.name ?? ''}
                currentRound={currentRound}
                totalRounds={totalRounds}
                onChoose={handleChoose}
                onBack={() => navigate('round-select', -1)}
              />
            </motion.div>
          )}

          {screen === 'game-camera' && currentPair && (
            <motion.div
              key={`game-camera-${currentRound}`}
              custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <GameCameraScreen
                optionA={currentPair[0]}
                optionB={currentPair[1]}
                currentRound={currentRound}
                totalRounds={totalRounds}
                onChoose={handleChoose}
                onBack={() => navigate('round-select', -1)}
              />
            </motion.div>
          )}

          {screen === 'result' && choices.length > 0 && selectedCat && (
            <motion.div
              key="result"
              custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <ResultScreen
                choices={choices}
                totalRounds={totalRounds}
                category={selectedCat}
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
