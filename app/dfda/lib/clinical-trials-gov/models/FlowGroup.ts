/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface FlowGroup
 */
export interface FlowGroup {
  /**
   *
   * @type {string}
   * @memberof FlowGroup
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof FlowGroup
   */
  title?: string
  /**
   *
   * @type {string}
   * @memberof FlowGroup
   */
  description?: string
}

export function FlowGroupFromJSON(json: any): FlowGroup {
  return FlowGroupFromJSONTyped(json, false)
}

export function FlowGroupFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): FlowGroup {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    title: json["title"] == null ? undefined : json["title"],
    description: json["description"] == null ? undefined : json["description"],
  }
}
