/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const Status = {
  ActiveNotRecruiting: "ACTIVE_NOT_RECRUITING",
  Completed: "COMPLETED",
  EnrollingByInvitation: "ENROLLING_BY_INVITATION",
  NotYetRecruiting: "NOT_YET_RECRUITING",
  Recruiting: "RECRUITING",
  Suspended: "SUSPENDED",
  Terminated: "TERMINATED",
  Withdrawn: "WITHDRAWN",
  Available: "AVAILABLE",
  NoLongerAvailable: "NO_LONGER_AVAILABLE",
  TemporarilyNotAvailable: "TEMPORARILY_NOT_AVAILABLE",
  ApprovedForMarketing: "APPROVED_FOR_MARKETING",
  Withheld: "WITHHELD",
  Unknown: "UNKNOWN",
} as const
export type Status = (typeof Status)[keyof typeof Status]

export function StatusFromJSON(json: any): Status {
  return StatusFromJSONTyped(json, false)
}

export function StatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Status {
  return json as Status
}
