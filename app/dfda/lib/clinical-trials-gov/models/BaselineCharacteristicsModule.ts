;
/* tslint:disable */
/* eslint-disable */

import type { BaselineMeasure } from "./BaselineMeasure";
import { BaselineMeasureFromJSON } from "./BaselineMeasure";
import type { Denom } from "./Denom";
import { DenomFromJSON } from "./Denom";
import type { MeasureGroup } from "./MeasureGroup";
import { MeasureGroupFromJSON } from "./MeasureGroup";


/**
 *
 * @export
 * @interface BaselineCharacteristicsModule
 */
export interface BaselineCharacteristicsModule {
  /**
   *
   * @type {string}
   * @memberof BaselineCharacteristicsModule
   */
  populationDescription?: string
  /**
   *
   * @type {string}
   * @memberof BaselineCharacteristicsModule
   */
  typeUnitsAnalyzed?: string
  /**
   *
   * @type {Array<MeasureGroup>}
   * @memberof BaselineCharacteristicsModule
   */
  groups?: Array<MeasureGroup>
  /**
   *
   * @type {Array<Denom>}
   * @memberof BaselineCharacteristicsModule
   */
  denoms?: Array<Denom>
  /**
   *
   * @type {Array<BaselineMeasure>}
   * @memberof BaselineCharacteristicsModule
   */
  measures?: Array<BaselineMeasure>
}

export function BaselineCharacteristicsModuleFromJSON(
  json: any
): BaselineCharacteristicsModule {
  return BaselineCharacteristicsModuleFromJSONTyped(json, false)
}

export function BaselineCharacteristicsModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BaselineCharacteristicsModule {
  if (json == null) {
    return json
  }
  return {
    populationDescription:
      json["populationDescription"] == null
        ? undefined
        : json["populationDescription"],
    typeUnitsAnalyzed:
      json["typeUnitsAnalyzed"] == null ? undefined : json["typeUnitsAnalyzed"],
    groups:
      json["groups"] == null
        ? undefined
        : (json["groups"] as Array<any>).map(MeasureGroupFromJSON),
    denoms:
      json["denoms"] == null
        ? undefined
        : (json["denoms"] as Array<any>).map(DenomFromJSON),
    measures:
      json["measures"] == null
        ? undefined
        : (json["measures"] as Array<any>).map(BaselineMeasureFromJSON),
  }
}
