;
/* tslint:disable */
/* eslint-disable */

import type { BrowseBranch } from "./BrowseBranch";
import { BrowseBranchFromJSON } from "./BrowseBranch";
import type { BrowseLeaf } from "./BrowseLeaf";
import { BrowseLeafFromJSON } from "./BrowseLeaf";
import type { Mesh } from "./Mesh";
import { MeshFromJSON } from "./Mesh";


/**
 *
 * @export
 * @interface BrowseModule
 */
export interface BrowseModule {
  /**
   *
   * @type {Array<Mesh>}
   * @memberof BrowseModule
   */
  meshes?: Array<Mesh>
  /**
   *
   * @type {Array<Mesh>}
   * @memberof BrowseModule
   */
  ancestors?: Array<Mesh>
  /**
   *
   * @type {Array<BrowseLeaf>}
   * @memberof BrowseModule
   */
  browseLeaves?: Array<BrowseLeaf>
  /**
   *
   * @type {Array<BrowseBranch>}
   * @memberof BrowseModule
   */
  browseBranches?: Array<BrowseBranch>
}

export function BrowseModuleFromJSON(json: any): BrowseModule {
  return BrowseModuleFromJSONTyped(json, false)
}

export function BrowseModuleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): BrowseModule {
  if (json == null) {
    return json
  }
  return {
    meshes:
      json["meshes"] == null
        ? undefined
        : (json["meshes"] as Array<any>).map(MeshFromJSON),
    ancestors:
      json["ancestors"] == null
        ? undefined
        : (json["ancestors"] as Array<any>).map(MeshFromJSON),
    browseLeaves:
      json["browseLeaves"] == null
        ? undefined
        : (json["browseLeaves"] as Array<any>).map(BrowseLeafFromJSON),
    browseBranches:
      json["browseBranches"] == null
        ? undefined
        : (json["browseBranches"] as Array<any>).map(BrowseBranchFromJSON),
  }
}
