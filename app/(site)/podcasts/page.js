import { createPageMetadata } from '@/lib/metadata'
import { SlideUp } from '@/lib/transitions/SlideUp'

export const metadata = createPageMetadata({
  title: 'Podcasts',
  description: 'Listen to our latest podcast episodes on software development, AI, and technology.',
  path: '/podcasts',
})

export default function PodcastsPage() {
  return (
    <>
      <section className="section-breathe">
        <SlideUp>
          <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">Podcasts</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            Listen to our latest episodes on software development, AI, and technology.
          </p>
        </SlideUp>
      </section>

      <section className="section-breathe">
        <SlideUp delay={0.1}>
          <div className="mx-auto max-w-4xl">
            <iframe
              src="https://www.buzzsprout.com/1988715?client_source=large_player&iframe=true"
              loading="lazy"
              width="100%"
              height="375"
              frameBorder="0"
              scrolling="no"
              title="Podcast Episodes"
              className="rounded-lg"
            />
          </div>
        </SlideUp>
      </section>
    </>
  )
}
