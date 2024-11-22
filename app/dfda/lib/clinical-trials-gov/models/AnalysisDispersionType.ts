/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const AnalysisDispersionType = {
  Deviation: "STANDARD_DEVIATION",
  ErrorOfMean: "STANDARD_ERROR_OF_MEAN",
} as const
export type AnalysisDispersionType =
  (typeof AnalysisDispersionType)[keyof typeof AnalysisDispersionType]

export function AnalysisDispersionTypeFromJSON(
  json: any
): AnalysisDispersionType {
  return AnalysisDispersionTypeFromJSONTyped(json, false)
}

export function AnalysisDispersionTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AnalysisDispersionType {
  return json as AnalysisDispersionType
}
