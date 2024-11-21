/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const AgreementRestrictionType = {
  Lte60: "LTE60",
  Gt60: "GT60",
  Other: "OTHER",
} as const
export type AgreementRestrictionType =
  (typeof AgreementRestrictionType)[keyof typeof AgreementRestrictionType]

export function AgreementRestrictionTypeFromJSON(
  json: any
): AgreementRestrictionType {
  return AgreementRestrictionTypeFromJSONTyped(json, false)
}

export function AgreementRestrictionTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AgreementRestrictionType {
  return json as AgreementRestrictionType
}
