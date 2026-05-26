'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  useEffect(() => {
    document.body.style.overflow = navShow ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [navShow])

  const onToggleNav = () => {
    setNavShow((status) => !status)
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="ml-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:text-text-primary"
        aria-label="Toggle Menu"
        aria-expanded={navShow}
        aria-controls="mobile-navigation"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {navShow && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-200"
            onClick={onToggleNav}
          />

          <div
            id="mobile-navigation"
            className="fixed right-0 top-0 z-50 h-full w-72 max-w-[calc(100vw-1rem)] bg-surface-base shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border-subtle p-4">
                <span className="text-sm font-medium text-text-muted">Menu</span>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
                  aria-label="Close Menu"
                  onClick={onToggleNav}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  {headerNavLinks.map((link, index) => (
                    <li
                      key={link.title}
                      style={{
                        opacity: 1,
                        transform: 'translateX(0)',
                        transition: `opacity 150ms ease-out ${index * 30}ms, transform 150ms ease-out ${
                          index * 30
                        }ms`,
                      }}
                    >
                      <Link
                        href={link.href}
                        className="block rounded-lg px-4 py-3 text-lg font-medium text-text-primary transition-colors hover:bg-surface-elevated hover:text-accent-subtle"
                        onClick={onToggleNav}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-border-subtle p-4">
                <p className="text-xs text-text-muted">0xSero</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MobileNav
