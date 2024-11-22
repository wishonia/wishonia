;
/* tslint:disable */
/* eslint-disable */

import type { UnpostedEventType } from "./UnpostedEventType";
import { UnpostedEventTypeFromJSON } from "./UnpostedEventType";


/**
 *
 * @export
 * @interface UnpostedEvent
 */
export interface UnpostedEvent {
  /**
   *
   * @type {UnpostedEventType}
   * @memberof UnpostedEvent
   */
  type?: UnpostedEventType
  /**
   *
   * @type {Date}
   * @memberof UnpostedEvent
   */
  date?: Date
  /**
   *
   * @type {boolean}
   * @memberof UnpostedEvent
   */
  dateUnknown?: boolean
}

export function UnpostedEventFromJSON(json: any): UnpostedEvent {
  return UnpostedEventFromJSONTyped(json, false)
}

export function UnpostedEventFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): UnpostedEvent {
  if (json == null) {
    return json
  }
  return {
    type:
      json["type"] == null
        ? undefined
        : UnpostedEventTypeFromJSON(json["type"]),
    date: json["date"] == null ? undefined : new Date(json["date"]),
    dateUnknown: json["dateUnknown"] == null ? undefined : json["dateUnknown"],
  }
}
