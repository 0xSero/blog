import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'

export default function AppLayoutWrapper({ children }) {
  return (
    <div className="min-h-screen bg-surface-base">
      <SectionContainer>
        <div className="flex min-h-screen flex-col">
          <header className="relative z-20 flex items-center justify-between py-6">
            <div>
              <Link
                href="/home"
                aria-label={siteMetadata.headerTitle}
                className="inline-flex min-h-11 items-center"
              >
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-2xl font-semibold tracking-tight text-text-primary">
                    {siteMetadata.headerTitle}
                  </span>
                </div>
              </Link>
            </div>
            <nav className="flex items-center gap-1">
              <div className="hidden md:flex md:items-center md:gap-1">
                {headerNavLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
              <MobileNav />
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <div className="relative z-20">
            <Footer />
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
