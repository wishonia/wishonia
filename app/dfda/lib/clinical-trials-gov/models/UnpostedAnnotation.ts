;
/* tslint:disable */
/* eslint-disable */

import type { UnpostedEvent } from "./UnpostedEvent";
import { UnpostedEventFromJSON } from "./UnpostedEvent";


/**
 *
 * @export
 * @interface UnpostedAnnotation
 */
export interface UnpostedAnnotation {
  /**
   *
   * @type {string}
   * @memberof UnpostedAnnotation
   */
  unpostedResponsibleParty?: string
  /**
   *
   * @type {Array<UnpostedEvent>}
   * @memberof UnpostedAnnotation
   */
  unpostedEvents?: Array<UnpostedEvent>
}

export function UnpostedAnnotationFromJSON(json: any): UnpostedAnnotation {
  return UnpostedAnnotationFromJSONTyped(json, false)
}

export function UnpostedAnnotationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): UnpostedAnnotation {
  if (json == null) {
    return json
  }
  return {
    unpostedResponsibleParty:
      json["unpostedResponsibleParty"] == null
        ? undefined
        : json["unpostedResponsibleParty"],
    unpostedEvents:
      json["unpostedEvents"] == null
        ? undefined
        : (json["unpostedEvents"] as Array<any>).map(UnpostedEventFromJSON),
  }
}
