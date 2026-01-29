import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StartupDeals - Exclusive SaaS Deals for Startups',
  description: 'Get access to premium SaaS tools, cloud services, and productivity software at exclusive discounts. Built for founders, indie hackers, and early-stage teams.',
  keywords: ['startup deals', 'saas discounts', 'startup benefits', 'indie hackers', 'cloud services'],
  authors: [{ name: 'StartupDeals' }],
  openGraph: {
    title: 'StartupDeals - Exclusive SaaS Deals for Startups',
    description: 'Access premium SaaS tools at exclusive discounts',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  )
}
