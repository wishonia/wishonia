/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const ReferenceType = {
  Background: "BACKGROUND",
  Result: "RESULT",
  Derived: "DERIVED",
} as const
export type ReferenceType = (typeof ReferenceType)[keyof typeof ReferenceType]

export function ReferenceTypeFromJSON(json: any): ReferenceType {
  return ReferenceTypeFromJSONTyped(json, false)
}

export function ReferenceTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ReferenceType {
  return json as ReferenceType
}
