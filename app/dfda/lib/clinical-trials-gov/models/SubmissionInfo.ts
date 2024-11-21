/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface SubmissionInfo
 */
export interface SubmissionInfo {
  /**
   *
   * @type {Date}
   * @memberof SubmissionInfo
   */
  releaseDate?: Date
  /**
   *
   * @type {Date}
   * @memberof SubmissionInfo
   */
  unreleaseDate?: Date
  /**
   *
   * @type {boolean}
   * @memberof SubmissionInfo
   */
  unreleaseDateUnknown?: boolean
  /**
   *
   * @type {Date}
   * @memberof SubmissionInfo
   */
  resetDate?: Date
  /**
   *
   * @type {number}
   * @memberof SubmissionInfo
   */
  mcpReleaseN?: number
}

export function SubmissionInfoFromJSON(json: any): SubmissionInfo {
  return SubmissionInfoFromJSONTyped(json, false)
}

export function SubmissionInfoFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): SubmissionInfo {
  if (json == null) {
    return json
  }
  return {
    releaseDate:
      json["releaseDate"] == null ? undefined : new Date(json["releaseDate"]),
    unreleaseDate:
      json["unreleaseDate"] == null
        ? undefined
        : new Date(json["unreleaseDate"]),
    unreleaseDateUnknown:
      json["unreleaseDateUnknown"] == null
        ? undefined
        : json["unreleaseDateUnknown"],
    resetDate:
      json["resetDate"] == null ? undefined : new Date(json["resetDate"]),
    mcpReleaseN: json["mcpReleaseN"] == null ? undefined : json["mcpReleaseN"],
  }
}
