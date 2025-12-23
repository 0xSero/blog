export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, company, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Send to Formspree - free form backend
    const response = await fetch('https://formspree.io/f/xwpkvgdp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        company: company || 'Not provided',
        message,
        _subject: `New contact from ${name} - Sybil Solutions`,
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
