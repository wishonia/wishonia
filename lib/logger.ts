import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug'

interface LoggerOptions {
  metadata?: any
  error?: Error | unknown
  user?: {
    id?: string
    email?: string
    username?: string
  }
  // For custom error grouping
  fingerprint?: string[]
  // For error sampling
  sampleRate?: number
  // For tracking the operation/transaction
  transaction?: string
  severity?: SeverityLevel
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'
  private isServer = typeof window === 'undefined'
  
  // Default sample rates by environment
  private readonly sampleRates = {
    production: 0.1, // 10% of errors
    development: 1.0, // All errors
    test: 0.0 // No errors
  }

  private shouldSampleError(sampleRate?: number): boolean {
    const defaultRate = this.sampleRates[process.env.NODE_ENV as keyof typeof this.sampleRates] || 1.0
    const finalRate = sampleRate ?? defaultRate
    return Math.random() < finalRate
  }

  private getRuntimeContext() {
    if (this.isServer) {
      return {
        environment: 'server',
        node: process.version,
        env: process.env.NODE_ENV,
        memory: process.memoryUsage()
      }
    }
    
    return {
      environment: 'client',
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: (performance as any)?.memory ? {
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize
      } : undefined
    }
  }

  private formatMessage(level: LogLevel, message: string, options?: LoggerOptions | unknown) {
    const normalizedOptions: LoggerOptions = 
      options instanceof Error ? { error: options } :
      typeof options === 'object' ? { metadata: options } :
      options as LoggerOptions || {}

    const formattedMessage: Record<string, any> = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: this.isServer ? 'server' : 'client'
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
      
      if (error && this.shouldSampleError((options as LoggerOptions)?.sampleRate)) {
        const metadata = (options as LoggerOptions)?.metadata || {}
        const user = (options as LoggerOptions)?.user
        const fingerprint = (options as LoggerOptions)?.fingerprint
        const transaction = (options as LoggerOptions)?.transaction
        const severity = (options as LoggerOptions)?.severity || 'error'

        // Add breadcrumb for error tracking
        Sentry.addBreadcrumb({
          category: 'logger',
          message,
          level: severity,
          data: metadata
        });

        Sentry.withScope((scope) => {
          scope.setLevel(severity);
          scope.setContext('metadata', metadata);
          scope.setTag('logger.message', message);
          scope.setTag('environment', process.env.NODE_ENV || 'unknown');
          scope.setTag('runtime', this.isServer ? 'server' : 'client');
          
          if (user) {
            scope.setUser(user);
          }

          if (fingerprint) {
            scope.setFingerprint(fingerprint);
          }

          if (transaction) {
            scope.setTag('transaction', transaction);
          }
          
          // Add timestamp for better error tracking
          scope.setContext('timestamp', {
            iso: new Date().toISOString(),
            unix: Date.now()
          });

          // Add runtime-specific context
          scope.setContext('runtime', this.getRuntimeContext());

          Sentry.captureException(error, {
            extra: { message, ...metadata }
          });
        });
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