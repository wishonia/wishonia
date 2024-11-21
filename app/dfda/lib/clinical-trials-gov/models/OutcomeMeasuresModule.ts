;
/* tslint:disable */
/* eslint-disable */

import type { OutcomeMeasure } from "./OutcomeMeasure";
import { OutcomeMeasureFromJSON } from "./OutcomeMeasure";


/**
 *
 * @export
 * @interface OutcomeMeasuresModule
 */
export interface OutcomeMeasuresModule {
  /**
   *
   * @type {Array<OutcomeMeasure>}
   * @memberof OutcomeMeasuresModule
   */
  outcomeMeasures?: Array<OutcomeMeasure>
}

export function OutcomeMeasuresModuleFromJSON(
  json: any
): OutcomeMeasuresModule {
  return OutcomeMeasuresModuleFromJSONTyped(json, false)
}

export function OutcomeMeasuresModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OutcomeMeasuresModule {
  if (json == null) {
    return json
  }
  return {
    outcomeMeasures:
      json["outcomeMeasures"] == null
        ? undefined
        : (json["outcomeMeasures"] as Array<any>).map(OutcomeMeasureFromJSON),
  }
}
