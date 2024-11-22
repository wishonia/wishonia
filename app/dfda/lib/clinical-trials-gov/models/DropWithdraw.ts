;
/* tslint:disable */
/* eslint-disable */

import type { FlowStats } from "./FlowStats";
import { FlowStatsFromJSON } from "./FlowStats";


/**
 *
 * @export
 * @interface DropWithdraw
 */
export interface DropWithdraw {
  /**
   *
   * @type {string}
   * @memberof DropWithdraw
   */
  type?: string
  /**
   *
   * @type {string}
   * @memberof DropWithdraw
   */
  comment?: string
  /**
   *
   * @type {Array<FlowStats>}
   * @memberof DropWithdraw
   */
  reasons?: Array<FlowStats>
}

export function DropWithdrawFromJSON(json: any): DropWithdraw {
  return DropWithdrawFromJSONTyped(json, false)
}

export function DropWithdrawFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DropWithdraw {
  if (json == null) {
    return json
  }
  return {
    type: json["type"] == null ? undefined : json["type"],
    comment: json["comment"] == null ? undefined : json["comment"],
    reasons:
      json["reasons"] == null
        ? undefined
        : (json["reasons"] as Array<any>).map(FlowStatsFromJSON),
  }
}
