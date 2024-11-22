;
/* tslint:disable */
/* eslint-disable */

import type { DateStruct } from "./DateStruct";
import { DateStructFromJSON } from "./DateStruct";
import type { ExpandedAccessInfo } from "./ExpandedAccessInfo";
import { ExpandedAccessInfoFromJSON } from "./ExpandedAccessInfo";
import type { PartialDateStruct } from "./PartialDateStruct";
import { PartialDateStructFromJSON } from "./PartialDateStruct";
import type { Status } from "./Status";
import { StatusFromJSON } from "./Status";


/**
 *
 * @export
 * @interface StatusModule
 */
export interface StatusModule {
  /**
   * Date in `yyyy`, `yyyy-MM`, or `yyyy-MM-dd` format
   * @type {string}
   * @memberof StatusModule
   */
  statusVerifiedDate?: string
  /**
   *
   * @type {Status}
   * @memberof StatusModule
   */
  overallStatus?: Status
  /**
   *
   * @type {Status}
   * @memberof StatusModule
   */
  lastKnownStatus?: Status
  /**
   *
   * @type {boolean}
   * @memberof StatusModule
   */
  delayedPosting?: boolean
  /**
   *
   * @type {string}
   * @memberof StatusModule
   */
  whyStopped?: string
  /**
   *
   * @type {ExpandedAccessInfo}
   * @memberof StatusModule
   */
  expandedAccessInfo?: ExpandedAccessInfo
  /**
   *
   * @type {PartialDateStruct}
   * @memberof StatusModule
   */
  startDateStruct?: PartialDateStruct
  /**
   *
   * @type {PartialDateStruct}
   * @memberof StatusModule
   */
  primaryCompletionDateStruct?: PartialDateStruct
  /**
   *
   * @type {PartialDateStruct}
   * @memberof StatusModule
   */
  completionDateStruct?: PartialDateStruct
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  studyFirstSubmitDate?: Date
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  studyFirstSubmitQcDate?: Date
  /**
   *
   * @type {DateStruct}
   * @memberof StatusModule
   */
  studyFirstPostDateStruct?: DateStruct
  /**
   *
   * @type {boolean}
   * @memberof StatusModule
   */
  resultsWaived?: boolean
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  resultsFirstSubmitDate?: Date
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  resultsFirstSubmitQcDate?: Date
  /**
   *
   * @type {DateStruct}
   * @memberof StatusModule
   */
  resultsFirstPostDateStruct?: DateStruct
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  dispFirstSubmitDate?: Date
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  dispFirstSubmitQcDate?: Date
  /**
   *
   * @type {DateStruct}
   * @memberof StatusModule
   */
  dispFirstPostDateStruct?: DateStruct
  /**
   *
   * @type {Date}
   * @memberof StatusModule
   */
  lastUpdateSubmitDate?: Date
  /**
   *
   * @type {DateStruct}
   * @memberof StatusModule
   */
  lastUpdatePostDateStruct?: DateStruct
}

export function StatusModuleFromJSON(json: any): StatusModule {
  return StatusModuleFromJSONTyped(json, false)
}

export function StatusModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): StatusModule {
  if (json == null) {
    return json
  }
  return {
    statusVerifiedDate:
      json["statusVerifiedDate"] == null
        ? undefined
        : json["statusVerifiedDate"],
    overallStatus:
      json["overallStatus"] == null
        ? undefined
        : StatusFromJSON(json["overallStatus"]),
    lastKnownStatus:
      json["lastKnownStatus"] == null
        ? undefined
        : StatusFromJSON(json["lastKnownStatus"]),
    delayedPosting:
      json["delayedPosting"] == null ? undefined : json["delayedPosting"],
    whyStopped: json["whyStopped"] == null ? undefined : json["whyStopped"],
    expandedAccessInfo:
      json["expandedAccessInfo"] == null
        ? undefined
        : ExpandedAccessInfoFromJSON(json["expandedAccessInfo"]),
    startDateStruct:
      json["startDateStruct"] == null
        ? undefined
        : PartialDateStructFromJSON(json["startDateStruct"]),
    primaryCompletionDateStruct:
      json["primaryCompletionDateStruct"] == null
        ? undefined
        : PartialDateStructFromJSON(json["primaryCompletionDateStruct"]),
    completionDateStruct:
      json["completionDateStruct"] == null
        ? undefined
        : PartialDateStructFromJSON(json["completionDateStruct"]),
    studyFirstSubmitDate:
      json["studyFirstSubmitDate"] == null
        ? undefined
        : new Date(json["studyFirstSubmitDate"]),
    studyFirstSubmitQcDate:
      json["studyFirstSubmitQcDate"] == null
        ? undefined
        : new Date(json["studyFirstSubmitQcDate"]),
    studyFirstPostDateStruct:
      json["studyFirstPostDateStruct"] == null
        ? undefined
        : DateStructFromJSON(json["studyFirstPostDateStruct"]),
    resultsWaived:
      json["resultsWaived"] == null ? undefined : json["resultsWaived"],
    resultsFirstSubmitDate:
      json["resultsFirstSubmitDate"] == null
        ? undefined
        : new Date(json["resultsFirstSubmitDate"]),
    resultsFirstSubmitQcDate:
      json["resultsFirstSubmitQcDate"] == null
        ? undefined
        : new Date(json["resultsFirstSubmitQcDate"]),
    resultsFirstPostDateStruct:
      json["resultsFirstPostDateStruct"] == null
        ? undefined
        : DateStructFromJSON(json["resultsFirstPostDateStruct"]),
    dispFirstSubmitDate:
      json["dispFirstSubmitDate"] == null
        ? undefined
        : new Date(json["dispFirstSubmitDate"]),
    dispFirstSubmitQcDate:
      json["dispFirstSubmitQcDate"] == null
        ? undefined
        : new Date(json["dispFirstSubmitQcDate"]),
    dispFirstPostDateStruct:
      json["dispFirstPostDateStruct"] == null
        ? undefined
        : DateStructFromJSON(json["dispFirstPostDateStruct"]),
    lastUpdateSubmitDate:
      json["lastUpdateSubmitDate"] == null
        ? undefined
        : new Date(json["lastUpdateSubmitDate"]),
    lastUpdatePostDateStruct:
      json["lastUpdatePostDateStruct"] == null
        ? undefined
        : DateStructFromJSON(json["lastUpdatePostDateStruct"]),
  }
}
