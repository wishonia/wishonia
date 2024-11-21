;
/* tslint:disable */
/* eslint-disable */

import type { ContactRole } from "./ContactRole";
import { ContactRoleFromJSON } from "./ContactRole";


/**
 *
 * @export
 * @interface Contact
 */
export interface Contact {
  /**
   *
   * @type {string}
   * @memberof Contact
   */
  name?: string
  /**
   *
   * @type {ContactRole}
   * @memberof Contact
   */
  role?: ContactRole
  /**
   *
   * @type {string}
   * @memberof Contact
   */
  phone?: string
  /**
   *
   * @type {string}
   * @memberof Contact
   */
  phoneExt?: string
  /**
   *
   * @type {string}
   * @memberof Contact
   */
  email?: string
}

export function ContactFromJSON(json: any): Contact {
  return ContactFromJSONTyped(json, false)
}

export function ContactFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Contact {
  if (json == null) {
    return json
  }
  return {
    name: json["name"] == null ? undefined : json["name"],
    role: json["role"] == null ? undefined : ContactRoleFromJSON(json["role"]),
    phone: json["phone"] == null ? undefined : json["phone"],
    phoneExt: json["phoneExt"] == null ? undefined : json["phoneExt"],
    email: json["email"] == null ? undefined : json["email"],
  }
}
