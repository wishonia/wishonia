/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const SamplingMethod = {
  ProbabilitySample: "PROBABILITY_SAMPLE",
  NonProbabilitySample: "NON_PROBABILITY_SAMPLE",
} as const
export type SamplingMethod =
  (typeof SamplingMethod)[keyof typeof SamplingMethod]

export function SamplingMethodFromJSON(json: any): SamplingMethod {
  return SamplingMethodFromJSONTyped(json, false)
}

export function SamplingMethodFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SamplingMethod {
  return json as SamplingMethod
}
