/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const OfficialRole = {
  StudyChair: "STUDY_CHAIR",
  StudyDirector: "STUDY_DIRECTOR",
  PrincipalInvestigator: "PRINCIPAL_INVESTIGATOR",
  SubInvestigator: "SUB_INVESTIGATOR",
} as const
export type OfficialRole = (typeof OfficialRole)[keyof typeof OfficialRole]

export function OfficialRoleFromJSON(json: any): OfficialRole {
  return OfficialRoleFromJSONTyped(json, false)
}

export function OfficialRoleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OfficialRole {
  return json as OfficialRole
}
