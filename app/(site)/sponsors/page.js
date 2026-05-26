import SponsorsPageClient from '@/components/pages/SponsorsPageClient'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Sponsors - Sero',
  description: 'Companies supporting our work in AI and open source.',
  path: '/sponsors',
})

export default function SponsorsPage() {
  return <SponsorsPageClient />
}
