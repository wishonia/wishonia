;
/* tslint:disable */
/* eslint-disable */

import type { AdverseEvent } from "./AdverseEvent";
import { AdverseEventFromJSON } from "./AdverseEvent";
import type { EventGroup } from "./EventGroup";
import { EventGroupFromJSON } from "./EventGroup";


/**
 *
 * @export
 * @interface AdverseEventsModule
 */
export interface AdverseEventsModule {
  /**
   *
   * @type {string}
   * @memberof AdverseEventsModule
   */
  frequencyThreshold?: string
  /**
   *
   * @type {string}
   * @memberof AdverseEventsModule
   */
  timeFrame?: string
  /**
   *
   * @type {string}
   * @memberof AdverseEventsModule
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof AdverseEventsModule
   */
  allCauseMortalityComment?: string
  /**
   *
   * @type {Array<EventGroup>}
   * @memberof AdverseEventsModule
   */
  eventGroups?: Array<EventGroup>
  /**
   *
   * @type {Array<AdverseEvent>}
   * @memberof AdverseEventsModule
   */
  seriousEvents?: Array<AdverseEvent>
  /**
   *
   * @type {Array<AdverseEvent>}
   * @memberof AdverseEventsModule
   */
  otherEvents?: Array<AdverseEvent>
}

export function AdverseEventsModuleFromJSON(json: any): AdverseEventsModule {
  return AdverseEventsModuleFromJSONTyped(json, false)
}

export function AdverseEventsModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AdverseEventsModule {
  if (json == null) {
    return json
  }
  return {
    frequencyThreshold:
      json["frequencyThreshold"] == null
        ? undefined
        : json["frequencyThreshold"],
    timeFrame: json["timeFrame"] == null ? undefined : json["timeFrame"],
    description: json["description"] == null ? undefined : json["description"],
    allCauseMortalityComment:
      json["allCauseMortalityComment"] == null
        ? undefined
        : json["allCauseMortalityComment"],
    eventGroups:
      json["eventGroups"] == null
        ? undefined
        : (json["eventGroups"] as Array<any>).map(EventGroupFromJSON),
    seriousEvents:
      json["seriousEvents"] == null
        ? undefined
        : (json["seriousEvents"] as Array<any>).map(AdverseEventFromJSON),
    otherEvents:
      json["otherEvents"] == null
        ? undefined
        : (json["otherEvents"] as Array<any>).map(AdverseEventFromJSON),
  }
}
