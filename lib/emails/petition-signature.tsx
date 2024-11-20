import { PetitionSignatureEmailProps } from '@/types'

export function getPetitionSignatureEmail({
  petitionTitle,
  petitionId,
  userId,
  baseUrl,
}: PetitionSignatureEmailProps): string {
  const referralUrl = `${baseUrl}/petitions/${petitionId}?ref=${userId}`
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for signing the petition</title>
      </head>
      <body style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 24px;">Thank you for signing!</h1>
          
          <p>Thank you for signing the petition: <strong>${petitionTitle}</strong></p>
          
          <p>Your signature helps make a difference. Help us reach more people by sharing this petition:</p>
          
          <div style="margin: 32px 0;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right: 16px;">
                  <a href="https://twitter.com/intent/tweet?text=I just signed ${encodeURIComponent(petitionTitle)}&url=${encodeURIComponent(referralUrl)}"
                     style="background-color: #1DA1F2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                    Share on Twitter
                  </a>
                </td>
                <td>
                  <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}"
                     style="background-color: #4267B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                    Share on Facebook
                  </a>
                </td>
              </tr>
            </table>
          </div>
          
          <p style="margin-top: 24px;">Your personal referral link:</p>
          <input value="${referralUrl}" 
                 style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 8px;"
                 readonly>
          
          <p style="color: #666; font-size: 14px; margin-top: 32px;">
            You received this email because you signed a petition on Wishonia. 
            If you believe this was a mistake, please contact us.
          </p>
        </div>
      </body>
    </html>
  `
} 