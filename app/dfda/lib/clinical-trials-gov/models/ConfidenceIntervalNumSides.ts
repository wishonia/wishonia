/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ConfidenceIntervalNumSides = {
  OneSided: "ONE_SIDED",
  TwoSided: "TWO_SIDED",
} as const
export type ConfidenceIntervalNumSides =
  (typeof ConfidenceIntervalNumSides)[keyof typeof ConfidenceIntervalNumSides]

export function ConfidenceIntervalNumSidesFromJSON(
  json: any
): ConfidenceIntervalNumSides {
  return ConfidenceIntervalNumSidesFromJSONTyped(json, false)
}

export function ConfidenceIntervalNumSidesFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ConfidenceIntervalNumSides {
  return json as ConfidenceIntervalNumSides
}
