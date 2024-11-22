/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const DateType = {
  Actual: "ACTUAL",
  Estimated: "ESTIMATED",
} as const
export type DateType = (typeof DateType)[keyof typeof DateType]

export function DateTypeFromJSON(json: any): DateType {
  return DateTypeFromJSONTyped(json, false)
}

export function DateTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DateType {
  return json as DateType
}
