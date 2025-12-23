import { useEffect, useRef } from 'react'
import { PageSEO } from '@/components/SEO'
import Link from '@/components/Link'
import SocialIcon from '@/components/social-icons'
import { SlideUp } from '@/lib/transitions/PageTransition'

// Particle system for background
class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = (Math.random() - 0.5) * 0.3
    this.radius = Math.random() * 1.5 + 0.5
    this.alpha = Math.random() * 0.3 + 0.1
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(40, 20%, 80%, ${this.alpha})`
    ctx.fill()
  }
}

// Connection lines between nearby particles
function drawConnections(ctx, particles, maxDist = 100) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.15
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `hsla(40, 15%, 70%, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

export default function About() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    let scale = 1

    const resize = () => {
      scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * scale
      canvas.height = window.innerHeight * scale
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(scale, 0, 0, scale, 0, 0)

      // Recreate particles on resize
      const particleCount = Math.min(
        Math.floor((window.innerWidth * window.innerHeight) / 15000),
        80
      )
      particles = Array.from({ length: particleCount }, () => new Particle(canvas))
    }

    const animate = () => {
      const width = canvas.width / scale
      const height = canvas.height / scale

      // Clear with base color
      ctx.fillStyle = 'hsl(30, 5%, 10.5%)'
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      particles.forEach((p) => {
        p.update()
        p.draw(ctx)
      })

      // Draw connections
      drawConnections(ctx, particles, 120)

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  const journey = [
    {
      era: 'The Beginning',
      title: 'Content Protection',
      description:
        'Started helping creators remove stolen content, fake accounts, and doxxed information from the web. DMCA takedowns, GDPR requests, hunting down impersonators.',
      insight: 'Learned that the systems we build shape who has power.',
    },
    {
      era: 'The Expansion',
      title: 'Web3 & DAOs',
      description:
        'Joined Raid Guild. Built governance infrastructure for ZKSync, worked with Ethereum Foundation on zero-knowledge research. Contributed to MakerDAO, Gnosis, Superfluid, Lens Protocol.',
      insight: 'Decentralization is about returning power to individuals.',
    },
    {
      era: 'The Convergence',
      title: 'AI Infrastructure',
      description:
        'Contributing to ElizaOS (17k+ stars), building Open Orchestra for multi-agent coordination, running local models on 8x 3090s. Making AI work for developers, not against them.',
      insight: 'The best tools give you control, not dependency.',
    },
    {
      era: 'Now',
      title: 'Thrive Protocol',
      description:
        'Building AI systems that automate treasury allocations from crypto ecosystems to builders. $150M+ committed capital, 1,800+ funded builders.',
      insight: "You shouldn't need to be an insider to build great things.",
    },
  ]

  const beliefs = [
    { label: 'Freedom Tech', description: 'Systems that give individuals more control, not less' },
    { label: 'Build in Public', description: '175+ repos, most of them open source' },
    { label: 'Boring Reliability', description: 'The best infrastructure is invisible' },
    { label: 'Say No', description: 'To projects that extract value without creating it' },
  ]

  return (
    <>
      <PageSEO
        title="About - Sero"
        description="Father, builder, podcaster. I build tools that give people control."
      />

      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: 'hsl(30, 5%, 10.5%)' }}
      />

      {/* Hero Section */}
      <section className="section-breathe relative px-4 sm:px-6">
        <SlideUp>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:mb-4 sm:text-sm sm:tracking-[0.3em]">
              Father · Builder · Podcaster
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-text-primary sm:mb-6 sm:text-4xl md:text-6xl">
              I build tools that
              <span className="block text-accent-subtle">give people control.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
              That's the thread running through everything: AI agents, blockchain infrastructure,
              the content protection work I started with years ago. Being a father changed how I see
              technology. My kid is going to inherit this internet.
            </p>
          </div>
        </SlideUp>

        {/* Social Links */}
        <SlideUp delay={0.1}>
          <div className="mt-8 flex justify-center gap-5 sm:mt-10 sm:gap-6">
            <SocialIcon kind="github" href="https://github.com/0xSero" size="6" />
            <SocialIcon kind="twitter" href="https://twitter.com/0x_Sero" size="6" />
            <SocialIcon kind="mail" href="mailto:admin@serotonindesigns.com" size="6" />
            <SocialIcon
              kind="linkedin"
              href="https://www.linkedin.com/in/sero-346b85202/"
              size="6"
            />
          </div>
        </SlideUp>
      </section>

      {/* The Journey - Timeline */}
      <section className="section-breathe px-4 sm:px-6">
        <SlideUp>
          <h2 className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:mb-12 sm:text-sm sm:tracking-[0.3em]">
            The Journey
          </h2>
        </SlideUp>

        <div className="mx-auto max-w-3xl">
          {journey.map((item, i) => (
            <SlideUp key={item.era} delay={i * 0.1}>
              <div className="relative mb-8 pl-6 sm:mb-12 sm:pl-8 md:pl-12">
                {/* Timeline line */}
                <div className="from-accent-subtle/50 absolute left-0 top-0 h-full w-px bg-gradient-to-b to-transparent" />
                {/* Timeline dot */}
                <div className="absolute -left-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-accent-subtle bg-surface-base sm:-left-1.5 sm:h-3 sm:w-3" />

                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent-subtle">
                  {item.era}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-text-primary sm:text-xl">
                  {item.title}
                </h3>
                <p className="mb-2 text-sm leading-relaxed text-text-secondary sm:mb-3 sm:text-base">
                  {item.description}
                </p>
                <p className="text-xs italic text-text-muted sm:text-sm">"{item.insight}"</p>
              </div>
            </SlideUp>
          ))}
        </div>
      </section>

      {/* What I Actually Do */}
      <section className="section-breathe px-4 sm:px-6">
        <SlideUp>
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:mb-8 sm:text-sm sm:tracking-[0.3em]">
              What I Actually Do
            </h2>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <div className="bg-surface-elevated/50 rounded-xl border border-border-subtle p-4 sm:p-6">
                <h3 className="mb-2 text-base font-semibold text-text-primary sm:mb-3 sm:text-lg">
                  AI Infrastructure
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Contributing to{' '}
                  <Link href="https://elizaos.ai" className="text-accent-subtle hover:underline">
                    ElizaOS
                  </Link>{' '}
                  (17k+ stars). Building orchestration layers, memory systems, and the boring
                  plumbing that makes AI agents work in production. Running local models on 8x 3090s
                  because I don't trust corporations with my data.
                </p>
              </div>

              <div className="bg-surface-elevated/50 rounded-xl border border-border-subtle p-4 sm:p-6">
                <h3 className="mb-2 text-base font-semibold text-text-primary sm:mb-3 sm:text-lg">
                  Blockchain Systems
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  Governance infrastructure for ZKSync (150k+ daily events). Zero-knowledge research
                  with Ethereum Foundation. Contributor to MakerDAO, Gnosis, Superfluid, Lens
                  Protocol. Not the sexy frontend stuff - the backend systems that keep things
                  running.
                </p>
              </div>

              <div className="bg-surface-elevated/50 rounded-xl border border-border-subtle p-4 sm:p-6">
                <h3 className="mb-2 text-base font-semibold text-text-primary sm:mb-3 sm:text-lg">
                  Developer Tools
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  <Link
                    href="https://github.com/0xSero/Azul"
                    className="text-accent-subtle hover:underline"
                  >
                    Azul
                  </Link>{' '}
                  - terminal web browser with AI.{' '}
                  <Link
                    href="https://github.com/0xSero/open-orchestra"
                    className="text-accent-subtle hover:underline"
                  >
                    Open Orchestra
                  </Link>{' '}
                  - multi-agent coordination.{' '}
                  <Link
                    href="https://github.com/0xSero/AI-Data-Extraction"
                    className="text-accent-subtle hover:underline"
                  >
                    AI Data Extraction
                  </Link>{' '}
                  - reclaim your coding assistant history.
                </p>
              </div>

              <div className="bg-surface-elevated/50 rounded-xl border border-border-subtle p-4 sm:p-6">
                <h3 className="mb-2 text-base font-semibold text-text-primary sm:mb-3 sm:text-lg">
                  Ethers Club Podcast
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  <Link
                    href="https://podcast.ethers.club"
                    className="text-accent-subtle hover:underline"
                  >
                    57 episodes
                  </Link>{' '}
                  talking to builders about technology, business, spirituality, and life. Guests
                  include Ameen Soleimani (Moloch DAO), founders from Flow, DeFi Wonderland, and the
                  teams behind AI coding tools.
                </p>
              </div>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Beliefs */}
      <section className="section-breathe px-4 sm:px-6">
        <SlideUp>
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:mb-8 sm:text-sm sm:tracking-[0.3em]">
              What I Believe
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {beliefs.map((belief, i) => (
                <SlideUp key={belief.label} delay={i * 0.05}>
                  <div className="flex items-start gap-3 rounded-lg border border-border-subtle p-3 sm:gap-4 sm:p-4">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent-subtle" />
                    <div>
                      <p className="text-sm font-medium text-text-primary sm:text-base">
                        {belief.label}
                      </p>
                      <p className="text-xs leading-relaxed text-text-secondary sm:text-sm">
                        {belief.description}
                      </p>
                    </div>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Outside the Terminal */}
      <section className="section-breathe px-4 sm:px-6">
        <SlideUp>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:mb-6 sm:text-sm sm:tracking-[0.3em]">
              Outside the Terminal
            </h2>
            <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
              I run local meetups for builders. Read a lot about systems thinking. Lift weights
              because desk work will kill you otherwise. Family comes first—everything else is
              noise.
            </p>
            <p className="mt-3 text-sm text-text-muted sm:mt-4">
              US-based. Async preferred. Clear specs. Ship it.
            </p>
          </div>
        </SlideUp>
      </section>

      {/* CTA */}
      <section className="section-breathe px-4 sm:px-6">
        <SlideUp>
          <div className="bg-surface-elevated/50 mx-auto max-w-2xl rounded-2xl border border-border-subtle p-6 text-center sm:p-8 md:p-12">
            <h2 className="mb-3 text-xl font-semibold text-text-primary sm:mb-4 sm:text-2xl">
              Let's Work Together
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-text-secondary sm:mb-6 sm:text-base">
              I take on a limited number of projects - usually infrastructure work that requires
              deep context and careful execution. If you're building something that gives people
              more freedom, more privacy, or more control over their digital lives, let's talk.
            </p>
            <p className="mb-6 text-xs text-text-muted sm:mb-8 sm:text-sm">
              If you're building another extractive platform, I'm not your guy.
            </p>
            <Link
              href="/contact"
              className="inline-block w-full rounded-lg bg-text-primary px-6 py-3 text-sm font-medium text-surface-base transition-all hover:opacity-90 sm:w-auto sm:px-8"
            >
              Start a conversation
            </Link>
          </div>
        </SlideUp>
      </section>
    </>
  )
}
