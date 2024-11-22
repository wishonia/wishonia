;
/* tslint:disable */
/* eslint-disable */

import type { ViolationEventType } from "./ViolationEventType";
import { ViolationEventTypeFromJSON } from "./ViolationEventType";


/**
 *
 * @export
 * @interface ViolationEvent
 */
export interface ViolationEvent {
  /**
   *
   * @type {ViolationEventType}
   * @memberof ViolationEvent
   */
  type?: ViolationEventType
  /**
   *
   * @type {string}
   * @memberof ViolationEvent
   */
  description?: string
  /**
   *
   * @type {Date}
   * @memberof ViolationEvent
   */
  creationDate?: Date
  /**
   *
   * @type {Date}
   * @memberof ViolationEvent
   */
  issuedDate?: Date
  /**
   *
   * @type {Date}
   * @memberof ViolationEvent
   */
  releaseDate?: Date
  /**
   *
   * @type {Date}
   * @memberof ViolationEvent
   */
  postedDate?: Date
}

export function ViolationEventFromJSON(json: any): ViolationEvent {
  return ViolationEventFromJSONTyped(json, false)
}

export function ViolationEventFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ViolationEvent {
  if (json == null) {
    return json
  }
  return {
    type:
      json["type"] == null
        ? undefined
        : ViolationEventTypeFromJSON(json["type"]),
    description: json["description"] == null ? undefined : json["description"],
    creationDate:
      json["creationDate"] == null ? undefined : new Date(json["creationDate"]),
    issuedDate:
      json["issuedDate"] == null ? undefined : new Date(json["issuedDate"]),
    releaseDate:
      json["releaseDate"] == null ? undefined : new Date(json["releaseDate"]),
    postedDate:
      json["postedDate"] == null ? undefined : new Date(json["postedDate"]),
  }
}
