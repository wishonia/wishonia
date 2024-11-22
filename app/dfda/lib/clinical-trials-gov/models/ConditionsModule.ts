/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface ConditionsModule
 */
export interface ConditionsModule {
  /**
   *
   * @type {Array<string>}
   * @memberof ConditionsModule
   */
  conditions?: Array<string>
  /**
   *
   * @type {Array<string>}
   * @memberof ConditionsModule
   */
  keywords?: Array<string>
}

export function ConditionsModuleFromJSON(json: any): ConditionsModule {
  return ConditionsModuleFromJSONTyped(json, false)
}

export function ConditionsModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ConditionsModule {
  if (json == null) {
    return json
  }
  return {
    conditions: json["conditions"] == null ? undefined : json["conditions"],
    keywords: json["keywords"] == null ? undefined : json["keywords"],
  }
}
