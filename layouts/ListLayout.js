'use client'

import Link from '@/components/Link'
import ContentCard from '@/components/content/ContentCard'
import { useEffect, useMemo, useRef, useState } from 'react'

const POSTS_BATCH_SIZE = 9

export default function ListLayout({ posts, title }) {
  const [searchValue, setSearchValue] = useState('')
  const [visibleCount, setVisibleCount] = useState(POSTS_BATCH_SIZE)
  const loadMoreRef = useRef(null)
  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredBlogPosts = useMemo(
    () =>
      posts.filter((frontMatter) => {
        const searchContent = [
          frontMatter.title,
          frontMatter.summary,
          ...(frontMatter.tags || []),
        ].join(' ')

        return searchContent.toLowerCase().includes(normalizedSearch)
      }),
    [posts, normalizedSearch]
  )

  const displayPosts = filteredBlogPosts.slice(0, visibleCount)
  const hasMorePosts = visibleCount < filteredBlogPosts.length

  useEffect(() => {
    setVisibleCount(POSTS_BATCH_SIZE)
  }, [normalizedSearch])

  useEffect(() => {
    const loadMoreNode = loadMoreRef.current

    if (!loadMoreNode || !hasMorePosts) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + POSTS_BATCH_SIZE, filteredBlogPosts.length))
        }
      },
      { rootMargin: '320px 0px' }
    )

    observer.observe(loadMoreNode)

    return () => observer.disconnect()
  }, [filteredBlogPosts.length, hasMorePosts])

  return (
    <>
      {/* Hero Section */}
      <div className="section-breathe">
        <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg text-text-secondary">
          Insights on software development, AI, and technology.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-lg">
        <input
          aria-label="Search articles"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Search articles..."
          className="border-border-default block w-full rounded-lg border bg-surface-elevated px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
        />
        <svg
          className="absolute right-4 top-3.5 h-5 w-5 text-text-muted"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="grid auto-rows-fr gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {!displayPosts.length && (
          <p className="col-span-full text-center text-text-secondary">No posts found.</p>
        )}
        {displayPosts.map((frontMatter) => {
          const { slug, date, title, summary, tags } = frontMatter
          return (
            <ContentCard
              key={slug}
              date={date}
              href={`/blog/${slug}`}
              metaPlacement="header"
              summary={summary}
              tags={tags}
              title={title}
            />
          )
        })}
      </div>

      {hasMorePosts && (
        <div ref={loadMoreRef} className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + POSTS_BATCH_SIZE, filteredBlogPosts.length)
              )
            }
            className="min-h-11 rounded-full border border-border-default px-5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-border-accent hover:text-text-primary"
          >
            Load more
          </button>
        </div>
      )}
    </>
  )
}
