/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ArmGroupType = {
  Experimental: "EXPERIMENTAL",
  ActiveComparator: "ACTIVE_COMPARATOR",
  PlaceboComparator: "PLACEBO_COMPARATOR",
  ShamComparator: "SHAM_COMPARATOR",
  NoIntervention: "NO_INTERVENTION",
  Other: "OTHER",
} as const
export type ArmGroupType = (typeof ArmGroupType)[keyof typeof ArmGroupType]

export function ArmGroupTypeFromJSON(json: any): ArmGroupType {
  return ArmGroupTypeFromJSONTyped(json, false)
}

export function ArmGroupTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ArmGroupType {
  return json as ArmGroupType
}
