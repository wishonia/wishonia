/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface Measurement
 */
export interface Measurement {
  /**
   *
   * @type {string}
   * @memberof Measurement
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof Measurement
   */
  value?: string
  /**
   *
   * @type {string}
   * @memberof Measurement
   */
  spread?: string
  /**
   *
   * @type {string}
   * @memberof Measurement
   */
  lowerLimit?: string
  /**
   *
   * @type {string}
   * @memberof Measurement
   */
  upperLimit?: string
  /**
   *
   * @type {string}
   * @memberof Measurement
   */
  comment?: string
}

export function MeasurementFromJSON(json: any): Measurement {
  return MeasurementFromJSONTyped(json, false)
}

export function MeasurementFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Measurement {
  if (json == null) {
    return json
  }
  return {
    groupId: json["groupId"] == null ? undefined : json["groupId"],
    value: json["value"] == null ? undefined : json["value"],
    spread: json["spread"] == null ? undefined : json["spread"],
    lowerLimit: json["lowerLimit"] == null ? undefined : json["lowerLimit"],
    upperLimit: json["upperLimit"] == null ? undefined : json["upperLimit"],
    comment: json["comment"] == null ? undefined : json["comment"],
  }
}
