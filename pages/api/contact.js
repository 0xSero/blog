export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, company, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Web3Forms - unlimited free, sends to contact@sybilsolutions.com
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: '0a0ecb80-ba96-44f8-9efa-579664e6fe05',
        name,
        email,
        company: company || 'Not provided',
        message,
        subject: `New contact from ${name} - Sybil Solutions`,
        from_name: 'Sybil Solutions Contact Form',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to submit form')
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
