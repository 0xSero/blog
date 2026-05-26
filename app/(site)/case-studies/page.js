import CaseStudiesPageClient from '@/components/pages/CaseStudiesPageClient'
import { createPageMetadata } from '@/lib/metadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'

export const metadata = createPageMetadata({
  title: 'Case Studies',
  description: 'Explore our portfolio of successful projects and client success stories.',
  path: '/case-studies',
})

export default async function CaseStudiesPage() {
  const caseStudies = await getAllFilesFrontMatter('case-studies')

  return <CaseStudiesPageClient caseStudies={caseStudies} />
}
