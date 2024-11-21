;
/* tslint:disable */
/* eslint-disable */

import type { LargeDocumentModule } from "./LargeDocumentModule";
import { LargeDocumentModuleFromJSON } from "./LargeDocumentModule";


/**
 *
 * @export
 * @interface DocumentSection
 */
export interface DocumentSection {
  /**
   *
   * @type {LargeDocumentModule}
   * @memberof DocumentSection
   */
  largeDocumentModule?: LargeDocumentModule
}

export function DocumentSectionFromJSON(json: any): DocumentSection {
  return DocumentSectionFromJSONTyped(json, false)
}

export function DocumentSectionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DocumentSection {
  if (json == null) {
    return json
  }
  return {
    largeDocumentModule:
      json["largeDocumentModule"] == null
        ? undefined
        : LargeDocumentModuleFromJSON(json["largeDocumentModule"]),
  }
}
