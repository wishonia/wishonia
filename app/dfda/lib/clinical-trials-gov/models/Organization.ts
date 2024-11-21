;
/* tslint:disable */
/* eslint-disable */

import type { AgencyClass } from "./AgencyClass";
import { AgencyClassFromJSON } from "./AgencyClass";


/**
 *
 * @export
 * @interface Organization
 */
export interface Organization {
  /**
   *
   * @type {string}
   * @memberof Organization
   */
  fullName?: string
  /**
   *
   * @type {AgencyClass}
   * @memberof Organization
   */
  _class?: AgencyClass
}

export function OrganizationFromJSON(json: any): Organization {
  return OrganizationFromJSONTyped(json, false)
}

export function OrganizationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Organization {
  if (json == null) {
    return json
  }
  return {
    fullName: json["fullName"] == null ? undefined : json["fullName"],
    _class:
      json["class"] == null ? undefined : AgencyClassFromJSON(json["class"]),
  }
}
