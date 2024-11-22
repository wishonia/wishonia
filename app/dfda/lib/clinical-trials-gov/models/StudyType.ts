/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const StudyType = {
  ExpandedAccess: "EXPANDED_ACCESS",
  Interventional: "INTERVENTIONAL",
  Observational: "OBSERVATIONAL",
} as const
export type StudyType = (typeof StudyType)[keyof typeof StudyType]

export function StudyTypeFromJSON(json: any): StudyType {
  return StudyTypeFromJSONTyped(json, false)
}

export function StudyTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): StudyType {
  return json as StudyType
}
