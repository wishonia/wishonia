;
/* tslint:disable */
/* eslint-disable */

import type { DateStruct } from "./DateStruct";
import { DateStructFromJSON } from "./DateStruct";


/**
 *
 * @export
 * @interface FirstMcpInfo
 */
export interface FirstMcpInfo {
  /**
   *
   * @type {DateStruct}
   * @memberof FirstMcpInfo
   */
  postDateStruct?: DateStruct
}

export function FirstMcpInfoFromJSON(json: any): FirstMcpInfo {
  return FirstMcpInfoFromJSONTyped(json, false)
}

export function FirstMcpInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): FirstMcpInfo {
  if (json == null) {
    return json
  }
  return {
    postDateStruct:
      json["postDateStruct"] == null
        ? undefined
        : DateStructFromJSON(json["postDateStruct"]),
  }
}
