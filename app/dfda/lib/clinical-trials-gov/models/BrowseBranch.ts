/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface BrowseBranch
 */
export interface BrowseBranch {
  /**
   *
   * @type {string}
   * @memberof BrowseBranch
   */
  abbrev?: string
  /**
   *
   * @type {string}
   * @memberof BrowseBranch
   */
  name?: string
}

export function BrowseBranchFromJSON(json: any): BrowseBranch {
  return BrowseBranchFromJSONTyped(json, false)
}

export function BrowseBranchFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BrowseBranch {
  if (json == null) {
    return json
  }
  return {
    abbrev: json["abbrev"] == null ? undefined : json["abbrev"],
    name: json["name"] == null ? undefined : json["name"],
  }
}
