/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface OversightModule
 */
export interface OversightModule {
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  oversightHasDmc?: boolean
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  isFdaRegulatedDrug?: boolean
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  isFdaRegulatedDevice?: boolean
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  isUnapprovedDevice?: boolean
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  isPpsd?: boolean
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  isUsExport?: boolean
  /**
   *
   * @type {boolean}
   * @memberof OversightModule
   */
  fdaaa801Violation?: boolean
}

export function OversightModuleFromJSON(json: any): OversightModule {
  return OversightModuleFromJSONTyped(json, false)
}

export function OversightModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OversightModule {
  if (json == null) {
    return json
  }
  return {
    oversightHasDmc:
      json["oversightHasDmc"] == null ? undefined : json["oversightHasDmc"],
    isFdaRegulatedDrug:
      json["isFdaRegulatedDrug"] == null
        ? undefined
        : json["isFdaRegulatedDrug"],
    isFdaRegulatedDevice:
      json["isFdaRegulatedDevice"] == null
        ? undefined
        : json["isFdaRegulatedDevice"],
    isUnapprovedDevice:
      json["isUnapprovedDevice"] == null
        ? undefined
        : json["isUnapprovedDevice"],
    isPpsd: json["isPpsd"] == null ? undefined : json["isPpsd"],
    isUsExport: json["isUsExport"] == null ? undefined : json["isUsExport"],
    fdaaa801Violation:
      json["fdaaa801Violation"] == null ? undefined : json["fdaaa801Violation"],
  }
}
