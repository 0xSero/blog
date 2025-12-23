import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { SlideUp } from '@/lib/transitions/PageTransition'

export default function Podcasts() {
  return (
    <>
      <PageSEO
        title={`Podcasts | ${siteMetadata.title}`}
        description="Listen to our latest podcast episodes on software development, AI, and technology."
      />

      {/* Hero Section */}
      <section className="section-breathe">
        <SlideUp>
          <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">Podcasts</h1>
          <p className="max-w-2xl text-lg text-text-secondary">
            Listen to our latest episodes on software development, AI, and technology.
          </p>
        </SlideUp>
      </section>

      {/* Podcast Player - using iframe instead of script */}
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
