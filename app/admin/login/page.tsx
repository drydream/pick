'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/adminAuth'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (loading) return
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (adminLogin(user.trim(), pass)) {
        router.replace('/admin')
      } else {
        setError('Username หรือ Password ไม่ถูกต้อง')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-950 px-6">

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-400/30">
          <Shield size={32} className="text-gray-900" />
        </div>
        <h1 className="text-2xl font-black text-white">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">PICK · Management</p>
      </div>

      <div className="w-full space-y-3">
        <input
          type="text"
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="Username"
          className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-2xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
          />
          <button onClick={() => setShowPass(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 active:text-gray-300">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-yellow-400 text-gray-900 font-extrabold text-base active:scale-95 transition-transform disabled:opacity-60 mt-1"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>

      <p className="text-gray-700 text-xs mt-10">สำหรับ Admin เท่านั้น</p>
    </div>
  )
}
