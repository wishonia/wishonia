;
/* tslint:disable */
/* eslint-disable */

import type { Contact } from "./Contact";
import { ContactFromJSON } from "./Contact";
import type { GeoPoint } from "./GeoPoint";
import { GeoPointFromJSON } from "./GeoPoint";
import type { RecruitmentStatus } from "./RecruitmentStatus";
import { RecruitmentStatusFromJSON } from "./RecruitmentStatus";


/**
 *
 * @export
 * @interface Location
 */
export interface Location {
  /**
   *
   * @type {string}
   * @memberof Location
   */
  facility?: string
  /**
   *
   * @type {RecruitmentStatus}
   * @memberof Location
   */
  status?: RecruitmentStatus
  /**
   *
   * @type {string}
   * @memberof Location
   */
  city?: string
  /**
   *
   * @type {string}
   * @memberof Location
   */
  state?: string
  /**
   *
   * @type {string}
   * @memberof Location
   */
  zip?: string
  /**
   *
   * @type {string}
   * @memberof Location
   */
  country?: string
  /**
   *
   * @type {Array<Contact>}
   * @memberof Location
   */
  contacts?: Array<Contact>
  /**
   *
   * @type {string}
   * @memberof Location
   */
  countryCode?: string
  /**
   *
   * @type {GeoPoint}
   * @memberof Location
   */
  geoPoint?: GeoPoint
}

export function LocationFromJSON(json: any): Location {
  return LocationFromJSONTyped(json, false)
}

export function LocationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Location {
  if (json == null) {
    return json
  }
  return {
    facility: json["facility"] == null ? undefined : json["facility"],
    status:
      json["status"] == null
        ? undefined
        : RecruitmentStatusFromJSON(json["status"]),
    city: json["city"] == null ? undefined : json["city"],
    state: json["state"] == null ? undefined : json["state"],
    zip: json["zip"] == null ? undefined : json["zip"],
    country: json["country"] == null ? undefined : json["country"],
    contacts:
      json["contacts"] == null
        ? undefined
        : (json["contacts"] as Array<any>).map(ContactFromJSON),
    countryCode: json["countryCode"] == null ? undefined : json["countryCode"],
    geoPoint:
      json["geoPoint"] == null ? undefined : GeoPointFromJSON(json["geoPoint"]),
  }
}
