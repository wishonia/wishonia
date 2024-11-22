/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const InterventionalAssignment = {
  SingleGroup: "SINGLE_GROUP",
  Parallel: "PARALLEL",
  Crossover: "CROSSOVER",
  Factorial: "FACTORIAL",
  Sequential: "SEQUENTIAL",
} as const
export type InterventionalAssignment =
  (typeof InterventionalAssignment)[keyof typeof InterventionalAssignment]

export function InterventionalAssignmentFromJSON(
  json: any
): InterventionalAssignment {
  return InterventionalAssignmentFromJSONTyped(json, false)
}

export function InterventionalAssignmentFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): InterventionalAssignment {
  return json as InterventionalAssignment
}
