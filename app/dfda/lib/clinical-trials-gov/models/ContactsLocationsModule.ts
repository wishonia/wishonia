;
/* tslint:disable */
/* eslint-disable */

import type { Contact } from "./Contact";
import { ContactFromJSON } from "./Contact";
import type { Location } from "./Location";
import { LocationFromJSON } from "./Location";
import type { Official } from "./Official";
import { OfficialFromJSON } from "./Official";


/**
 *
 * @export
 * @interface ContactsLocationsModule
 */
export interface ContactsLocationsModule {
  /**
   *
   * @type {Array<Contact>}
   * @memberof ContactsLocationsModule
   */
  centralContacts?: Array<Contact>
  /**
   *
   * @type {Array<Official>}
   * @memberof ContactsLocationsModule
   */
  overallOfficials?: Array<Official>
  /**
   *
   * @type {Array<Location>}
   * @memberof ContactsLocationsModule
   */
  locations?: Array<Location>
}

export function ContactsLocationsModuleFromJSON(
  json: any
): ContactsLocationsModule {
  return ContactsLocationsModuleFromJSONTyped(json, false)
}

export function ContactsLocationsModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ContactsLocationsModule {
  if (json == null) {
    return json
  }
  return {
    centralContacts:
      json["centralContacts"] == null
        ? undefined
        : (json["centralContacts"] as Array<any>).map(ContactFromJSON),
    overallOfficials:
      json["overallOfficials"] == null
        ? undefined
        : (json["overallOfficials"] as Array<any>).map(OfficialFromJSON),
    locations:
      json["locations"] == null
        ? undefined
        : (json["locations"] as Array<any>).map(LocationFromJSON),
  }
}
