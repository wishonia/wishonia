;
/* tslint:disable */
/* eslint-disable */

import type { DropWithdraw } from "./DropWithdraw";
import { DropWithdrawFromJSON } from "./DropWithdraw";
import type { FlowMilestone } from "./FlowMilestone";
import { FlowMilestoneFromJSON } from "./FlowMilestone";


/**
 *
 * @export
 * @interface FlowPeriod
 */
export interface FlowPeriod {
  /**
   *
   * @type {string}
   * @memberof FlowPeriod
   */
  title?: string
  /**
   *
   * @type {Array<FlowMilestone>}
   * @memberof FlowPeriod
   */
  milestones?: Array<FlowMilestone>
  /**
   *
   * @type {Array<DropWithdraw>}
   * @memberof FlowPeriod
   */
  dropWithdraws?: Array<DropWithdraw>
}

export function FlowPeriodFromJSON(json: any): FlowPeriod {
  return FlowPeriodFromJSONTyped(json, false)
}

export function FlowPeriodFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): FlowPeriod {
  if (json == null) {
    return json
  }
  return {
    title: json["title"] == null ? undefined : json["title"],
    milestones:
      json["milestones"] == null
        ? undefined
        : (json["milestones"] as Array<any>).map(FlowMilestoneFromJSON),
    dropWithdraws:
      json["dropWithdraws"] == null
        ? undefined
        : (json["dropWithdraws"] as Array<any>).map(DropWithdrawFromJSON),
  }
}
