'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, Trash2, Upload, ImagePlus, AlertCircle, Send } from 'lucide-react'
import { Category } from '@/lib/types'

const PRESET_EMOJIS = [
  '🎮', '🍕', '🎵', '🏆', '🌟', '❤️', '🎯', '🚀', '🌈', '🎪',
  '🦁', '🌺', '🎭', '🏀', '🎲', '🌍', '🎸', '🍔', '🎨', '🐶',
  '🦋', '🎉', '🔥', '💎', '🌙', '⚡', '🎡', '🦄', '🐉', '🍀',
  '🎤', '🎬', '🏖️', '🗺️', '🌮',
]

interface ItemEntry {
  id: string
  name: string
  imageDataUrl: string
}

interface Props {
  editCategory?: Category
  onClose: () => void
  onAdd: (cat: Category) => void
}

const compressImage = (dataUrl: string, maxDim = 480, quality = 0.78): Promise<string> =>
  new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })

export default function AddCategoryModal({ editCategory, onClose, onAdd }: Props) {
  const [selectedEmoji, setSelectedEmoji] = useState(editCategory?.emoji ?? '🎮')
  const [iconDataUrl, setIconDataUrl] = useState(editCategory?.iconDataUrl ?? '')
  const [catName, setCatName] = useState(editCategory?.name ?? '')
  const [items, setItems] = useState<ItemEntry[]>(() => {
    if (editCategory?.items && editCategory.items.length > 0) {
      return editCategory.items.map((it, i) => ({
        id: `e${i}`,
        name: it.name,
        imageDataUrl: it.imageDataUrl ?? '',
      }))
    }
    return Array.from({ length: 6 }, (_, i) => ({ id: `n${i}`, name: '', imageDataUrl: '' }))
  })
  const [showSubmitDetail, setShowSubmitDetail] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const iconInputRef = useRef<HTMLInputElement>(null)

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      const compressed = await compressImage(ev.target?.result as string, 120)
      setIconDataUrl(compressed)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleItemImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async ev => {
      const compressed = await compressImage(ev.target?.result as string, 480)
      setItems(prev => prev.map(it => it.id === id ? { ...it, imageDataUrl: compressed } : it))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const addItem = () =>
    setItems(prev => [...prev, { id: `new_${Date.now()}`, name: '', imageDataUrl: '' }])

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(it => it.id !== id))

  const updateItemName = (id: string, name: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, name } : it))

  const filledItems = items.filter(it => it.name.trim())

  const handleSave = () => {
    const errs: string[] = []
    if (!catName.trim()) errs.push('Category name is required')
    if (filledItems.length < 6) errs.push(`ต้องมีอย่างน้อย 6 Items (ตอนนี้มี ${filledItems.length})`)
    if (errs.length) { setErrors(errs); return }
    setErrors([])
    onAdd({
      id: editCategory?.id ?? `custom_${Date.now()}`,
      name: catName.trim(),
      emoji: selectedEmoji,
      iconDataUrl: iconDataUrl || undefined,
      pairs: [],
      items: filledItems.map(it => ({
        name: it.name.trim(),
        imageDataUrl: it.imageDataUrl || undefined,
      })),
      isCustom: true,
    })
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-white flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-gray-100 shrink-0">
        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="flex-1 text-lg font-extrabold text-gray-900">
          {editCategory ? 'Edit Category' : 'New Category'}
        </h1>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        {/* ── Icon picker ─────────────────────────────── */}
        <section>
          <p className="text-sm font-bold text-gray-700 mb-2">Category Icon</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => iconInputRef.current?.click()}
              className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center shrink-0 overflow-hidden ${
                iconDataUrl ? 'border-indigo-400' : 'border-dashed border-gray-300 bg-gray-50'
              }`}
            >
              {iconDataUrl
                ? <img src={iconDataUrl} className="w-full h-full object-cover" />
                : <Upload size={15} className="text-gray-400" />
              }
            </button>
            <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />

            {PRESET_EMOJIS.map(em => (
              <button key={em}
                onClick={() => { setSelectedEmoji(em); setIconDataUrl('') }}
                className={`w-11 h-11 rounded-xl border-2 text-xl flex items-center justify-center transition-all ${
                  !iconDataUrl && selectedEmoji === em
                    ? 'border-indigo-500 bg-indigo-50 scale-110'
                    : 'border-gray-200 bg-gray-50 active:scale-95'
                }`}
              >{em}</button>
            ))}
          </div>
        </section>

        {/* ── Category name ───────────────────────────── */}
        <section>
          <p className="text-sm font-bold text-gray-700 mb-2">Category Name</p>
          <input
            type="text"
            value={catName}
            onChange={e => setCatName(e.target.value)}
            placeholder="e.g. ดาราที่ชอบ, เพลงโปรด..."
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </section>

        {/* ── Item list ───────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700">Items</p>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              filledItems.length >= 6 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
            }`}>
              {filledItems.length}/6 min
            </span>
          </div>

          <AnimatePresence initial={false}>
            {items.map((it, idx) => {
              const inputId = `item-img-${it.id}`
              return (
                <motion.div key={it.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden mb-2"
                >
                  <div className="flex items-center gap-2">
                    <label htmlFor={inputId}
                      className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center shrink-0 cursor-pointer bg-gray-50 overflow-hidden">
                      {it.imageDataUrl
                        ? <img src={it.imageDataUrl} className="w-full h-full object-cover" />
                        : <ImagePlus size={15} className="text-gray-400" />
                      }
                      <input id={inputId} type="file" accept="image/*" className="hidden"
                        onChange={e => handleItemImageUpload(it.id, e)} />
                    </label>

                    <input
                      type="text"
                      value={it.name}
                      onChange={e => updateItemName(it.id, e.target.value)}
                      placeholder={`Item ${idx + 1}`}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    {items.length > 6 && (
                      <button onClick={() => removeItem(it.id)}
                        className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          <button onClick={addItem}
            className="w-full py-2.5 mt-1 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 text-sm font-semibold flex items-center justify-center gap-1.5">
            <Plus size={15} />Add Item
          </button>
        </section>

        {/* ── Errors ──────────────────────────────────── */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-red-50 rounded-2xl px-4 py-3 space-y-1"
            >
              {errors.map((err, i) => (
                <p key={i} className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={13} className="shrink-0" />{err}
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Privacy notice ──────────────────────────── */}
        <div className="bg-blue-50 rounded-2xl px-4 py-3">
          <p className="text-blue-700 text-xs leading-relaxed">
            🔒 ข้อมูลจะถูก Save ไว้บนเครื่องและ Account ของคุณเท่านั้น
            ไม่ได้ขึ้น Public Server
          </p>
        </div>

        {/* ── Submit to server ────────────────────────── */}
        <div className="space-y-2 pb-3">
          <button onClick={() => setShowSubmitDetail(v => !v)}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center gap-2">
            <Send size={14} />Request to Go Public
          </button>
          <AnimatePresence>
            {showSubmitDetail && (
              <motion.p
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-gray-500 text-center leading-relaxed overflow-hidden"
              >
                ข้อมูลจะผ่านการ Review โดย Admin ก่อน
                เพื่อ Block เนื้อหาที่ไม่เหมาะสมหรือผิดกฎหมาย
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 pb-6 pt-3 border-t border-gray-100 shrink-0 bg-white">
        <button onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-extrabold text-base shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
          Save Category
        </button>
      </div>
    </motion.div>
  )
}
