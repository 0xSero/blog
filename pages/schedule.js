import { useState, useEffect, useRef, useMemo } from 'react'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { patternConfigs, createPattern, resolvePatternFromParam } from '@/lib/patterns'

// ============================================================================
// UTILITY FUNCTIONS (from portal animation system)
// ============================================================================
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

// Palette (warm earth tones)
const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  baseDeep: 'hsl(30, 5%, 8%)',
  baseLift: 'hsl(30, 5%, 14%)',
  center: 'hsl(40, 30%, 96%)',
  centerSoft: 'hsla(40, 25%, 92%, 0.9)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  warmPulse: 'hsla(35, 40%, 75%, 0.6)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  highlightSubtle: 'hsla(40, 25%, 75%, 0.25)',
}

// ============================================================================
// FIBER BACKGROUND
// ============================================================================
const buildFibers = (width, height) => {
  const fibers = []
  const count = Math.round(Math.min(width, height) / 60)
  for (let i = 0; i < count; i++) {
    fibers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 0.08 * width + Math.random() * 0.16 * width,
      angle: -0.35 + Math.random() * 0.7,
      alpha: 0.02 + Math.random() * 0.04,
    })
  }
  return fibers
}

const drawPaper = (ctx, width, height, fibers) => {
  ctx.fillStyle = palette.base
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.strokeStyle = palette.inkFaint
  fibers.forEach((fiber) => {
    ctx.globalAlpha = fiber.alpha
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(fiber.x, fiber.y)
    ctx.lineTo(
      fiber.x + Math.cos(fiber.angle) * fiber.length,
      fiber.y + Math.sin(fiber.angle) * fiber.length
    )
    ctx.stroke()
  })
  ctx.restore()
}

// ============================================================================
// CONCENTRIC RINGS PATTERN (for schedule page)
// ============================================================================
class ConcentricRingsPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.config = config
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.rings = []
    this.build()
  }

  build() {
    const ringCount = 12
    for (let i = 0; i < ringCount; i++) {
      const t = i / (ringCount - 1)
      const baseRadius = this.clearRadius * 1.2 + t * Math.min(this.width, this.height) * 0.4
      const thickness = 2 + Math.random() * 6

      // Create arc segments for each ring
      const segments = []
      const segmentCount = 3 + Math.floor(Math.random() * 4)
      for (let j = 0; j < segmentCount; j++) {
        const startAngle = (j / segmentCount) * Math.PI * 2 + Math.random() * 0.5
        const endAngle = startAngle + (0.3 + Math.random() * 0.5)
        segments.push({ startAngle, endAngle, phase: Math.random() * Math.PI * 2 })
      }

      this.rings.push({
        radius: baseRadius,
        thickness,
        segments,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
      })
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    this.rings.forEach((ring, i) => {
      const ringBase = this.rings.length === 1 ? 0.5 : i / (this.rings.length - 1)
      const reveal = clamp((progress - ringBase * 0.6) * 2.5, 0, 1)
      if (reveal < 0.01) return

      const rotation = ring.phase + t * ring.speed

      // Glow
      ctx.globalAlpha = alpha * 0.15 * reveal
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = ring.thickness + 4
      ctx.beginPath()
      ctx.arc(this.centerX, this.centerY, ring.radius, 0, Math.PI * 2)
      ctx.stroke()

      // Ring segments
      ctx.globalAlpha = alpha * 0.6 * reveal
      ctx.strokeStyle = palette.ink
      ctx.lineWidth = ring.thickness

      ring.segments.forEach((seg) => {
        ctx.beginPath()
        ctx.arc(
          this.centerX,
          this.centerY,
          ring.radius,
          seg.startAngle + rotation,
          seg.endAngle + rotation
        )
        ctx.stroke()
      })

      // Highlights on segments
      ctx.globalAlpha = alpha * 0.3 * reveal
      ctx.strokeStyle = palette.highlight
      ctx.lineWidth = 1

      ring.segments.forEach((seg) => {
        ctx.beginPath()
        ctx.arc(
          this.centerX,
          this.centerY,
          ring.radius,
          seg.startAngle + rotation,
          seg.startAngle + rotation + 0.05
        )
        ctx.stroke()
      })
    })

    ctx.restore()
  }
}

// ============================================================================
// MAIN SCHEDULE PAGE
// ============================================================================
const SLOT_DURATION_MINUTES = 30
const START_HOUR = 9
const END_HOUR = 17

