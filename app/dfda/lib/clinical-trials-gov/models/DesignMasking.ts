/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const DesignMasking = {
  None: "NONE",
  Single: "SINGLE",
  Double: "DOUBLE",
  Triple: "TRIPLE",
  Quadruple: "QUADRUPLE",
} as const
export type DesignMasking = (typeof DesignMasking)[keyof typeof DesignMasking]

export function DesignMaskingFromJSON(json: any): DesignMasking {
  return DesignMaskingFromJSONTyped(json, false)
}

export function DesignMaskingFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DesignMasking {
  return json as DesignMasking
}
