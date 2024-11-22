/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const DesignAllocation = {
  Randomized: "RANDOMIZED",
  NonRandomized: "NON_RANDOMIZED",
  Na: "NA",
} as const
export type DesignAllocation =
  (typeof DesignAllocation)[keyof typeof DesignAllocation]

export function DesignAllocationFromJSON(json: any): DesignAllocation {
  return DesignAllocationFromJSONTyped(json, false)
}

export function DesignAllocationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DesignAllocation {
  return json as DesignAllocation
}
