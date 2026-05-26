import { notFound } from 'next/navigation'
import { cache } from 'react'
import PageTitle from '@/components/PageTitle'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { createArticleMetadata } from '@/lib/metadata'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'

const DEFAULT_LAYOUT = 'PostLayout'

function normalizeSlug(params) {
  return Array.isArray(params?.slug) ? params.slug.join('/') : params?.slug
}

const getBlogPost = cache(async (slug) => {
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === slug)

  if (postIndex === -1) {
    return null
  }

  const post = await getFileBySlug('blog', slug)
  const authorList = post.frontMatter.authors || ['default']
  const authorDetails = await Promise.all(
    authorList.map(async (author) => {
      const authorResults = await getFileBySlug('authors', [author])
      return authorResults.frontMatter
    })
  )

  return {
    allPosts,
    post,
    authorDetails,
    prev: allPosts[postIndex + 1] || null,
    next: allPosts[postIndex - 1] || null,
  }
})

export async function generateStaticParams() {
  const posts = await getAllFilesFrontMatter('blog')

  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }))
}

export async function generateMetadata({ params }) {
  const slug = normalizeSlug(await params)
  const blogPost = await getBlogPost(slug)

  if (!blogPost) {
    return {}
  }

  const { frontMatter } = blogPost.post
  return createArticleMetadata({
    title: frontMatter.title,
    description: frontMatter.summary,
    path: `/blog/${frontMatter.slug}`,
    images: frontMatter.images,
    publishedTime: frontMatter.date,
    modifiedTime: frontMatter.lastmod || frontMatter.date,
  })
}

export default async function BlogPostPage({ params }) {
  const slug = normalizeSlug(await params)
  const blogPost = await getBlogPost(slug)

  if (!blogPost) {
    notFound()
  }

  const { allPosts, post, authorDetails, prev, next } = blogPost
  const { mdxSource, toc, frontMatter } = post

  if (frontMatter.draft === true) {
    return (
      <div className="mt-24 text-center">
        <PageTitle>
          Under Construction{' '}
          <span role="img" aria-label="roadwork sign">
            🚧
          </span>
        </PageTitle>
      </div>
    )
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/blog/${frontMatter.slug}`,
    },
    headline: frontMatter.title,
    image: (frontMatter.images || [siteMetadata.socialBanner]).map((image) => ({
      '@type': 'ImageObject',
      url: image.includes('http') ? image : `${siteMetadata.siteUrl}${image}`,
    })),
    datePublished: new Date(frontMatter.date).toISOString(),
    dateModified: new Date(frontMatter.lastmod || frontMatter.date).toISOString(),
    author: authorDetails.map((author) => ({ '@type': 'Person', name: author.name })),
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: frontMatter.summary,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <MDXLayoutRenderer
        layout={frontMatter.layout || DEFAULT_LAYOUT}
        toc={toc}
        mdxSource={mdxSource}
        frontMatter={frontMatter}
        authorDetails={authorDetails}
        prev={prev}
        next={next}
      />
    </>
  )
}
