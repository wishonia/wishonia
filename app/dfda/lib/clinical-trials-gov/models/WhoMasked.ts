/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const WhoMasked = {
  Participant: "PARTICIPANT",
  CareProvider: "CARE_PROVIDER",
  Investigator: "INVESTIGATOR",
  OutcomesAssessor: "OUTCOMES_ASSESSOR",
} as const
export type WhoMasked = (typeof WhoMasked)[keyof typeof WhoMasked]

export function WhoMaskedFromJSON(json: any): WhoMasked {
  return WhoMaskedFromJSONTyped(json, false)
}

export function WhoMaskedFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): WhoMasked {
  return json as WhoMasked
}
