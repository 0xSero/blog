import IntroPageClient from '@/components/pages/IntroPageClient'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({ absoluteTitle: true })

export default function IntroPage() {
  return <IntroPageClient />
}
