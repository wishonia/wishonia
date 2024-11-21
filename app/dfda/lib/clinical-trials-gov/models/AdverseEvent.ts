;
/* tslint:disable */
/* eslint-disable */

import type { EventAssessment } from "./EventAssessment";
import { EventAssessmentFromJSON } from "./EventAssessment";
import type { EventStats } from "./EventStats";
import { EventStatsFromJSON } from "./EventStats";


/**
 *
 * @export
 * @interface AdverseEvent
 */
export interface AdverseEvent {
  /**
   *
   * @type {string}
   * @memberof AdverseEvent
   */
  term?: string
  /**
   *
   * @type {string}
   * @memberof AdverseEvent
   */
  organSystem?: string
  /**
   *
   * @type {string}
   * @memberof AdverseEvent
   */
  sourceVocabulary?: string
  /**
   *
   * @type {EventAssessment}
   * @memberof AdverseEvent
   */
  assessmentType?: EventAssessment
  /**
   *
   * @type {string}
   * @memberof AdverseEvent
   */
  notes?: string
  /**
   *
   * @type {Array<EventStats>}
   * @memberof AdverseEvent
   */
  stats?: Array<EventStats>
}

export function AdverseEventFromJSON(json: any): AdverseEvent {
  return AdverseEventFromJSONTyped(json, false)
}

export function AdverseEventFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AdverseEvent {
  if (json == null) {
    return json
  }
  return {
    term: json["term"] == null ? undefined : json["term"],
    organSystem: json["organSystem"] == null ? undefined : json["organSystem"],
    sourceVocabulary:
      json["sourceVocabulary"] == null ? undefined : json["sourceVocabulary"],
    assessmentType:
      json["assessmentType"] == null
        ? undefined
        : EventAssessmentFromJSON(json["assessmentType"]),
    notes: json["notes"] == null ? undefined : json["notes"],
    stats:
      json["stats"] == null
        ? undefined
        : (json["stats"] as Array<any>).map(EventStatsFromJSON),
  }
}
