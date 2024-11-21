/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ObservationalModel = {
  Cohort: "COHORT",
  CaseControl: "CASE_CONTROL",
  CaseOnly: "CASE_ONLY",
  CaseCrossover: "CASE_CROSSOVER",
  EcologicOrCommunity: "ECOLOGIC_OR_COMMUNITY",
  FamilyBased: "FAMILY_BASED",
  DefinedPopulation: "DEFINED_POPULATION",
  NaturalHistory: "NATURAL_HISTORY",
  Other: "OTHER",
} as const
export type ObservationalModel =
  (typeof ObservationalModel)[keyof typeof ObservationalModel]

export function ObservationalModelFromJSON(json: any): ObservationalModel {
  return ObservationalModelFromJSONTyped(json, false)
}

export function ObservationalModelFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ObservationalModel {
  return json as ObservationalModel
}
