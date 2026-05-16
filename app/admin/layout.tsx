export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-gray-950 px-4 py-2.5 shrink-0 border-b border-gray-800 flex items-center">
        <a href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5">
          ← Back to App
        </a>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  )
}
