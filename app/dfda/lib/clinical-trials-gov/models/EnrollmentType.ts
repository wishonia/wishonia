/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const EnrollmentType = {
  Actual: "ACTUAL",
  Estimated: "ESTIMATED",
} as const
export type EnrollmentType =
  (typeof EnrollmentType)[keyof typeof EnrollmentType]

export function EnrollmentTypeFromJSON(json: any): EnrollmentType {
  return EnrollmentTypeFromJSONTyped(json, false)
}

export function EnrollmentTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EnrollmentType {
  return json as EnrollmentType
}
