import { useState, useEffect } from 'react'

/**
 * X402 Payment Integration Component
 *
 * This component provides crypto payment functionality using x402 protocol.
 * x402 is a crypto payment solution for booking appointments and services.
 *
 * Configuration via environment variables:
 * - NEXT_PUBLIC_X402_API_KEY - Your x402 API key
 * - NEXT_PUBLIC_X402_MERCHANT_ID - Your merchant ID
 * - NEXT_PUBLIC_X402_WALLET_ADDRESS - Wallet to receive payments
 */

const X402Payment = ({ amount, duration, onPaymentSuccess, onPaymentError, disabled = false }) => {
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, processing, success, error
  const [transactionHash, setTransactionHash] = useState('')
  const [showQRCode, setShowQRCode] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  // Load wallet address from config or environment
  useEffect(() => {
    // Get wallet address from environment or use a default placeholder
    const address =
      process.env.NEXT_PUBLIC_X402_WALLET_ADDRESS ||
      process.env.NEXT_PUBLIC_WALLET_ADDRESS ||
      '0x0000000000000000000000000000000000000000'

    // If using placeholder, show a demo note
    if (address === '0x0000000000000000000000000000000000000000') {
      setWalletAddress('Configure in .env (NEXT_PUBLIC_X402_WALLET_ADDRESS)')
    } else {
      setWalletAddress(address)
    }
  }, [])

  const initiatePayment = async () => {
    if (disabled) return

    setPaymentStatus('processing')

    try {
      // Check if x402 API is configured
      const apiKey = process.env.NEXT_PUBLIC_X402_API_KEY

      if (apiKey) {
        // Use x402 API if configured
        await initiateX402Payment()
      } else {
        // Fallback: Simulate payment for demo purposes
        await simulatePayment()
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('error')
      if (onPaymentError) {
        onPaymentError(error.message || 'Payment failed')
      }
    }
  }

  const initiateX402Payment = async () => {
    const merchantId = process.env.NEXT_PUBLIC_X402_MERCHANT_ID
    const apiKey = process.env.NEXT_PUBLIC_X402_API_KEY

    // Call x402 API (example implementation)
    const response = await fetch('https://api.x402.io/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Merchant-ID': merchantId,
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'ETH', // or your preferred currency
        description: `Consultation - ${duration}`,
        metadata: {
          type: 'consultation',
          duration: duration,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to initiate payment')
    }

    const data = await response.json()

    if (data.paymentUrl) {
      // Redirect to x402 payment page
      window.location.href = data.paymentUrl
    } else if (data.qrCode) {
      // Show QR code for payment
      setShowQRCode(true)
    }
  }

  const simulatePayment = async () => {
    // Simulate payment processing for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate a transaction hash
    const mockHash =
      '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

    setTransactionHash(mockHash)
    setPaymentStatus('success')

    if (onPaymentSuccess) {
      onPaymentSuccess({
        transactionHash: mockHash,
        amount: amount,
        currency: 'ETH',
        timestamp: new Date().toISOString(),
      })
    }
  }

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(
      process.env.NEXT_PUBLIC_X402_WALLET_ADDRESS || '0x0000000000000000000000000000000000000000'
    )
  }

  if (paymentStatus === 'success') {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-900/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-green-400">Payment Successful!</h4>
            <p className="text-sm text-text-secondary">Your consultation has been booked.</p>
          </div>
        </div>

        {transactionHash && (
          <div className="mt-4 rounded-lg bg-surface-inset p-3">
            <p className="text-xs text-text-muted">Transaction Hash:</p>
            <p className="mt-1 break-all font-mono text-sm text-text-secondary">
              {transactionHash}
            </p>
          </div>
        )}
      </div>
    )
  }

  if (paymentStatus === 'error') {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-900/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-red-400">Payment Failed</h4>
            <p className="text-sm text-text-secondary">
              There was an issue processing your payment. Please try again.
            </p>
          </div>
        </div>
        <button
          onClick={() => setPaymentStatus('idle')}
          className="hover:bg-border-accent/10 mt-4 rounded-lg border border-border-accent px-4 py-2 text-sm font-medium text-text-primary transition-all"
          style={{ borderColor: '#8B5A2B' }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="border-border-default rounded-lg border bg-surface-inset p-6">
      <div className="mb-6">
        <h4 className="flex items-center gap-2 text-lg font-semibold text-text-primary">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Payment Required
        </h4>
        <p className="mt-1 text-sm text-text-secondary">
          Secure your consultation with a crypto payment
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-surface-base px-4 py-3">
          <span className="text-text-secondary">Duration</span>
          <span className="font-medium text-text-primary">{duration}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-base px-4 py-3">
          <span className="text-text-secondary">Amount</span>
          <span className="font-medium text-text-primary">{amount} ETH</span>
        </div>
      </div>

      {/* Manual Wallet Payment Option */}
      <div className="border-border-default mb-6 rounded-lg border bg-surface-base p-4">
        <p className="mb-2 text-sm font-medium text-text-primary">Send payment to:</p>
        <div className="flex items-center gap-2 rounded-lg bg-surface-inset p-3">
          <code className="flex-1 truncate font-mono text-xs text-text-secondary">
            {walletAddress}
          </code>
          <button
            onClick={copyWalletAddress}
            className="border-border-default hover:bg-border-accent/20 rounded border p-1.5 transition-all"
            title="Copy address"
          >
            <svg
              className="h-4 w-4 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <button
        onClick={initiatePayment}
        disabled={disabled || paymentStatus === 'processing'}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-surface-base transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: '#8B5A2B' }}
      >
        {paymentStatus === 'processing' ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Pay {amount} ETH
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-text-muted">
        Secure payment via x402 protocol • Powered by crypto
      </p>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="mt-4 flex items-center justify-center">
          <div className="rounded-lg bg-white p-4">
            {/* QR Code placeholder - would be generated by x402 API */}
            <div className="h-48 w-48 bg-gray-100">
              <div className="flex h-full items-center justify-center text-gray-500">
                <span className="text-sm">QR Code</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default X402Payment
