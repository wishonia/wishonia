/* tslint:disable */

/* eslint-disable */

/**
 *
 * @export
 * @interface Mesh
 */
export interface Mesh {
  /**
   *
   * @type {string}
   * @memberof Mesh
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof Mesh
   */
  term?: string
}

export function MeshFromJSON(json: any): Mesh {
  return MeshFromJSONTyped(json, false)
}

export function MeshFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Mesh {
  if (json == null) {
    return json
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    term: json["term"] == null ? undefined : json["term"],
  }
}
