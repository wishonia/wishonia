/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface MeasureGroup
 */
export interface MeasureGroup {
  /**
   *
   * @type {string}
   * @memberof MeasureGroup
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof MeasureGroup
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof MeasureGroup
   */
  description?: string
}

export function MeasureGroupFromJSON(json: any): MeasureGroup {
  return MeasureGroupFromJSONTyped(json, false)
}

export function MeasureGroupFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MeasureGroup {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    title: json["title"] == null ? undefined : json["title"],
    description: json["description"] == null ? undefined : json["description"],
  }
}
