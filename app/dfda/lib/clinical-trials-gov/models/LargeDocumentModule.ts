;
/* tslint:disable */
/* eslint-disable */

import type { LargeDoc } from "./LargeDoc";
import { LargeDocFromJSON } from "./LargeDoc";


/**
 *
 * @export
 * @interface LargeDocumentModule
 */
export interface LargeDocumentModule {
  /**
   *
   * @type {boolean}
   * @memberof LargeDocumentModule
   */
  noSap?: boolean
  /**
   *
   * @type {Array<LargeDoc>}
   * @memberof LargeDocumentModule
   */
  largeDocs?: Array<LargeDoc>
}

export function LargeDocumentModuleFromJSON(json: any): LargeDocumentModule {
  return LargeDocumentModuleFromJSONTyped(json, false)
}

export function LargeDocumentModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): LargeDocumentModule {
  if (json == null) {
    return json
  }
  return {
    noSap: json["noSap"] == null ? undefined : json["noSap"],
    largeDocs:
      json["largeDocs"] == null
        ? undefined
        : (json["largeDocs"] as Array<any>).map(LargeDocFromJSON),
  }
}
