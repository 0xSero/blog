import { useEffect, useRef, useState } from 'react'

/**
 * AI Chatbot Component using Voiceflow
 *
 * This component provides an AI chatbot that can:
 * - Answer questions about the user/company
 * - Schedule meetings via calendar integration
 * - Provide general assistance
 *
 * Requires Voiceflow project ID and API key in environment variables:
 * - NEXT_PUBLIC_VOICEFLOW_PROJECT_ID
 * - NEXT_PUBLIC_VOICEFLOW_API_KEY (optional for public projects)
 */

const AIChatbot = ({ isOpen: externalIsOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(externalIsOpen || false)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [hasUserOpened, setHasUserOpened] = useState(false)
  const containerRef = useRef(null)
  const chatWidgetRef = useRef(null)

  // Handle external open/close
  useEffect(() => {
    if (externalIsOpen !== undefined && externalIsOpen !== isOpen) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])

  const toggleChat = () => {
    setIsOpen((prev) => {
      const newState = !prev
      if (!hasUserOpened) {
        setHasUserOpened(true)
      }
      if (onToggle) onToggle(newState)
      return newState
    })
  }

  // Load Voiceflow chat widget
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_VOICEFLOW_PROJECT_ID
    const apiKey = process.env.NEXT_PUBLIC_VOICEFLOW_API_KEY

    if (!projectId) {
      console.warn('Voiceflow Project ID not found. Set NEXT_PUBLIC_VOICEFLOW_PROJECT_ID in .env')
      return
    }

    // Only load script once
    if (isScriptLoaded) return

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => {
      setIsScriptLoaded(true)
      initializeVoiceflow(projectId, apiKey)
    }
    script.onerror = () => {
      console.error('Failed to load Voiceflow chat widget')
    }

    // Voiceflow chat widget URL
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs'

    document.body.appendChild(script)

    return () => {
      // Cleanup is handled by Voiceflow widget
      const scripts = document.querySelectorAll('script[src*="voiceflow.com/widget"]')
      scripts.forEach((s) => s.remove())
    }
  }, []) // Only run once on mount

  const initializeVoiceflow = (projectId, apiKey) => {
    // Voiceflow widget will be initialized via their runtime
    // We'll use their embedded chat approach
    if (window.voiceflow) {
      window.voiceflow.chat.load({
        verify: { projectID: projectId },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production',
        // Styling options
        render: {
          assistant: {
            firstMessage:
              "Hi! I'm the Sybil Solutions AI assistant. I can help you schedule a meeting, learn about our services, or answer any questions you might have.",
            secondaryMessage: 'How can I help you today?',
            avatar: {
              src: '/static/images/logo.png',
              name: 'Sybil AI',
            },
            stylesheet: `
              .vfrc-container { z-index: 9999; }
              .vfrc-launcher { background-color: #8B5A2B !important; }
              .vfrc-header { background-color: #3D2B1F !important; }
              .vfrc-message--assistant { background-color: #3D2B1F !important; }
              .vfrc-message--user { background-color: #8B5A2B !important; }
            `,
          },
        },
        autostart: false,
        allowInput: true,
      })
    }
  }

  // Open chat programmatically when isOpen changes
  useEffect(() => {
    if (isScriptLoaded && isOpen) {
      // Voiceflow widget handles its own toggle
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.open()
      }
    }
  }, [isOpen, isScriptLoaded])

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: '#8B5A2B',
          }}
          aria-label="Open AI Chat"
        >
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Pulse animation */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
          </span>
        </button>
      )}

      {/* Chat Container (Voiceflow renders its own widget) */}
      <div ref={containerRef} />
    </>
  )
}

export default AIChatbot

// Inline Chat Component for Contact Page
export const InlineAIChat = ({ title, description }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-border-default rounded-lg border bg-surface-inset p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">{title || 'AI Assistant'}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {description || 'Chat with our AI to schedule meetings or get answers quickly.'}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-subtle">
          <svg
            className="h-5 w-5 text-text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Schedule meetings
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Get instant answers
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Available 24/7
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Learn about services
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="hover:bg-border-accent/10 mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-border-accent px-4 py-3 font-medium text-text-primary transition-all"
          style={{ borderColor: '#8B5A2B' }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Chat with AI Assistant
        </button>
      </div>

      {/* Floating chat when opened */}
      {isOpen && <AIChatbot isOpen={true} onToggle={setIsOpen} />}
    </div>
  )
}
