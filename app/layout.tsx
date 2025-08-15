import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt Engineering Demo - 专业提示词工程演示工具',
  description: '面向开发和产品团队的Prompt工程实战演示工具，掌握AI时代的核心技能',
  keywords: 'Prompt Engineering, AI, 人工智能, 开发工具, 产品管理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}