/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface DenomCount
 */
export interface DenomCount {
  /**
   *
   * @type {string}
   * @memberof DenomCount
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof DenomCount
   */
  value?: string
}

export function DenomCountFromJSON(json: any): DenomCount {
  return DenomCountFromJSONTyped(json, false)
}

export function DenomCountFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DenomCount {
  if (json == null) {
    return json
  }
  return {
    groupId: json["groupId"] == null ? undefined : json["groupId"],
    value: json["value"] == null ? undefined : json["value"],
  }
}
