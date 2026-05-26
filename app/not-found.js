import siteMetadata from '@/data/siteMetadata'
import { createPageMetadata } from '@/lib/metadata'
import NotFoundPageClient from '@/components/pages/NotFoundPageClient'

export const metadata = createPageMetadata({
  title: 'Page Not Found',
  description: siteMetadata.description,
  path: '/404',
})

export default function NotFound() {
  return <NotFoundPageClient />
}
