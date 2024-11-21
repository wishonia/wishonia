/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface SeeAlsoLink
 */
export interface SeeAlsoLink {
  /**
   *
   * @type {string}
   * @memberof SeeAlsoLink
   */
  label?: string
  /**
   *
   * @type {string}
   * @memberof SeeAlsoLink
   */
  url?: string
}

export function SeeAlsoLinkFromJSON(json: any): SeeAlsoLink {
  return SeeAlsoLinkFromJSONTyped(json, false)
}

export function SeeAlsoLinkFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SeeAlsoLink {
  if (json == null) {
    return json
  }
  return {
    label: json["label"] == null ? undefined : json["label"],
    url: json["url"] == null ? undefined : json["url"],
  }
}
