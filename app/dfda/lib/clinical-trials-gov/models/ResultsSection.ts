;
/* tslint:disable */
/* eslint-disable */

import type { AdverseEventsModule } from "./AdverseEventsModule";
import { AdverseEventsModuleFromJSON } from "./AdverseEventsModule";
import type { BaselineCharacteristicsModule } from "./BaselineCharacteristicsModule";
import { BaselineCharacteristicsModuleFromJSON } from "./BaselineCharacteristicsModule";
import type { MoreInfoModule } from "./MoreInfoModule";
import { MoreInfoModuleFromJSON } from "./MoreInfoModule";
import type { OutcomeMeasuresModule } from "./OutcomeMeasuresModule";
import { OutcomeMeasuresModuleFromJSON } from "./OutcomeMeasuresModule";
import type { ParticipantFlowModule } from "./ParticipantFlowModule";
import { ParticipantFlowModuleFromJSON } from "./ParticipantFlowModule";


/**
 *
 * @export
 * @interface ResultsSection
 */
export interface ResultsSection {
  /**
   *
   * @type {ParticipantFlowModule}
   * @memberof ResultsSection
   */
  participantFlowModule?: ParticipantFlowModule
  /**
   *
   * @type {BaselineCharacteristicsModule}
   * @memberof ResultsSection
   */
  baselineCharacteristicsModule?: BaselineCharacteristicsModule
  /**
   *
   * @type {OutcomeMeasuresModule}
   * @memberof ResultsSection
   */
  outcomeMeasuresModule?: OutcomeMeasuresModule
  /**
   *
   * @type {AdverseEventsModule}
   * @memberof ResultsSection
   */
  adverseEventsModule?: AdverseEventsModule
  /**
   *
   * @type {MoreInfoModule}
   * @memberof ResultsSection
   */
  moreInfoModule?: MoreInfoModule
}

export function ResultsSectionFromJSON(json: any): ResultsSection {
  return ResultsSectionFromJSONTyped(json, false)
}

export function ResultsSectionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ResultsSection {
  if (json == null) {
    return json
  }
  return {
    participantFlowModule:
      json["participantFlowModule"] == null
        ? undefined
        : ParticipantFlowModuleFromJSON(json["participantFlowModule"]),
    baselineCharacteristicsModule:
      json["baselineCharacteristicsModule"] == null
        ? undefined
        : BaselineCharacteristicsModuleFromJSON(
            json["baselineCharacteristicsModule"]
          ),
    outcomeMeasuresModule:
      json["outcomeMeasuresModule"] == null
        ? undefined
        : OutcomeMeasuresModuleFromJSON(json["outcomeMeasuresModule"]),
    adverseEventsModule:
      json["adverseEventsModule"] == null
        ? undefined
        : AdverseEventsModuleFromJSON(json["adverseEventsModule"]),
    moreInfoModule:
      json["moreInfoModule"] == null
        ? undefined
        : MoreInfoModuleFromJSON(json["moreInfoModule"]),
  }
}
