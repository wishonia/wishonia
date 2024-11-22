;
/* tslint:disable */
/* eslint-disable */

import type { BrowseModule } from "./BrowseModule";
import { BrowseModuleFromJSON } from "./BrowseModule";
import type { MiscInfoModule } from "./MiscInfoModule";
import { MiscInfoModuleFromJSON } from "./MiscInfoModule";


/**
 *
 * @export
 * @interface DerivedSection
 */
export interface DerivedSection {
  /**
   *
   * @type {MiscInfoModule}
   * @memberof DerivedSection
   */
  miscInfoModule?: MiscInfoModule
  /**
   *
   * @type {BrowseModule}
   * @memberof DerivedSection
   */
  conditionBrowseModule?: BrowseModule
  /**
   *
   * @type {BrowseModule}
   * @memberof DerivedSection
   */
  interventionBrowseModule?: BrowseModule
}

export function DerivedSectionFromJSON(json: any): DerivedSection {
  return DerivedSectionFromJSONTyped(json, false)
}

export function DerivedSectionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DerivedSection {
  if (json == null) {
    return json
  }
  return {
    miscInfoModule:
      json["miscInfoModule"] == null
        ? undefined
        : MiscInfoModuleFromJSON(json["miscInfoModule"]),
    conditionBrowseModule:
      json["conditionBrowseModule"] == null
        ? undefined
        : BrowseModuleFromJSON(json["conditionBrowseModule"]),
    interventionBrowseModule:
      json["interventionBrowseModule"] == null
        ? undefined
        : BrowseModuleFromJSON(json["interventionBrowseModule"]),
  }
}
