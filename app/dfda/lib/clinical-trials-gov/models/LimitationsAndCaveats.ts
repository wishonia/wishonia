/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface LimitationsAndCaveats
 */
export interface LimitationsAndCaveats {
  /**
   *
   * @type {string}
   * @memberof LimitationsAndCaveats
   */
  description?: string
}

export function LimitationsAndCaveatsFromJSON(
  json: any
): LimitationsAndCaveats {
  return LimitationsAndCaveatsFromJSONTyped(json, false)
}

export function LimitationsAndCaveatsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): LimitationsAndCaveats {
  if (json == null) {
    return json
  }
  return {
    description: json["description"] == null ? undefined : json["description"],
  }
}
