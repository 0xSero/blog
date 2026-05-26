import ListLayout from '@/layouts/ListLayout'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { createPageMetadata } from '@/lib/metadata'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import siteMetadata from '@/data/siteMetadata'

function getTagTitle(tag) {
  return tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
}

export async function generateStaticParams() {
  const tags = await getAllTags('blog')

  return Object.keys(tags).map((tag) => ({
    tag,
  }))
}

export async function generateMetadata({ params }) {
  const { tag } = await params

  return createPageMetadata({
    title: tag,
    description: `${tag} tags - ${siteMetadata.author}`,
    path: `/tags/${tag}`,
    rssPath: `/tags/${tag}/feed.xml`,
  })
}

export default async function TagPage({ params }) {
  const { tag } = await params
  const allPosts = await getAllFilesFrontMatter('blog')
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && (post.tags || []).map((item) => kebabCase(item)).includes(tag)
  )

  return <ListLayout posts={filteredPosts} title={getTagTitle(tag)} />
}
