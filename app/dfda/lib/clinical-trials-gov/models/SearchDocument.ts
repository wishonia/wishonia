;
/* tslint:disable */
/* eslint-disable */

import type { SearchArea } from "./SearchArea";
import { SearchAreaFromJSON } from "./SearchArea";


/**
 *
 * @export
 * @interface SearchDocument
 */
export interface SearchDocument {
  /**
   *
   * @type {Array<SearchArea>}
   * @memberof SearchDocument
   */
  areas: Array<SearchArea>
  /**
   *
   * @type {string}
   * @memberof SearchDocument
   */
  name: string
}

export function SearchDocumentFromJSON(json: any): SearchDocument {
  return SearchDocumentFromJSONTyped(json, false)
}

export function SearchDocumentFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SearchDocument {
  if (json == null) {
    return json
  }
  return {
    areas: (json["areas"] as Array<any>).map(SearchAreaFromJSON),
    name: json["name"],
  }
}
