import { useState } from 'react'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { SlideUp } from '@/lib/transitions/PageTransition'

export async function getStaticProps() {
  const caseStudies = await getAllFilesFrontMatter('case-studies')
  return { props: { caseStudies } }
}

export default function CaseStudies({ caseStudies }) {
  const [selectedTag, setSelectedTag] = useState('All')

  const allTags = ['All', ...new Set(caseStudies.flatMap((cs) => cs.tags || []))]

  // Sort by date descending (newest first), then filter by tag
  const sortedStudies = [...caseStudies].sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0)
    const dateB = b.date ? new Date(b.date) : new Date(0)
    return dateB - dateA
  })

  const filteredStudies =
    selectedTag === 'All'
      ? sortedStudies
      : sortedStudies.filter((cs) => cs.tags?.includes(selectedTag))

  return (
    <>
      <PageSEO
        title={`Case Studies | ${siteMetadata.title}`}
        description="Explore our portfolio of successful projects and client success stories."
      />

      {/* Hero Section */}
      <section className="section-breathe relative overflow-hidden">
        {/* Subtle patterned background echoing splash aesthetics */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[...Array(10)].map((_, i) => (
              <line
                key={i}
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="100"
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-text-primary"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 10}
                x2="100"
                y2={i * 10}
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-text-primary"
              />
            ))}
          </svg>
        </div>

        <SlideUp className="relative z-10">
          <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">
            Case Studies
          </h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            Selected work and experiments from Sybil Solutions (by 0xSero).
          </p>
        </SlideUp>
      </section>

      {/* Filter Tags */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-text-primary text-surface-base'
                  : 'border-border-default border bg-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Case Studies Grid - Japanese Minimalism */}
      <section className="grid gap-12 md:grid-cols-2">
        {filteredStudies.map((study, i) => (
          <SlideUp key={study.slug} delay={i * 0.1}>
            <Link href={`/case-studies/${study.slug}`} className="group block">
              <article className="divider-asymmetric relative pb-8">
                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {study.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-surface-inset px-2 py-1 text-xs text-accent-subtle"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="mb-2 text-2xl font-semibold text-text-primary transition-colors group-hover:text-accent-subtle">
                  {study.title}
                </h2>

                <p className="text-text-secondary">{study.summary}</p>

                {/* Metrics */}
                {study.metrics && (
                  <div className="mt-4 flex gap-6 border-t border-border-subtle pt-4">
                    {study.metrics.slice(0, 3).map((metric, idx) => (
                      <div key={idx}>
                        <div className="text-lg font-semibold text-accent-subtle">
                          {metric.value}
                        </div>
                        <div className="text-xs text-text-muted">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          </SlideUp>
        ))}
      </section>

      {filteredStudies.length === 0 && (
        <div className="py-20 text-center text-text-secondary">
          No case studies found for this filter.
        </div>
      )}
    </>
  )
}
