import { emailer } from "@/lib/email/emailer"
import { getPetitionMilestoneEmail } from "@/lib/emails/petition-milestone"
import { getPetitionStatusUpdateEmail } from "@/lib/emails/petition-status-update"
import { getSignatureThresholdEmail } from "@/lib/emails/signature-threshold"
import { getPetitionSummaryEmail } from "@/lib/emails/summary-notification"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma"

const log = logger.forService("petition-notifications")

type NotificationType = "comment" | "milestone" | "update" | "signature"
type PeriodType = "INSTANT" | "DAILY" | "WEEKLY"

interface PetitionUpdate {
  type: "SIGNATURE" | "COMMENT" | "STATUS_UPDATE" | "MILESTONE"
  content: string
  timestamp: Date
}

interface NotificationFollower {
  id: string
  user: {
    id: string
    email: string | null
    name: string | null
  }
  petitionId: string
  petition: {
    id: string
    title: string
  }
  userId: string
  createdAt: Date
  notifyOnComment: boolean
  notifyOnMilestone: boolean
  notifyOnUpdate: boolean
  notifyOnSignature: boolean
  emailFrequency: string
  lastEmailSent: Date | null
}

interface EmailData {
  to: string
  subject: string
  html: string
}

async function getEligibleFollowers(
  petitionId: string | undefined,
  notificationType: NotificationType | undefined,
  period: PeriodType = "INSTANT"
) {
  const baseWhere: any = {
    emailFrequency: period,
    user: {
      unsubscribeFromAll: false,
      email: { not: null },
    },
  }

  if (petitionId && notificationType) {
    const notificationField = {
      comment: "notifyOnComment",
      milestone: "notifyOnMilestone",
      update: "notifyOnUpdate",
      signature: "notifyOnSignature",
    }[notificationType]

    baseWhere.petitionId = petitionId
    baseWhere[notificationField] = true
  }

  if (period !== "INSTANT") {
    const cutoffDate =
      period === "DAILY"
        ? new Date(Date.now() - 24 * 60 * 60 * 1000)
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    baseWhere.OR = [
      { lastEmailSent: { lt: cutoffDate } },
      { lastEmailSent: null },
    ]
  }

  return prisma.petitionFollow.findMany({
    where: baseWhere,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      petition: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  })
}

