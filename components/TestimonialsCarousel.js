import { useState, useEffect } from 'react'

const testimonials = [
  {
    quote:
      'Sybil Solutions delivered exactly what we needed. Their expertise in AI development transformed our operations.',
    author: 'Alex Chen',
    role: 'CTO, TechVentures',
    company: 'TechVentures Inc.',
  },
  {
    quote:
      "The team's deep understanding of blockchain and frontend development made our project a success.",
    author: 'Sarah Mitchell',
    role: 'Founder',
    company: 'DeFi Labs',
  },
  {
    quote:
      'Professional, responsive, and technically brilliant. They exceeded our expectations at every turn.',
    author: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Innovation Hub',
  },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="divider-asymmetric relative p-8 md:p-12">
        <div className="transition-opacity duration-500" key={current}>
          <blockquote className="mb-6 text-xl text-text-primary md:text-2xl">
            "{testimonials[current].quote}"
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-inset text-accent-subtle">
              {testimonials[current].author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-text-primary">{testimonials[current].author}</div>
              <div className="text-sm text-text-secondary">
                {testimonials[current].role}, {testimonials[current].company}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? 'w-6 bg-accent-subtle' : 'bg-border-default w-2'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
