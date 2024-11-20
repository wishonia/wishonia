import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - skipping email send')
    return
  }

  try {
    await resend.emails.send({
      from: 'Wishonia <notifications@wishonia.org>',
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Failed to send email:', error)
  }
} 