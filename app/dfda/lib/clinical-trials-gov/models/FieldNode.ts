;
/* tslint:disable */
/* eslint-disable */

import type { WebLink } from "./WebLink";
import { WebLinkFromJSON } from "./WebLink";


/**
 *
 * @export
 * @interface FieldNode
 */
export interface FieldNode {
  /**
   *
   * @type {Array<string>}
   * @memberof FieldNode
   */
  altPieceNames?: Array<string>
  /**
   *
   * @type {Array<FieldNode>}
   * @memberof FieldNode
   */
  children?: Array<FieldNode>
  /**
   *
   * @type {WebLink}
   * @memberof FieldNode
   */
  dedLink?: WebLink
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  description?: string
  /**
   *
   * @type {boolean}
   * @memberof FieldNode
   */
  historicOnly?: boolean
  /**
   *
   * @type {boolean}
   * @memberof FieldNode
   */
  indexedOnly?: boolean
  /**
   *
   * @type {boolean}
   * @memberof FieldNode
   */
  isEnum?: boolean
  /**
   *
   * @type {number}
   * @memberof FieldNode
   */
  maxChars?: number
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  name: string
  /**
   *
   * @type {boolean}
   * @memberof FieldNode
   */
  nested?: boolean
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  piece: string
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  rules?: string
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  sourceType: string
  /**
   *
   * @type {boolean}
   * @memberof FieldNode
   */
  synonyms?: boolean
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof FieldNode
   */
  type: string
}

export function FieldNodeFromJSON(json: any): FieldNode {
  return FieldNodeFromJSONTyped(json, false)
}

export function FieldNodeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): FieldNode {
  if (json == null) {
    return json
  }
  return {
    altPieceNames:
      json["altPieceNames"] == null ? undefined : json["altPieceNames"],
    children:
      json["children"] == null
        ? undefined
        : (json["children"] as Array<any>).map(FieldNodeFromJSON),
    dedLink:
      json["dedLink"] == null ? undefined : WebLinkFromJSON(json["dedLink"]),
    description: json["description"] == null ? undefined : json["description"],
    historicOnly:
      json["historicOnly"] == null ? undefined : json["historicOnly"],
    indexedOnly: json["indexedOnly"] == null ? undefined : json["indexedOnly"],
    isEnum: json["isEnum"] == null ? undefined : json["isEnum"],
    maxChars: json["maxChars"] == null ? undefined : json["maxChars"],
    name: json["name"],
    nested: json["nested"] == null ? undefined : json["nested"],
    piece: json["piece"],
    rules: json["rules"] == null ? undefined : json["rules"],
    sourceType: json["sourceType"],
    synonyms: json["synonyms"] == null ? undefined : json["synonyms"],
    title: json["title"] == null ? undefined : json["title"],
    type: json["type"],
  }
}
