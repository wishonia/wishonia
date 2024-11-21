/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ExpandedAccessStatus = {
  Available: "AVAILABLE",
  NoLongerAvailable: "NO_LONGER_AVAILABLE",
  TemporarilyNotAvailable: "TEMPORARILY_NOT_AVAILABLE",
  ApprovedForMarketing: "APPROVED_FOR_MARKETING",
} as const
export type ExpandedAccessStatus =
  (typeof ExpandedAccessStatus)[keyof typeof ExpandedAccessStatus]

export function ExpandedAccessStatusFromJSON(json: any): ExpandedAccessStatus {
  return ExpandedAccessStatusFromJSONTyped(json, false)
}

export function ExpandedAccessStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ExpandedAccessStatus {
  return json as ExpandedAccessStatus
}
