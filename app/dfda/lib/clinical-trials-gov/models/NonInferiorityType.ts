/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const NonInferiorityType = {
  Superiority: "SUPERIORITY",
  NonInferiority: "NON_INFERIORITY",
  Equivalence: "EQUIVALENCE",
  Other: "OTHER",
  NonInferiorityOrEquivalence: "NON_INFERIORITY_OR_EQUIVALENCE",
  SuperiorityOrOther: "SUPERIORITY_OR_OTHER",
  NonInferiorityOrEquivalenceLegacy: "NON_INFERIORITY_OR_EQUIVALENCE_LEGACY",
  SuperiorityOrOtherLegacy: "SUPERIORITY_OR_OTHER_LEGACY",
} as const
export type NonInferiorityType =
  (typeof NonInferiorityType)[keyof typeof NonInferiorityType]

export function NonInferiorityTypeFromJSON(json: any): NonInferiorityType {
  return NonInferiorityTypeFromJSONTyped(json, false)
}

export function NonInferiorityTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): NonInferiorityType {
  return json as NonInferiorityType
}