async function generatePetitionSummary(petitionId: string, since: Date) {
  const petition = await prisma.petition.findUnique({
    where: { id: petitionId },
    include: {
      signatures: {
        where: { signedAt: { gte: since } },
        include: { user: true },
      },
      comments: {
        where: { createdAt: { gte: since } },
        include: { user: true },
      },
      statusUpdates: {
        where: { createdAt: { gte: since } },
      },
      milestones: {
        where: { reachedAt: { gte: since } },
      },
    },
  })

  if (!petition) return null

  const updates: PetitionUpdate[] = [
    ...petition.signatures.map((sig) => ({
      type: "SIGNATURE" as const,
      content: `${sig.user.name} signed the petition`,
      timestamp: sig.signedAt,
    })),
    ...petition.comments.map((comment) => ({
      type: "COMMENT" as const,
      content: `${comment.user.name} commented: "${comment.content}"`,
      timestamp: comment.createdAt,
    })),
    ...petition.statusUpdates.map((update) => ({
      type: "STATUS_UPDATE" as const,
      content: update.content,
      timestamp: update.createdAt,
    })),
    ...petition.milestones
      .filter((m) => m.reachedAt)
      .map((milestone) => ({
        type: "MILESTONE" as const,
        content: `Reached ${milestone.threshold} signatures! ${milestone.title}`,
        timestamp: milestone.reachedAt!,
      })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return { petition, updates }
}

async function sendNotificationEmail(
  follower: NotificationFollower,
  emailData: EmailData,
  notificationType: string
) {
  try {
    await emailer.send(emailData)

    if (["daily", "weekly"].includes(notificationType)) {
      await prisma.petitionFollow.update({
        where: { id: follower.id },
        data: { lastEmailSent: new Date() },
      })
    }

    log.info(`Sent ${notificationType} notification`, {
      metadata: {
        userId: follower.user.id,
        petitionId: follower.petitionId,
        type: notificationType,
      },
    })
  } catch (error) {
    log.error(`Failed to send ${notificationType} notification`, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : { message: String(error) },
      metadata: {
        userId: follower.user.id,
        petitionId: follower.petitionId,
        email: follower.user.email,
      },
    })
  }
}

// Instant notification functions
export async function notifyPetitionMilestone(
  petitionId: string,
  milestone: {
    title: string
    description: string
    threshold: number
  }
) {
  const followers = await getEligibleFollowers(petitionId, "milestone")

  for (const follower of followers) {
    if (follower.user.email) {
      await sendNotificationEmail(
        follower,
        {
          to: follower.user.email,
          subject: `Milestone reached: ${milestone.title} - ${follower.petition.title}`,
          html: getPetitionMilestoneEmail({
            userId: follower.user.id,
            baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
            petitionTitle: follower.petition.title,
            petitionId,
            milestoneTitle: milestone.title,
            milestoneDescription: milestone.description,
            threshold: milestone.threshold,
          }),
        },
        "milestone"
      )
    }
  }
}

export async function notifyPetitionStatusUpdate(
  petitionId: string,
  content: string
) {
  const followers = await getEligibleFollowers(petitionId, "update")

  for (const follower of followers) {
    if (follower.user.email) {
      await sendNotificationEmail(
        follower,
        {
          to: follower.user.email,
          subject: `Update on petition: ${follower.petition.title}`,
          html: getPetitionStatusUpdateEmail({
            userId: follower.user.id,
            baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
            petitionTitle: follower.petition.title,
            petitionId,
            content,
          }),
        },
        "update"
      )
    }
  }
}

export async function notifySignatureThreshold(
  petitionId: string,
  threshold: number
) {
  const followers = await getEligibleFollowers(petitionId, "signature")

  for (const follower of followers) {
    if (follower.user.email) {
      await sendNotificationEmail(
        follower,
        {
          to: follower.user.email,
          subject: `${threshold} signatures reached on: ${follower.petition.title}`,
          html: getSignatureThresholdEmail({
            userId: follower.user.id,
            baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
            petitionTitle: follower.petition.title,
            petitionId,
            threshold,
          }),
        },
        "signature"
      )
    }
  }
}

// Periodic summary functions
export async function sendDailySummaries() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const followers = await getEligibleFollowers(undefined, undefined, "DAILY")

  for (const follower of followers) {
    const summary = await generatePetitionSummary(
      follower.petitionId,
      yesterday
    )
    if (!summary || summary.updates.length === 0) continue

    await sendNotificationEmail(
      follower,
      {
        to: follower.user.email!,
        subject: `Daily Update: ${summary.petition.title}`,
        html: getPetitionSummaryEmail({
          userId: follower.user.id,
          baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
          petitionTitle: summary.petition.title,
          petitionId: summary.petition.id,
          updates: summary.updates,
          period: "daily",
        }),
      },
      "daily"
    )
  }
}

export async function sendWeeklySummaries() {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const followers = await getEligibleFollowers(undefined, undefined, "WEEKLY")

  for (const follower of followers) {
    const summary = await generatePetitionSummary(follower.petitionId, lastWeek)
    if (!summary || summary.updates.length === 0) continue

    await sendNotificationEmail(
      follower,
      {
        to: follower.user.email!,
        subject: `Weekly Update: ${summary.petition.title}`,
        html: getPetitionSummaryEmail({
          userId: follower.user.id,
          baseUrl: process.env.NEXT_PUBLIC_APP_URL!,
          petitionTitle: summary.petition.title,
          petitionId: summary.petition.id,
          updates: summary.updates,
          period: "weekly",
        }),
      },
      "weekly"
    )
  }
}
