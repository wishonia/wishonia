/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface LargeDoc
 */
export interface LargeDoc {
  /**
   *
   * @type {string}
   * @memberof LargeDoc
   */
  typeAbbrev?: string
  /**
   *
   * @type {boolean}
   * @memberof LargeDoc
   */
  hasProtocol?: boolean
  /**
   *
   * @type {boolean}
   * @memberof LargeDoc
   */
  hasSap?: boolean
  /**
   *
   * @type {boolean}
   * @memberof LargeDoc
   */
  hasIcf?: boolean
  /**
   *
   * @type {string}
   * @memberof LargeDoc
   */
  label?: string
  /**
   *
   * @type {Date}
   * @memberof LargeDoc
   */
  date?: Date
  /**
   * Date and time in `yyyy-MM-dd'T'HH:mm` format
   * @type {string}
   * @memberof LargeDoc
   */
  uploadDate?: string
  /**
   *
   * @type {string}
   * @memberof LargeDoc
   */
  filename?: string
  /**
   *
   * @type {number}
   * @memberof LargeDoc
   */
  size?: number
}

export function LargeDocFromJSON(json: any): LargeDoc {
  return LargeDocFromJSONTyped(json, false)
}

export function LargeDocFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): LargeDoc {
  if (json == null) {
    return json
  }
  return {
    typeAbbrev: json["typeAbbrev"] == null ? undefined : json["typeAbbrev"],
    hasProtocol: json["hasProtocol"] == null ? undefined : json["hasProtocol"],
    hasSap: json["hasSap"] == null ? undefined : json["hasSap"],
    hasIcf: json["hasIcf"] == null ? undefined : json["hasIcf"],
    label: json["label"] == null ? undefined : json["label"],
    date: json["date"] == null ? undefined : new Date(json["date"]),
    uploadDate: json["uploadDate"] == null ? undefined : json["uploadDate"],
    filename: json["filename"] == null ? undefined : json["filename"],
    size: json["size"] == null ? undefined : json["size"],
  }
}
