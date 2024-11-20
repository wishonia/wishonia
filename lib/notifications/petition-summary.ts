import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

interface PetitionUpdate {
  type: 'SIGNATURE' | 'COMMENT' | 'STATUS_UPDATE' | 'MILESTONE'
  content: string
  timestamp: Date
}

async function generatePetitionSummary(petitionId: string, since: Date) {
  const petition = await prisma.petition.findUnique({
    where: { id: petitionId },
    include: {
      signatures: {
        where: { signedAt: { gte: since } },
        include: { user: true }
      },
      comments: {
        where: { createdAt: { gte: since } },
        include: { user: true }
      },
      statusUpdates: {
        where: { createdAt: { gte: since } }
      },
      milestones: {
        where: { reachedAt: { gte: since } }
      }
    }
  })

  if (!petition) return null

  const updates: PetitionUpdate[] = [
    ...petition.signatures.map(sig => ({
      type: 'SIGNATURE' as const,
      content: `${sig.user.name} signed the petition`,
      timestamp: sig.signedAt
    })),
    ...petition.comments.map(comment => ({
      type: 'COMMENT' as const,
      content: `${comment.user.name} commented: "${comment.content}"`,
      timestamp: comment.createdAt
    })),
    ...petition.statusUpdates.map(update => ({
      type: 'STATUS_UPDATE' as const,
      content: update.content,
      timestamp: update.createdAt
    })),
    ...petition.milestones.filter(m => m.reachedAt).map(milestone => ({
      type: 'MILESTONE' as const,
      content: `Reached ${milestone.threshold} signatures! ${milestone.title}`,
      timestamp: milestone.reachedAt!
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return {
    petition,
    updates
  }
}

export async function sendDailySummaries() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  const followers = await prisma.petitionFollow.findMany({
    where: {
      emailFrequency: 'DAILY',
      OR: [
        { lastEmailSent: { lt: yesterday } },
        { lastEmailSent: null }
      ]
    },
    include: {
      user: true,
      petition: true
    }
  })

  for (const follower of followers) {
    const summary = await generatePetitionSummary(follower.petitionId, yesterday)
    if (!summary || summary.updates.length === 0) continue

    await sendEmail({
      to: follower.user.email!,
      subject: `Daily Update: ${summary.petition.title}`,
      html: `
        <h1>Daily Summary for ${summary.petition.title}</h1>
        <p>Here's what happened in the last 24 hours:</p>
        
        <ul>
          ${summary.updates.map(update => `
            <li>${update.content}</li>
          `).join('')}
        </ul>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${summary.petition.id}">
          View Petition
        </a>
      `
    })

    await prisma.petitionFollow.update({
      where: { id: follower.id },
      data: { lastEmailSent: new Date() }
    })
  }
}

export async function sendWeeklySummaries() {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const followers = await prisma.petitionFollow.findMany({
    where: {
      emailFrequency: 'WEEKLY',
      OR: [
        { lastEmailSent: { lt: lastWeek } },
        { lastEmailSent: null }
      ]
    },
    include: {
      user: true,
      petition: true
    }
  })

  // Similar to daily summaries but with weekly data
  // ... implementation similar to daily summaries
} 