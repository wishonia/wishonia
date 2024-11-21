/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ContactRole = {
  StudyChair: "STUDY_CHAIR",
  StudyDirector: "STUDY_DIRECTOR",
  PrincipalInvestigator: "PRINCIPAL_INVESTIGATOR",
  SubInvestigator: "SUB_INVESTIGATOR",
  Contact: "CONTACT",
} as const
export type ContactRole = (typeof ContactRole)[keyof typeof ContactRole]

export function ContactRoleFromJSON(json: any): ContactRole {
  return ContactRoleFromJSONTyped(json, false)
}

export function ContactRoleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ContactRole {
  return json as ContactRole
}
