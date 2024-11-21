;
/* tslint:disable */
/* eslint-disable */

import type { Outcome } from "./Outcome";
import { OutcomeFromJSON } from "./Outcome";


/**
 *
 * @export
 * @interface OutcomesModule
 */
export interface OutcomesModule {
  /**
   *
   * @type {Array<Outcome>}
   * @memberof OutcomesModule
   */
  primaryOutcomes?: Array<Outcome>
  /**
   *
   * @type {Array<Outcome>}
   * @memberof OutcomesModule
   */
  secondaryOutcomes?: Array<Outcome>
  /**
   *
   * @type {Array<Outcome>}
   * @memberof OutcomesModule
   */
  otherOutcomes?: Array<Outcome>
}

export function OutcomesModuleFromJSON(json: any): OutcomesModule {
  return OutcomesModuleFromJSONTyped(json, false)
}

export function OutcomesModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OutcomesModule {
  if (json == null) {
    return json
  }
  return {
    primaryOutcomes:
      json["primaryOutcomes"] == null
        ? undefined
        : (json["primaryOutcomes"] as Array<any>).map(OutcomeFromJSON),
    secondaryOutcomes:
      json["secondaryOutcomes"] == null
        ? undefined
        : (json["secondaryOutcomes"] as Array<any>).map(OutcomeFromJSON),
    otherOutcomes:
      json["otherOutcomes"] == null
        ? undefined
        : (json["otherOutcomes"] as Array<any>).map(OutcomeFromJSON),
  }
}
