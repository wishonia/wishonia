import { LogData, LogEntry, LogLevel } from "./types"

function getCallerInfo() {
  if (process.env.NODE_ENV !== "production") {
    try {
      const error = new Error()
      const stack = error.stack?.split("\n")[3] // Skip getCallerInfo, log method, and createLogger frames
      if (stack) {
        const match = stack.match(/\((.+):(\d+):(\d+)\)/)
        if (match) {
          const [_, file, line, col] = match
          // Convert to format that PhpStorm/WebStorm recognizes
          return `${file}:${line}:${col}`
        }
      }
    } catch (e) {
      // Ignore errors in getting caller info
    }
  }
  return undefined
}

function createLogger(service: string) {
  return {
    log(level: LogLevel, message: string, data?: LogData) {
      const timestamp = new Date().toISOString()
      const caller = getCallerInfo()
      const logEntry: LogEntry = {
        timestamp,
        level,
        service,
        message,
        ...(data && { data }),
        ...(caller && { caller }),
      }

      const logString = JSON.stringify(logEntry, null, 2)

      switch (level) {
        case "error":
          console.error(logString)
          break
        case "warn":
          console.warn(logString)
          break
        case "info":
          console.log(logString)
          break
        case "debug":
          if (process.env.NODE_ENV !== "production") {
            console.log(logString)
          }
          break
      }
    },

    debug(message: string, data?: LogData) {
      this.log("debug", message, data)
    },

    info(message: string, data?: LogData) {
      this.log("info", message, data)
    },

    warn(message: string, data?: LogData) {
      this.log("warn", message, data)
    },

    error(message: string, data?: LogData) {
      this.log("error", message, data)
    },
  }
}

export const logger = {
  forService: (service: string) => createLogger(service),
}
