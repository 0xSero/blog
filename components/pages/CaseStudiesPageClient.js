'use client'

import { useState } from 'react'
import ContentCard from '@/components/content/ContentCard'
import { SlideUp } from '@/lib/transitions/SlideUp'

export default function CaseStudiesPageClient({ caseStudies }) {
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
              className={`min-h-11 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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

      <section className="grid auto-rows-fr gap-x-10 gap-y-14 md:grid-cols-2">
        {filteredStudies.map((study, i) => (
          <SlideUp key={study.slug} delay={i * 0.08} className="h-full">
            <ContentCard
              date={study.date}
              href={`/case-studies/${study.slug}`}
              metaPlacement="header"
              metrics={study.metrics}
              summary={study.summary}
              tags={study.tags}
              title={study.title}
              titleLines={2}
            />
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
