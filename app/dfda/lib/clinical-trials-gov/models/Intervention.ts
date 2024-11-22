;
/* tslint:disable */
/* eslint-disable */

import type { InterventionType } from "./InterventionType";
import { InterventionTypeFromJSON } from "./InterventionType";


/**
 *
 * @export
 * @interface Intervention
 */
export interface Intervention {
  /**
   *
   * @type {InterventionType}
   * @memberof Intervention
   */
  type?: InterventionType
  /**
   *
   * @type {string}
   * @memberof Intervention
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof Intervention
   */
  description?: string
  /**
   *
   * @type {Array<string>}
   * @memberof Intervention
   */
  armGroupLabels?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof Intervention
   */
  otherNames?: Array<string>
}

export function InterventionFromJSON(json: any): Intervention {
  return InterventionFromJSONTyped(json, false)
}

export function InterventionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Intervention {
  if (json == null) {
    return json
  }
  return {
    type:
      json["type"] == null ? undefined : InterventionTypeFromJSON(json["type"]),
    name: json["name"] == null ? undefined : json["name"],
    description: json["description"] == null ? undefined : json["description"],
    armGroupLabels:
      json["armGroupLabels"] == null ? undefined : json["armGroupLabels"],
    otherNames: json["otherNames"] == null ? undefined : json["otherNames"],
  }
}
