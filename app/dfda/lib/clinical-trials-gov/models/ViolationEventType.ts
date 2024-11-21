/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ViolationEventType = {
  ViolationIdentified: "VIOLATION_IDENTIFIED",
  CorrectionConfirmed: "CORRECTION_CONFIRMED",
  PenaltyImposed: "PENALTY_IMPOSED",
  IssuesInLetterAddressedConfirmed: "ISSUES_IN_LETTER_ADDRESSED_CONFIRMED",
} as const
export type ViolationEventType =
  (typeof ViolationEventType)[keyof typeof ViolationEventType]

export function ViolationEventTypeFromJSON(json: any): ViolationEventType {
  return ViolationEventTypeFromJSONTyped(json, false)
}

export function ViolationEventTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ViolationEventType {
  return json as ViolationEventType
}
