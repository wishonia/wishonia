;
/* tslint:disable */
/* eslint-disable */

import type { ArmsInterventionsModule } from "./ArmsInterventionsModule";
import { ArmsInterventionsModuleFromJSON } from "./ArmsInterventionsModule";
import type { ConditionsModule } from "./ConditionsModule";
import { ConditionsModuleFromJSON } from "./ConditionsModule";
import type { ContactsLocationsModule } from "./ContactsLocationsModule";
import { ContactsLocationsModuleFromJSON } from "./ContactsLocationsModule";
import type { DescriptionModule } from "./DescriptionModule";
import { DescriptionModuleFromJSON } from "./DescriptionModule";
import type { DesignModule } from "./DesignModule";
import { DesignModuleFromJSON } from "./DesignModule";
import type { EligibilityModule } from "./EligibilityModule";
import { EligibilityModuleFromJSON } from "./EligibilityModule";
import type { IdentificationModule } from "./IdentificationModule";
import { IdentificationModuleFromJSON } from "./IdentificationModule";
import type { IpdSharingStatementModule } from "./IpdSharingStatementModule";
import { IpdSharingStatementModuleFromJSON } from "./IpdSharingStatementModule";
import type { OutcomesModule } from "./OutcomesModule";
import { OutcomesModuleFromJSON } from "./OutcomesModule";
import type { OversightModule } from "./OversightModule";
import { OversightModuleFromJSON } from "./OversightModule";
import type { ReferencesModule } from "./ReferencesModule";
import { ReferencesModuleFromJSON } from "./ReferencesModule";
import type { SponsorCollaboratorsModule } from "./SponsorCollaboratorsModule";
import { SponsorCollaboratorsModuleFromJSON } from "./SponsorCollaboratorsModule";
import type { StatusModule } from "./StatusModule";
import { StatusModuleFromJSON } from "./StatusModule";


/**
 *
 * @export
 * @interface ProtocolSection
 */
export interface ProtocolSection {
  /**
   *
   * @type {IdentificationModule}
   * @memberof ProtocolSection
   */
  identificationModule?: IdentificationModule
  /**
   *
   * @type {StatusModule}
   * @memberof ProtocolSection
   */
  statusModule?: StatusModule
  /**
   *
   * @type {SponsorCollaboratorsModule}
   * @memberof ProtocolSection
   */
  sponsorCollaboratorsModule?: SponsorCollaboratorsModule
  /**
   *
   * @type {OversightModule}
   * @memberof ProtocolSection
   */
  oversightModule?: OversightModule
  /**
   *
   * @type {DescriptionModule}
   * @memberof ProtocolSection
   */
  descriptionModule?: DescriptionModule
  /**
   *
   * @type {ConditionsModule}
   * @memberof ProtocolSection
   */
  conditionsModule?: ConditionsModule
  /**
   *
   * @type {DesignModule}
   * @memberof ProtocolSection
   */
  designModule?: DesignModule
  /**
   *
   * @type {ArmsInterventionsModule}
   * @memberof ProtocolSection
   */
  armsInterventionsModule?: ArmsInterventionsModule
  /**
   *
   * @type {OutcomesModule}
   * @memberof ProtocolSection
   */
  outcomesModule?: OutcomesModule
  /**
   *
   * @type {EligibilityModule}
   * @memberof ProtocolSection
   */
  eligibilityModule?: EligibilityModule
  /**
   *
   * @type {ContactsLocationsModule}
   * @memberof ProtocolSection
   */
  contactsLocationsModule?: ContactsLocationsModule
  /**
   *
   * @type {ReferencesModule}
   * @memberof ProtocolSection
   */
  referencesModule?: ReferencesModule
  /**
   *
   * @type {IpdSharingStatementModule}
   * @memberof ProtocolSection
   */
  ipdSharingStatementModule?: IpdSharingStatementModule
}

export function ProtocolSectionFromJSON(json: any): ProtocolSection {
  return ProtocolSectionFromJSONTyped(json, false)
}

export function ProtocolSectionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ProtocolSection {
  if (json == null) {
    return json
  }
  return {
    identificationModule:
      json["identificationModule"] == null
        ? undefined
        : IdentificationModuleFromJSON(json["identificationModule"]),
    statusModule:
      json["statusModule"] == null
        ? undefined
        : StatusModuleFromJSON(json["statusModule"]),
    sponsorCollaboratorsModule:
      json["sponsorCollaboratorsModule"] == null
        ? undefined
        : SponsorCollaboratorsModuleFromJSON(
            json["sponsorCollaboratorsModule"]
          ),
    oversightModule:
      json["oversightModule"] == null
        ? undefined
        : OversightModuleFromJSON(json["oversightModule"]),
    descriptionModule:
      json["descriptionModule"] == null
        ? undefined
        : DescriptionModuleFromJSON(json["descriptionModule"]),
    conditionsModule:
      json["conditionsModule"] == null
        ? undefined
        : ConditionsModuleFromJSON(json["conditionsModule"]),
    designModule:
      json["designModule"] == null
        ? undefined
        : DesignModuleFromJSON(json["designModule"]),
    armsInterventionsModule:
      json["armsInterventionsModule"] == null
        ? undefined
        : ArmsInterventionsModuleFromJSON(json["armsInterventionsModule"]),
    outcomesModule:
      json["outcomesModule"] == null
        ? undefined
        : OutcomesModuleFromJSON(json["outcomesModule"]),
    eligibilityModule:
      json["eligibilityModule"] == null
        ? undefined
        : EligibilityModuleFromJSON(json["eligibilityModule"]),
    contactsLocationsModule:
      json["contactsLocationsModule"] == null
        ? undefined
        : ContactsLocationsModuleFromJSON(json["contactsLocationsModule"]),
    referencesModule:
      json["referencesModule"] == null
        ? undefined
        : ReferencesModuleFromJSON(json["referencesModule"]),
    ipdSharingStatementModule:
      json["ipdSharingStatementModule"] == null
        ? undefined
        : IpdSharingStatementModuleFromJSON(json["ipdSharingStatementModule"]),
  }
}
