import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSEO } from '@/components/SEO'
import Link from '@/components/Link'

export default function AuthorLayout({ children, frontMatter }) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = frontMatter

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />

      {/* Hero Section */}
      <section className="section-breathe">
        <div className="grid gap-10 md:grid-cols-[200px_1fr] md:items-start">
          {/* Sidebar */}
          <div className="flex flex-col items-center md:sticky md:top-8">
            <div className="relative">
              <div className="from-accent-subtle/20 absolute -inset-1 rounded-full bg-gradient-to-br to-transparent blur-sm" />
              <Image
                src={avatar}
                alt="avatar"
                width="160px"
                height="160px"
                className="relative h-40 w-40 rounded-full border-2 border-border-subtle"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-text-primary">{name}</h3>
            <div className="text-sm text-text-secondary">{occupation}</div>
            <div className="text-sm text-accent-subtle">{company}</div>
            <div className="mt-4 flex space-x-3">
              <SocialIcon kind="mail" href={`mailto:${email}`} size="5" />
              <SocialIcon kind="github" href={github} size="5" />
              <SocialIcon kind="linkedin" href={linkedin} size="5" />
              <SocialIcon kind="twitter" href={twitter} size="5" />
            </div>
            <Link
              href="/contact"
              className="mt-6 w-full rounded-lg bg-text-primary px-6 py-2 text-center text-sm font-medium text-surface-base transition-all hover:opacity-90"
            >
              Get in touch
            </Link>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-accent-subtle prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-li:text-text-secondary">
            {children}
          </div>
        </div>
      </section>
    </>
  )
}
