;
/* tslint:disable */
/* eslint-disable */

import type { FlowGroup } from "./FlowGroup";
import { FlowGroupFromJSON } from "./FlowGroup";
import type { FlowPeriod } from "./FlowPeriod";
import { FlowPeriodFromJSON } from "./FlowPeriod";


/**
 *
 * @export
 * @interface ParticipantFlowModule
 */
export interface ParticipantFlowModule {
  /**
   *
   * @type {string}
   * @memberof ParticipantFlowModule
   */
  preAssignmentDetails?: string
  /**
   *
   * @type {string}
   * @memberof ParticipantFlowModule
   */
  recruitmentDetails?: string
  /**
   *
   * @type {string}
   * @memberof ParticipantFlowModule
   */
  typeUnitsAnalyzed?: string
  /**
   *
   * @type {Array<FlowGroup>}
   * @memberof ParticipantFlowModule
   */
  groups?: Array<FlowGroup>
  /**
   *
   * @type {Array<FlowPeriod>}
   * @memberof ParticipantFlowModule
   */
  periods?: Array<FlowPeriod>
}

export function ParticipantFlowModuleFromJSON(
  json: any
): ParticipantFlowModule {
  return ParticipantFlowModuleFromJSONTyped(json, false)
}

export function ParticipantFlowModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ParticipantFlowModule {
  if (json == null) {
    return json
  }
  return {
    preAssignmentDetails:
      json["preAssignmentDetails"] == null
        ? undefined
        : json["preAssignmentDetails"],
    recruitmentDetails:
      json["recruitmentDetails"] == null
        ? undefined
        : json["recruitmentDetails"],
    typeUnitsAnalyzed:
      json["typeUnitsAnalyzed"] == null ? undefined : json["typeUnitsAnalyzed"],
    groups:
      json["groups"] == null
        ? undefined
        : (json["groups"] as Array<any>).map(FlowGroupFromJSON),
    periods:
      json["periods"] == null
        ? undefined
        : (json["periods"] as Array<any>).map(FlowPeriodFromJSON),
  }
}
