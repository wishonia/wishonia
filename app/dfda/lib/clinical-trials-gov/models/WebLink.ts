/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface WebLink
 */
export interface WebLink {
  /**
   *
   * @type {string}
   * @memberof WebLink
   */
  label: string
  /**
   *
   * @type {string}
   * @memberof WebLink
   */
  url: string
}

export function WebLinkFromJSON(json: any): WebLink {
  return WebLinkFromJSONTyped(json, false)
}

export function WebLinkFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): WebLink {
  if (json == null) {
    return json
  }
  return {
    label: json["label"],
    url: json["url"],
  }
}
