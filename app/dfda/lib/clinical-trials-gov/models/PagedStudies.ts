;
/* tslint:disable */
/* eslint-disable */

import type { Study } from "./Study";
import { StudyFromJSON } from "./Study";


/**
 *
 * @export
 * @interface PagedStudies
 */
export interface PagedStudies {
  /**
   *
   * @type {string}
   * @memberof PagedStudies
   */
  nextPageToken?: string
  /**
   * `study` field values of type `markup` are in markdown format.
   *
   * @type {Array<Study>}
   * @memberof PagedStudies
   */
  studies: Array<Study>
  /**
   *
   * @type {number}
   * @memberof PagedStudies
   */
  totalCount?: number
}

export function PagedStudiesFromJSON(json: any): PagedStudies {
  return PagedStudiesFromJSONTyped(json, false)
}

export function PagedStudiesFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): PagedStudies {
  if (json == null) {
    return json
  }
  return {
    nextPageToken:
      json["nextPageToken"] == null ? undefined : json["nextPageToken"],
    studies: (json["studies"] as Array<any>).map(StudyFromJSON),
    totalCount: json["totalCount"] == null ? undefined : json["totalCount"],
  }
}
