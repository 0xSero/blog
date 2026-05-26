'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import Analytics from '@/components/analytics'
import ScrollToTop from '@/components/app/ScrollToTop'

export default function AppProviders({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} forcedTheme="dark">
      <Analytics />
      <ScrollToTop />
      {children}
    </ThemeProvider>
  )
}
