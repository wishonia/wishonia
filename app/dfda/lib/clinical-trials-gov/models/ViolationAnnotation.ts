;
/* tslint:disable */
/* eslint-disable */

import type { ViolationEvent } from "./ViolationEvent";
import { ViolationEventFromJSON } from "./ViolationEvent";


/**
 *
 * @export
 * @interface ViolationAnnotation
 */
export interface ViolationAnnotation {
  /**
   *
   * @type {Array<ViolationEvent>}
   * @memberof ViolationAnnotation
   */
  violationEvents?: Array<ViolationEvent>
}

export function ViolationAnnotationFromJSON(json: any): ViolationAnnotation {
  return ViolationAnnotationFromJSONTyped(json, false)
}

export function ViolationAnnotationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ViolationAnnotation {
  if (json == null) {
    return json
  }
  return {
    violationEvents:
      json["violationEvents"] == null
        ? undefined
        : (json["violationEvents"] as Array<any>).map(ViolationEventFromJSON),
  }
}
