import { useRef, useState } from 'react'

import siteMetadata from '@/data/siteMetadata'

const NewsletterForm = ({ title }) => {
  const inputEl = useRef(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e) => {
    e.preventDefault()

    const res = await fetch(`/api/${siteMetadata.newsletter.provider}`, {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      setError(true)
      setMessage('Your e-mail address is invalid or you are already subscribed!')
      return
    }

    inputEl.current.value = ''
    setError(false)
    setSubscribed(true)
    setMessage('Successfully subscribed!')
  }

  return (
    <div className="w-full">
      {title && <div className="mb-3 text-lg font-semibold text-text-primary">{title}</div>}
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={subscribe}>
        <div className="flex-1">
          <label className="sr-only" htmlFor="email-input">
            Email address
          </label>
          <input
            autoComplete="email"
            className="border-border-default w-full rounded-lg border bg-surface-base px-4 py-3 text-text-primary placeholder-text-muted focus:border-border-accent focus:outline-none focus:ring-2 focus:ring-border-accent"
            id="email-input"
            name="email"
            placeholder={subscribed ? "You're subscribed!" : 'Enter your email'}
            ref={inputEl}
            required
            type="email"
            disabled={subscribed}
          />
        </div>
        <button
          className={`rounded-lg bg-text-primary px-6 py-3 font-medium text-surface-base transition-all ${
            subscribed ? 'cursor-default opacity-50' : 'hover:opacity-90'
          }`}
          type="submit"
          disabled={subscribed}
        >
          {subscribed ? 'Thank you!' : 'Subscribe'}
        </button>
      </form>
      {error && <div className="mt-2 text-sm text-red-400">{message}</div>}
      {subscribed && !error && <div className="mt-2 text-sm text-green-400">{message}</div>}
    </div>
  )
}

export default NewsletterForm

export const BlogNewsletterForm = ({ title }) => (
  <div className="divider-asymmetric relative my-8 p-6">
    <NewsletterForm title={title} />
  </div>
)
