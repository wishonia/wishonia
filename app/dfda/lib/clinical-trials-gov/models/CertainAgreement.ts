;
/* tslint:disable */
/* eslint-disable */

import type { AgreementRestrictionType } from "./AgreementRestrictionType";
import { AgreementRestrictionTypeFromJSON } from "./AgreementRestrictionType";


/**
 *
 * @export
 * @interface CertainAgreement
 */
export interface CertainAgreement {
  /**
   *
   * @type {boolean}
   * @memberof CertainAgreement
   */
  piSponsorEmployee?: boolean
  /**
   *
   * @type {AgreementRestrictionType}
   * @memberof CertainAgreement
   */
  restrictionType?: AgreementRestrictionType
  /**
   *
   * @type {boolean}
   * @memberof CertainAgreement
   */
  restrictiveAgreement?: boolean
  /**
   *
   * @type {string}
   * @memberof CertainAgreement
   */
  otherDetails?: string
}

export function CertainAgreementFromJSON(json: any): CertainAgreement {
  return CertainAgreementFromJSONTyped(json, false)
}

export function CertainAgreementFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): CertainAgreement {
  if (json == null) {
    return json
  }
  return {
    piSponsorEmployee:
      json["piSponsorEmployee"] == null ? undefined : json["piSponsorEmployee"],
    restrictionType:
      json["restrictionType"] == null
        ? undefined
        : AgreementRestrictionTypeFromJSON(json["restrictionType"]),
    restrictiveAgreement:
      json["restrictiveAgreement"] == null
        ? undefined
        : json["restrictiveAgreement"],
    otherDetails:
      json["otherDetails"] == null ? undefined : json["otherDetails"],
  }
}
