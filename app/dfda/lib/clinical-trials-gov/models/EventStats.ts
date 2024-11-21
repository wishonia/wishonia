/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface EventStats
 */
export interface EventStats {
  /**
   *
   * @type {string}
   * @memberof EventStats
   */
  groupId?: string
  /**
   *
   * @type {number}
   * @memberof EventStats
   */
  numEvents?: number
  /**
   *
   * @type {number}
   * @memberof EventStats
   */
  numAffected?: number
  /**
   *
   * @type {number}
   * @memberof EventStats
   */
  numAtRisk?: number
}

export function EventStatsFromJSON(json: any): EventStats {
  return EventStatsFromJSONTyped(json, false)
}

export function EventStatsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EventStats {
  if (json == null) {
    return json
  }
  return {
    groupId: json["groupId"] == null ? undefined : json["groupId"],
    numEvents: json["numEvents"] == null ? undefined : json["numEvents"],
    numAffected: json["numAffected"] == null ? undefined : json["numAffected"],
    numAtRisk: json["numAtRisk"] == null ? undefined : json["numAtRisk"],
  }
}
