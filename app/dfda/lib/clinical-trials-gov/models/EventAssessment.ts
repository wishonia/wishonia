/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const EventAssessment = {
  NonSystematicAssessment: "NON_SYSTEMATIC_ASSESSMENT",
  SystematicAssessment: "SYSTEMATIC_ASSESSMENT",
} as const
export type EventAssessment =
  (typeof EventAssessment)[keyof typeof EventAssessment]

export function EventAssessmentFromJSON(json: any): EventAssessment {
  return EventAssessmentFromJSONTyped(json, false)
}

export function EventAssessmentFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): EventAssessment {
  return json as EventAssessment
}
