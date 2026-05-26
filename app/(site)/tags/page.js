import Link from '@/components/Link'
import { createPageMetadata } from '@/lib/metadata'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'

export const metadata = createPageMetadata({
  title: 'Tags',
  description: 'Things I blog about',
  path: '/tags',
})

export default async function TagsPage() {
  const tags = await getAllTags('blog')
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])

  const groupedTags = sortedTags.reduce((acc, tag) => {
    const letter = tag[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push({ name: tag, count: tags[tag] })
    return acc
  }, {})

  return (
    <>
      <div className="section-breathe">
        <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">Tags</h1>
        <p className="text-lg text-text-secondary">{sortedTags.length} topics across all posts</p>
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
          Most Used
        </h2>
        <div className="flex flex-wrap gap-3">
          {sortedTags.slice(0, 8).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${kebabCase(tag)}`}
              className="group flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2 transition-all hover:border-border-accent hover:bg-surface-inset"
            >
              <span className="text-text-primary group-hover:text-accent-subtle">{tag}</span>
              <span className="text-xs text-text-muted">{tags[tag]}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-muted">
          All Tags
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(groupedTags)
            .sort()
            .map((letter) => (
              <div key={letter}>
                <h3 className="mb-3 text-lg font-semibold text-text-primary">{letter}</h3>
                <ul className="space-y-2">
                  {groupedTags[letter].map(({ name, count }) => (
                    <li key={name}>
                      <Link
                        href={`/tags/${kebabCase(name)}`}
                        className="flex items-center justify-between text-text-secondary transition-colors hover:text-text-primary"
                      >
                        <span>{name}</span>
                        <span className="text-xs text-text-muted">{count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
