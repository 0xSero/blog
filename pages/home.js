import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import NewsletterForm from '@/components/NewsletterForm'
import ServiceCard from '@/components/ServiceCard'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import { useEffect } from 'react'
import { SlideUp } from '@/lib/transitions/PageTransition'

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  return { props: { posts: posts.slice(0, 3) } }
}

export default function Home({ posts }) {
  useEffect(() => {
    // Mark as visited for portal skip
    sessionStorage.setItem('sybil_visited', 'true')
  }, [])

  const services = [
    {
      title: 'Frontend Development',
      description:
        'Modern, responsive web applications built with React, Next.js, and cutting-edge technologies.',
      icon: 'frontend',
    },
    {
      title: 'Backend Development',
      description:
        'Scalable APIs, microservices, and server infrastructure that powers your applications.',
      icon: 'backend',
    },
    {
      title: 'AI Agent Development',
      description:
        'Custom AI solutions and intelligent agents that automate and enhance your workflows.',
      icon: 'ai',
    },
    {
      title: 'Research & Consulting',
      description: 'Strategic technical guidance and research to help you make informed decisions.',
      icon: 'consulting',
    },
  ]

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      {/* Hero Section */}
      <section className="section-breathe relative overflow-hidden">
        {/* Splash-inspired background: concentric rings + subtle grid */}
        <div className="pointer-events-none absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.04]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {[...Array(14)].map((_, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={6 + i * 5}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-border-subtle"
                fill="none"
              />
            ))}
          </svg>
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.03]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {[...Array(10)].map((_, i) => (
              <line
                key={i}
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="100"
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-border-subtle"
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
                className="text-border-subtle"
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <SlideUp className="text-left">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-text-muted">
              Sybil Solutions · 0xSero
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Systems, agents, and infrastructure
              <span className="block text-accent-subtle">for people who care about details.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-text-secondary md:text-xl">
              I design and build production systems, governance tooling, and AI agents that sit
              close to the metal—reliable enough for real teams, opinionated enough to feel sharp.
            </p>
            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-lg bg-text-primary px-8 py-3 text-sm font-medium text-surface-base transition-all hover:opacity-90"
              >
                Start a project
              </Link>
              <Link
                href="/case-studies"
                className="rounded-lg border border-border-strong px-8 py-3 text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated"
              >
                Explore case studies
              </Link>
            </div>
          </SlideUp>

          <SlideUp className="md:justify-self-end">
            <div className="divider-asymmetric surface-float hover-glow hover-lift bg-surface-elevated/70 relative max-w-sm rounded-xl border border-border-subtle p-6 backdrop-blur">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                CURRENT FOCUS
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>· Agentic systems that orchestrate tools, not just chat.</li>
                <li>· Governance + infra around Ethereum, ZK, and L2s.</li>
                <li>· Interfaces that feel as considered as the backend.</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3 text-xs text-text-muted">
                <Link href="https://github.com/0xSero">github.com/0xSero</Link>
                <span className="h-1 w-1 rounded-full bg-border-subtle" />
                <Link href="https://x.com/0xsero">x.com/0xsero</Link>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Capability Strip */}
      <section className="section-breathe pt-0">
        <SlideUp>
          <div className="divider-asymmetric surface-float hover-glow hover-lift bg-surface-elevated/70 flex flex-col gap-6 rounded-xl border border-border-subtle p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-text-muted">
                SELECTED CAPABILITIES
              </h2>
              <p className="mt-3 max-w-xl text-sm text-text-secondary">
                From zero-knowledge research and governance infra to production-ready AI agents, I
                like projects that sit at the edge of what’s currently possible—and then make them
                feel boringly reliable.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  CRYPTO / GOVERNANCE
                </p>
                <p className="mt-1">ZK, L2 infra, governance event systems, grants tooling.</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  AGENTS / SYSTEMS
                </p>
                <p className="mt-1">
                  Tool-using agents, orchestration layers, production observability.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  PRODUCT / UX
                </p>
                <p className="mt-1">Interfaces that match the depth of the underlying system.</p>
              </div>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Services Section */}
      <section className="section-breathe">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-text-primary md:text-4xl">Services</h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            A flexible set of ways to plug into your team
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <SlideUp key={service.title} delay={i * 0.08}>
              <ServiceCard {...service} />
            </SlideUp>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-breathe">
        <SlideUp>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-text-primary md:text-4xl">
              What clients say
            </h2>
            <p className="mx-auto max-w-2xl text-text-secondary">
              A small sample of the people and teams I’ve worked with.
            </p>
          </div>
        </SlideUp>
        <SlideUp delay={0.05}>
          <TestimonialsCarousel />
        </SlideUp>
      </section>

      {/* Recent Blog Posts */}
      {posts.length > 0 && (
        <section className="section-breathe">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
              Latest Insights
            </h2>
            <Link
              href="/blog"
              className="text-accent-subtle transition-colors hover:text-text-primary"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {posts.map((post, i) => (
              <SlideUp key={post.slug} delay={i * 0.1}>
                <article className="group divider-asymmetric relative pb-8">
                  <time className="text-sm text-text-muted">{post.date}</time>
                  <h3 className="mt-2 text-xl font-semibold text-text-primary transition-colors group-hover:text-accent-subtle">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="line-clamp-2 mt-2 text-text-secondary">{post.summary}</p>
                </article>
              </SlideUp>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {siteMetadata.newsletter.provider !== '' && (
        <section className="section-breathe">
          <div className="divider-asymmetric relative p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-semibold text-text-primary">Stay Updated</h2>
            <p className="mx-auto mb-8 max-w-xl text-text-secondary">
              Subscribe to our newsletter for the latest insights on software development and AI.
            </p>
            <div className="mx-auto max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
