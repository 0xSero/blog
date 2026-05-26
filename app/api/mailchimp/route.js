import mailchimp from '@mailchimp/mailchimp_marketing'

let isConfigured = false

function getMailchimpClient() {
  if (!isConfigured) {
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_API_SERVER,
    })
    isConfigured = true
  }

  return mailchimp
}

export async function POST(request) {
  const { email } = await request.json()

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    await getMailchimpClient().lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
    })

    return Response.json({ error: '' }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message || error.toString() }, { status: 500 })
  }
}

export function GET() {
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}
