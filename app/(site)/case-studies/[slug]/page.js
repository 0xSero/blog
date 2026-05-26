import { notFound } from 'next/navigation'
import { cache } from 'react'
import CaseStudyPageClient from '@/components/pages/CaseStudyPageClient'
import { createArticleMetadata } from '@/lib/metadata'
import { getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'

const getCaseStudyData = cache(async (slug) => {
  const allCaseStudies = await getAllFilesFrontMatter('case-studies')

  if (!allCaseStudies.some((caseStudy) => caseStudy.slug === slug)) {
    return null
  }

  const post = await getFileBySlug('case-studies', slug)
  const otherStudies = allCaseStudies.filter((caseStudy) => caseStudy.slug !== slug).slice(0, 2)

  return { post, otherStudies }
})

export async function generateStaticParams() {
  const files = getFiles('case-studies')

  return files.map((file) => ({
    slug: file.replace(/\.(mdx|md)/, ''),
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyData(slug)

  if (!caseStudy) {
    return {}
  }

  return createArticleMetadata({
    title: caseStudy.post.frontMatter.title,
    description: caseStudy.post.frontMatter.summary,
    path: `/case-studies/${slug}`,
    images: caseStudy.post.frontMatter.images,
    publishedTime: caseStudy.post.frontMatter.date,
    modifiedTime: caseStudy.post.frontMatter.lastmod || caseStudy.post.frontMatter.date,
  })
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyData(slug)

  if (!caseStudy) {
    notFound()
  }

  return <CaseStudyPageClient post={caseStudy.post} otherStudies={caseStudy.otherStudies} />
}
