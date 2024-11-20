import { sendEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export async function notifyPetitionMilestone(petitionId: string, milestone: {
  title: string
  description: string
  threshold: number
}) {
  const followers = await prisma.petitionFollow.findMany({
    where: {
      petitionId,
      notifyOnMilestone: true
    },
    include: {
      user: true,
      petition: {
        select: { title: true }
      }
    }
  })

  for (const follower of followers) {
    if (follower.user.email) {
      await sendEmail({
        to: follower.user.email,
        subject: `Milestone reached: ${milestone.title} - ${follower.petition.title}`,
        html: `
          <h1>Petition Milestone Reached!</h1>
          <p>The petition "${follower.petition.title}" has reached ${milestone.threshold} signatures!</p>
          <p>${milestone.description}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}">View the petition</a>
        `
      })
    }
  }
}

export async function notifyPetitionStatusUpdate(petitionId: string, content: string) {
  const followers = await prisma.petitionFollow.findMany({
    where: {
      petitionId,
      notifyOnUpdate: true
    },
    include: {
      user: true,
      petition: {
        select: { title: true }
      }
    }
  })

  for (const follower of followers) {
    if (follower.user.email) {
      await sendEmail({
        to: follower.user.email,
        subject: `Update on petition: ${follower.petition.title}`,
        html: `
          <h1>Petition Update</h1>
          <p>${content}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}">View the petition</a>
        `
      })
    }
  }
}

export async function notifySignatureThreshold(petitionId: string, threshold: number) {
  const followers = await prisma.petitionFollow.findMany({
    where: {
      petitionId,
      notifyOnSignature: true
    },
    include: {
      user: true,
      petition: {
        select: { title: true }
      }
    }
  })

  for (const follower of followers) {
    if (follower.user.email) {
      await sendEmail({
        to: follower.user.email,
        subject: `${threshold} signatures reached on: ${follower.petition.title}`,
        html: `
          <h1>Signature Milestone Reached!</h1>
          <p>The petition "${follower.petition.title}" has reached ${threshold} signatures!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}">View the petition</a>
        `
      })
    }
  }
}

export async function notifyPetitionUpdate(petitionId: string, update: {
  type: 'COMMENT' | 'MILESTONE' | 'STATUS_UPDATE' | 'SIGNATURE'
  content: string
}) {
  const followers = await prisma.petitionFollow.findMany({
    where: {
      petitionId,
      emailFrequency: 'INSTANT',
      // Add specific notification preference check
      ...(update.type === 'COMMENT' && { notifyOnComment: true }),
      ...(update.type === 'MILESTONE' && { notifyOnMilestone: true }),
      ...(update.type === 'STATUS_UPDATE' && { notifyOnUpdate: true }),
      ...(update.type === 'SIGNATURE' && { notifyOnSignature: true }),
    },
    include: {
      user: true,
      petition: {
        select: { title: true }
      }
    }
  })

  // Send instant notifications only to followers with INSTANT frequency
  for (const follower of followers) {
    if (follower.user.email) {
      await sendEmail({
        to: follower.user.email,
        subject: `Update on petition: ${follower.petition.title}`,
        html: `
          <h1>Petition Update</h1>
          <p>${update.content}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}">View the petition</a>
        `
      })
    }
  }
} 