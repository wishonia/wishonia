;
/* tslint:disable */
/* eslint-disable */

import type { FlowStats } from "./FlowStats";
import { FlowStatsFromJSON } from "./FlowStats";


/**
 *
 * @export
 * @interface FlowMilestone
 */
export interface FlowMilestone {
  /**
   *
   * @type {string}
   * @memberof FlowMilestone
   */
  type?: string
  /**
   *
   * @type {string}
   * @memberof FlowMilestone
   */
  comment?: string
  /**
   *
   * @type {Array<FlowStats>}
   * @memberof FlowMilestone
   */
  achievements?: Array<FlowStats>
}

export function FlowMilestoneFromJSON(json: any): FlowMilestone {
  return FlowMilestoneFromJSONTyped(json, false)
}

export function FlowMilestoneFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): FlowMilestone {
  if (json == null) {
    return json
  }
  return {
    type: json["type"] == null ? undefined : json["type"],
    comment: json["comment"] == null ? undefined : json["comment"],
    achievements:
      json["achievements"] == null
        ? undefined
        : (json["achievements"] as Array<any>).map(FlowStatsFromJSON),
  }
}
