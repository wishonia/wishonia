;
/* tslint:disable */
/* eslint-disable */

import type { DenomCount } from "./DenomCount";
import { DenomCountFromJSON } from "./DenomCount";


/**
 *
 * @export
 * @interface Denom
 */
export interface Denom {
  /**
   *
   * @type {string}
   * @memberof Denom
   */
  units?: string
  /**
   *
   * @type {Array<DenomCount>}
   * @memberof Denom
   */
  counts?: Array<DenomCount>
}

export function DenomFromJSON(json: any): Denom {
  return DenomFromJSONTyped(json, false)
}

export function DenomFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Denom {
  if (json == null) {
    return json
  }
  return {
    units: json["units"] == null ? undefined : json["units"],
    counts:
      json["counts"] == null
        ? undefined
        : (json["counts"] as Array<any>).map(DenomCountFromJSON),
  }
}
