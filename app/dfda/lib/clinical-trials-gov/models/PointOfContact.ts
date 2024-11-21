/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface PointOfContact
 */
export interface PointOfContact {
  /**
   *
   * @type {string}
   * @memberof PointOfContact
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof PointOfContact
   */
  organization?: string
  /**
   *
   * @type {string}
   * @memberof PointOfContact
   */
  email?: string
  /**
   *
   * @type {string}
   * @memberof PointOfContact
   */
  phone?: string
  /**
   *
   * @type {string}
   * @memberof PointOfContact
   */
  phoneExt?: string
}

export function PointOfContactFromJSON(json: any): PointOfContact {
  return PointOfContactFromJSONTyped(json, false)
}

export function PointOfContactFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PointOfContact {
  if (json == null) {
    return json
  }
  return {
    title: json["title"] == null ? undefined : json["title"],
    organization:
      json["organization"] == null ? undefined : json["organization"],
    email: json["email"] == null ? undefined : json["email"],
    phone: json["phone"] == null ? undefined : json["phone"],
    phoneExt: json["phoneExt"] == null ? undefined : json["phoneExt"],
  }
}
