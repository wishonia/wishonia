;
/* tslint:disable */
/* eslint-disable */

import type { DateType } from "./DateType";
import { DateTypeFromJSON } from "./DateType";


/**
 *
 * @export
 * @interface PartialDateStruct
 */
export interface PartialDateStruct {
  /**
   * Date in `yyyy`, `yyyy-MM`, or `yyyy-MM-dd` format
   * @type {string}
   * @memberof PartialDateStruct
   */
  date?: string
  /**
   *
   * @type {DateType}
   * @memberof PartialDateStruct
   */
  type?: DateType
}

export function PartialDateStructFromJSON(json: any): PartialDateStruct {
  return PartialDateStructFromJSONTyped(json, false)
}

export function PartialDateStructFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PartialDateStruct {
  if (json == null) {
    return json
  }
  return {
    date: json["date"] == null ? undefined : json["date"],
    type: json["type"] == null ? undefined : DateTypeFromJSON(json["type"]),
  }
}
