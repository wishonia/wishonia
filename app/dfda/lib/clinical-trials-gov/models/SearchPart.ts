/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface SearchPart
 */
export interface SearchPart {
  /**
   *
   * @type {boolean}
   * @memberof SearchPart
   */
  isEnum: boolean
  /**
   *
   * @type {boolean}
   * @memberof SearchPart
   */
  isSynonyms: boolean
  /**
   *
   * @type {Array<string>}
   * @memberof SearchPart
   */
  pieces: Array<string>
  /**
   *
   * @type {string}
   * @memberof SearchPart
   */
  type: string
  /**
   *
   * @type {number}
   * @memberof SearchPart
   */
  weight: number
}

export function SearchPartFromJSON(json: any): SearchPart {
  return SearchPartFromJSONTyped(json, false)
}

export function SearchPartFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SearchPart {
  if (json == null) {
    return json
  }
  return {
    isEnum: json["isEnum"],
    isSynonyms: json["isSynonyms"],
    pieces: json["pieces"],
    type: json["type"],
    weight: json["weight"],
  }
}
