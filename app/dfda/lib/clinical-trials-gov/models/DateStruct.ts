;
/* tslint:disable */
/* eslint-disable */

import type { DateType } from "./DateType";
import { DateTypeFromJSON } from "./DateType";


/**
 *
 * @export
 * @interface DateStruct
 */
export interface DateStruct {
  /**
   *
   * @type {Date}
   * @memberof DateStruct
   */
  date?: Date
  /**
   *
   * @type {DateType}
   * @memberof DateStruct
   */
  type?: DateType
}

export function DateStructFromJSON(json: any): DateStruct {
  return DateStructFromJSONTyped(json, false)
}

export function DateStructFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DateStruct {
  if (json == null) {
    return json
  }
  return {
    date: json["date"] == null ? undefined : new Date(json["date"]),
    type: json["type"] == null ? undefined : DateTypeFromJSON(json["type"]),
  }
}
