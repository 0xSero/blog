import '@/styles/index.css'
import '@/css/prism.css'
import 'katex/dist/katex.css'

import { Inter } from 'next/font/google'
import siteMetadata from '@/data/siteMetadata'
import AppProviders from '@/components/app/AppProviders'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: siteMetadata.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
    site: siteMetadata.twitter,
  },
  icons: {
    apple: '/static/favicons/apple-touch-icon.png',
    icon: [
      { url: '/static/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/static/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/static/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    other: [{ rel: 'mask-icon', url: '/static/favicons/safari-pinned-tab.svg', color: '#5bbad5' }],
  },
  manifest: '/static/favicons/site.webmanifest',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fff' },
    { media: '(prefers-color-scheme: dark)', color: '#000' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html
      lang={siteMetadata.language}
      className="scroll-smooth dark"
      style={{ colorScheme: 'dark' }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={`${inter.className} bg-surface-base text-text-primary antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
