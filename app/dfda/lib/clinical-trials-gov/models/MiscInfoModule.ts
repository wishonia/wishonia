;
/* tslint:disable */
/* eslint-disable */

import type { SubmissionTracking } from "./SubmissionTracking";
import { SubmissionTrackingFromJSON } from "./SubmissionTracking";


/**
 *
 * @export
 * @interface MiscInfoModule
 */
export interface MiscInfoModule {
  /**
   *
   * @type {Date}
   * @memberof MiscInfoModule
   */
  versionHolder?: Date
  /**
   *
   * @type {Array<string>}
   * @memberof MiscInfoModule
   */
  removedCountries?: Array<string>
  /**
   *
   * @type {SubmissionTracking}
   * @memberof MiscInfoModule
   */
  submissionTracking?: SubmissionTracking
}

export function MiscInfoModuleFromJSON(json: any): MiscInfoModule {
  return MiscInfoModuleFromJSONTyped(json, false)
}

export function MiscInfoModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MiscInfoModule {
  if (json == null) {
    return json
  }
  return {
    versionHolder:
      json["versionHolder"] == null
        ? undefined
        : new Date(json["versionHolder"]),
    removedCountries:
      json["removedCountries"] == null ? undefined : json["removedCountries"],
    submissionTracking:
      json["submissionTracking"] == null
        ? undefined
        : SubmissionTrackingFromJSON(json["submissionTracking"]),
  }
}
