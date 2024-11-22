/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const PrimaryPurpose = {
  Treatment: "TREATMENT",
  Prevention: "PREVENTION",
  Diagnostic: "DIAGNOSTIC",
  Ect: "ECT",
  SupportiveCare: "SUPPORTIVE_CARE",
  Screening: "SCREENING",
  HealthServicesResearch: "HEALTH_SERVICES_RESEARCH",
  BasicScience: "BASIC_SCIENCE",
  DeviceFeasibility: "DEVICE_FEASIBILITY",
  Other: "OTHER",
} as const
export type PrimaryPurpose =
  (typeof PrimaryPurpose)[keyof typeof PrimaryPurpose]

export function PrimaryPurposeFromJSON(json: any): PrimaryPurpose {
  return PrimaryPurposeFromJSONTyped(json, false)
}

export function PrimaryPurposeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PrimaryPurpose {
  return json as PrimaryPurpose
}
