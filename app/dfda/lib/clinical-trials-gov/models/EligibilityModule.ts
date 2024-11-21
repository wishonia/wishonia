;
/* tslint:disable */
/* eslint-disable */

import type { SamplingMethod } from "./SamplingMethod";
import { SamplingMethodFromJSON } from "./SamplingMethod";
import type { Sex } from "./Sex";
import { SexFromJSON } from "./Sex";
import type { StandardAge } from "./StandardAge";
import { StandardAgeFromJSON } from "./StandardAge";


/**
 *
 * @export
 * @interface EligibilityModule
 */
export interface EligibilityModule {
  /**
   *
   * @type {string}
   * @memberof EligibilityModule
   */
  eligibilityCriteria?: string
  /**
   *
   * @type {boolean}
   * @memberof EligibilityModule
   */
  healthyVolunteers?: boolean
  /**
   *
   * @type {Sex}
   * @memberof EligibilityModule
   */
  sex?: Sex
  /**
   *
   * @type {boolean}
   * @memberof EligibilityModule
   */
  genderBased?: boolean
  /**
   *
   * @type {string}
   * @memberof EligibilityModule
   */
  genderDescription?: string
  /**
   *
   * @type {string}
   * @memberof EligibilityModule
   */
  minimumAge?: string
  /**
   *
   * @type {string}
   * @memberof EligibilityModule
   */
  maximumAge?: string
  /**
   *
   * @type {Array<StandardAge>}
   * @memberof EligibilityModule
   */
  stdAges?: Array<StandardAge>
  /**
   *
   * @type {string}
   * @memberof EligibilityModule
   */
  studyPopulation?: string
  /**
   *
   * @type {SamplingMethod}
   * @memberof EligibilityModule
   */
  samplingMethod?: SamplingMethod
}

export function EligibilityModuleFromJSON(json: any): EligibilityModule {
  return EligibilityModuleFromJSONTyped(json, false)
}

export function EligibilityModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EligibilityModule {
  if (json == null) {
    return json
  }
  return {
    eligibilityCriteria:
      json["eligibilityCriteria"] == null
        ? undefined
        : json["eligibilityCriteria"],
    healthyVolunteers:
      json["healthyVolunteers"] == null ? undefined : json["healthyVolunteers"],
    sex: json["sex"] == null ? undefined : SexFromJSON(json["sex"]),
    genderBased: json["genderBased"] == null ? undefined : json["genderBased"],
    genderDescription:
      json["genderDescription"] == null ? undefined : json["genderDescription"],
    minimumAge: json["minimumAge"] == null ? undefined : json["minimumAge"],
    maximumAge: json["maximumAge"] == null ? undefined : json["maximumAge"],
    stdAges:
      json["stdAges"] == null
        ? undefined
        : (json["stdAges"] as Array<any>).map(StandardAgeFromJSON),
    studyPopulation:
      json["studyPopulation"] == null ? undefined : json["studyPopulation"],
    samplingMethod:
      json["samplingMethod"] == null
        ? undefined
        : SamplingMethodFromJSON(json["samplingMethod"]),
  }
}
