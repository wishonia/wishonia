;
/* tslint:disable */
/* eslint-disable */

import type { DesignMasking } from "./DesignMasking";
import { DesignMaskingFromJSON } from "./DesignMasking";
import type { WhoMasked } from "./WhoMasked";
import { WhoMaskedFromJSON } from "./WhoMasked";


/**
 *
 * @export
 * @interface MaskingBlock
 */
export interface MaskingBlock {
  /**
   *
   * @type {DesignMasking}
   * @memberof MaskingBlock
   */
  masking?: DesignMasking
  /**
   *
   * @type {string}
   * @memberof MaskingBlock
   */
  maskingDescription?: string
  /**
   *
   * @type {Array<WhoMasked>}
   * @memberof MaskingBlock
   */
  whoMasked?: Array<WhoMasked>
}

export function MaskingBlockFromJSON(json: any): MaskingBlock {
  return MaskingBlockFromJSONTyped(json, false)
}

export function MaskingBlockFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MaskingBlock {
  if (json == null) {
    return json
  }
  return {
    masking:
      json["masking"] == null
        ? undefined
        : DesignMaskingFromJSON(json["masking"]),
    maskingDescription:
      json["maskingDescription"] == null
        ? undefined
        : json["maskingDescription"],
    whoMasked:
      json["whoMasked"] == null
        ? undefined
        : (json["whoMasked"] as Array<any>).map(WhoMaskedFromJSON),
  }
}
