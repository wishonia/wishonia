;
/* tslint:disable */
/* eslint-disable */

import type { ResponsiblePartyType } from "./ResponsiblePartyType";
import { ResponsiblePartyTypeFromJSON } from "./ResponsiblePartyType";


/**
 *
 * @export
 * @interface ResponsibleParty
 */
export interface ResponsibleParty {
  /**
   *
   * @type {ResponsiblePartyType}
   * @memberof ResponsibleParty
   */
  type?: ResponsiblePartyType
  /**
   *
   * @type {string}
   * @memberof ResponsibleParty
   */
  investigatorFullName?: string
  /**
   *
   * @type {string}
   * @memberof ResponsibleParty
   */
  investigatorTitle?: string
  /**
   *
   * @type {string}
   * @memberof ResponsibleParty
   */
  investigatorAffiliation?: string
  /**
   *
   * @type {string}
   * @memberof ResponsibleParty
   */
  oldNameTitle?: string
  /**
   *
   * @type {string}
   * @memberof ResponsibleParty
   */
  oldOrganization?: string
}

export function ResponsiblePartyFromJSON(json: any): ResponsibleParty {
  return ResponsiblePartyFromJSONTyped(json, false)
}

export function ResponsiblePartyFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ResponsibleParty {
  if (json == null) {
    return json
  }
  return {
    type:
      json["type"] == null
        ? undefined
        : ResponsiblePartyTypeFromJSON(json["type"]),
    investigatorFullName:
      json["investigatorFullName"] == null
        ? undefined
        : json["investigatorFullName"],
    investigatorTitle:
      json["investigatorTitle"] == null ? undefined : json["investigatorTitle"],
    investigatorAffiliation:
      json["investigatorAffiliation"] == null
        ? undefined
        : json["investigatorAffiliation"],
    oldNameTitle:
      json["oldNameTitle"] == null ? undefined : json["oldNameTitle"],
    oldOrganization:
      json["oldOrganization"] == null ? undefined : json["oldOrganization"],
  }
}
