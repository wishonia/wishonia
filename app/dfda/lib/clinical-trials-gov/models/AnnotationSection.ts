;
/* tslint:disable */
/* eslint-disable */

import type { AnnotationModule } from "./AnnotationModule";
import { AnnotationModuleFromJSON } from "./AnnotationModule";


/**
 *
 * @export
 * @interface AnnotationSection
 */
export interface AnnotationSection {
  /**
   *
   * @type {AnnotationModule}
   * @memberof AnnotationSection
   */
  annotationModule?: AnnotationModule
}

export function AnnotationSectionFromJSON(json: any): AnnotationSection {
  return AnnotationSectionFromJSONTyped(json, false)
}

export function AnnotationSectionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AnnotationSection {
  if (json == null) {
    return json
  }
  return {
    annotationModule:
      json["annotationModule"] == null
        ? undefined
        : AnnotationModuleFromJSON(json["annotationModule"]),
  }
}
