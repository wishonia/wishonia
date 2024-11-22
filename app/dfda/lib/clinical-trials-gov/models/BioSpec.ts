;
/* tslint:disable */
/* eslint-disable */

import type { BioSpecRetention } from "./BioSpecRetention";
import { BioSpecRetentionFromJSON } from "./BioSpecRetention";


/**
 *
 * @export
 * @interface BioSpec
 */
export interface BioSpec {
  /**
   *
   * @type {BioSpecRetention}
   * @memberof BioSpec
   */
  retention?: BioSpecRetention
  /**
   *
   * @type {string}
   * @memberof BioSpec
   */
  description?: string
}

export function BioSpecFromJSON(json: any): BioSpec {
  return BioSpecFromJSONTyped(json, false)
}

export function BioSpecFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BioSpec {
  if (json == null) {
    return json
  }
  return {
    retention:
      json["retention"] == null
        ? undefined
        : BioSpecRetentionFromJSON(json["retention"]),
    description: json["description"] == null ? undefined : json["description"],
  }
}
