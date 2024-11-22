/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const BrowseLeafRelevance = {
  Low: "LOW",
  High: "HIGH",
} as const
export type BrowseLeafRelevance =
  (typeof BrowseLeafRelevance)[keyof typeof BrowseLeafRelevance]

export function BrowseLeafRelevanceFromJSON(json: any): BrowseLeafRelevance {
  return BrowseLeafRelevanceFromJSONTyped(json, false)
}

export function BrowseLeafRelevanceFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BrowseLeafRelevance {
  return json as BrowseLeafRelevance
}
