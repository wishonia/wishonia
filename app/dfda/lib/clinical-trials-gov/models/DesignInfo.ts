;
/* tslint:disable */
/* eslint-disable */

import type { DesignAllocation } from "./DesignAllocation";
import { DesignAllocationFromJSON } from "./DesignAllocation";
import type { DesignTimePerspective } from "./DesignTimePerspective";
import { DesignTimePerspectiveFromJSON } from "./DesignTimePerspective";
import type { InterventionalAssignment } from "./InterventionalAssignment";
import { InterventionalAssignmentFromJSON } from "./InterventionalAssignment";
import type { MaskingBlock } from "./MaskingBlock";
import { MaskingBlockFromJSON } from "./MaskingBlock";
import type { ObservationalModel } from "./ObservationalModel";
import { ObservationalModelFromJSON } from "./ObservationalModel";
import type { PrimaryPurpose } from "./PrimaryPurpose";
import { PrimaryPurposeFromJSON } from "./PrimaryPurpose";


/**
 *
 * @export
 * @interface DesignInfo
 */
export interface DesignInfo {
  /**
   *
   * @type {DesignAllocation}
   * @memberof DesignInfo
   */
  allocation?: DesignAllocation
  /**
   *
   * @type {InterventionalAssignment}
   * @memberof DesignInfo
   */
  interventionModel?: InterventionalAssignment
  /**
   *
   * @type {string}
   * @memberof DesignInfo
   */
  interventionModelDescription?: string
  /**
   *
   * @type {PrimaryPurpose}
   * @memberof DesignInfo
   */
  primaryPurpose?: PrimaryPurpose
  /**
   *
   * @type {ObservationalModel}
   * @memberof DesignInfo
   */
  observationalModel?: ObservationalModel
  /**
   *
   * @type {DesignTimePerspective}
   * @memberof DesignInfo
   */
  timePerspective?: DesignTimePerspective
  /**
   *
   * @type {MaskingBlock}
   * @memberof DesignInfo
   */
  maskingInfo?: MaskingBlock
}

export function DesignInfoFromJSON(json: any): DesignInfo {
  return DesignInfoFromJSONTyped(json, false)
}

export function DesignInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DesignInfo {
  if (json == null) {
    return json
  }
  return {
    allocation:
      json["allocation"] == null
        ? undefined
        : DesignAllocationFromJSON(json["allocation"]),
    interventionModel:
      json["interventionModel"] == null
        ? undefined
        : InterventionalAssignmentFromJSON(json["interventionModel"]),
    interventionModelDescription:
      json["interventionModelDescription"] == null
        ? undefined
        : json["interventionModelDescription"],
    primaryPurpose:
      json["primaryPurpose"] == null
        ? undefined
        : PrimaryPurposeFromJSON(json["primaryPurpose"]),
    observationalModel:
      json["observationalModel"] == null
        ? undefined
        : ObservationalModelFromJSON(json["observationalModel"]),
    timePerspective:
      json["timePerspective"] == null
        ? undefined
        : DesignTimePerspectiveFromJSON(json["timePerspective"]),
    maskingInfo:
      json["maskingInfo"] == null
        ? undefined
        : MaskingBlockFromJSON(json["maskingInfo"]),
  }
}
