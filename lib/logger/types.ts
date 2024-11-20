export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogData {
  error?: {
    name?: string
    message?: string
    stack?: string
    code?: string
    cause?: unknown
    [key: string]: unknown
  }
  metadata?: Record<string, unknown>

  [key: string]: unknown
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  service: string
  message: string
  data?: LogData
  caller?: string
}
