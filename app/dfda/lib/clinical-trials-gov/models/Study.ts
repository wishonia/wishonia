;
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSection } from "./AnnotationSection";
import { AnnotationSectionFromJSON } from "./AnnotationSection";
import type { DerivedSection } from "./DerivedSection";
import { DerivedSectionFromJSON } from "./DerivedSection";
import type { DocumentSection } from "./DocumentSection";
import { DocumentSectionFromJSON } from "./DocumentSection";
import type { ProtocolSection } from "./ProtocolSection";
import { ProtocolSectionFromJSON } from "./ProtocolSection";
import type { ResultsSection } from "./ResultsSection";
import { ResultsSectionFromJSON } from "./ResultsSection";


/**
 *
 * @export
 * @interface Study
 */
export interface Study {
  /**
   *
   * @type {ProtocolSection}
   * @memberof Study
   */
  protocolSection?: ProtocolSection
  /**
   *
   * @type {ResultsSection}
   * @memberof Study
   */
  resultsSection?: ResultsSection
  /**
   *
   * @type {AnnotationSection}
   * @memberof Study
   */
  annotationSection?: AnnotationSection
  /**
   *
   * @type {DocumentSection}
   * @memberof Study
   */
  documentSection?: DocumentSection
  /**
   *
   * @type {DerivedSection}
   * @memberof Study
   */
  derivedSection?: DerivedSection
  /**
   *
   * @type {boolean}
   * @memberof Study
   */
  hasResults?: boolean
}

export function StudyFromJSON(json: any): Study {
  return StudyFromJSONTyped(json, false)
}

export function StudyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Study {
  if (json == null) {
    return json
  }
  return {
    protocolSection:
      json["protocolSection"] == null
        ? undefined
        : ProtocolSectionFromJSON(json["protocolSection"]),
    resultsSection:
      json["resultsSection"] == null
        ? undefined
        : ResultsSectionFromJSON(json["resultsSection"]),
    annotationSection:
      json["annotationSection"] == null
        ? undefined
        : AnnotationSectionFromJSON(json["annotationSection"]),
    documentSection:
      json["documentSection"] == null
        ? undefined
        : DocumentSectionFromJSON(json["documentSection"]),
    derivedSection:
      json["derivedSection"] == null
        ? undefined
        : DerivedSectionFromJSON(json["derivedSection"]),
    hasResults: json["hasResults"] == null ? undefined : json["hasResults"],
  }
}
