/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const OrgStudyIdType = {
  Nih: "NIH",
  Fda: "FDA",
  Va: "VA",
  Cdc: "CDC",
  Ahrq: "AHRQ",
  Samhsa: "SAMHSA",
} as const
export type OrgStudyIdType =
  (typeof OrgStudyIdType)[keyof typeof OrgStudyIdType]

export function OrgStudyIdTypeFromJSON(json: any): OrgStudyIdType {
  return OrgStudyIdTypeFromJSONTyped(json, false)
}

export function OrgStudyIdTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OrgStudyIdType {
  return json as OrgStudyIdType
}
