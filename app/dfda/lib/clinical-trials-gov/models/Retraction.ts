/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface Retraction
 */
export interface Retraction {
  /**
   *
   * @type {string}
   * @memberof Retraction
   */
  pmid?: string
  /**
   *
   * @type {string}
   * @memberof Retraction
   */
  source?: string
}

export function RetractionFromJSON(json: any): Retraction {
  return RetractionFromJSONTyped(json, false)
}

export function RetractionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Retraction {
  if (json == null) {
    return json
  }
  return {
    pmid: json["pmid"] == null ? undefined : json["pmid"],
    source: json["source"] == null ? undefined : json["source"],
  }
}
