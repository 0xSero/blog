export default function ArticleLoading({ eyebrow = 'Loading' }) {
  return (
    <div className="section-breathe mx-auto max-w-3xl">
      <div className="mb-8 h-3 w-28 animate-pulse rounded-full bg-surface-elevated" />
      <div className="mb-5 h-10 w-4/5 animate-pulse rounded-lg bg-surface-elevated md:h-14" />
      <div className="mb-10 h-6 w-2/3 animate-pulse rounded-lg bg-surface-elevated" />

      <div className="sr-only">{eyebrow}</div>
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-surface-elevated" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-surface-elevated" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-elevated" />
        <div className="h-4 w-8/12 animate-pulse rounded bg-surface-elevated" />
      </div>
    </div>
  )
}
