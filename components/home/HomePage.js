import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from '@/components/NewsletterForm'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import FeaturedProjects from '@/components/FeaturedProjects'
import ContributorScroll from '@/components/ContributorScroll'
import SocialIcon from '@/components/social-icons'
import HomeSessionMarker from '@/components/home/HomeSessionMarker'
import PortalSeparator from '@/components/home/PortalSeparator'
import formatDate from '@/lib/utils/formatDate'
import { SlideUp } from '@/lib/transitions/SlideUp'

const homeSectionClass = 'py-16 md:py-20'
const heroSectionClass = 'relative overflow-hidden py-20 md:py-24'
const separatorSectionClass = 'py-10 md:py-12'
const sectionHeaderClass = 'mb-8 flex items-center justify-between md:mb-10'
const centeredHeaderClass = 'mb-8 text-center md:mb-10'
const capabilityLabelClass =
  'font-mono text-xs font-medium uppercase tracking-[0.16em] text-text-muted'
const capabilityTextClass = 'text-base font-normal leading-7 text-text-secondary'

const SeparatorSection = () => (
  <section className={separatorSectionClass}>
    <SlideUp>
      <PortalSeparator />
    </SlideUp>
  </section>
)

export default function HomePageContent({ posts }) {
  const recentWork = [
    {
      type: 'Open Source',
      project: 'TurboQuant',
      detail: 'KV cache quantization for LLM inference',
    },
    {
      type: 'Open Source',
      project: 'vLLM Studio',
      detail: 'Control panel for local inference',
    },
    {
      type: 'Open Source',
      project: 'Parchi',
      detail: 'AI friend in your browser',
    },
    {
      type: 'Open Source',
      project: 'Pi Brain',
      detail: 'Local AI memory system',
    },
  ]

  const stats = [
    { value: '60k+', label: 'Total Stars' },
    { value: '200+', label: 'Public Repositories' },
    { value: '5k+', label: 'Stars Contributed' },
  ]

  return (
    <>
      <HomeSessionMarker />

      {/* Hero Section */}
      <section className={heroSectionClass}>
        <div className="relative z-10">
          <SlideUp className="text-left">
            <p className="mb-3 font-mono text-2xl font-medium normal-case text-text-muted">
              0xSero
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
              Building the future of AI
            </h1>
            <p className="mb-8 max-w-xl text-lg text-text-secondary md:text-xl">
              I work to make AI more accessible, affordable, and useful for everyone. From
              compressing LLMs to fit on edge devices, to educating people on the technology and
              what can be done with it.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Link
                href="/contact"
                className="w-full rounded-lg bg-text-primary px-8 py-3 text-center text-sm font-medium text-surface-base transition-all hover:opacity-90 sm:w-auto"
              >
                Contact me
              </Link>
              <Link
                href="/case-studies"
                className="w-full rounded-lg border border-border-strong px-8 py-3 text-center text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated sm:w-auto"
              >
                View case studies
              </Link>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Current Focus - Full Width Row */}
      <section className={homeSectionClass}>
        <SlideUp>
          <div className="border-y border-border-subtle py-8 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:items-stretch">
              <div className="flex min-h-full flex-col justify-between gap-10">
                <p className="font-mono text-sm font-medium uppercase tracking-[0.16em] text-text-muted">
                  CURRENT FOCUS
                </p>
                <div className="flex items-center gap-5 text-text-muted">
                  <SocialIcon kind="github" href="https://github.com/0xSero" size={8} />
                  <SocialIcon kind="twitter" href="https://x.com/0xsero" size={8} />
                  <SocialIcon kind="farcaster" href="https://warpcast.com/sero" size={8} />
                </div>
              </div>

              <div className="divide-y divide-border-subtle">
                <div className="grid gap-3 pb-6 sm:grid-cols-[3rem_11rem_1fr] sm:items-baseline sm:gap-6">
                  <p className="font-mono text-sm leading-none text-text-muted tabular-nums">01</p>
                  <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                    LLM Compression
                  </h2>
                  <p className="text-base leading-7 text-text-secondary">
                    Expert pruning, quantization, and model optimization for edge deployment
                  </p>
                </div>
                <div className="grid gap-3 py-6 sm:grid-cols-[3rem_11rem_1fr] sm:items-baseline sm:gap-6">
                  <p className="font-mono text-sm leading-none text-text-muted tabular-nums">02</p>
                  <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                    AI Education
                  </h2>
                  <p className="text-base leading-7 text-text-secondary">
                    Making AI accessible through tools, documentation, and community building
                  </p>
                </div>
                <div className="grid gap-3 pt-6 sm:grid-cols-[3rem_11rem_1fr] sm:items-baseline sm:gap-6">
                  <p className="font-mono text-sm leading-none text-text-muted tabular-nums">03</p>
                  <h2 className="text-xl font-semibold tracking-tight text-text-primary">
                    Open Source
                  </h2>
                  <p className="text-base leading-7 text-text-secondary">
                    Building and contributing to open-source tools used by developers worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Stats Bar */}
      <section className={homeSectionClass}>
        <SlideUp>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
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

      <SeparatorSection />

      {/* Featured Open Source */}
      <section className={homeSectionClass}>
        <SlideUp>
          <div className={sectionHeaderClass}>
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
          className="mt-4 flex min-h-11 items-center justify-center text-center text-sm text-accent-subtle transition-colors hover:text-text-primary sm:hidden"
        >
          View all on GitHub &rarr;
        </Link>
      </section>

      <SeparatorSection />

      {/* Capability Strip */}
      <section className={homeSectionClass}>
        <SlideUp>
          <div className="grid gap-10 border-y border-border-subtle py-8 md:py-10 lg:grid-cols-[0.9fr_1.45fr] lg:items-start">
            <div>
              <h2 className={capabilityLabelClass}>SELECTED CAPABILITIES</h2>
              <p className={`${capabilityTextClass} mt-5 max-w-xl text-text-secondary`}>
                I take on complex projects at the edge of what's possible and make them boringly
                reliable.
              </p>
            </div>

            <div className="divide-y divide-border-subtle">
              <div className="grid gap-3 pb-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
                <p className={capabilityLabelClass}>AI / AGENTS</p>
                <p className={capabilityTextClass}>
                  LLM infrastructure, multi-agent orchestration, tool-calling systems
                </p>
              </div>
              <div className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
                <p className={capabilityLabelClass}>DEV TOOLS</p>
                <p className={capabilityTextClass}>
                  Open-source libraries, browser automation, data extraction tooling
                </p>
              </div>
              <div className="grid gap-3 pt-6 sm:grid-cols-[9rem_1fr] sm:gap-8">
                <p className={capabilityLabelClass}>PRODUCT / SYSTEMS</p>
                <p className={capabilityTextClass}>
                  Interfaces that match the depth of the underlying system
                </p>
              </div>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Recent Work Section */}
      <section className={homeSectionClass}>
        <div className={sectionHeaderClass}>
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
              <div className="bg-surface-elevated/50 flex h-full flex-col rounded-xl border border-border-subtle p-5">
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
          className="mt-4 flex min-h-11 items-center justify-center text-center text-sm text-accent-subtle transition-colors hover:text-text-primary sm:hidden"
        >
          All case studies &rarr;
        </Link>
      </section>

      <SeparatorSection />

      {/* Contributor Scroll */}
      <section className={homeSectionClass}>
        <SlideUp>
          <ContributorScroll />
        </SlideUp>
      </section>

      {/* Testimonials Section */}
      <section className={homeSectionClass}>
        <SlideUp>
          <div className={centeredHeaderClass}>
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
        <section className={homeSectionClass}>
          <div className={sectionHeaderClass}>
            <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">
              Latest Insights
            </h2>
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center text-accent-subtle transition-colors hover:text-text-primary"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid auto-rows-fr gap-12 md:grid-cols-3">
            {posts.map((post, i) => (
              <SlideUp key={post.slug} delay={i * 0.1} className="h-full">
                <article className="group divider-asymmetric relative flex h-full min-h-[220px] flex-col pb-6">
                  <time className="text-sm text-text-muted" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <h3 className="mt-4 min-h-[5.25rem] text-xl font-semibold text-text-primary transition-colors group-hover:text-accent-subtle">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="line-clamp-2 mt-3 leading-7 text-text-secondary">{post.summary}</p>
                </article>
              </SlideUp>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {siteMetadata.newsletter.provider !== '' && (
        <section className={homeSectionClass}>
          <div className="divider-asymmetric relative p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-semibold text-text-primary">Stay Updated</h2>
            <p className="mx-auto mb-8 max-w-xl text-text-secondary">
              Subscribe for insights on AI systems, developer tools, and building in public.
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
