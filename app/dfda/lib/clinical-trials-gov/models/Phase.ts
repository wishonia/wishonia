/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const Phase = {
  Na: "NA",
  EarlyPhase1: "EARLY_PHASE1",
  Phase1: "PHASE1",
  Phase2: "PHASE2",
  Phase3: "PHASE3",
  Phase4: "PHASE4",
} as const
export type Phase = (typeof Phase)[keyof typeof Phase]

export function PhaseFromJSON(json: any): Phase {
  return PhaseFromJSONTyped(json, false)
}

export function PhaseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Phase {
  return json as Phase
}
