/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const MeasureParam = {
  GeometricMean: "GEOMETRIC_MEAN",
  GeometricLeastSquaresMean: "GEOMETRIC_LEAST_SQUARES_MEAN",
  LeastSquaresMean: "LEAST_SQUARES_MEAN",
  LogMean: "LOG_MEAN",
  Mean: "MEAN",
  Median: "MEDIAN",
  Number: "NUMBER",
  CountOfParticipants: "COUNT_OF_PARTICIPANTS",
  CountOfUnits: "COUNT_OF_UNITS",
} as const
export type MeasureParam = (typeof MeasureParam)[keyof typeof MeasureParam]

export function MeasureParamFromJSON(json: any): MeasureParam {
  return MeasureParamFromJSONTyped(json, false)
}

export function MeasureParamFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MeasureParam {
  return json as MeasureParam
}
