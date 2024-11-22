/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const StandardAge = {
  Child: "CHILD",
  Adult: "ADULT",
  OlderAdult: "OLDER_ADULT",
} as const
export type StandardAge = (typeof StandardAge)[keyof typeof StandardAge]

export function StandardAgeFromJSON(json: any): StandardAge {
  return StandardAgeFromJSONTyped(json, false)
}

export function StandardAgeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): StandardAge {
  return json as StandardAge
}
