'use client'

import Link from '@/components/Link'

export default function NotFoundPageClient() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border-subtle" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border-subtle" />

      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-[0.7fr_1fr] md:items-center">
        <div className="font-mono text-[8rem] font-semibold leading-none tracking-tight text-text-primary/10 sm:text-[11rem] md:text-[13rem]">
          404
        </div>

        <div>
          <p className="font-mono text-sm font-medium uppercase tracking-[0.18em] text-text-muted">
            Page not found
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl">
            This route does not exist.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl sm:leading-9">
            The page may have moved, or the link points to an old path.
          </p>

          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/home"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-text-primary px-7 text-sm font-medium text-surface-base transition-colors hover:bg-text-secondary"
            >
              Go home
            </Link>
            <Link
              href="/blog"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border-strong px-7 text-sm font-medium text-text-primary transition-colors hover:bg-surface-elevated"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
