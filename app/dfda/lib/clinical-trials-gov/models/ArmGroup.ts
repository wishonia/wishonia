;
/* tslint:disable */
/* eslint-disable */

import type { ArmGroupType } from "./ArmGroupType";
import { ArmGroupTypeFromJSON } from "./ArmGroupType";


/**
 *
 * @export
 * @interface ArmGroup
 */
export interface ArmGroup {
  /**
   *
   * @type {string}
   * @memberof ArmGroup
   */
  label?: string
  /**
   *
   * @type {ArmGroupType}
   * @memberof ArmGroup
   */
  type?: ArmGroupType
  /**
   *
   * @type {string}
   * @memberof ArmGroup
   */
  description?: string
  /**
   *
   * @type {Array<string>}
   * @memberof ArmGroup
   */
  interventionNames?: Array<string>
}

export function ArmGroupFromJSON(json: any): ArmGroup {
  return ArmGroupFromJSONTyped(json, false)
}

export function ArmGroupFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ArmGroup {
  if (json == null) {
    return json
  }
  return {
    label: json["label"] == null ? undefined : json["label"],
    type: json["type"] == null ? undefined : ArmGroupTypeFromJSON(json["type"]),
    description: json["description"] == null ? undefined : json["description"],
    interventionNames:
      json["interventionNames"] == null ? undefined : json["interventionNames"],
  }
}
