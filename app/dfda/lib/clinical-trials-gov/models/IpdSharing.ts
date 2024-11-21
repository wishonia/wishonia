/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const IpdSharing = {
  Yes: "YES",
  No: "NO",
  Undecided: "UNDECIDED",
} as const
export type IpdSharing = (typeof IpdSharing)[keyof typeof IpdSharing]

export function IpdSharingFromJSON(json: any): IpdSharing {
  return IpdSharingFromJSONTyped(json, false)
}

export function IpdSharingFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IpdSharing {
  return json as IpdSharing
}
