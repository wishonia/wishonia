export interface EmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export interface EmailResult {
  id: string
  to: string
  subject: string
  status: "sent" | "failed"
  error?: {
    code: string
    message: string
    solution: string
  }
}

// Base email props that all emails share
export interface BaseEmailProps {
  userId: string
  baseUrl: string
}

// Specific props for comment notification emails
export interface CommentNotificationEmailProps extends BaseEmailProps {
  petitionTitle: string
  petitionId: string
  content: string
}
