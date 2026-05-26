import HomePageContent from '@/components/home/HomePage'
import { createPageMetadata } from '@/lib/metadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'

export const metadata = createPageMetadata({ absoluteTitle: true, path: '/home' })

export default async function HomePage() {
  const posts = await getAllFilesFrontMatter('blog')

  return <HomePageContent posts={posts.slice(0, 3)} />
}
