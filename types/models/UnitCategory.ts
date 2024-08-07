/**
 * Decentralized FDA API
 * A platform for quantifying the effects of every drug, supplement, food, and other factor on your health.
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export class UnitCategory {
  /**
   * id
   */
  "id"?: number
  /**
   * Category name
   */
  "name": string
  /**
   * Base unit for in which measurements are to be converted to and stored
   */
  "standardUnitAbbreviatedName"?: string

  static readonly discriminator: string | undefined = undefined

  static readonly attributeTypeMap: Array<{
    name: string
    baseName: string
    type: string
    format: string
  }> = [
    {
      name: "id",
      baseName: "id",
      type: "number",
      format: "",
    },
    {
      name: "name",
      baseName: "name",
      type: "string",
      format: "",
    },
    {
      name: "standardUnitAbbreviatedName",
      baseName: "standardUnitAbbreviatedName",
      type: "string",
      format: "",
    },
  ]

  static getAttributeTypeMap() {
    return UnitCategory.attributeTypeMap
  }

  public constructor() {}
}
