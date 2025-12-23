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
    service: 'general',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // For now, just simulate a submission
    // You can integrate with Vercel Forms, Formspree, or your own API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus({ type: 'success', message: "Thank you! We'll be in touch soon." })
      setFormData({ name: '', email: '', company: '', message: '', service: 'general' })
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    }

    setIsSubmitting(false)
  }

  const services = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'ai', label: 'AI Agent Development' },
    { value: 'consulting', label: 'Research & Consulting' },
  ]

  return (
    <>
      <PageSEO
        title={`Contact | ${siteMetadata.title}`}
        description="Get in touch with Sybil Solutions for your software development needs."
      />

      <div className="section-breathe">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Info */}
          <SlideUp>
            <h1 className="mb-4 text-4xl font-semibold text-text-primary md:text-5xl">
              Get in Touch
            </h1>
            <p className="mb-8 text-lg text-text-secondary">
              Ready to start your project? Have a question? We'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-surface-inset p-3 text-accent-subtle">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                  <a
                    href={`mailto:${siteMetadata.email}`}
                    className="text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {siteMetadata.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-surface-inset p-3 text-accent-subtle">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Response Time</h3>
                  <p className="text-text-secondary">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-surface-inset p-3 text-accent-subtle">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Location</h3>
                  <p className="text-text-secondary">Remote-first, worldwide</p>
                </div>
              </div>
            </div>
          </SlideUp>

          {/* Right Column - Form */}
          <SlideUp delay={0.1}>
            <div className="divider-asymmetric relative rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    htmlFor="service"
                    className="mb-2 block text-sm font-medium text-text-primary"
                  >
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="border-border-default block w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
                  >
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
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
                    rows={5}
                    className="border-border-default block w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {status.message && (
                  <div
                    className={`rounded-lg p-4 ${
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
                  className="w-full rounded-lg bg-text-primary px-6 py-3 font-medium text-surface-base transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </SlideUp>
        </div>
      </div>
    </>
  )
}
