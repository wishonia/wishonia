;
/* tslint:disable */
/* eslint-disable */

import type { BrowseLeafRelevance } from "./BrowseLeafRelevance";
import { BrowseLeafRelevanceFromJSON } from "./BrowseLeafRelevance";


/**
 *
 * @export
 * @interface BrowseLeaf
 */
export interface BrowseLeaf {
  /**
   *
   * @type {string}
   * @memberof BrowseLeaf
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof BrowseLeaf
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof BrowseLeaf
   */
  asFound?: string
  /**
   *
   * @type {BrowseLeafRelevance}
   * @memberof BrowseLeaf
   */
  relevance?: BrowseLeafRelevance
}

export function BrowseLeafFromJSON(json: any): BrowseLeaf {
  return BrowseLeafFromJSONTyped(json, false)
}

export function BrowseLeafFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BrowseLeaf {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    name: json["name"] == null ? undefined : json["name"],
    asFound: json["asFound"] == null ? undefined : json["asFound"],
    relevance:
      json["relevance"] == null
        ? undefined
        : BrowseLeafRelevanceFromJSON(json["relevance"]),
  }
}
