import winston from 'winston'
import * as Sentry from '@sentry/nextjs'

// Configure winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
})

// Add error tracking to Sentry
const originalErrorLog = logger.error.bind(logger)
type LoggerError = winston.Logger['error']
logger.error = ((message: any, ...args: any[]): winston.Logger => {
  // Send to Sentry if it's an error object
  const error = args[0]?.error || (args[0] instanceof Error ? args[0] : null)
  if (error) {
    Sentry.captureException(error, {
      extra: { message, ...args[0] }
    })
  }
  return originalErrorLog(message, ...args)
}) as LoggerError

// Development only: more detailed logging
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug'
} 