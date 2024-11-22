;
/* tslint:disable */
/* eslint-disable */

import type { EnumItem } from "./EnumItem";
import { EnumItemFromJSON } from "./EnumItem";


/**
 *
 * @export
 * @interface EnumInfo
 */
export interface EnumInfo {
  /**
   *
   * @type {Array<string>}
   * @memberof EnumInfo
   */
  pieces: Array<string>
  /**
   *
   * @type {string}
   * @memberof EnumInfo
   */
  type: string
  /**
   *
   * @type {Array<EnumItem>}
   * @memberof EnumInfo
   */
  values: Array<EnumItem>
}

export function EnumInfoFromJSON(json: any): EnumInfo {
  return EnumInfoFromJSONTyped(json, false)
}

export function EnumInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EnumInfo {
  if (json == null) {
    return json
  }
  return {
    pieces: json["pieces"],
    type: json["type"],
    values: (json["values"] as Array<any>).map(EnumItemFromJSON),
  }
}
