;
/* tslint:disable */
/* eslint-disable */

import type { Organization } from "./Organization";
import { OrganizationFromJSON } from "./Organization";
import type { OrgStudyIdInfo } from "./OrgStudyIdInfo";
import { OrgStudyIdInfoFromJSON } from "./OrgStudyIdInfo";
import type { SecondaryIdInfo } from "./SecondaryIdInfo";
import { SecondaryIdInfoFromJSON } from "./SecondaryIdInfo";


/**
 *
 * @export
 * @interface IdentificationModule
 */
export interface IdentificationModule {
  /**
   *
   * @type {string}
   * @memberof IdentificationModule
   */
  nctId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof IdentificationModule
   */
  nctIdAliases?: Array<string>
  /**
   *
   * @type {OrgStudyIdInfo}
   * @memberof IdentificationModule
   */
  orgStudyIdInfo?: OrgStudyIdInfo
  /**
   *
   * @type {Array<SecondaryIdInfo>}
   * @memberof IdentificationModule
   */
  secondaryIdInfos?: Array<SecondaryIdInfo>
  /**
   *
   * @type {string}
   * @memberof IdentificationModule
   */
  briefTitle?: string
  /**
   *
   * @type {string}
   * @memberof IdentificationModule
   */
  officialTitle?: string
  /**
   *
   * @type {string}
   * @memberof IdentificationModule
   */
  acronym?: string
  /**
   *
   * @type {Organization}
   * @memberof IdentificationModule
   */
  organization?: Organization
}

export function IdentificationModuleFromJSON(json: any): IdentificationModule {
  return IdentificationModuleFromJSONTyped(json, false)
}

export function IdentificationModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IdentificationModule {
  if (json == null) {
    return json
  }
  return {
    nctId: json["nctId"] == null ? undefined : json["nctId"],
    nctIdAliases:
      json["nctIdAliases"] == null ? undefined : json["nctIdAliases"],
    orgStudyIdInfo:
      json["orgStudyIdInfo"] == null
        ? undefined
        : OrgStudyIdInfoFromJSON(json["orgStudyIdInfo"]),
    secondaryIdInfos:
      json["secondaryIdInfos"] == null
        ? undefined
        : (json["secondaryIdInfos"] as Array<any>).map(SecondaryIdInfoFromJSON),
    briefTitle: json["briefTitle"] == null ? undefined : json["briefTitle"],
    officialTitle:
      json["officialTitle"] == null ? undefined : json["officialTitle"],
    acronym: json["acronym"] == null ? undefined : json["acronym"],
    organization:
      json["organization"] == null
        ? undefined
        : OrganizationFromJSON(json["organization"]),
  }
}
