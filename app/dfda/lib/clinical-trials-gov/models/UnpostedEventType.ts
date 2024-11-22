/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const UnpostedEventType = {
  Reset: "RESET",
  Release: "RELEASE",
  Unrelease: "UNRELEASE",
} as const
export type UnpostedEventType =
  (typeof UnpostedEventType)[keyof typeof UnpostedEventType]

export function UnpostedEventTypeFromJSON(json: any): UnpostedEventType {
  return UnpostedEventTypeFromJSONTyped(json, false)
}

export function UnpostedEventTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): UnpostedEventType {
  return json as UnpostedEventType
}
