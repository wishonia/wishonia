/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const AgencyClass = {
  Nih: "NIH",
  Fed: "FED",
  OtherGov: "OTHER_GOV",
  Indiv: "INDIV",
  Industry: "INDUSTRY",
  Network: "NETWORK",
  Ambig: "AMBIG",
  Other: "OTHER",
  Unknown: "UNKNOWN",
} as const
export type AgencyClass = (typeof AgencyClass)[keyof typeof AgencyClass]

export function AgencyClassFromJSON(json: any): AgencyClass {
  return AgencyClassFromJSONTyped(json, false)
}

export function AgencyClassFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AgencyClass {
  return json as AgencyClass
}
