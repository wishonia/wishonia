;
/* tslint:disable */
/* eslint-disable */

import type { FirstMcpInfo } from "./FirstMcpInfo";
import { FirstMcpInfoFromJSON } from "./FirstMcpInfo";
import type { SubmissionInfo } from "./SubmissionInfo";
import { SubmissionInfoFromJSON } from "./SubmissionInfo";


/**
 *
 * @export
 * @interface SubmissionTracking
 */
export interface SubmissionTracking {
  /**
   *
   * @type {Date}
   * @memberof SubmissionTracking
   */
  estimatedResultsFirstSubmitDate?: Date
  /**
   *
   * @type {FirstMcpInfo}
   * @memberof SubmissionTracking
   */
  firstMcpInfo?: FirstMcpInfo
  /**
   *
   * @type {Array<SubmissionInfo>}
   * @memberof SubmissionTracking
   */
  submissionInfos?: Array<SubmissionInfo>
}

export function SubmissionTrackingFromJSON(json: any): SubmissionTracking {
  return SubmissionTrackingFromJSONTyped(json, false)
}

export function SubmissionTrackingFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SubmissionTracking {
  if (json == null) {
    return json
  }
  return {
    estimatedResultsFirstSubmitDate:
      json["estimatedResultsFirstSubmitDate"] == null
        ? undefined
        : new Date(json["estimatedResultsFirstSubmitDate"]),
    firstMcpInfo:
      json["firstMcpInfo"] == null
        ? undefined
        : FirstMcpInfoFromJSON(json["firstMcpInfo"]),
    submissionInfos:
      json["submissionInfos"] == null
        ? undefined
        : (json["submissionInfos"] as Array<any>).map(SubmissionInfoFromJSON),
  }
}
