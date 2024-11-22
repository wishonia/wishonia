/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const BioSpecRetention = {
  NoneRetained: "NONE_RETAINED",
  SamplesWithDna: "SAMPLES_WITH_DNA",
  SamplesWithoutDna: "SAMPLES_WITHOUT_DNA",
} as const
export type BioSpecRetention =
  (typeof BioSpecRetention)[keyof typeof BioSpecRetention]

export function BioSpecRetentionFromJSON(json: any): BioSpecRetention {
  return BioSpecRetentionFromJSONTyped(json, false)
}

export function BioSpecRetentionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BioSpecRetention {
  return json as BioSpecRetention
}
