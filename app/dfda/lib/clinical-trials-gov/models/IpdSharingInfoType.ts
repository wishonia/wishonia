/* tslint:disable */
/* eslint-disable */

/**
 *
 * @export
 */
export const IpdSharingInfoType = {
  StudyProtocol: "STUDY_PROTOCOL",
  Sap: "SAP",
  Icf: "ICF",
  Csr: "CSR",
  AnalyticCode: "ANALYTIC_CODE",
} as const
export type IpdSharingInfoType =
  (typeof IpdSharingInfoType)[keyof typeof IpdSharingInfoType]

export function IpdSharingInfoTypeFromJSON(json: any): IpdSharingInfoType {
  return IpdSharingInfoTypeFromJSONTyped(json, false)
}

export function IpdSharingInfoTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IpdSharingInfoType {
  return json as IpdSharingInfoType
}
