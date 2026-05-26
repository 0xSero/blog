'use client'

import { SlideUp } from '@/lib/transitions/SlideUp'
import Link from '@/components/Link'
import SponsorLogo from '@/components/sponsors/SponsorLogo'
import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { ParticleField } from '@/lib/animations/ParticleField'
import { useCanvasAnimation } from '@/lib/animations/useCanvasAnimation'

const sponsors = [
  {
    name: 'Anthropic',
    logo: 'anthropic',
    description: 'Claude Code Warsaw',
    href: 'https://anthropic.com',
  },
  {
    name: 'Factory AI',
    logo: 'factory',
    description: 'Droid CLI support',
    href: 'https://factory.ai',
  },
  {
    name: 'Nvidia',
    logo: 'nvidia',
    description: 'Compute for LLM compressions Nemotron, Qwen',
    href: 'https://nvidia.com',
  },
  {
    name: 'TNG Technology',
    logo: 'tng',
    description: 'Compute for research on LLM compression',
    href: 'https://tngtech.com',
  },
  {
    name: 'Lambda AI',
    logo: 'lambda',
    description: 'Compute for GLM-5.1-REAP',
    href: 'https://lambdalabs.com',
  },
  {
    name: 'Prime Intellect',
    logo: 'prime',
    description: 'Compute for GLM-4.7-REAP',
    href: 'https://primeintellect.ai',
  },
  {
    name: 'Hot Aisle',
    logo: 'hotAisle',
    description: 'Compute for AMD support in vllm-studio',
    href: 'https://hotaisle.com',
  },
]

export default function Sponsors() {
  const canvasRef = useRef(null)
  const particleFieldRef = useRef(null)

  useCanvasAnimation({
    canvasRef,
    fullscreen: true,
    onResize: ({ width, height, quality }) => {
      if (!particleFieldRef.current) {
        particleFieldRef.current = new ParticleField({
          connectionAlpha: 0.1,
          maxParticles: 60,
          particleAlphaMax: 0.25,
          particleAlphaMin: 0.05,
          particleDivisor: 20000,
          radiusMax: 1.5,
          radiusMin: 0.3,
          speed: 0.2,
        })
      }
      particleFieldRef.current.resize(width, height, quality)
    },
    render: ({ ctx, width, height, quality }) => {
      particleFieldRef.current?.render(ctx, width, height, quality)
    },
  })

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: 'hsl(30, 5%, 10.5%)' }}
      />

      <section className="section-breathe relative z-10 px-4 sm:px-6">
        <SlideUp>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:mb-4 sm:text-sm sm:tracking-[0.3em]">
              Supported By
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-text-primary sm:mb-6 sm:text-4xl md:text-5xl">
              Sponsors & Partners
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              These companies have supported our work in AI, open source, and developer
              infrastructure. Their partnership enables us to build better tools for everyone.
            </p>
          </div>
        </SlideUp>
      </section>

      <section className="section-breathe relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {sponsors.map((sponsor, i) => (
              <SlideUp
                key={sponsor.name}
                delay={i * 0.05}
                className={`h-full ${
                  sponsors.length % 3 === 1 && i === sponsors.length - 1
                    ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2'
                    : ''
                }`}
              >
                <Link
                  href={sponsor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <div className="relative flex h-full min-h-[190px] flex-col justify-between overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated/45 p-6 text-left backdrop-blur transition-colors hover:border-border-strong hover:bg-surface-elevated/70">
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-text-muted/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div>
                      <div className="mb-6 flex h-12 items-center text-text-secondary transition-colors group-hover:text-text-primary">
                        <SponsorLogo id={sponsor.logo} name={sponsor.name} />
                      </div>
                      <h3 className="text-xl font-semibold leading-tight text-text-primary">
                        {sponsor.name}
                      </h3>
                      <p className="mt-3 min-h-[3.5rem] text-base leading-7 text-text-secondary">
                        {sponsor.description}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-text-muted transition-colors group-hover:text-accent-subtle">
                      Visit
                      <ExternalLink
                        size={14}
                        strokeWidth={1.8}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-breathe relative z-10 px-4 sm:px-6">
        <SlideUp>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl md:text-6xl">
              Become a Sponsor
            </h2>
            <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-text-secondary sm:text-2xl sm:leading-10">
              If you're building tools that make AI more accessible and want to support open source
              development, let's talk.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex min-h-16 w-full items-center justify-center rounded-lg bg-text-primary px-10 text-lg font-medium text-surface-base transition-colors hover:bg-text-secondary sm:w-auto"
            >
              Contact us
            </Link>
          </div>
        </SlideUp>
      </section>
    </>
  )
}
