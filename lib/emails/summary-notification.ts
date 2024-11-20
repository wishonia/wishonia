import { wrapEmailContent } from "./template"

interface SummaryEmailProps {
  userId: string
  baseUrl: string
  petitionTitle: string
  petitionId: string
  updates: Array<{
    content: string
    timestamp: Date
  }>
  period: "daily" | "weekly"
}

export function getPetitionSummaryEmail({
  userId,
  baseUrl,
  petitionTitle,
  petitionId,
  updates,
  period,
}: SummaryEmailProps): string {
  const timeframe = period === "daily" ? "24 hours" : "7 days"

  const content = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 24px;">${period === "daily" ? "Daily" : "Weekly"} Summary</h1>
      
      <p>Here's what happened with "<strong>${petitionTitle}</strong>" in the last ${timeframe}:</p>
      
      <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #2563eb;">
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          ${updates
            .map(
              (update) => `
            <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
              ${update.content}
            </li>
          `
            )
            .join("")}
        </ul>
        
        <p style="margin-top: 15px; color: #666;">
          Total updates: ${updates.length}
        </p>
      </div>
      
      <a href="${baseUrl}/petitions/${petitionId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View the petition
      </a>
    </div>
  `

  return wrapEmailContent({ content, userId, baseUrl })
}
