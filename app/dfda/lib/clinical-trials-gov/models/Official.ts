;
/* tslint:disable */
/* eslint-disable */

import type { OfficialRole } from "./OfficialRole";
import { OfficialRoleFromJSON } from "./OfficialRole";


/**
 *
 * @export
 * @interface Official
 */
export interface Official {
  /**
   *
   * @type {string}
   * @memberof Official
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof Official
   */
  affiliation?: string
  /**
   *
   * @type {OfficialRole}
   * @memberof Official
   */
  role?: OfficialRole
}

export function OfficialFromJSON(json: any): Official {
  return OfficialFromJSONTyped(json, false)
}

export function OfficialFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Official {
  if (json == null) {
    return json
  }
  return {
    name: json["name"] == null ? undefined : json["name"],
    affiliation: json["affiliation"] == null ? undefined : json["affiliation"],
    role: json["role"] == null ? undefined : OfficialRoleFromJSON(json["role"]),
  }
}
