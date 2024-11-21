;
/* tslint:disable */
/* eslint-disable */

import type { SearchPart } from "./SearchPart";
import { SearchPartFromJSON } from "./SearchPart";


/**
 *
 * @export
 * @interface SearchArea
 */
export interface SearchArea {
  /**
   *
   * @type {string}
   * @memberof SearchArea
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof SearchArea
   */
  param?: string
  /**
   *
   * @type {Array<SearchPart>}
   * @memberof SearchArea
   */
  parts: Array<SearchPart>
  /**
   *
   * @type {string}
   * @memberof SearchArea
   */
  uiLabel?: string
}

export function SearchAreaFromJSON(json: any): SearchArea {
  return SearchAreaFromJSONTyped(json, false)
}

export function SearchAreaFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SearchArea {
  if (json == null) {
    return json
  }
  return {
    name: json["name"],
    param: json["param"] == null ? undefined : json["param"],
    parts: (json["parts"] as Array<any>).map(SearchPartFromJSON),
    uiLabel: json["uiLabel"] == null ? undefined : json["uiLabel"],
  }
}