const CONSULTATION_TYPES = [
  {
    id: 'quick',
    name: 'Quick Chat',
    duration: '30 min',
    amount: 0.01,
    description: 'Short consultation for quick questions',
    icon: '⚡',
  },
  {
    id: 'standard',
    name: 'Standard',
    duration: '60 min',
    amount: 0.02,
    description: 'Deep dive into your project needs',
    icon: '🎯',
  },
  {
    id: 'extended',
    name: 'Deep Dive',
    duration: '90 min',
    amount: 0.03,
    description: 'Comprehensive strategy session',
    icon: '🚀',
  },
]

const CONSULTATION_TOPICS = [
  { id: 'general', name: 'General Inquiry', icon: '💬' },
  { id: 'frontend', name: 'Frontend Development', icon: '🎨' },
  { id: 'backend', name: 'Backend Development', icon: '⚙️' },
  { id: 'ai', name: 'AI Agent Development', icon: '🤖' },
  { id: 'consulting', name: 'Strategy & Consulting', icon: '📊' },
  { id: 'review', name: 'Code Review', icon: '🔍' },
]

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedConsultation, setSelectedConsultation] = useState(CONSULTATION_TYPES[1])
  const [selectedTopic, setSelectedTopic] = useState(CONSULTATION_TOPICS[0])
  const [notes, setNotes] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState(1)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Animation setup
  useEffect(() => {
    setIsMounted(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let fibers = []
    let pattern = null
    let startTime = performance.now()

    const activeConfig = resolvePatternFromParam(null)

    const resize = () => {
      const canvasScale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * canvasScale
      canvas.height = window.innerHeight * canvasScale
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0)

      const width = window.innerWidth
      const height = window.innerHeight
      fibers = buildFibers(width, height)

      const minDim = Math.min(width, height)
      const clearRadius = minDim * activeConfig.clearRadius
      pattern = new ConcentricRingsPattern(width, height, activeConfig, clearRadius)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = (currentTime) => {
      const width = canvas.width / Math.min(window.devicePixelRatio || 1, 2)
      const height = canvas.height / Math.min(window.devicePixelRatio || 1, 2)
      const centerX = width / 2
      const centerY = height / 2
      const minDim = Math.min(width, height)
      const clearRadius = minDim * activeConfig.clearRadius

      const elapsed = currentTime - startTime
      const cycleT = (elapsed % activeConfig.cycleMs) / activeConfig.cycleMs

      drawPaper(ctx, width, height, fibers)

      if (pattern) {
        pattern.render(ctx, cycleT)
      }

      // Draw center disc
      const discAlpha = isTransitioning ? Math.min(discAlpha + 0.02, 1) : 0
      ctx.save()
      ctx.globalAlpha = 0.98
      ctx.fillStyle = palette.center
      ctx.beginPath()
      ctx.arc(centerX, centerY, clearRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    let discAlpha = 0
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isTransitioning])

  // Generate available slots for a date
  const generateSlots = (date) => {
    const slots = []
    const start = new Date(date)
    start.setHours(START_HOUR, 0, 0, 0)
    const end = new Date(date)
    end.setHours(END_HOUR, 0, 0, 0)

    while (start < end) {
      slots.push(new Date(start))
      start.setMinutes(start.getMinutes() + SLOT_DURATION_MINUTES)
    }

    return slots
  }

  // Generate next 14 days
  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayOfWeek = date.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(date)
      }
    }

    return dates
  }, [])

  const availableSlots = selectedDate ? generateSlots(selectedDate) : []

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setStep(2)
  }

  const handlePaymentSuccess = (paymentData) => {
    setPaymentComplete(true)
    setBookingData({
      date: selectedDate,
      slot: selectedSlot,
      consultation: selectedConsultation,
      topic: selectedTopic,
      notes,
      email,
      name,
      payment: paymentData,
    })

    // Add to Google Calendar (if API key configured)
    if (siteMetadata.schedule.calendar.googleApiKey) {
      addToGoogleCalendar()
    }

    setStep(3)
  }

  const addToGoogleCalendar = async () => {
    const event = {
      summary: `Consultation: ${selectedTopic.name} - ${name}`,
      description: notes || 'Consultation booking',
      start: {
        dateTime: selectedSlot.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(selectedSlot.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [{ email }],
    }

    console.log('Would add to Google Calendar:', event)
    // Implement actual Google Calendar API call when API key is set
  }

  const handleReset = () => {
    setStep(1)
    setSelectedDate(null)
    setSelectedSlot(null)
    setPaymentComplete(false)
    setBookingData(null)
    setNotes('')
    setEmail('')
    setName('')
  }

  // Step content components
  const renderStep1 = () => (
    <div
      className={`grid gap-8 transition-all duration-1000 lg:grid-cols-2 ${
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-white/95 p-6 shadow-xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              📅
            </span>
            Select a Date
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {availableDates.map((date, i) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                style={{ animationDelay: `${i * 50}ms` }}
                className={`rounded-lg border-2 p-3 text-center transition-all hover:scale-105 ${
                  selectedDate?.getTime() === date.getTime()
                    ? 'border-amber-600 bg-amber-50 shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:border-amber-300'
                }`}
              >
                <div className="text-xs font-semibold uppercase text-gray-500">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xl font-bold text-gray-900">{date.getDate()}</div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg bg-white/95 p-6 shadow-xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              🕐
            </span>
            {selectedDate ? `Available Times - ${formatDate(selectedDate)}` : 'Select a Date First'}
          </h2>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableSlots.map((slot, i) => (
                <button
                  key={slot.toISOString()}
                  onClick={() => handleSelectSlot(slot)}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`rounded-lg border-2 px-3 py-3 text-sm font-semibold transition-all hover:scale-105 ${'border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400">
              <p className="text-center">Select a date to see available time slots</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div
      className={`mx-auto max-w-4xl transition-all duration-1000 ${
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="rounded-lg bg-white/95 p-8 shadow-xl">
        <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-gray-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            ⚙️
          </span>
          Booking Details
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Consultation Type */}
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-gray-700">
                Consultation Type
              </label>
              <div className="space-y-3">
                {CONSULTATION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedConsultation(type)}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                      selectedConsultation.id === type.id
                        ? 'border-amber-600 bg-amber-50 shadow-lg'
                        : 'border-gray-200 bg-gray-50 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900">{type.name}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{type.amount} ETH</p>
                      <p className="text-sm text-gray-600">{type.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-gray-700">
                Topic
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CONSULTATION_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                      selectedTopic.id === topic.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-blue-400'
                    }`}
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <span className="font-medium text-gray-900">{topic.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What would you like to discuss?"
                  rows={3}
                  className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                <svg
                  className="h-5 w-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2m0 8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Payment Required
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Secure your consultation with a crypto payment via x402 protocol
              </p>
              <button
                onClick={() => setPaymentComplete(true)}
                disabled={!name || !email}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-amber-500 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Pay {selectedConsultation.amount} ETH
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                Wallet: 0xc016...d9A9 • Powered by x402
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep(1)}
          className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to date selection
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div
      className={`mx-auto max-w-lg transition-all duration-1000 ${
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="rounded-2xl border-2 border-green-500/30 bg-white/95 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-lg">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="mb-3 text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="mb-8 text-lg text-gray-600">
          Your consultation has been successfully booked and added to calendar.
        </p>

        <div className="mb-8 space-y-3 rounded-xl bg-gray-50 p-6 text-left">
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-600">Date</span>
            <span className="font-bold text-gray-900">{formatDate(bookingData.date)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-600">Time</span>
            <span className="font-bold text-gray-900">{formatTime(bookingData.slot)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-600">Duration</span>
            <span className="font-bold text-gray-900">{bookingData.consultation.duration}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-3">
            <span className="text-gray-600">Topic</span>
            <span className="font-bold text-gray-900">{bookingData.topic.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-bold text-green-600">{bookingData.consultation.amount} ETH</span>
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          A confirmation email has been sent to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>

        <button
          onClick={handleReset}
          className="w-full rounded-xl border-2 border-amber-600 bg-amber-50 px-6 py-4 font-bold text-amber-700 transition-all hover:bg-amber-100"
        >
          Book Another Session
        </button>
      </div>
    </div>
  )

  return (
    <>
      <PageSEO
        title={`Schedule | ${siteMetadata.title}`}
        description="Book a consultation with Sybil Solutions. Pay securely with crypto via x402."
      />

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0"
        style={{ backgroundColor: 'hsl(30, 5%, 10.5%)' }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div
            className={`mb-12 text-center transition-all duration-1000 ${
              isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h1 className="mb-4 text-5xl font-bold text-gray-900 md:text-6xl">
              Schedule a Consultation
            </h1>
            <p className="text-xl text-gray-600">
              Book time on the calendar • Pay securely with crypto via x402
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-12 flex items-center justify-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all ${
                    s <= step
                      ? 'scale-110 bg-amber-600 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-16 rounded-full transition-all ${
                      s < step ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </>
  )
}
