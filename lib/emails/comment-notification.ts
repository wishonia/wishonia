import { CommentNotificationEmailProps } from "@/lib/email/types"

import { wrapEmailContent } from "./template"

export function getCommentNotificationEmail({
  petitionTitle,
  petitionId,
  content,
  baseUrl,
  userId,
}: CommentNotificationEmailProps): string {
  const emailContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 24px;">New Comment on Petition</h1>
      
      <p>A new comment was added to the petition: <strong>${petitionTitle}</strong></p>
      
      <blockquote style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #333;">
        ${content}
      </blockquote>
      
      <a href="${baseUrl}/petitions/${petitionId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View the petition
      </a>
    </div>
  `

  return wrapEmailContent({ content: emailContent, userId, baseUrl })
}
