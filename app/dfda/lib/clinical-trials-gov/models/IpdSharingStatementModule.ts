;
/* tslint:disable */
/* eslint-disable */

import type { IpdSharing } from "./IpdSharing";
import { IpdSharingFromJSON } from "./IpdSharing";
import type { IpdSharingInfoType } from "./IpdSharingInfoType";
import { IpdSharingInfoTypeFromJSON } from "./IpdSharingInfoType";


/**
 *
 * @export
 * @interface IpdSharingStatementModule
 */
export interface IpdSharingStatementModule {
  /**
   *
   * @type {IpdSharing}
   * @memberof IpdSharingStatementModule
   */
  ipdSharing?: IpdSharing
  /**
   *
   * @type {string}
   * @memberof IpdSharingStatementModule
   */
  description?: string
  /**
   *
   * @type {Array<IpdSharingInfoType>}
   * @memberof IpdSharingStatementModule
   */
  infoTypes?: Array<IpdSharingInfoType>
  /**
   *
   * @type {string}
   * @memberof IpdSharingStatementModule
   */
  timeFrame?: string
  /**
   *
   * @type {string}
   * @memberof IpdSharingStatementModule
   */
  accessCriteria?: string
  /**
   *
   * @type {string}
   * @memberof IpdSharingStatementModule
   */
  url?: string
}

export function IpdSharingStatementModuleFromJSON(
  json: any
): IpdSharingStatementModule {
  return IpdSharingStatementModuleFromJSONTyped(json, false)
}

export function IpdSharingStatementModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IpdSharingStatementModule {
  if (json == null) {
    return json
  }
  return {
    ipdSharing:
      json["ipdSharing"] == null
        ? undefined
        : IpdSharingFromJSON(json["ipdSharing"]),
    description: json["description"] == null ? undefined : json["description"],
    infoTypes:
      json["infoTypes"] == null
        ? undefined
        : (json["infoTypes"] as Array<any>).map(IpdSharingInfoTypeFromJSON),
    timeFrame: json["timeFrame"] == null ? undefined : json["timeFrame"],
    accessCriteria:
      json["accessCriteria"] == null ? undefined : json["accessCriteria"],
    url: json["url"] == null ? undefined : json["url"],
  }
}
