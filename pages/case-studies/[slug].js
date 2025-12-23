import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getFiles, getFileBySlug, getAllFilesFrontMatter } from '@/lib/mdx'
import { SlideUp } from '@/lib/transitions/PageTransition'

export async function getStaticPaths() {
  const files = getFiles('case-studies')
  return {
    paths: files.map((file) => ({
      params: { slug: file.replace(/\.(mdx|md)/, '') },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = await getFileBySlug('case-studies', params.slug)
  const allCaseStudies = await getAllFilesFrontMatter('case-studies')
  const otherStudies = allCaseStudies.filter((cs) => cs.slug !== params.slug).slice(0, 2)

  return {
    props: {
      post,
      otherStudies,
    },
  }
}

export default function CaseStudy({ post, otherStudies }) {
  const { mdxSource, frontMatter } = post
  const MDXContent = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return (
    <>
      <PageSEO
        title={`${frontMatter.title} | ${siteMetadata.title}`}
        description={frontMatter.summary}
      />

      <article className="relative overflow-hidden py-12">
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[...Array(14)].map((_, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={8 + i * 6}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-border-subtle"
                fill="none"
              />
            ))}
          </svg>
        </div>

        <SlideUp className="relative z-10">
          {/* Back link */}
          <Link
            href="/case-studies"
            className="mb-8 inline-flex items-center text-primary-500 hover:text-primary-400"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Case Studies
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="mb-4 flex flex-wrap gap-2">
              {frontMatter.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-500/10 px-3 py-1 text-sm text-primary-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{frontMatter.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span>Client: {frontMatter.client}</span>
              <span className="h-1 w-1 rounded-full bg-gray-600" />
              <span>
                {new Date(frontMatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>
          </header>

          {/* Metrics */}
          {frontMatter.metrics && (
            <div className="mb-12 grid gap-4 sm:grid-cols-3">
              {frontMatter.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dark-border bg-dark-card p-6 text-center"
                >
                  <div className="text-3xl font-bold text-primary-500">{metric.value}</div>
                  <div className="mt-1 text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary-500 prose-strong:text-white prose-li:text-gray-300">
            <MDXContent />
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-xl border border-dark-border bg-dark-card p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">Ready to start your project?</h3>
            <p className="mb-6 text-gray-400">
              Let's discuss how we can help you achieve similar results.
            </p>
            <Link
              href="/contact"
              className="bg-purple-gradient inline-block rounded-full px-8 py-3 font-medium text-white transition-all hover:opacity-90"
            >
              Get in Touch
            </Link>
          </div>

          {/* Other Case Studies */}
          {otherStudies.length > 0 && (
            <section className="mt-16">
              <h3 className="mb-8 text-2xl font-bold text-white">More Case Studies</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {otherStudies.map((study) => (
                  <Link
                    key={study.slug}
                    href={`/case-studies/${study.slug}`}
                    className="group rounded-xl border border-dark-border bg-dark-card p-6 transition-all hover:border-primary-500/50"
                  >
                    <h4 className="mb-2 text-xl font-bold text-white group-hover:text-primary-400">
                      {study.title}
                    </h4>
                    <p className="text-gray-400">{study.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </SlideUp>
      </article>
    </>
  )
}
