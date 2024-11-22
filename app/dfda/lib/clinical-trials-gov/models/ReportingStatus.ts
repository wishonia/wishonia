/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ReportingStatus = {
  NotPosted: "NOT_POSTED",
  Posted: "POSTED",
} as const
export type ReportingStatus =
  (typeof ReportingStatus)[keyof typeof ReportingStatus]

export function ReportingStatusFromJSON(json: any): ReportingStatus {
  return ReportingStatusFromJSONTyped(json, false)
}

export function ReportingStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ReportingStatus {
  return json as ReportingStatus
}
