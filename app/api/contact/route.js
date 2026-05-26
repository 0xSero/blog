export async function POST(request) {
  const { name, email, company, message } = await request.json()

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY

    if (!accessKey) {
      return Response.json({ error: 'Contact form is not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
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

    return Response.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

export function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}
