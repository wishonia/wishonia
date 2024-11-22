;
/* tslint:disable */
/* eslint-disable */

import type { UnpostedAnnotation } from "./UnpostedAnnotation";
import { UnpostedAnnotationFromJSON } from "./UnpostedAnnotation";
import type { ViolationAnnotation } from "./ViolationAnnotation";
import { ViolationAnnotationFromJSON } from "./ViolationAnnotation";


/**
 *
 * @export
 * @interface AnnotationModule
 */
export interface AnnotationModule {
  /**
   *
   * @type {UnpostedAnnotation}
   * @memberof AnnotationModule
   */
  unpostedAnnotation?: UnpostedAnnotation
  /**
   *
   * @type {ViolationAnnotation}
   * @memberof AnnotationModule
   */
  violationAnnotation?: ViolationAnnotation
}

export function AnnotationModuleFromJSON(json: any): AnnotationModule {
  return AnnotationModuleFromJSONTyped(json, false)
}

export function AnnotationModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AnnotationModule {
  if (json == null) {
    return json
  }
  return {
    unpostedAnnotation:
      json["unpostedAnnotation"] == null
        ? undefined
        : UnpostedAnnotationFromJSON(json["unpostedAnnotation"]),
    violationAnnotation:
      json["violationAnnotation"] == null
        ? undefined
        : ViolationAnnotationFromJSON(json["violationAnnotation"]),
  }
}
