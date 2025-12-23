import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import NewsletterForm from '@/components/NewsletterForm'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import FeaturedProjects from '@/components/FeaturedProjects'
import ContributorScroll from '@/components/ContributorScroll'
import { useEffect, useRef } from 'react'
import { SlideUp } from '@/lib/transitions/PageTransition'
import { createPattern, getPatternConfig, patternConfigs } from '@/lib/patterns'

const PortalSeparator = ({ patternKey = 'tri' }) => {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const ctx = canvas.getContext('2d')
    const activeConfig = getPatternConfig(patternKey) || patternConfigs[0]
    // Responsive sizing for mobile
    const isMobile = wrapper.clientWidth < 640
    const patternOverrides = {
      tri: {},
      metamorph: {
        clearRadius: 0.3,
        eyeSpacing: isMobile ? 55 : 50,
        ringSpacing: isMobile ? 35 : 40,
        ringCount: 12,
        edgePadding: isMobile ? 8 : 12,
        eyeScale: isMobile ? 0.65 : 0.85,
      },
      life: { clearRadius: 0, golGridSize: 6, lifeDensity: 0.16, cycleMs: 7000 },
    }
    const patternConfig = { ...activeConfig, ...patternOverrides[patternKey] }
    let animationId = null
    let pattern = null
    let startTime = performance.now()
    let scale = 1

    const resize = () => {
      const width = Math.max(wrapper.clientWidth, 1)
      const height = Math.max(wrapper.clientHeight, 180)
      scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * scale
      canvas.height = height * scale
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(scale, 0, 0, scale, 0, 0)

      const clearRadius = Math.min(width, height) * patternConfig.clearRadius
      pattern = createPattern(patternConfig.key, width, height, patternConfig, clearRadius)
    }

    const animate = (time) => {
      const width = canvas.width / scale
      const height = canvas.height / scale
      const elapsed = time - startTime
      const cycleT = (elapsed % patternConfig.cycleMs) / patternConfig.cycleMs

      ctx.fillStyle = 'hsl(30, 5%, 10.5%)'
      ctx.fillRect(0, 0, width, height)
      if (pattern) {
        pattern.render(ctx, cycleT)
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [patternKey])

  return (
    <div
      ref={wrapperRef}
      className="bg-surface-elevated/60 relative my-12 min-h-[180px] overflow-hidden rounded-2xl"
    >
      <canvas ref={canvasRef} className="opacity-85 absolute inset-0 h-full w-full" />
      <div className="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),transparent_70%)] pointer-events-none absolute inset-0" />
    </div>
  )
}

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')
  return { props: { posts: posts.slice(0, 3) } }
}

