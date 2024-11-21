/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface AvailIpd
 */
export interface AvailIpd {
  /**
   *
   * @type {string}
   * @memberof AvailIpd
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof AvailIpd
   */
  type?: string
  /**
   *
   * @type {string}
   * @memberof AvailIpd
   */
  url?: string
  /**
   *
   * @type {string}
   * @memberof AvailIpd
   */
  comment?: string
}

export function AvailIpdFromJSON(json: any): AvailIpd {
  return AvailIpdFromJSONTyped(json, false)
}

export function AvailIpdFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): AvailIpd {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    type: json["type"] == null ? undefined : json["type"],
    url: json["url"] == null ? undefined : json["url"],
    comment: json["comment"] == null ? undefined : json["comment"],
  }
}
