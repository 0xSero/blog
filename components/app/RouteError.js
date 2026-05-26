'use client'

import { useEffect } from 'react'
import Link from '@/components/Link'

export default function RouteError({ error, reset, title = 'Something went wrong' }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="section-breathe mx-auto max-w-2xl">
      <p className="mb-4 font-mono text-sm uppercase text-text-muted">route error</p>
      <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">{title}</h1>
      <p className="mb-8 text-lg text-text-secondary">
        This route failed while loading. Try again, or go back to the homepage.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-border-accent px-5 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-elevated"
        >
          Try again
        </button>
        <Link
          href="/home"
          className="rounded-full border border-border-default px-5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-accent hover:text-text-primary"
        >
          Home
        </Link>
      </div>
    </section>
  )
}
