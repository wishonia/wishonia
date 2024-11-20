import { wrapEmailContent } from "./template"

interface StatusUpdateEmailProps {
  userId: string
  baseUrl: string
  petitionTitle: string
  petitionId: string
  content: string
}

export function getPetitionStatusUpdateEmail({
  userId,
  baseUrl,
  petitionTitle,
  petitionId,
  content,
}: StatusUpdateEmailProps): string {
  const emailContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 24px;">Petition Update</h1>
      
      <p>There's a new update on the petition: <strong>${petitionTitle}</strong></p>
      
      <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #2563eb;">
        ${content}
      </div>
      
      <a href="${baseUrl}/petitions/${petitionId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View the petition
      </a>
    </div>
  `

  return wrapEmailContent({ content: emailContent, userId, baseUrl })
}
