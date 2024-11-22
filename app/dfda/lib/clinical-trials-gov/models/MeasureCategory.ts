;
/* tslint:disable */
/* eslint-disable */

import type { Measurement } from "./Measurement";
import { MeasurementFromJSON } from "./Measurement";


/**
 *
 * @export
 * @interface MeasureCategory
 */
export interface MeasureCategory {
  /**
   *
   * @type {string}
   * @memberof MeasureCategory
   */
  title?: string
  /**
   *
   * @type {Array<Measurement>}
   * @memberof MeasureCategory
   */
  measurements?: Array<Measurement>
}

export function MeasureCategoryFromJSON(json: any): MeasureCategory {
  return MeasureCategoryFromJSONTyped(json, false)
}

export function MeasureCategoryFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MeasureCategory {
  if (json == null) {
    return json
  }
  return {
    title: json["title"] == null ? undefined : json["title"],
    measurements:
      json["measurements"] == null
        ? undefined
        : (json["measurements"] as Array<any>).map(MeasurementFromJSON),
  }
}
