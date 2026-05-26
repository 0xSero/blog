import AboutPageClient from '@/components/pages/AboutPageClient'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'About - Sero',
  description: 'Father, builder, podcaster. I build tools that give people control.',
  path: '/about',
})

export default function AboutPage() {
  return <AboutPageClient />
}
