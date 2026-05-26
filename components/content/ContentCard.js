import Link from '@/components/Link'
import SmartTagList from '@/components/content/SmartTagList'
import formatDate from '@/lib/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

const shortDateFormatter = new Intl.DateTimeFormat(siteMetadata.locale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const titleLineStyles = {
  2: {
    block: 'md:h-20',
    clamp: 'line-clamp-2',
  },
  3: {
    block: 'md:h-24',
    clamp: 'line-clamp-3',
  },
  4: {
    block: 'md:h-32',
    clamp: 'line-clamp-4',
  },
}

function formatShortDate(date) {
  return shortDateFormatter.format(new Date(date))
}

export default function ContentCard({
  date,
  href,
  metrics,
  metaPlacement = 'footer',
  titleLines = 4,
  summary,
  tags,
  title,
}) {
  const hasHeaderMeta = metaPlacement === 'header'
  const titleStyle = titleLineStyles[titleLines] || titleLineStyles[4]

  return (
    <article className="group flex h-full min-h-[340px] flex-col border-b border-border-subtle pb-6">
      {hasHeaderMeta ? (
        <div className="mb-7 flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SmartTagList size="compact" tags={tags} />
          </div>
          {date && (
            <time className="shrink-0 text-sm leading-7 text-text-muted" dateTime={date}>
              {formatShortDate(date)}
            </time>
          )}
        </div>
      ) : (
        date && (
          <time className="block text-sm text-text-muted" dateTime={date}>
            {formatDate(date)}
          </time>
        )
      )}

      <h2
        className={`overflow-hidden text-2xl font-semibold leading-tight tracking-tight text-text-primary transition-colors group-hover:text-accent-subtle ${titleStyle.block} ${
          hasHeaderMeta ? '' : 'mt-6'
        }`}
      >
        <Link href={href} className={titleStyle.clamp}>
          {title}
        </Link>
      </h2>

      <p className="mt-5 line-clamp-3 text-base leading-7 text-text-secondary">{summary}</p>

      {metrics?.length > 0 && (
        <div className="mt-7 grid grid-cols-3 gap-3">
          {metrics.slice(0, 3).map((metric) => (
            <div key={`${metric.value}-${metric.label}`} className="min-w-0">
              <div className="truncate text-lg font-semibold text-accent-subtle">
                {metric.value}
              </div>
              <div className="mt-1 truncate text-xs text-text-muted">{metric.label}</div>
            </div>
          ))}
        </div>
      )}

      {!hasHeaderMeta && (
        <div className="mt-auto pt-8">
          <SmartTagList tags={tags} />
        </div>
      )}
    </article>
  )
}
