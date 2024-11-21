/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const SecondaryIdType = {
  Nih: "NIH",
  Fda: "FDA",
  Va: "VA",
  Cdc: "CDC",
  Ahrq: "AHRQ",
  Samhsa: "SAMHSA",
  OtherGrant: "OTHER_GRANT",
  EudractNumber: "EUDRACT_NUMBER",
  Ctis: "CTIS",
  Registry: "REGISTRY",
  Other: "OTHER",
} as const
export type SecondaryIdType =
  (typeof SecondaryIdType)[keyof typeof SecondaryIdType]

export function SecondaryIdTypeFromJSON(json: any): SecondaryIdType {
  return SecondaryIdTypeFromJSONTyped(json, false)
}

export function SecondaryIdTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SecondaryIdType {
  return json as SecondaryIdType
}
