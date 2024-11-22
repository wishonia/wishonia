;
/* tslint:disable */
/* eslint-disable */

import type { AvailIpd } from "./AvailIpd";
import { AvailIpdFromJSON } from "./AvailIpd";
import type { Reference } from "./Reference";
import { ReferenceFromJSON } from "./Reference";
import type { SeeAlsoLink } from "./SeeAlsoLink";
import { SeeAlsoLinkFromJSON } from "./SeeAlsoLink";


/**
 *
 * @export
 * @interface ReferencesModule
 */
export interface ReferencesModule {
  /**
   *
   * @type {Array<Reference>}
   * @memberof ReferencesModule
   */
  references?: Array<Reference>
  /**
   *
   * @type {Array<SeeAlsoLink>}
   * @memberof ReferencesModule
   */
  seeAlsoLinks?: Array<SeeAlsoLink>
  /**
   *
   * @type {Array<AvailIpd>}
   * @memberof ReferencesModule
   */
  availIpds?: Array<AvailIpd>
}

export function ReferencesModuleFromJSON(json: any): ReferencesModule {
  return ReferencesModuleFromJSONTyped(json, false)
}

export function ReferencesModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ReferencesModule {
  if (json == null) {
    return json
  }
  return {
    references:
      json["references"] == null
        ? undefined
        : (json["references"] as Array<any>).map(ReferenceFromJSON),
    seeAlsoLinks:
      json["seeAlsoLinks"] == null
        ? undefined
        : (json["seeAlsoLinks"] as Array<any>).map(SeeAlsoLinkFromJSON),
    availIpds:
      json["availIpds"] == null
        ? undefined
        : (json["availIpds"] as Array<any>).map(AvailIpdFromJSON),
  }
}
