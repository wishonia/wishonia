/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const OutcomeMeasureType = {
  Primary: "PRIMARY",
  Secondary: "SECONDARY",
  OtherPreSpecified: "OTHER_PRE_SPECIFIED",
  PostHoc: "POST_HOC",
} as const
export type OutcomeMeasureType =
  (typeof OutcomeMeasureType)[keyof typeof OutcomeMeasureType]

export function OutcomeMeasureTypeFromJSON(json: any): OutcomeMeasureType {
  return OutcomeMeasureTypeFromJSONTyped(json, false)
}

export function OutcomeMeasureTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OutcomeMeasureType {
  return json as OutcomeMeasureType
}
