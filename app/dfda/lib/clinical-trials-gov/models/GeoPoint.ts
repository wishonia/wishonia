/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface GeoPoint
 */
export interface GeoPoint {
  /**
   *
   * @type {number}
   * @memberof GeoPoint
   */
  lat: number
  /**
   *
   * @type {number}
   * @memberof GeoPoint
   */
  lon: number
}

export function GeoPointFromJSON(json: any): GeoPoint {
  return GeoPointFromJSONTyped(json, false)
}

export function GeoPointFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): GeoPoint {
  if (json == null) {
    return json
  }
  return {
    lat: json["lat"],
    lon: json["lon"],
  }
}
