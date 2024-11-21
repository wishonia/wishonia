/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface EventGroup
 */
export interface EventGroup {
  /**
   *
   * @type {string}
   * @memberof EventGroup
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof EventGroup
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof EventGroup
   */
  description?: string
  /**
   *
   * @type {number}
   * @memberof EventGroup
   */
  deathsNumAffected?: number
  /**
   *
   * @type {number}
   * @memberof EventGroup
   */
  deathsNumAtRisk?: number
  /**
   *
   * @type {number}
   * @memberof EventGroup
   */
  seriousNumAffected?: number
  /**
   *
   * @type {number}
   * @memberof EventGroup
   */
  seriousNumAtRisk?: number
  /**
   *
   * @type {number}
   * @memberof EventGroup
   */
  otherNumAffected?: number
  /**
   *
   * @type {number}
   * @memberof EventGroup
   */
  otherNumAtRisk?: number
}

export function EventGroupFromJSON(json: any): EventGroup {
  return EventGroupFromJSONTyped(json, false)
}

export function EventGroupFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EventGroup {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    title: json["title"] == null ? undefined : json["title"],
    description: json["description"] == null ? undefined : json["description"],
    deathsNumAffected:
      json["deathsNumAffected"] == null ? undefined : json["deathsNumAffected"],
    deathsNumAtRisk:
      json["deathsNumAtRisk"] == null ? undefined : json["deathsNumAtRisk"],
    seriousNumAffected:
      json["seriousNumAffected"] == null
        ? undefined
        : json["seriousNumAffected"],
    seriousNumAtRisk:
      json["seriousNumAtRisk"] == null ? undefined : json["seriousNumAtRisk"],
    otherNumAffected:
      json["otherNumAffected"] == null ? undefined : json["otherNumAffected"],
    otherNumAtRisk:
      json["otherNumAtRisk"] == null ? undefined : json["otherNumAtRisk"],
  }
}
