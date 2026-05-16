'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { DEFAULT_CATEGORIES } from '@/lib/data'
import { Category } from '@/lib/types'
import { getRequests } from '@/lib/requests'
import { ArrowLeft, Trash2, Search, Pencil, Plus, X, Check } from 'lucide-react'

const PRESET_EMOJIS = [
  '🎮', '🍕', '🎵', '🏆', '🌟', '❤️', '🎯', '🚀', '🌈', '🎪',
  '🦁', '🌺', '🎭', '🏀', '🎲', '🌍', '🎸', '🍔', '🎨', '🐶',
  '🦋', '🎉', '🔥', '💎', '🌙', '⚡', '🎡', '🦄', '🐉', '🍀',
  '🎤', '🎬', '🏖️', '🗺️', '🌮',
]

type CatType = 'default' | 'approved' | 'custom'
type CatWithType = Category & { _type: CatType }

interface EditItem { id: string; name: string }
interface EditState {
  original: CatWithType
  name: string
  emoji: string
  items: EditItem[]
}

const TYPE_BADGE: Record<CatType, string> = {
  default:  'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  custom:   'bg-orange-100 text-orange-700',
}
const TYPE_LABEL: Record<CatType, string> = {
  default: 'Default',
  approved: 'Public',
  custom: 'Custom',
}

function loadCustomCats(): Category[] {
  try { return JSON.parse(localStorage.getItem('pick_custom_cats') ?? '[]') } catch { return [] }
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [customCats, setCustomCats] = useState<Category[]>([])
  const [approvedCats, setApprovedCats] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editing, setEditing] = useState<EditState | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.replace('/admin/login'); return }
    setCustomCats(loadCustomCats())
    setApprovedCats(getRequests().filter(r => r.status === 'approved').map(r => r.category))
    setReady(true)
  }, [router])

  if (!ready) return null

  const customIds = new Set(customCats.map(c => c.id))
  const allCats: CatWithType[] = [
    ...DEFAULT_CATEGORIES.filter(c => !customIds.has(c.id)).map(c => ({ ...c, _type: 'default' as CatType })),
    ...approvedCats.map(c => ({ ...c, _type: 'approved' as CatType })),
    ...customCats.map(c => ({ ...c, _type: 'custom' as CatType })),
  ]

  const q = search.toLowerCase()
  const filtered = q ? allCats.filter(c => c.name.toLowerCase().includes(q)) : allCats

  const startEdit = (cat: CatWithType) => {
    const items: EditItem[] = cat.items
      ? cat.items.map((it, i) => ({ id: `i${i}`, name: it.name }))
      : cat.pairs.flat().map((name, i) => ({ id: `p${i}`, name }))
    setEditing({ original: cat, name: cat.name, emoji: cat.emoji, items })
  }

  const saveEdit = () => {
    if (!editing) return
    const { _type, ...base } = editing.original
    const saved: Category = {
      ...base,
      name: editing.name.trim() || editing.original.name,
      emoji: editing.emoji,
      pairs: [],
      items: editing.items.filter(i => i.name.trim()).map(i => ({ name: i.name.trim() })),
      isCustom: true,
    }
    const existing = loadCustomCats()
    const idx = existing.findIndex(c => c.id === saved.id)
    const newList = idx >= 0 ? existing.map(c => c.id === saved.id ? saved : c) : [...existing, saved]
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(newList)) } catch {}
    setCustomCats(newList)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    const updated = customCats.filter(c => c.id !== id)
    setCustomCats(updated)
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(updated)) } catch {}
    setDeletingId(null)
  }

  const updateEditItems = (fn: (items: EditItem[]) => EditItem[]) =>
    setEditing(prev => prev ? { ...prev, items: fn(prev.items) } : prev)

  return (
    <div className="h-full flex flex-col bg-gray-50 relative overflow-hidden">

      {/* Header */}
      <div className="bg-gray-900 text-white px-4 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin" className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <h1 className="text-lg font-extrabold">All Categories</h1>
          <span className="ml-auto text-sm text-gray-500">{filtered.length} รายการ</span>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-gray-800 text-white placeholder-gray-600 border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {filtered.map(cat => {
          const itemCount = cat.items?.length ?? cat.pairs.flat().length
          const isDeleting = deletingId === cat.id

          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-gray-50">
                  {cat.iconDataUrl
                    ? <img src={cat.iconDataUrl} className="w-full h-full object-cover" alt="" />
                    : <span className="text-2xl">{cat.emoji}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{cat.name}</p>
                  <p className="text-gray-400 text-xs">{itemCount} items</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${TYPE_BADGE[cat._type]}`}>
                  {TYPE_LABEL[cat._type]}
                </span>
                <button onClick={() => startEdit(cat)}
                  className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Pencil size={14} className="text-indigo-500" />
                </button>
                {cat._type === 'custom' && !isDeleting && (
                  <button onClick={() => setDeletingId(cat.id)}
                    className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                )}
              </div>

              {isDeleting && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleDelete(cat.id)}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-bold text-sm active:scale-95 transition-transform">
                    Confirm Delete
                  </button>
                  <button onClick={() => setDeletingId(null)}
                    className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm">
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-1">
                {(cat.items
                  ? cat.items.slice(0, 5).map(i => i.name)
                  : cat.pairs.flat().slice(0, 5)
                ).map((name, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{name}</span>
                ))}
                {itemCount > 5 && (
                  <span className="text-xs text-gray-400 px-1 py-0.5">+{itemCount - 5} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Edit Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="absolute inset-0 z-50 bg-white flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
          >
            {/* Edit header */}
            <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-gray-100 shrink-0">
              <button onClick={() => setEditing(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                <X size={20} className="text-gray-700" />
              </button>
              <h2 className="flex-1 text-base font-extrabold text-gray-900 truncate">
                Edit: {editing.original.name}
              </h2>
              <button onClick={saveEdit}
                className="h-9 px-4 bg-indigo-500 text-white font-bold text-sm rounded-full flex items-center gap-1.5 active:scale-95 transition-transform">
                <Check size={14} />Save
              </button>
            </div>

            {/* Edit body */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

              {/* Emoji picker */}
              <section>
                <p className="text-sm font-bold text-gray-700 mb-2">Icon</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EMOJIS.map(em => (
                    <button key={em}
                      onClick={() => setEditing(prev => prev ? { ...prev, emoji: em } : prev)}
                      className={`w-11 h-11 rounded-xl border-2 text-xl flex items-center justify-center transition-all ${
                        editing.emoji === em
                          ? 'border-indigo-500 bg-indigo-50 scale-110'
                          : 'border-gray-200 bg-gray-50 active:scale-95'
                      }`}
                    >{em}</button>
                  ))}
                </div>
              </section>

              {/* Name */}
              <section>
                <p className="text-sm font-bold text-gray-700 mb-2">Category Name</p>
                <input
                  type="text"
                  value={editing.name}
                  onChange={e => setEditing(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </section>

              {/* Items */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-gray-700">Items</p>
                  <span className="text-xs text-gray-400">
                    {editing.items.filter(i => i.name.trim()).length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {editing.items.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span className="w-6 text-xs text-gray-400 text-right shrink-0">{idx + 1}.</span>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => updateEditItems(items =>
                          items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i)
                        )}
                        placeholder={`Item ${idx + 1}`}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <button
                        onClick={() => updateEditItems(items => items.filter(i => i.id !== item.id))}
                        className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateEditItems(items => [
                    ...items,
                    { id: `new_${Date.now()}`, name: '' },
                  ])}
                  className="w-full py-2.5 mt-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus size={15} />Add Item
                </button>
              </section>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
