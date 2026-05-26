import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import siteMetadata from '@/data/siteMetadata'

const staticRoutes = [
  '',
  '/about',
  '/blog',
  '/case-studies',
  '/contact',
  '/home',
  '/podcasts',
  '/projects',
  '/sponsors',
  '/tags',
]

function url(pathname, lastModified) {
  return {
    url: `${siteMetadata.siteUrl}${pathname}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
  }
}

export default async function sitemap() {
  const [posts, caseStudies, tags] = await Promise.all([
    getAllFilesFrontMatter('blog'),
    getAllFilesFrontMatter('case-studies'),
    getAllTags('blog'),
  ])

  return [
    ...staticRoutes.map((route) => url(route)),
    ...posts.map((post) => url(`/blog/${post.slug}`, post.lastmod || post.date)),
    ...caseStudies.map((study) => url(`/case-studies/${study.slug}`, study.lastmod || study.date)),
    ...Object.keys(tags).map((tag) => url(`/tags/${tag}`)),
  ]
}
