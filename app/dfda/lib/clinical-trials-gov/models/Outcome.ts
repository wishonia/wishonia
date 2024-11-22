/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface Outcome
 */
export interface Outcome {
  /**
   *
   * @type {string}
   * @memberof Outcome
   */
  measure?: string
  /**
   *
   * @type {string}
   * @memberof Outcome
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof Outcome
   */
  timeFrame?: string
}

export function OutcomeFromJSON(json: any): Outcome {
  return OutcomeFromJSONTyped(json, false)
}

export function OutcomeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Outcome {
  if (json == null) {
    return json
  }
  return {
    measure: json["measure"] == null ? undefined : json["measure"],
    description: json["description"] == null ? undefined : json["description"],
    timeFrame: json["timeFrame"] == null ? undefined : json["timeFrame"],
  }
}
