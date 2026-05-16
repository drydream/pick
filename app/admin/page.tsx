'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAdminAuthenticated, adminLogout } from '@/lib/adminAuth'
import { getRequests } from '@/lib/requests'
import { DEFAULT_CATEGORIES } from '@/lib/data'
import { Shield, LogOut, Inbox, FolderOpen, ChevronRight } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [pendingCount, setPendingCount] = useState(0)
  const [customCount, setCustomCount] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAdminAuthenticated()) { router.replace('/admin/login'); return }
    setPendingCount(getRequests().filter(r => r.status === 'pending').length)
    try {
      const raw = localStorage.getItem('pick_custom_cats')
      if (raw) setCustomCount(JSON.parse(raw).length)
    } catch {}
    setReady(true)
  }, [router])

  if (!ready) return null

  const handleLogout = () => {
    adminLogout()
    router.replace('/admin/login')
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">

      <div className="bg-gray-900 text-white px-4 pt-10 pb-6 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Shield size={18} className="text-gray-900" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-none">Admin Panel</h1>
              <p className="text-gray-500 text-xs mt-0.5">PICK Management</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center active:bg-gray-700">
            <LogOut size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-black text-gray-900">{pendingCount}</p>
            <p className="text-gray-500 text-xs mt-1">Pending Requests</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-black text-gray-900">{DEFAULT_CATEGORIES.length + customCount}</p>
            <p className="text-gray-500 text-xs mt-1">Total Categories</p>
          </div>
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-3 pb-1 px-1">Manage</p>

        <Link href="/admin/requests"
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
          <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <Inbox size={20} className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">Public Requests</p>
            <p className="text-gray-500 text-xs">Approve / Reject category submissions</p>
          </div>
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
              {pendingCount}
            </span>
          )}
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
        </Link>

        <Link href="/admin/categories"
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50">
          <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <FolderOpen size={20} className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">All Categories</p>
            <p className="text-gray-500 text-xs">View and manage all category data</p>
          </div>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
        </Link>

      </div>
    </div>
  )
}
