;
/* tslint:disable */
/* eslint-disable */

import type { Denom } from "./Denom";
import { DenomFromJSON } from "./Denom";
import type { MeasureAnalysis } from "./MeasureAnalysis";
import { MeasureAnalysisFromJSON } from "./MeasureAnalysis";
import type { MeasureClass } from "./MeasureClass";
import { MeasureClassFromJSON } from "./MeasureClass";
import type { MeasureGroup } from "./MeasureGroup";
import { MeasureGroupFromJSON } from "./MeasureGroup";
import type { MeasureParam } from "./MeasureParam";
import { MeasureParamFromJSON } from "./MeasureParam";
import type { OutcomeMeasureType } from "./OutcomeMeasureType";
import { OutcomeMeasureTypeFromJSON } from "./OutcomeMeasureType";
import type { ReportingStatus } from "./ReportingStatus";
import { ReportingStatusFromJSON } from "./ReportingStatus";


/**
 *
 * @export
 * @interface OutcomeMeasure
 */
export interface OutcomeMeasure {
  /**
   *
   * @type {OutcomeMeasureType}
   * @memberof OutcomeMeasure
   */
  type?: OutcomeMeasureType
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  populationDescription?: string
  /**
   *
   * @type {ReportingStatus}
   * @memberof OutcomeMeasure
   */
  reportingStatus?: ReportingStatus
  /**
   * Date in `yyyy`, `yyyy-MM`, or `yyyy-MM-dd` format
   * @type {string}
   * @memberof OutcomeMeasure
   */
  anticipatedPostingDate?: string
  /**
   *
   * @type {MeasureParam}
   * @memberof OutcomeMeasure
   */
  paramType?: MeasureParam
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  dispersionType?: string
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  unitOfMeasure?: string
  /**
   *
   * @type {boolean}
   * @memberof OutcomeMeasure
   */
  calculatePct?: boolean
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  timeFrame?: string
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  typeUnitsAnalyzed?: string
  /**
   *
   * @type {string}
   * @memberof OutcomeMeasure
   */
  denomUnitsSelected?: string
  /**
   *
   * @type {Array<MeasureGroup>}
   * @memberof OutcomeMeasure
   */
  groups?: Array<MeasureGroup>
  /**
   *
   * @type {Array<Denom>}
   * @memberof OutcomeMeasure
   */
  denoms?: Array<Denom>
  /**
   *
   * @type {Array<MeasureClass>}
   * @memberof OutcomeMeasure
   */
  classes?: Array<MeasureClass>
  /**
   *
   * @type {Array<MeasureAnalysis>}
   * @memberof OutcomeMeasure
   */
  analyses?: Array<MeasureAnalysis>
}

export function OutcomeMeasureFromJSON(json: any): OutcomeMeasure {
  return OutcomeMeasureFromJSONTyped(json, false)
}

export function OutcomeMeasureFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OutcomeMeasure {
  if (json == null) {
    return json
  }
  return {
    type:
      json["type"] == null
        ? undefined
        : OutcomeMeasureTypeFromJSON(json["type"]),
    title: json["title"] == null ? undefined : json["title"],
    description: json["description"] == null ? undefined : json["description"],
    populationDescription:
      json["populationDescription"] == null
        ? undefined
        : json["populationDescription"],
    reportingStatus:
      json["reportingStatus"] == null
        ? undefined
        : ReportingStatusFromJSON(json["reportingStatus"]),
    anticipatedPostingDate:
      json["anticipatedPostingDate"] == null
        ? undefined
        : json["anticipatedPostingDate"],
    paramType:
      json["paramType"] == null
        ? undefined
        : MeasureParamFromJSON(json["paramType"]),
    dispersionType:
      json["dispersionType"] == null ? undefined : json["dispersionType"],
    unitOfMeasure:
      json["unitOfMeasure"] == null ? undefined : json["unitOfMeasure"],
    calculatePct:
      json["calculatePct"] == null ? undefined : json["calculatePct"],
    timeFrame: json["timeFrame"] == null ? undefined : json["timeFrame"],
    typeUnitsAnalyzed:
      json["typeUnitsAnalyzed"] == null ? undefined : json["typeUnitsAnalyzed"],
    denomUnitsSelected:
      json["denomUnitsSelected"] == null
        ? undefined
        : json["denomUnitsSelected"],
    groups:
      json["groups"] == null
        ? undefined
        : (json["groups"] as Array<any>).map(MeasureGroupFromJSON),
    denoms:
      json["denoms"] == null
        ? undefined
        : (json["denoms"] as Array<any>).map(DenomFromJSON),
    classes:
      json["classes"] == null
        ? undefined
        : (json["classes"] as Array<any>).map(MeasureClassFromJSON),
    analyses:
      json["analyses"] == null
        ? undefined
        : (json["analyses"] as Array<any>).map(MeasureAnalysisFromJSON),
  }
}
