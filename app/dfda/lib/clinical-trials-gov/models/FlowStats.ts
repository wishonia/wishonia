/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface FlowStats
 */
export interface FlowStats {
  /**
   *
   * @type {string}
   * @memberof FlowStats
   */
  groupId?: string
  /**
   *
   * @type {string}
   * @memberof FlowStats
   */
  comment?: string
  /**
   *
   * @type {string}
   * @memberof FlowStats
   */
  numSubjects?: string
  /**
   *
   * @type {string}
   * @memberof FlowStats
   */
  numUnits?: string
}

export function FlowStatsFromJSON(json: any): FlowStats {
  return FlowStatsFromJSONTyped(json, false)
}

export function FlowStatsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): FlowStats {
  if (json == null) {
    return json
  }
  return {
    groupId: json["groupId"] == null ? undefined : json["groupId"],
    comment: json["comment"] == null ? undefined : json["comment"],
    numSubjects: json["numSubjects"] == null ? undefined : json["numSubjects"],
    numUnits: json["numUnits"] == null ? undefined : json["numUnits"],
  }
}
