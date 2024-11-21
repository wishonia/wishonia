/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const InterventionType = {
  Behavioral: "BEHAVIORAL",
  Biological: "BIOLOGICAL",
  CombinationProduct: "COMBINATION_PRODUCT",
  Device: "DEVICE",
  DiagnosticTest: "DIAGNOSTIC_TEST",
  DietarySupplement: "DIETARY_SUPPLEMENT",
  Drug: "DRUG",
  Genetic: "GENETIC",
  Procedure: "PROCEDURE",
  Radiation: "RADIATION",
  Other: "OTHER",
} as const
export type InterventionType =
  (typeof InterventionType)[keyof typeof InterventionType]

export function InterventionTypeFromJSON(json: any): InterventionType {
  return InterventionTypeFromJSONTyped(json, false)
}

export function InterventionTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): InterventionType {
  return json as InterventionType
}
