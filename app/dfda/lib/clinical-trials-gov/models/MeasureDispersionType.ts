/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const MeasureDispersionType = {
  Na: "NA",
  StandardDeviation: "STANDARD_DEVIATION",
  StandardError: "STANDARD_ERROR",
  InterQuartileRange: "INTER_QUARTILE_RANGE",
  FullRange: "FULL_RANGE",
  Confidence80: "CONFIDENCE_80",
  Confidence90: "CONFIDENCE_90",
  Confidence95: "CONFIDENCE_95",
  Confidence975: "CONFIDENCE_975",
  Confidence99: "CONFIDENCE_99",
  ConfidenceOther: "CONFIDENCE_OTHER",
  GeometricCoefficient: "GEOMETRIC_COEFFICIENT",
} as const
export type MeasureDispersionType =
  (typeof MeasureDispersionType)[keyof typeof MeasureDispersionType]

export function MeasureDispersionTypeFromJSON(
  json: any
): MeasureDispersionType {
  return MeasureDispersionTypeFromJSONTyped(json, false)
}

export function MeasureDispersionTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MeasureDispersionType {
  return json as MeasureDispersionType
}
