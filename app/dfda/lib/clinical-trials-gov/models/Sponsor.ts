;
/* tslint:disable */
/* eslint-disable */

import type { AgencyClass } from "./AgencyClass";
import { AgencyClassFromJSON } from "./AgencyClass";


/**
 *
 * @export
 * @interface Sponsor
 */
export interface Sponsor {
  /**
   *
   * @type {string}
   * @memberof Sponsor
   */
  name?: string
  /**
   *
   * @type {AgencyClass}
   * @memberof Sponsor
   */
  _class?: AgencyClass
}

export function SponsorFromJSON(json: any): Sponsor {
  return SponsorFromJSONTyped(json, false)
}

export function SponsorFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Sponsor {
  if (json == null) {
    return json
  }
  return {
    name: json["name"] == null ? undefined : json["name"],
    _class:
      json["class"] == null ? undefined : AgencyClassFromJSON(json["class"]),
  }
}
