;
/* tslint:disable */
/* eslint-disable */

import type { Denom } from "./Denom";
import { DenomFromJSON } from "./Denom";
import type { MeasureClass } from "./MeasureClass";
import { MeasureClassFromJSON } from "./MeasureClass";
import type { MeasureDispersionType } from "./MeasureDispersionType";
import { MeasureDispersionTypeFromJSON } from "./MeasureDispersionType";
import type { MeasureParam } from "./MeasureParam";
import { MeasureParamFromJSON } from "./MeasureParam";


/**
 *
 * @export
 * @interface BaselineMeasure
 */
export interface BaselineMeasure {
  /**
   *
   * @type {string}
   * @memberof BaselineMeasure
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof BaselineMeasure
   */
  description?: string
  /**
   *
   * @type {string}
   * @memberof BaselineMeasure
   */
  populationDescription?: string
  /**
   *
   * @type {MeasureParam}
   * @memberof BaselineMeasure
   */
  paramType?: MeasureParam
  /**
   *
   * @type {MeasureDispersionType}
   * @memberof BaselineMeasure
   */
  dispersionType?: MeasureDispersionType
  /**
   *
   * @type {string}
   * @memberof BaselineMeasure
   */
  unitOfMeasure?: string
  /**
   *
   * @type {boolean}
   * @memberof BaselineMeasure
   */
  calculatePct?: boolean
  /**
   *
   * @type {string}
   * @memberof BaselineMeasure
   */
  denomUnitsSelected?: string
  /**
   *
   * @type {Array<Denom>}
   * @memberof BaselineMeasure
   */
  denoms?: Array<Denom>
  /**
   *
   * @type {Array<MeasureClass>}
   * @memberof BaselineMeasure
   */
  classes?: Array<MeasureClass>
}

export function BaselineMeasureFromJSON(json: any): BaselineMeasure {
  return BaselineMeasureFromJSONTyped(json, false)
}

export function BaselineMeasureFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BaselineMeasure {
  if (json == null) {
    return json
  }
  return {
    title: json["title"] == null ? undefined : json["title"],
    description: json["description"] == null ? undefined : json["description"],
    populationDescription:
      json["populationDescription"] == null
        ? undefined
        : json["populationDescription"],
    paramType:
      json["paramType"] == null
        ? undefined
        : MeasureParamFromJSON(json["paramType"]),
    dispersionType:
      json["dispersionType"] == null
        ? undefined
        : MeasureDispersionTypeFromJSON(json["dispersionType"]),
    unitOfMeasure:
      json["unitOfMeasure"] == null ? undefined : json["unitOfMeasure"],
    calculatePct:
      json["calculatePct"] == null ? undefined : json["calculatePct"],
    denomUnitsSelected:
      json["denomUnitsSelected"] == null
        ? undefined
        : json["denomUnitsSelected"],
    denoms:
      json["denoms"] == null
        ? undefined
        : (json["denoms"] as Array<any>).map(DenomFromJSON),
    classes:
      json["classes"] == null
        ? undefined
        : (json["classes"] as Array<any>).map(MeasureClassFromJSON),
  }
}
