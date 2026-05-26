import ContactPageClient from '@/components/pages/ContactPageClient'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Contact',
  description: 'Get in touch with Sybil Solutions for your software development needs.',
  path: '/contact',
})

export default function ContactPage() {
  return <ContactPageClient />
}
