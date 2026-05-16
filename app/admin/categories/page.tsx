'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { DEFAULT_CATEGORIES } from '@/lib/data'
import { Category } from '@/lib/types'
import { getRequests } from '@/lib/requests'
import { ArrowLeft, Trash2, Search } from 'lucide-react'

type CatWithType = Category & { _type: 'default' | 'approved' | 'custom' }

const TYPE_BADGE: Record<string, string> = {
  default:  'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  custom:   'bg-orange-100 text-orange-700',
}

const TYPE_LABEL: Record<string, string> = {
  default:  'Default',
  approved: 'Public',
  custom:   'Custom',
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [customCats, setCustomCats] = useState<Category[]>([])
  const [approvedCats, setApprovedCats] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.replace('/admin/login'); return }
    try {
      const raw = localStorage.getItem('pick_custom_cats')
      if (raw) setCustomCats(JSON.parse(raw))
    } catch {}
    setApprovedCats(
      getRequests().filter(r => r.status === 'approved').map(r => r.category)
    )
    setReady(true)
  }, [router])

  if (!ready) return null

  const allCats: CatWithType[] = [
    ...DEFAULT_CATEGORIES.map(c => ({ ...c, _type: 'default' as const })),
    ...approvedCats.map(c => ({ ...c, _type: 'approved' as const })),
    ...customCats.map(c => ({ ...c, _type: 'custom' as const })),
  ]

  const q = search.toLowerCase()
  const filtered = q ? allCats.filter(c => c.name.toLowerCase().includes(q)) : allCats

  const handleDelete = (id: string) => {
    const updated = customCats.filter(c => c.id !== id)
    setCustomCats(updated)
    try { localStorage.setItem('pick_custom_cats', JSON.stringify(updated)) } catch {}
    setDeletingId(null)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">

      <div className="bg-gray-900 text-white px-4 pt-10 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin"
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
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

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {filtered.map(cat => {
          const itemCount = cat.items?.length ?? cat.pairs.flat().length
          const isDeleting = deletingId === cat.id
          const isDeletable = cat._type === 'custom'

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
                {isDeletable && !isDeleting && (
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
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                    {name}
                  </span>
                ))}
                {itemCount > 5 && (
                  <span className="text-xs text-gray-400 px-1 py-0.5">+{itemCount - 5} more</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
