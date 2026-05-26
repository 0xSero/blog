import ListLayout from '@/layouts/ListLayout'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'Blog',
  description: siteMetadata.description,
  path: '/blog',
  rssPath: '/feed.xml',
})

export default async function BlogPage() {
  const posts = await getAllFilesFrontMatter('blog')

  return <ListLayout posts={posts} title="All Posts" />
}
