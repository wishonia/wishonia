/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const Sex = {
  Female: "FEMALE",
  Male: "MALE",
  All: "ALL",
} as const
export type Sex = (typeof Sex)[keyof typeof Sex]

export function SexFromJSON(json: any): Sex {
  return SexFromJSONTyped(json, false)
}

export function SexFromJSONTyped(json: any, ignoreDiscriminator: boolean): Sex {
  return json as Sex
}
