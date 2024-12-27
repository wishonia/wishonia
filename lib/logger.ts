import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogMetadata = Record<string, any>

interface LoggerOptions {
  metadata?: LogMetadata
  error?: Error | unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  private formatMessage(level: LogLevel, message: string, options?: LoggerOptions) {
    const formattedMessage: Record<string, any> = {
      timestamp: new Date().toISOString(),
      level,
      message
    }
    
    if (options?.metadata) {
      formattedMessage.metadata = options.metadata
    }
    
    if (options?.error) {
      formattedMessage.error = this.formatError(options.error)
    }
    
    return formattedMessage
  }

  private formatError(error: Error | unknown) {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any).cause && { cause: (error as any).cause }
      }
    }
    return { message: String(error) }
  }

  private log(level: LogLevel, message: string, options?: LoggerOptions) {
    const logData = this.formatMessage(level, message, options)
    
    if (this.isDevelopment || level === 'error') {
      const consoleMethod = level === 'error' ? 'error' 
        : level === 'warn' ? 'warn'
        : level === 'debug' ? 'debug'
        : 'log'
      console[consoleMethod](message, logData)
    }

    // Always send errors to Sentry, regardless of environment
    if (level === 'error' && options?.error) {
      Sentry.captureException(options.error, {
        extra: { message, ...options.metadata }
      })
    }
  }

  debug(message: string, options?: Omit<LoggerOptions, 'error'>) {
    this.log('debug', message, options)
  }

  info(message: string, options?: Omit<LoggerOptions, 'error'>) {
    this.log('info', message, options)
  }

  warn(message: string, options?: LoggerOptions) {
    this.log('warn', message, options)
  }

  error(message: string, options?: LoggerOptions & { error?: Error | unknown }) {
    this.log('error', message, options)
  }
}

export const logger = new Logger() 