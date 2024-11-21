/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface EnumItem
 */
export interface EnumItem {
  /**
   *
   * @type {object}
   * @memberof EnumItem
   */
  exceptions?: object
  /**
   *
   * @type {string}
   * @memberof EnumItem
   */
  legacyValue: string
  /**
   *
   * @type {string}
   * @memberof EnumItem
   */
  value: string
}

export function EnumItemFromJSON(json: any): EnumItem {
  return EnumItemFromJSONTyped(json, false)
}

export function EnumItemFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EnumItem {
  if (json == null) {
    return json
  }
  return {
    exceptions: json["exceptions"] == null ? undefined : json["exceptions"],
    legacyValue: json["legacyValue"],
    value: json["value"],
  }
}
