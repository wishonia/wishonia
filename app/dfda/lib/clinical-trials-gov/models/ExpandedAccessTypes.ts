/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface ExpandedAccessTypes
 */
export interface ExpandedAccessTypes {
  /**
   *
   * @type {boolean}
   * @memberof ExpandedAccessTypes
   */
  individual?: boolean
  /**
   *
   * @type {boolean}
   * @memberof ExpandedAccessTypes
   */
  intermediate?: boolean
  /**
   *
   * @type {boolean}
   * @memberof ExpandedAccessTypes
   */
  treatment?: boolean
}

export function ExpandedAccessTypesFromJSON(json: any): ExpandedAccessTypes {
  return ExpandedAccessTypesFromJSONTyped(json, false)
}

export function ExpandedAccessTypesFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ExpandedAccessTypes {
  if (json == null) {
    return json
  }
  return {
    individual: json["individual"] == null ? undefined : json["individual"],
    intermediate:
      json["intermediate"] == null ? undefined : json["intermediate"],
    treatment: json["treatment"] == null ? undefined : json["treatment"],
  }
}
