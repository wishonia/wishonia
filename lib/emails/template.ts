interface EmailTemplateProps {
  content: string
  userId: string
  baseUrl: string
}

export function wrapEmailContent({
  content,
  userId,
  baseUrl,
}: EmailTemplateProps): string {
  const unsubscribeUrl = `${baseUrl}/settings/notifications?userId=${userId}`

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Wishonia</title>
      </head>
      <body style="font-family: sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0;">
        <!-- Main Content -->
        ${content}
        
        <!-- Footer -->
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border-top: 1px solid #eee; margin-top: 32px;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Wishonia · Made with ❤️ for a better world
            <br>
            <a href="${unsubscribeUrl}" 
               style="color: #666; text-decoration: underline;">
              Manage email preferences
            </a>
          </p>
        </div>
      </body>
    </html>
  `
}
