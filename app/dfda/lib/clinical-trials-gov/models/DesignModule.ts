;
/* tslint:disable */
/* eslint-disable */

import type { BioSpec } from "./BioSpec";
import { BioSpecFromJSON } from "./BioSpec";
import type { DesignInfo } from "./DesignInfo";
import { DesignInfoFromJSON } from "./DesignInfo";
import type { EnrollmentInfo } from "./EnrollmentInfo";
import { EnrollmentInfoFromJSON } from "./EnrollmentInfo";
import type { ExpandedAccessTypes } from "./ExpandedAccessTypes";
import { ExpandedAccessTypesFromJSON } from "./ExpandedAccessTypes";
import type { Phase } from "./Phase";
import { PhaseFromJSON } from "./Phase";
import type { StudyType } from "./StudyType";
import { StudyTypeFromJSON } from "./StudyType";


/**
 *
 * @export
 * @interface DesignModule
 */
export interface DesignModule {
  /**
   *
   * @type {StudyType}
   * @memberof DesignModule
   */
  studyType?: StudyType
  /**
   *
   * @type {number}
   * @memberof DesignModule
   */
  nPtrsToThisExpAccNctId?: number
  /**
   *
   * @type {ExpandedAccessTypes}
   * @memberof DesignModule
   */
  expandedAccessTypes?: ExpandedAccessTypes
  /**
   *
   * @type {boolean}
   * @memberof DesignModule
   */
  patientRegistry?: boolean
  /**
   *
   * @type {string}
   * @memberof DesignModule
   */
  targetDuration?: string
  /**
   *
   * @type {Array<Phase>}
   * @memberof DesignModule
   */
  phases?: Array<Phase>
  /**
   *
   * @type {DesignInfo}
   * @memberof DesignModule
   */
  designInfo?: DesignInfo
  /**
   *
   * @type {BioSpec}
   * @memberof DesignModule
   */
  bioSpec?: BioSpec
  /**
   *
   * @type {EnrollmentInfo}
   * @memberof DesignModule
   */
  enrollmentInfo?: EnrollmentInfo
}

export function DesignModuleFromJSON(json: any): DesignModule {
  return DesignModuleFromJSONTyped(json, false)
}

export function DesignModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DesignModule {
  if (json == null) {
    return json
  }
  return {
    studyType:
      json["studyType"] == null
        ? undefined
        : StudyTypeFromJSON(json["studyType"]),
    nPtrsToThisExpAccNctId:
      json["nPtrsToThisExpAccNctId"] == null
        ? undefined
        : json["nPtrsToThisExpAccNctId"],
    expandedAccessTypes:
      json["expandedAccessTypes"] == null
        ? undefined
        : ExpandedAccessTypesFromJSON(json["expandedAccessTypes"]),
    patientRegistry:
      json["patientRegistry"] == null ? undefined : json["patientRegistry"],
    targetDuration:
      json["targetDuration"] == null ? undefined : json["targetDuration"],
    phases:
      json["phases"] == null
        ? undefined
        : (json["phases"] as Array<any>).map(PhaseFromJSON),
    designInfo:
      json["designInfo"] == null
        ? undefined
        : DesignInfoFromJSON(json["designInfo"]),
    bioSpec:
      json["bioSpec"] == null ? undefined : BioSpecFromJSON(json["bioSpec"]),
    enrollmentInfo:
      json["enrollmentInfo"] == null
        ? undefined
        : EnrollmentInfoFromJSON(json["enrollmentInfo"]),
  }
}
