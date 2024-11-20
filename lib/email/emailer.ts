import { Resend } from "resend"

import { logger } from "@/lib/logger"

import { EMAIL_CONFIG } from "./config"
import { EmailError } from "./errors"
import { EmailParams, EmailResult } from "./types"

// Add type for Resend error
interface ResendErrorResponse {
  name: string
  message: string
  statusCode?: number // Make statusCode optional
  [key: string]: unknown // Allow other properties
}

const resend = new Resend(process.env.RESEND_API_KEY)
const log = logger.forService("email")

async function sendWithRetry(
  params: EmailParams,
  attempt = 1
): Promise<EmailResult> {
  try {
    log.debug("Attempting to send email", {
      metadata: {
        to: params.to,
        subject: params.subject,
        attempt,
      },
    })

    const { data, error } = await resend.emails.send({
      from: params.from || EMAIL_CONFIG.defaultFrom,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      log.error("Resend API error", {
        error: {
          name: error.name,
          message: error.message,
          statusCode: (error as ResendErrorResponse).statusCode, // Type cast
          raw: error,
        },
        metadata: {
          to: params.to,
          subject: params.subject,
          attempt,
        },
      })
      throw EmailError.fromResendError(error)
    }

    log.info("Email sent successfully", {
      metadata: {
        emailId: data?.id,
        to: params.to,
        subject: params.subject,
      },
    })

    return {
      id: data?.id!,
      to: params.to,
      subject: params.subject,
      status: "sent",
    }
  } catch (error) {
    const emailError =
      error instanceof EmailError ? error : EmailError.fromResendError(error)
    const solution = getSolutionForError(emailError)

    log.error("Email sending failed", {
      error: {
        code: emailError.code,
        message: emailError.message,
        solution,
        originalError:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...((error as any).statusCode && {
                  statusCode: (error as any).statusCode,
                }),
                raw: error,
              }
            : error,
      },
      metadata: {
        attempt,
        to: params.to,
        subject: params.subject,
      },
    })

    // Don't retry domain verification errors
    if (emailError.code === "DOMAIN_NOT_VERIFIED") {
      return {
        id: "",
        to: params.to,
        subject: params.subject,
        status: "failed",
        error: {
          code: emailError.code,
          message: emailError.message,
          solution,
        },
      }
    }

    // Retry other errors
    if (attempt < EMAIL_CONFIG.retries.max) {
      log.warn("Retrying email send...", {
        metadata: {
          attempt,
          nextAttemptIn: `${EMAIL_CONFIG.retries.backoff * attempt}ms`,
          to: params.to,
          subject: params.subject,
        },
      })

      await new Promise((resolve) =>
        setTimeout(resolve, EMAIL_CONFIG.retries.backoff * attempt)
      )
      return sendWithRetry(params, attempt + 1)
    }

    return {
      id: "",
      to: params.to,
      subject: params.subject,
      status: "failed",
      error: {
        code: emailError.code,
        message: emailError.message,
        solution,
      },
    }
  }
}

function getSolutionForError(error: EmailError): string {
  switch (error.code) {
    case "DOMAIN_NOT_VERIFIED":
      return `Go to https://resend.com/domains to verify ${EMAIL_CONFIG.domains.main}`
    case "RATE_LIMIT_EXCEEDED":
      return "Reduce email sending rate or upgrade plan"
    case "INVALID_SENDER":
      return `Update sender email to use verified domain ${EMAIL_CONFIG.domains.main}`
    case "AUTHENTICATION_ERROR":
      return "Check RESEND_API_KEY environment variable"
    default:
      return "Contact support if problem persists"
  }
}

export const emailer = {
  async send(params: EmailParams): Promise<EmailResult> {
    return sendWithRetry(params)
  },
}
