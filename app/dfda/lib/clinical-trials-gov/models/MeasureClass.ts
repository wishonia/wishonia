;
/* tslint:disable */
/* eslint-disable */

import type { Denom } from "./Denom";
import { DenomFromJSON } from "./Denom";
import type { MeasureCategory } from "./MeasureCategory";
import { MeasureCategoryFromJSON } from "./MeasureCategory";


/**
 *
 * @export
 * @interface MeasureClass
 */
export interface MeasureClass {
  /**
   *
   * @type {string}
   * @memberof MeasureClass
   */
  title?: string
  /**
   *
   * @type {Array<Denom>}
   * @memberof MeasureClass
   */
  denoms?: Array<Denom>
  /**
   *
   * @type {Array<MeasureCategory>}
   * @memberof MeasureClass
   */
  categories?: Array<MeasureCategory>
}

export function MeasureClassFromJSON(json: any): MeasureClass {
  return MeasureClassFromJSONTyped(json, false)
}

export function MeasureClassFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MeasureClass {
  if (json == null) {
    return json
  }
  return {
    title: json["title"] == null ? undefined : json["title"],
    denoms:
      json["denoms"] == null
        ? undefined
        : (json["denoms"] as Array<any>).map(DenomFromJSON),
    categories:
      json["categories"] == null
        ? undefined
        : (json["categories"] as Array<any>).map(MeasureCategoryFromJSON),
  }
}
