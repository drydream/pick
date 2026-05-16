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
import ManageCategoriesScreen from '@/components/ManageCategoriesScreen'
import AddCategoryModal from '@/components/AddCategoryModal'
import LandingScreen from '@/components/LandingScreen'

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
}

const fade = {
  enter: () => ({ opacity: 0 }),
  center: { opacity: 1 },
  exit:  () => ({ opacity: 0 }),
}

const GAME_SCREENS: Screen[] = ['game-normal', 'game-camera']
const NO_TOPBAR_SCREENS: Screen[] = ['game-normal', 'game-camera', 'landing']

export default function Home() {
  const [screen, setScreen]           = useState<Screen>('landing')
  const [dir, setDir]                 = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addCatOpen, setAddCatOpen]   = useState(false)
  const [editCat, setEditCat]         = useState<Category | null>(null)
  const [selectedCat, setSelectedCat] = useState<Category | null>(null)
  const [selectedMode, setSelectedMode] = useState<'normal' | 'camera'>('normal')
  const [coins, setCoins]             = useState(0)
  const [customCats, setCustomCats]   = useState<Category[]>([])

  // ── Survivor game state ────────────────────────────────────────────
  const [gameItems, setGameItems]             = useState<string[]>([])
  const [currentWinner, setCurrentWinner]     = useState('')
  const [nextChallenger, setNextChallenger]   = useState('')
  const [currentIndex, setCurrentIndex]       = useState(2)
  const [totalItems, setTotalItems]           = useState(5)
  const [winHistory, setWinHistory]           = useState<string[]>([])
  const [winnerColor, setWinnerColor]         = useState<'red' | 'blue'>('red')
  const [winnerCameFromBottom, setWinnerCameFromBottom] = useState(false)
  const [itemImages, setItemImages]           = useState<Record<string, string>>({})
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
    let itemNames: string[]
    const images: Record<string, string> = {}

    if (selectedCat.items) {
      const sliced = selectedCat.items.slice(0, itemCount)
      itemNames = sliced.map(i => i.name)
      sliced.forEach(i => { if (i.imageDataUrl) images[i.name] = i.imageDataUrl })
    } else {
      itemNames = selectedCat.pairs.flat().slice(0, itemCount)
    }

    setItemImages(images)
    setGameItems(itemNames)
    setCurrentWinner(itemNames[0])
    setNextChallenger(itemNames[1])
    setCurrentIndex(2)
    setTotalItems(itemCount)
    setWinHistory([])
    setWinnerColor('red')
    setWinnerCameFromBottom(false)
    navigate(selectedMode === 'camera' ? 'game-camera' : 'game-normal')
  }

  const handleChoose = (item: string) => {
    const newHistory = [...winHistory, item]
    setWinHistory(newHistory)

    const newCoins = coins + 1
    setCoins(newCoins)
    try { localStorage.setItem('pick_coins', String(newCoins)) } catch {}

    const challengerWon = item === nextChallenger
    const newWinnerColor: 'red' | 'blue' = challengerWon
      ? (winnerColor === 'red' ? 'blue' : 'red')
      : winnerColor

    setWinnerColor(newWinnerColor)
    setWinnerCameFromBottom(challengerWon)

    if (currentIndex >= gameItems.length) {
      setCurrentWinner(item)
      navigate('result')
    } else {
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
    setWinnerColor('red')
    setWinnerCameFromBottom(false)
    navigate('round-select', -1)
  }

  const handleAddCategory = (cat: Category) => {
    let updated: Category[]
    if (editCat) {
      updated = customCats.map(c => c.id === cat.id ? cat : c)
      setEditCat(null)
    } else {
      updated = [...customCats, cat]
    }
    setCustomCats(updated)
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(updated)) } catch {}
    setAddCatOpen(false)
  }

  const handleEditCategory = (cat: Category) => {
    setEditCat(cat)
    setAddCatOpen(true)
  }

  const handleDeleteCategory = (id: string) => {
    const updated = customCats.filter(c => c.id !== id)
    setCustomCats(updated)
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(updated)) } catch {}
  }

  // ── Derived ────────────────────────────────────────────────────────

  const allCategories = [
    ...DEFAULT_CATEGORIES.filter(d => !customCats.find(c => c.id === d.id)),
    ...customCats,
  ]
  const isGameScreen  = GAME_SCREENS.includes(screen)
  const showTopBar    = !NO_TOPBAR_SCREENS.includes(screen)

  const categoryMaxItems = selectedCat
    ? (selectedCat.items?.length ?? selectedCat.pairs.flat().length)
    : 10

  const topBarTitle =
    screen === 'home'              ? 'Categories' :
    screen === 'mode-select'       ? (selectedCat?.name ?? '') :
    screen === 'round-select'      ? 'Select Items' :
    screen === 'manage-categories' ? 'Manage Categories' :
    screen === 'result'            ? 'Results' : ''

  const topBarBack =
    screen === 'home'              ? undefined :
    screen === 'mode-select'       ? () => navigate('home', -1) :
    screen === 'round-select'      ? () => navigate('mode-select', -1) :
    screen === 'manage-categories' ? () => navigate('home', -1) :
    screen === 'result'            ? () => navigate('home', -1) :
    undefined

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full font-sarabun overflow-hidden">

      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar key="sidebar"
            onClose={() => setSidebarOpen(false)}
            onManageCategories={() => { setSidebarOpen(false); navigate('manage-categories') }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addCatOpen && (
          <AddCategoryModal key="addcat"
            editCategory={editCat ?? undefined}
            onClose={() => { setAddCatOpen(false); setEditCat(null) }}
            onAdd={handleAddCategory}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTopBar && (
          <motion.div key="topbar"
            initial={{ y: -56 }} animate={{ y: 0 }} exit={{ y: -56 }}
            transition={{ type: 'tween', duration: 0.22 }}
          >
            <TopBar title={topBarTitle} coins={coins}
              onMenuClick={() => setSidebarOpen(true)} onBack={topBarBack} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>

          {screen === 'landing' && (
            <motion.div key="landing"
              custom={dir} variants={fade} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <LandingScreen onStart={() => navigate('home')} />
            </motion.div>
          )}

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
                maxItems={categoryMaxItems}
                onSelect={handleRoundSelect}
              />
            </motion.div>
          )}

          {screen === 'manage-categories' && (
            <motion.div key="manage-categories"
              custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
              transition={{ type: 'tween', duration: 0.28 }}
              className="absolute inset-0"
            >
              <ManageCategoriesScreen
                customCats={customCats}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onAdd={() => { setEditCat(null); setAddCatOpen(true) }}
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
                winnerColor={winnerColor}
                winnerCameFromBottom={winnerCameFromBottom}
                itemImages={itemImages}
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
                winnerColor={winnerColor}
                winnerCameFromBottom={winnerCameFromBottom}
                itemImages={itemImages}
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
