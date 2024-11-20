import { wrapEmailContent } from "./template"

interface MilestoneEmailProps {
  userId: string
  baseUrl: string
  petitionTitle: string
  petitionId: string
  milestoneTitle: string
  milestoneDescription: string
  threshold: number
}

export function getPetitionMilestoneEmail({
  userId,
  baseUrl,
  petitionTitle,
  petitionId,
  milestoneTitle,
  milestoneDescription,
  threshold,
}: MilestoneEmailProps): string {
  const content = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 24px;">Petition Milestone Reached!</h1>
      
      <h2 style="color: #374151; margin-bottom: 16px;">${milestoneTitle}</h2>
      
      <p>The petition "<strong>${petitionTitle}</strong>" has reached ${threshold} signatures!</p>
      <p>${milestoneDescription}</p>
      
      <a href="${baseUrl}/petitions/${petitionId}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View the petition
      </a>
    </div>
  `

  return wrapEmailContent({ content, userId, baseUrl })
}
