'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getRequests, updateRequest, deleteRequest, PublicRequest } from '@/lib/requests'
import { ArrowLeft, Check, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

type Filter = 'pending' | 'approved' | 'rejected' | 'all'

const STATUS_BADGE: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default function AdminRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<PublicRequest[]>([])
  const [filter, setFilter] = useState<Filter>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteMap, setNoteMap] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.replace('/admin/login'); return }
    setRequests(getRequests())
    setReady(true)
  }, [router])

  if (!ready) return null

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'pending',  label: 'Pending'  },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all',      label: 'All'      },
  ]

  const countOf = (s: Filter) => s === 'all' ? requests.length : requests.filter(r => r.status === s).length
  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const refresh = () => setRequests(getRequests())

  const handleApprove = (id: string) => {
    updateRequest(id, {
      status: 'approved',
      adminNote: noteMap[id] ?? '',
      reviewedAt: new Date().toISOString(),
    })
    refresh()
  }

  const handleReject = (id: string) => {
    updateRequest(id, {
      status: 'rejected',
      adminNote: noteMap[id] ?? '',
      reviewedAt: new Date().toISOString(),
    })
    refresh()
  }

  const handleDelete = (id: string) => {
    deleteRequest(id)
    setExpandedId(null)
    refresh()
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">

      <div className="bg-gray-900 text-white px-4 pt-10 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/admin"
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <h1 className="text-lg font-extrabold">Public Requests</h1>
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                filter === f.key
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {f.label} ({countOf(f.key)})
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-semibold">ไม่มี requests ในหมวดนี้</p>
          </div>
        ) : filtered.map(req => (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <span className="text-2xl shrink-0">{req.category.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{req.category.name}</p>
                <p className="text-gray-400 text-xs">
                  {req.category.items?.length ?? 0} items ·{' '}
                  {new Date(req.requestedAt).toLocaleDateString('th-TH')}
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[req.status]}`}>
                {req.status}
              </span>
              {expandedId === req.id
                ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                : <ChevronDown size={16} className="text-gray-400 shrink-0" />
              }
            </button>

            {expandedId === req.id && (
              <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">

                <div>
                  <p className="text-xs font-bold text-gray-500 mb-2">Items</p>
                  <div className="flex flex-wrap gap-1.5">
                    {req.category.items?.map((it, i) => (
                      <span key={i}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium">
                        {it.name}
                      </span>
                    ))}
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1.5">Admin Note (optional)</p>
                    <input
                      type="text"
                      value={noteMap[req.id] ?? ''}
                      onChange={e => setNoteMap(prev => ({ ...prev, [req.id]: e.target.value }))}
                      placeholder="Reason for decision..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                )}

                {req.adminNote && (
                  <p className="text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-xl">
                    Note: {req.adminNote}
                  </p>
                )}

                <div className="flex gap-2">
                  {req.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(req.id)}
                        className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                        <Check size={14} />Approve
                      </button>
                      <button onClick={() => handleReject(req.id)}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                        <X size={14} />Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(req.id)}
                    className={`py-2.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform ${
                      req.status === 'pending' ? 'px-3' : 'flex-1'
                    }`}>
                    <Trash2 size={14} />
                    {req.status !== 'pending' && 'Delete'}
                  </button>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
