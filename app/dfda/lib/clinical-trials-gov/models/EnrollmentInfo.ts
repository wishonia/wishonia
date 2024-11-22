;
/* tslint:disable */
/* eslint-disable */

import type { EnrollmentType } from "./EnrollmentType";
import { EnrollmentTypeFromJSON } from "./EnrollmentType";


/**
 *
 * @export
 * @interface EnrollmentInfo
 */
export interface EnrollmentInfo {
  /**
   *
   * @type {number}
   * @memberof EnrollmentInfo
   */
  count?: number
  /**
   *
   * @type {EnrollmentType}
   * @memberof EnrollmentInfo
   */
  type?: EnrollmentType
}

export function EnrollmentInfoFromJSON(json: any): EnrollmentInfo {
  return EnrollmentInfoFromJSONTyped(json, false)
}

export function EnrollmentInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EnrollmentInfo {
  if (json == null) {
    return json
  }
  return {
    count: json["count"] == null ? undefined : json["count"],
    type:
      json["type"] == null ? undefined : EnrollmentTypeFromJSON(json["type"]),
  }
}
