import type { Metadata } from 'next'
import { Sarabun } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sarabun',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PICK - เกมเลือกสิ่งที่ชอบ',
  description: 'เกม This or That ภาษาไทย — เลือกสิ่งที่คุณชอบกว่า',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} font-sarabun antialiased bg-gray-200`}>
        <main className="max-w-md mx-auto h-screen bg-white relative overflow-hidden shadow-2xl">
          {children}
        </main>
      </body>
    </html>
  )
}
