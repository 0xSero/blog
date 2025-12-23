import { useState } from 'react'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { SlideUp } from '@/lib/transitions/PageTransition'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setStatus({ type: 'success', message: "Thanks! We'll reply shortly." })
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <PageSEO
        title={`Contact | ${siteMetadata.title}`}
        description="Get in touch with Sybil Solutions for your software development needs."
      />

      <div className="section-breathe">
        <div className="mx-auto max-w-2xl">
          <SlideUp>
            <h1 className="text-4xl font-semibold text-text-primary md:text-5xl">Contact</h1>
            <p className="mt-4 text-lg text-text-secondary">
              Tell us about your project. We usually reply within 24 hours.
            </p>
          </SlideUp>

          <SlideUp delay={0.1}>
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-border-default block w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-border-default block w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="border-border-default block w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
                  placeholder="Your company (optional)"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="border-border-default block w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
                  placeholder="Tell us about your project..."
                />
              </div>

              {status.message && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-red-900/20 text-red-400'
                  }`}
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-text-primary px-6 py-3 font-medium text-surface-base transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </SlideUp>

          <SlideUp delay={0.2}>
            <p className="mt-8 text-sm text-text-muted">
              Prefer email? Reach us at{' '}
              <a className="text-text-primary underline" href={`mailto:${siteMetadata.email}`}>
                {siteMetadata.email}
              </a>
              .
            </p>
          </SlideUp>
        </div>
      </div>
    </>
  )
}
