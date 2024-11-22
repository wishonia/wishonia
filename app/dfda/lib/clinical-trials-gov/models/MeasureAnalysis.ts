;
/* tslint:disable */
/* eslint-disable */

import type { AnalysisDispersionType } from "./AnalysisDispersionType";
import { AnalysisDispersionTypeFromJSON } from "./AnalysisDispersionType";
import type { ConfidenceIntervalNumSides } from "./ConfidenceIntervalNumSides";
import { ConfidenceIntervalNumSidesFromJSON } from "./ConfidenceIntervalNumSides";
import type { NonInferiorityType } from "./NonInferiorityType";
import { NonInferiorityTypeFromJSON } from "./NonInferiorityType";


/**
 *
 * @export
 * @interface MeasureAnalysis
 */
export interface MeasureAnalysis {
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  paramType?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  paramValue?: string
  /**
   *
   * @type {AnalysisDispersionType}
   * @memberof MeasureAnalysis
   */
  dispersionType?: AnalysisDispersionType
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  dispersionValue?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  statisticalMethod?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  statisticalComment?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  pValue?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  pValueComment?: string
  /**
   *
   * @type {ConfidenceIntervalNumSides}
   * @memberof MeasureAnalysis
   */
  ciNumSides?: ConfidenceIntervalNumSides
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  ciPctValue?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  ciLowerLimit?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  ciUpperLimit?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  ciLowerLimitComment?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  ciUpperLimitComment?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  estimateComment?: string
  /**
   *
   * @type {boolean}
   * @memberof MeasureAnalysis
   */
  testedNonInferiority?: boolean
  /**
   *
   * @type {NonInferiorityType}
   * @memberof MeasureAnalysis
   */
  nonInferiorityType?: NonInferiorityType
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  nonInferiorityComment?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  otherAnalysisDescription?: string
  /**
   *
   * @type {string}
   * @memberof MeasureAnalysis
   */
  groupDescription?: string
  /**
   *
   * @type {Array<string>}
   * @memberof MeasureAnalysis
   */
  groupIds?: Array<string>
}

export function MeasureAnalysisFromJSON(json: any): MeasureAnalysis {
  return MeasureAnalysisFromJSONTyped(json, false)
}

export function MeasureAnalysisFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MeasureAnalysis {
  if (json == null) {
    return json
  }
  return {
    paramType: json["paramType"] == null ? undefined : json["paramType"],
    paramValue: json["paramValue"] == null ? undefined : json["paramValue"],
    dispersionType:
      json["dispersionType"] == null
        ? undefined
        : AnalysisDispersionTypeFromJSON(json["dispersionType"]),
    dispersionValue:
      json["dispersionValue"] == null ? undefined : json["dispersionValue"],
    statisticalMethod:
      json["statisticalMethod"] == null ? undefined : json["statisticalMethod"],
    statisticalComment:
      json["statisticalComment"] == null
        ? undefined
        : json["statisticalComment"],
    pValue: json["pValue"] == null ? undefined : json["pValue"],
    pValueComment:
      json["pValueComment"] == null ? undefined : json["pValueComment"],
    ciNumSides:
      json["ciNumSides"] == null
        ? undefined
        : ConfidenceIntervalNumSidesFromJSON(json["ciNumSides"]),
    ciPctValue: json["ciPctValue"] == null ? undefined : json["ciPctValue"],
    ciLowerLimit:
      json["ciLowerLimit"] == null ? undefined : json["ciLowerLimit"],
    ciUpperLimit:
      json["ciUpperLimit"] == null ? undefined : json["ciUpperLimit"],
    ciLowerLimitComment:
      json["ciLowerLimitComment"] == null
        ? undefined
        : json["ciLowerLimitComment"],
    ciUpperLimitComment:
      json["ciUpperLimitComment"] == null
        ? undefined
        : json["ciUpperLimitComment"],
    estimateComment:
      json["estimateComment"] == null ? undefined : json["estimateComment"],
    testedNonInferiority:
      json["testedNonInferiority"] == null
        ? undefined
        : json["testedNonInferiority"],
    nonInferiorityType:
      json["nonInferiorityType"] == null
        ? undefined
        : NonInferiorityTypeFromJSON(json["nonInferiorityType"]),
    nonInferiorityComment:
      json["nonInferiorityComment"] == null
        ? undefined
        : json["nonInferiorityComment"],
    otherAnalysisDescription:
      json["otherAnalysisDescription"] == null
        ? undefined
        : json["otherAnalysisDescription"],
    groupDescription:
      json["groupDescription"] == null ? undefined : json["groupDescription"],
    groupIds: json["groupIds"] == null ? undefined : json["groupIds"],
  }
}
