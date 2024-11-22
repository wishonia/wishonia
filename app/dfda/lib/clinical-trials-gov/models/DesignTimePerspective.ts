/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const DesignTimePerspective = {
  Retrospective: "RETROSPECTIVE",
  Prospective: "PROSPECTIVE",
  CrossSectional: "CROSS_SECTIONAL",
  Other: "OTHER",
} as const
export type DesignTimePerspective =
  (typeof DesignTimePerspective)[keyof typeof DesignTimePerspective]

export function DesignTimePerspectiveFromJSON(
  json: any
): DesignTimePerspective {
  return DesignTimePerspectiveFromJSONTyped(json, false)
}

export function DesignTimePerspectiveFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DesignTimePerspective {
  return json as DesignTimePerspective
}
