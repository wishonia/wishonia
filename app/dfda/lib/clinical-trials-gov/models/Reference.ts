;
/* tslint:disable */
/* eslint-disable */

import type { ReferenceType } from "./ReferenceType";
import { ReferenceTypeFromJSON } from "./ReferenceType";
import type { Retraction } from "./Retraction";
import { RetractionFromJSON } from "./Retraction";


/**
 *
 * @export
 * @interface Reference
 */
export interface Reference {
  /**
   *
   * @type {string}
   * @memberof Reference
   */
  pmid?: string
  /**
   *
   * @type {ReferenceType}
   * @memberof Reference
   */
  type?: ReferenceType
  /**
   *
   * @type {string}
   * @memberof Reference
   */
  citation?: string
  /**
   *
   * @type {Array<Retraction>}
   * @memberof Reference
   */
  retractions?: Array<Retraction>
}

export function ReferenceFromJSON(json: any): Reference {
  return ReferenceFromJSONTyped(json, false)
}

export function ReferenceFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Reference {
  if (json == null) {
    return json
  }
  return {
    pmid: json["pmid"] == null ? undefined : json["pmid"],
    type:
      json["type"] == null ? undefined : ReferenceTypeFromJSON(json["type"]),
    citation: json["citation"] == null ? undefined : json["citation"],
    retractions:
      json["retractions"] == null
        ? undefined
        : (json["retractions"] as Array<any>).map(RetractionFromJSON),
  }
}
