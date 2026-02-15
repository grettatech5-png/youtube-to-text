import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Summarify — Конспект YouTube-видео за минуту',
  description:
    'Вставьте ссылку на YouTube-видео и получите структурированный конспект с ключевыми тезисами за считанные секунды. Без регистрации.',
}

export const viewport: Viewport = {
  themeColor: '#F97316',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
