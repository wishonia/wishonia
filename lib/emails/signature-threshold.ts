import { wrapEmailContent } from "./template"

interface SignatureThresholdEmailProps {
  userId: string
  baseUrl: string
  petitionTitle: string
  petitionId: string
  threshold: number
}

export function getSignatureThresholdEmail({
  userId,
  baseUrl,
  petitionTitle,
  petitionId,
  threshold,
}: SignatureThresholdEmailProps): string {
  const content = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 24px;">Signature Milestone Reached!</h1>
      
      <p>Great news! The petition "<strong>${petitionTitle}</strong>" has reached ${threshold} signatures!</p>
      
      <p>Every signature helps make a difference. Thank you for being part of this movement.</p>
      
      <a href="${baseUrl}/petitions/${petitionId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View the petition
      </a>
    </div>
  `

  return wrapEmailContent({ content, userId, baseUrl })
}
