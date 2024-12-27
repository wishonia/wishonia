import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  metadata?: any
  error?: Error | unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'

  private formatMessage(level: LogLevel, message: string, options?: LoggerOptions | unknown) {
    const normalizedOptions: LoggerOptions = 
      options instanceof Error ? { error: options } :
      typeof options === 'object' ? { metadata: options } :
      options as LoggerOptions || {}

    const formattedMessage: Record<string, any> = {
      timestamp: new Date().toISOString(),
      level,
      message
    }
    
    if (normalizedOptions.metadata) {
      formattedMessage.metadata = normalizedOptions.metadata
    }
    
    if (normalizedOptions.error) {
      formattedMessage.error = this.formatError(normalizedOptions.error)
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

  private log(level: LogLevel, message: string, options?: LoggerOptions | unknown) {
    const logData = this.formatMessage(level, message, options)
    
    if (this.isDevelopment || level === 'error') {
      const consoleMethod = level === 'error' ? 'error' 
        : level === 'warn' ? 'warn'
        : level === 'debug' ? 'debug'
        : 'log'
      console[consoleMethod](message, logData)
    }

    // Always send errors to Sentry, regardless of environment
    if (level === 'error') {
      const error = options instanceof Error ? options : 
        (options as LoggerOptions)?.error
      
      if (error) {
        const metadata = (options as LoggerOptions)?.metadata || {}
        Sentry.captureException(error, {
          extra: { message, ...metadata }
        })
      }
    }
  }

  debug(message: string, options?: LoggerOptions | unknown) {
    this.log('debug', message, options)
  }

  info(message: string, options?: LoggerOptions | unknown) {
    this.log('info', message, options)
  }

  warn(message: string, options?: LoggerOptions | unknown) {
    this.log('warn', message, options)
  }

  error(message: string, options?: LoggerOptions | unknown) {
    this.log('error', message, options)
  }
}

export const logger = new Logger() 