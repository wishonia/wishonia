;
/* tslint:disable */
/* eslint-disable */

import type { ExpandedAccessStatus } from "./ExpandedAccessStatus";
import { ExpandedAccessStatusFromJSON } from "./ExpandedAccessStatus";


/**
 *
 * @export
 * @interface ExpandedAccessInfo
 */
export interface ExpandedAccessInfo {
  /**
   *
   * @type {boolean}
   * @memberof ExpandedAccessInfo
   */
  hasExpandedAccess?: boolean
  /**
   *
   * @type {string}
   * @memberof ExpandedAccessInfo
   */
  nctId?: string
  /**
   *
   * @type {ExpandedAccessStatus}
   * @memberof ExpandedAccessInfo
   */
  statusForNctId?: ExpandedAccessStatus
}

export function ExpandedAccessInfoFromJSON(json: any): ExpandedAccessInfo {
  return ExpandedAccessInfoFromJSONTyped(json, false)
}

export function ExpandedAccessInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ExpandedAccessInfo {
  if (json == null) {
    return json
  }
  return {
    hasExpandedAccess:
      json["hasExpandedAccess"] == null ? undefined : json["hasExpandedAccess"],
    nctId: json["nctId"] == null ? undefined : json["nctId"],
    statusForNctId:
      json["statusForNctId"] == null
        ? undefined
        : ExpandedAccessStatusFromJSON(json["statusForNctId"]),
  }
}
