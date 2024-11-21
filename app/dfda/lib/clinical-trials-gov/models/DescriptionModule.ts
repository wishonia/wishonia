/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface DescriptionModule
 */
export interface DescriptionModule {
  /**
   *
   * @type {string}
   * @memberof DescriptionModule
   */
  briefSummary?: string
  /**
   *
   * @type {string}
   * @memberof DescriptionModule
   */
  detailedDescription?: string
}

export function DescriptionModuleFromJSON(json: any): DescriptionModule {
  return DescriptionModuleFromJSONTyped(json, false)
}

export function DescriptionModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DescriptionModule {
  if (json == null) {
    return json
  }
  return {
    briefSummary:
      json["briefSummary"] == null ? undefined : json["briefSummary"],
    detailedDescription:
      json["detailedDescription"] == null
        ? undefined
        : json["detailedDescription"],
  }
}
