export function getUtcDateTimeWithTimezone() {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset()
  return new Date(date.getTime() - timezoneOffset * 60000).toISOString()
}

export function convertToUTC(localDateTime: string, timezoneOffset: number) {
  const localDate = new Date(localDateTime)
  return new Date(localDate.getTime() + timezoneOffset * 60000).toISOString()
}

export function throwErrorIfDateInFuture(utcDateTime: string) {
  const localDate = new Date(utcDateTime)
  const now = new Date()
  if (localDate > now) {
    throw new Error("Date cannot be in the future")
  }
}

export function getUtcDateTime() {
  return new Date().toISOString()
}

export function getTimeZoneOffset() {
  return new Date().getTimezoneOffset()
}

export function convertToLocalDateTime(
  utcDateTime: string | number | Date,
  timeZoneOffset: number
) {
  const utcDate = new Date(utcDateTime)
  const localDate = new Date(
    utcDate.getTime() - timeZoneOffset * 60 * 60 * 1000
  )
  return localDate.toISOString()
}
