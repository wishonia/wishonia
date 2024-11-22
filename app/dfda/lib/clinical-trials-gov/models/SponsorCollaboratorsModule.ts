;
/* tslint:disable */
/* eslint-disable */

import type { ResponsibleParty } from "./ResponsibleParty";
import { ResponsiblePartyFromJSON } from "./ResponsibleParty";
import type { Sponsor } from "./Sponsor";
import { SponsorFromJSON } from "./Sponsor";


/**
 *
 * @export
 * @interface SponsorCollaboratorsModule
 */
export interface SponsorCollaboratorsModule {
  /**
   *
   * @type {ResponsibleParty}
   * @memberof SponsorCollaboratorsModule
   */
  responsibleParty?: ResponsibleParty
  /**
   *
   * @type {Sponsor}
   * @memberof SponsorCollaboratorsModule
   */
  leadSponsor?: Sponsor
  /**
   *
   * @type {Array<Sponsor>}
   * @memberof SponsorCollaboratorsModule
   */
  collaborators?: Array<Sponsor>
}

export function SponsorCollaboratorsModuleFromJSON(
  json: any
): SponsorCollaboratorsModule {
  return SponsorCollaboratorsModuleFromJSONTyped(json, false)
}

export function SponsorCollaboratorsModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SponsorCollaboratorsModule {
  if (json == null) {
    return json
  }
  return {
    responsibleParty:
      json["responsibleParty"] == null
        ? undefined
        : ResponsiblePartyFromJSON(json["responsibleParty"]),
    leadSponsor:
      json["leadSponsor"] == null
        ? undefined
        : SponsorFromJSON(json["leadSponsor"]),
    collaborators:
      json["collaborators"] == null
        ? undefined
        : (json["collaborators"] as Array<any>).map(SponsorFromJSON),
  }
}
