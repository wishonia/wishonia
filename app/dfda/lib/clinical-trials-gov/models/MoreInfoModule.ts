;
/* tslint:disable */
/* eslint-disable */

import type { CertainAgreement } from "./CertainAgreement";
import { CertainAgreementFromJSON } from "./CertainAgreement";
import type { LimitationsAndCaveats } from "./LimitationsAndCaveats";
import { LimitationsAndCaveatsFromJSON } from "./LimitationsAndCaveats";
import type { PointOfContact } from "./PointOfContact";
import { PointOfContactFromJSON } from "./PointOfContact";


/**
 *
 * @export
 * @interface MoreInfoModule
 */
export interface MoreInfoModule {
  /**
   *
   * @type {LimitationsAndCaveats}
   * @memberof MoreInfoModule
   */
  limitationsAndCaveats?: LimitationsAndCaveats
  /**
   *
   * @type {CertainAgreement}
   * @memberof MoreInfoModule
   */
  certainAgreement?: CertainAgreement
  /**
   *
   * @type {PointOfContact}
   * @memberof MoreInfoModule
   */
  pointOfContact?: PointOfContact
}

export function MoreInfoModuleFromJSON(json: any): MoreInfoModule {
  return MoreInfoModuleFromJSONTyped(json, false)
}

export function MoreInfoModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MoreInfoModule {
  if (json == null) {
    return json
  }
  return {
    limitationsAndCaveats:
      json["limitationsAndCaveats"] == null
        ? undefined
        : LimitationsAndCaveatsFromJSON(json["limitationsAndCaveats"]),
    certainAgreement:
      json["certainAgreement"] == null
        ? undefined
        : CertainAgreementFromJSON(json["certainAgreement"]),
    pointOfContact:
      json["pointOfContact"] == null
        ? undefined
        : PointOfContactFromJSON(json["pointOfContact"]),
  }
}
