;
/* tslint:disable */
/* eslint-disable */

import type { SecondaryIdType } from "./SecondaryIdType";
import { SecondaryIdTypeFromJSON } from "./SecondaryIdType";


/**
 *
 * @export
 * @interface SecondaryIdInfo
 */
export interface SecondaryIdInfo {
  /**
   *
   * @type {string}
   * @memberof SecondaryIdInfo
   */
  id?: string
  /**
   *
   * @type {SecondaryIdType}
   * @memberof SecondaryIdInfo
   */
  type?: SecondaryIdType
  /**
   *
   * @type {string}
   * @memberof SecondaryIdInfo
   */
  domain?: string
  /**
   *
   * @type {string}
   * @memberof SecondaryIdInfo
   */
  link?: string
}

export function SecondaryIdInfoFromJSON(json: any): SecondaryIdInfo {
  return SecondaryIdInfoFromJSONTyped(json, false)
}

export function SecondaryIdInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SecondaryIdInfo {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    type:
      json["type"] == null ? undefined : SecondaryIdTypeFromJSON(json["type"]),
    domain: json["domain"] == null ? undefined : json["domain"],
    link: json["link"] == null ? undefined : json["link"],
  }
}
