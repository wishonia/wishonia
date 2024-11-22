/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ResponsiblePartyType = {
  Sponsor: "SPONSOR",
  PrincipalInvestigator: "PRINCIPAL_INVESTIGATOR",
  SponsorInvestigator: "SPONSOR_INVESTIGATOR",
} as const
export type ResponsiblePartyType =
  (typeof ResponsiblePartyType)[keyof typeof ResponsiblePartyType]

export function ResponsiblePartyTypeFromJSON(json: any): ResponsiblePartyType {
  return ResponsiblePartyTypeFromJSONTyped(json, false)
}

export function ResponsiblePartyTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ResponsiblePartyType {
  return json as ResponsiblePartyType
}
