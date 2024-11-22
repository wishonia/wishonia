;
/* tslint:disable */
/* eslint-disable */

import type { OrgStudyIdType } from "./OrgStudyIdType";
import { OrgStudyIdTypeFromJSON } from "./OrgStudyIdType";


/**
 *
 * @export
 * @interface OrgStudyIdInfo
 */
export interface OrgStudyIdInfo {
  /**
   *
   * @type {string}
   * @memberof OrgStudyIdInfo
   */
  id?: string
  /**
   *
   * @type {OrgStudyIdType}
   * @memberof OrgStudyIdInfo
   */
  type?: OrgStudyIdType
  /**
   *
   * @type {string}
   * @memberof OrgStudyIdInfo
   */
  link?: string
}

export function OrgStudyIdInfoFromJSON(json: any): OrgStudyIdInfo {
  return OrgStudyIdInfoFromJSONTyped(json, false)
}

export function OrgStudyIdInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OrgStudyIdInfo {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    type:
      json["type"] == null ? undefined : OrgStudyIdTypeFromJSON(json["type"]),
    link: json["link"] == null ? undefined : json["link"],
  }
}
