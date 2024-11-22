;
/* tslint:disable */
/* eslint-disable */

import type { ArmGroup } from "./ArmGroup";
import { ArmGroupFromJSON } from "./ArmGroup";
import type { Intervention } from "./Intervention";
import { InterventionFromJSON } from "./Intervention";


/**
 *
 * @export
 * @interface ArmsInterventionsModule
 */
export interface ArmsInterventionsModule {
  /**
   *
   * @type {Array<ArmGroup>}
   * @memberof ArmsInterventionsModule
   */
  armGroups?: Array<ArmGroup>
  /**
   *
   * @type {Array<Intervention>}
   * @memberof ArmsInterventionsModule
   */
  interventions?: Array<Intervention>
}

export function ArmsInterventionsModuleFromJSON(
  json: any
): ArmsInterventionsModule {
  return ArmsInterventionsModuleFromJSONTyped(json, false)
}

export function ArmsInterventionsModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ArmsInterventionsModule {
  if (json == null) {
    return json
  }
  return {
    armGroups:
      json["armGroups"] == null
        ? undefined
        : (json["armGroups"] as Array<any>).map(ArmGroupFromJSON),
    interventions:
      json["interventions"] == null
        ? undefined
        : (json["interventions"] as Array<any>).map(InterventionFromJSON),
  }
}
