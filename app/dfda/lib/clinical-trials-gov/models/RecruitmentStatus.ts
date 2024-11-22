/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const RecruitmentStatus = {
  ActiveNotRecruiting: "ACTIVE_NOT_RECRUITING",
  Completed: "COMPLETED",
  EnrollingByInvitation: "ENROLLING_BY_INVITATION",
  NotYetRecruiting: "NOT_YET_RECRUITING",
  Recruiting: "RECRUITING",
  Suspended: "SUSPENDED",
  Terminated: "TERMINATED",
  Withdrawn: "WITHDRAWN",
  Available: "AVAILABLE",
} as const
export type RecruitmentStatus =
  (typeof RecruitmentStatus)[keyof typeof RecruitmentStatus]

export function RecruitmentStatusFromJSON(json: any): RecruitmentStatus {
  return RecruitmentStatusFromJSONTyped(json, false)
}

export function RecruitmentStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): RecruitmentStatus {
  return json as RecruitmentStatus
}