export default function Home({ posts }) {
  useEffect(() => {
    // Mark as visited for portal skip
    sessionStorage.setItem('sybil_visited', 'true')
  }, [])

  const recentWork = [
    {
      type: 'Open Source',
      project: 'Open Orchestra',
      detail: 'Multi-agent orchestration with Neo4j memory',
    },
    {
      type: 'Client',
      project: 'ZKSync Governance',
      detail: '80k-160k daily RPC calls → RSS feeds',
    },
    {
      type: 'Research',
      project: 'EF IVCNotes',
      detail: 'ZK proofs + IVC for private digital notes',
    },
    {
      type: 'Open Source',
      project: 'Azul Browser',
      detail: 'Terminal web browser with AI tool-calling',
    },
  ]

  const stats = [
    { value: '50k+', label: 'Stars on Contributed Projects' },
    { value: '800+', label: 'Fellow Contributors' },
    { value: '510+', label: 'Stars on Own Repos' },
    { value: '175+', label: 'Public Repositories' },
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
              Sybil Solutions / 0xSero
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              AI agents, blockchain infra, and systems
              <span className="block text-accent-subtle">that work when it matters.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-text-secondary md:text-xl">
              I build production systems at the intersection of AI and crypto. Open-source tools
              used by developers worldwide. Client work for Ethereum Foundation, ZKSync, GitCoin,
              and more.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Link
                href="/contact"
                className="w-full rounded-lg bg-text-primary px-8 py-3 text-center text-sm font-medium text-surface-base transition-all hover:opacity-90 sm:w-auto"
              >
                Start a project
              </Link>
              <Link
                href="/case-studies"
                className="w-full rounded-lg border border-border-strong px-8 py-3 text-center text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated sm:w-auto"
              >
                View case studies
              </Link>
            </div>
          </SlideUp>

          <SlideUp className="md:justify-self-end">
            <div className="divider-asymmetric surface-float hover-glow hover-lift bg-surface-elevated/70 relative max-w-sm rounded-xl border border-border-subtle p-6 backdrop-blur">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                CURRENT FOCUS
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>
                  <span className="text-accent-subtle">AI</span> Tool-using agents, orchestration
                  layers, LLM infrastructure
                </li>
                <li>
                  <span className="text-accent-subtle">Crypto</span> Governance, ZK protocols, L2
                  infrastructure
                </li>
                <li>
                  <span className="text-accent-subtle">Open Source</span> Developer tools that
                  remove friction
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3 text-xs text-text-muted">
                <Link href="https://github.com/0xSero" className="hover:text-text-secondary">
                  GitHub
                </Link>
                <span className="h-1 w-1 self-center rounded-full bg-border-subtle" />
                <Link href="https://x.com/0xsero" className="hover:text-text-secondary">
                  X/Twitter
                </Link>
                <span className="h-1 w-1 self-center rounded-full bg-border-subtle" />
                <Link href="https://warpcast.com/sero" className="hover:text-text-secondary">
                  Farcaster
                </Link>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="section-breathe pt-0">
        <SlideUp>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold text-accent-subtle md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </SlideUp>
      </section>

      <section className="section-breathe pt-0">
        <SlideUp>
          <PortalSeparator patternKey="tri" />
        </SlideUp>
      </section>

      {/* Featured Open Source */}
      <section className="section-breathe">
        <SlideUp>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary md:text-3xl">
                Open Source Work
              </h2>
              <p className="mt-2 text-text-secondary">Tools and libraries built in public.</p>
            </div>
            <Link
              href="https://github.com/0xSero"
              className="hidden text-sm text-accent-subtle transition-colors hover:text-text-primary sm:block"
            >
              View all on GitHub &rarr;
            </Link>
          </div>
        </SlideUp>
        <SlideUp delay={0.1}>
          <FeaturedProjects />
        </SlideUp>
        <Link
          href="https://github.com/0xSero"
          className="mt-4 block text-center text-sm text-accent-subtle transition-colors hover:text-text-primary sm:hidden"
        >
          View all on GitHub &rarr;
        </Link>
      </section>

      <section className="section-breathe pt-0">
        <SlideUp>
          <PortalSeparator patternKey="metamorph" />
        </SlideUp>
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
                take on projects at the edge of what's possible and make them boringly reliable.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  AI / AGENTS
                </p>
                <p className="mt-1">
                  LLM infrastructure, multi-agent orchestration, tool-calling systems
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  CRYPTO / GOVERNANCE
                </p>
                <p className="mt-1">
                  ZK protocols, L2 infra, governance event systems, grants tooling
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  PRODUCT / SYSTEMS
                </p>
                <p className="mt-1">Interfaces that match the depth of the underlying system</p>
              </div>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Recent Work Section */}
      <section className="section-breathe">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary md:text-3xl">Recent Work</h2>
            <p className="mt-2 text-text-secondary">What I've been building lately</p>
          </div>
          <Link
            href="/case-studies"
            className="hidden text-sm text-accent-subtle transition-colors hover:text-text-primary sm:block"
          >
            All case studies &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentWork.map((item, i) => (
            <SlideUp key={item.project} delay={i * 0.06}>
              <div className="bg-surface-elevated/50 rounded-xl border border-border-subtle p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-accent-subtle">
                  {item.type}
                </span>
                <h3 className="mt-2 font-medium text-text-primary">{item.project}</h3>
                <p className="mt-1 text-sm text-text-secondary">{item.detail}</p>
              </div>
            </SlideUp>
          ))}
        </div>
        <Link
          href="/case-studies"
          className="mt-4 block text-center text-sm text-accent-subtle transition-colors hover:text-text-primary sm:hidden"
        >
          All case studies &rarr;
        </Link>
      </section>

      <section className="section-breathe pt-0">
        <SlideUp>
          <PortalSeparator patternKey="life" />
        </SlideUp>
      </section>

      {/* Contributor Scroll */}
      <section className="section-breathe">
        <SlideUp>
          <ContributorScroll />
        </SlideUp>
      </section>

      {/* Testimonials Section */}
      <section className="section-breathe">
        <SlideUp>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-text-primary md:text-4xl">
              Testimonials
            </h2>
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
              Subscribe for insights on AI agents, blockchain infrastructure, and building in
              public.
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
