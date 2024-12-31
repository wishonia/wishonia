import { AppSettings } from "../models/AppSettings"
import { AppSettingsResponse } from "../models/AppSettingsResponse"
import { AuthorizedClients } from "../models/AuthorizedClients"
import { Button } from "../models/Button"
import { Card } from "../models/Card"
import { Chart } from "../models/Chart"
import { CommonResponse } from "../models/CommonResponse"
import { ConnectInstructions } from "../models/ConnectInstructions"
import {
  ConversionStep,
} from "../models/ConversionStep"
import { Correlation } from "../models/Correlation"
import { DataSource } from "../models/DataSource"
import { DeviceToken } from "../models/DeviceToken"
import { ErrorResponse } from "../models/ErrorResponse"
import { Explanation } from "../models/Explanation"
import { ExplanationStartTracking } from "../models/ExplanationStartTracking"
import { FeedResponse } from "../models/FeedResponse"
import { GetConnectorsResponse } from "../models/GetConnectorsResponse"
import { GetCorrelationsDataResponse } from "../models/GetCorrelationsDataResponse"
import { GetSharesResponse } from "../models/GetSharesResponse"
import { GetStudiesResponse } from "../models/GetStudiesResponse"
import { GetTrackingReminderNotificationsResponse } from "../models/GetTrackingReminderNotificationsResponse"
import { GetUserVariableRelationshipsResponse } from "../models/GetUserVariableRelationshipsResponse"
import { HyperParameterCorrelation } from "../models/HyperParameterCorrelation"
import { Image } from "../models/Image"
import { InputField } from "../models/InputField"
import { JsonErrorResponse } from "../models/JsonErrorResponse"
import {
  Measurement,
} from "../models/Measurement"
import {
  MeasurementItem,
} from "../models/MeasurementItem"
import { MeasurementUpdate } from "../models/MeasurementUpdate"
import { Pair } from "../models/Pair"
import { ParticipantInstruction } from "../models/ParticipantInstruction"
import { PostMeasurementsDataResponse } from "../models/PostMeasurementsDataResponse"
import { PostMeasurementsResponse } from "../models/PostMeasurementsResponse"
import { PostStudyCreateResponse } from "../models/PostStudyCreateResponse"
import { PostStudyPublishResponse } from "../models/PostStudyPublishResponse"
import { PostTrackingRemindersDataResponse } from "../models/PostTrackingRemindersDataResponse"
import { PostTrackingRemindersResponse } from "../models/PostTrackingRemindersResponse"
import { PostUserSettingsDataResponse } from "../models/PostUserSettingsDataResponse"
import { PostUserSettingsResponse } from "../models/PostUserSettingsResponse"
import { ShareInvitationBody } from "../models/ShareInvitationBody"
import { Study } from "../models/Study"
import { StudyCharts } from "../models/StudyCharts"
import {
  StudyCreationBody,
} from "../models/StudyCreationBody"
import { StudyHtml } from "../models/StudyHtml"
import { StudyImages } from "../models/StudyImages"
import { StudyJoinResponse } from "../models/StudyJoinResponse"
import { StudyLinks } from "../models/StudyLinks"
import { StudySharing } from "../models/StudySharing"
import { StudyText } from "../models/StudyText"
import { StudyVotes } from "../models/StudyVotes"
import {
  TagVariable,
} from "../models/TagVariable"
import {
  TrackingReminder,
} from "../models/TrackingReminder"
import {
  TrackingReminderNotification,
} from "../models/TrackingReminderNotification"
import { TrackingReminderNotificationAction } from "../models/TrackingReminderNotificationAction"
import {
  TrackingReminderNotificationPost,
} from "../models/TrackingReminderNotificationPost"
import { TrackingReminderNotificationTrackAllAction } from "../models/TrackingReminderNotificationTrackAllAction"
import { Unit } from "../models/Unit"
import { UnitCategory } from "../models/UnitCategory"
import { User } from "../models/User"
import { UserPostBody } from "../models/UserPostBody"
import { UsersResponse } from "../models/UsersResponse"
import { UserTag } from "../models/UserTag"
import {
  UserVariable,
} from "../models/UserVariable"
import { UserVariableDelete } from "../models/UserVariableDelete"
import {
  VariableCategory,
} from "../models/VariableCategory"
import { VariableCharts } from "../models/VariableCharts"
import { Vote } from "../models/Vote"
import {
  GlobalVariable,
} from "./GlobalVariable"

export * from "../models/AppSettings"
export * from "../models/AppSettingsResponse"
export * from "../models/AuthorizedClients"
export * from "../models/Button"
export * from "../models/Card"
export * from "../models/Chart"
export * from "../models/CommonResponse"
export * from "../models/ConnectInstructions"
export * from "../models/ConversionStep"
export * from "../models/Correlation"
export * from "../models/DataSource"
export * from "../models/DeviceToken"
export * from "../models/ErrorResponse"
export * from "../models/Explanation"
export * from "../models/ExplanationStartTracking"
export * from "../models/FeedResponse"
export * from "../models/GetConnectorsResponse"
export * from "../models/GetCorrelationsDataResponse"
export * from "../models/GetSharesResponse"
export * from "../models/GetStudiesResponse"
export * from "../models/GetTrackingReminderNotificationsResponse"
export * from "../models/GetUserVariableRelationshipsResponse"
export * from "../models/HyperParameterCorrelation"
export * from "../models/Image"
export * from "../models/InputField"
export * from "../models/JsonErrorResponse"
export * from "../models/Measurement"
export * from "../models/MeasurementItem"
export * from "../models/MeasurementUpdate"
export * from "../models/Pair"
export * from "../models/ParticipantInstruction"
export * from "../models/PostMeasurementsDataResponse"
export * from "../models/PostMeasurementsResponse"
export * from "../models/PostStudyCreateResponse"
export * from "../models/PostStudyPublishResponse"
export * from "../models/PostTrackingRemindersDataResponse"
export * from "../models/PostTrackingRemindersResponse"
export * from "../models/PostUserSettingsDataResponse"
export * from "../models/PostUserSettingsResponse"
export * from "../models/ShareInvitationBody"
export * from "../models/Study"
export * from "../models/StudyCharts"
export * from "../models/StudyCreationBody"
export * from "../models/StudyHtml"
export * from "../models/StudyImages"
export * from "../models/StudyJoinResponse"
export * from "../models/StudyLinks"
export * from "../models/StudySharing"
export * from "../models/StudyText"
export * from "../models/StudyVotes"
export * from "../models/TagVariable"
export * from "../models/TrackingReminder"
export * from "../models/TrackingReminderNotification"
export * from "../models/TrackingReminderNotificationAction"
export * from "../models/TrackingReminderNotificationPost"
export * from "../models/TrackingReminderNotificationTrackAllAction"
export * from "../models/Unit"
export * from "../models/UnitCategory"
export * from "../models/User"
export * from "../models/UserPostBody"
export * from "../models/UserTag"
export * from "../models/UserVariable"
export * from "../models/UserVariableDelete"
export * from "../models/UsersResponse"
export * from "./GlobalVariable"
export * from "../models/VariableCategory"
export * from "../models/VariableCharts"
export * from "../models/Vote"

/* tslint:disable:no-unused-variable */
let primitives = [
  "string",
  "boolean",
  "double",
  "integer",
  "long",
  "float",
  "number",
  "any",
]

const supportedMediaTypes: { [mediaType: string]: number } = {
  "application/json": Infinity,
  "application/octet-stream": 0,
  "application/x-www-form-urlencoded": 0,
}

let enumsMap: Set<string> = new Set<string>([
  "ConversionStepOperationEnum",
  "InputFieldTypeEnum",
  "MeasurementVariableCategoryNameEnum",
  "MeasurementItemVariableCategoryNameEnum",
  "MeasurementItemCombinationOperationEnum",
  "StudyCreationBodyTypeEnum",
  "TagVariableCombinationOperationEnum",
  "TagVariableFillingTypeEnum",
  "TagVariableVariableCategoryNameEnum",
  "TrackingReminderCombinationOperationEnum",
  "TrackingReminderVariableCategoryNameEnum",
  "TrackingReminderNotificationCombinationOperationEnum",
  "TrackingReminderNotificationVariableCategoryNameEnum",
  "TrackingReminderNotificationPostActionEnum",
  "UnitCategoryEnum",
  "UserVariableCombinationOperationEnum",
  "UserVariableFillingTypeEnum",
  "UserVariableVariableCategoryNameEnum",
  "VariableCombinationOperationEnum",
  "VariableFillingTypeEnum",
  "VariableVariableCategoryNameEnum",
  "VariableCategoryVariableCategoryNameEnum",
  "VoteValueEnum",
  "VoteTypeEnum",
])

let typeMap: { [index: string]: any } = {
  AppSettings: AppSettings,
  AppSettingsResponse: AppSettingsResponse,
  AuthorizedClients: AuthorizedClients,
  Button: Button,
  Card: Card,
  Chart: Chart,
  CommonResponse: CommonResponse,
  ConnectInstructions: ConnectInstructions,
  ConversionStep: ConversionStep,
  Correlation: Correlation,
  DataSource: DataSource,
  DeviceToken: DeviceToken,
  ErrorResponse: ErrorResponse,
  Explanation: Explanation,
  ExplanationStartTracking: ExplanationStartTracking,
  FeedResponse: FeedResponse,
  GetConnectorsResponse: GetConnectorsResponse,
  GetCorrelationsDataResponse: GetCorrelationsDataResponse,
  GetSharesResponse: GetSharesResponse,
  GetStudiesResponse: GetStudiesResponse,
  GetTrackingReminderNotificationsResponse:
    GetTrackingReminderNotificationsResponse,
  GetUserVariableRelationshipsResponse: GetUserVariableRelationshipsResponse,
  HyperParameterCorrelation: HyperParameterCorrelation,
  Image: Image,
  InputField: InputField,
  JsonErrorResponse: JsonErrorResponse,
  Measurement: Measurement,
  MeasurementItem: MeasurementItem,
  MeasurementUpdate: MeasurementUpdate,
  Pair: Pair,
  ParticipantInstruction: ParticipantInstruction,
  PostMeasurementsDataResponse: PostMeasurementsDataResponse,
  PostMeasurementsResponse: PostMeasurementsResponse,
  PostStudyCreateResponse: PostStudyCreateResponse,
  PostStudyPublishResponse: PostStudyPublishResponse,
  PostTrackingRemindersDataResponse: PostTrackingRemindersDataResponse,
  PostTrackingRemindersResponse: PostTrackingRemindersResponse,
  PostUserSettingsDataResponse: PostUserSettingsDataResponse,
  PostUserSettingsResponse: PostUserSettingsResponse,
  ShareInvitationBody: ShareInvitationBody,
  Study: Study,
  StudyCharts: StudyCharts,
  StudyCreationBody: StudyCreationBody,
  StudyHtml: StudyHtml,
  StudyImages: StudyImages,
  StudyJoinResponse: StudyJoinResponse,
  StudyLinks: StudyLinks,
  StudySharing: StudySharing,
  StudyText: StudyText,
  StudyVotes: StudyVotes,
  TagVariable: TagVariable,
  TrackingReminder: TrackingReminder,
  TrackingReminderNotification: TrackingReminderNotification,
  TrackingReminderNotificationAction: TrackingReminderNotificationAction,
  TrackingReminderNotificationPost: TrackingReminderNotificationPost,
  TrackingReminderNotificationTrackAllAction:
    TrackingReminderNotificationTrackAllAction,
  Unit: Unit,
  UnitCategory: UnitCategory,
  User: User,
  UserPostBody: UserPostBody,
  UserTag: UserTag,
  UserVariable: UserVariable,
  UserVariableDelete: UserVariableDelete,
  UsersResponse: UsersResponse,
  Variable: GlobalVariable,
  VariableCategory: VariableCategory,
  VariableCharts: VariableCharts,
  Vote: Vote,
}

export class ObjectSerializer {
  public static findCorrectType(data: any, expectedType: string) {
    if (data == undefined) {
      return expectedType
    } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
      return expectedType
    } else if (expectedType === "Date") {
      return expectedType
    } else {
      if (enumsMap.has(expectedType)) {
        return expectedType
      }

      if (!typeMap[expectedType]) {
        return expectedType // w/e we don't know the type
      }

      // Check the discriminator
      let discriminatorProperty = typeMap[expectedType].discriminator
      if (discriminatorProperty == null) {
        return expectedType // the type does not have a discriminator. use it.
      } else {
        if (data[discriminatorProperty]) {
          var discriminatorType = data[discriminatorProperty]
          if (typeMap[discriminatorType]) {
            return discriminatorType // use the type given in the discriminator
          } else {
            return expectedType // discriminator did not map to a type
          }
        } else {
          return expectedType // discriminator was not present (or an empty string)
        }
      }
    }
  }

  public static serialize(data: any, type: string, format: string) {
    if (data == undefined) {
      return data
    } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
      return data
    } else if (type.lastIndexOf("Array<", 0) === 0) {
      // string.startsWith pre es6
      let subType: string = type.replace("Array<", "") // Array<Type> => Type>
      subType = subType.substring(0, subType.length - 1) // Type> => Type
      let transformedData: any[] = []
      for (let index in data) {
        let date = data[index]
        transformedData.push(ObjectSerializer.serialize(date, subType, format))
      }
      return transformedData
    } else if (type === "Date") {
      if (format == "date") {
        let month = data.getMonth() + 1
        month = month < 10 ? "0" + month.toString() : month.toString()
        let day = data.getDate()
        day = day < 10 ? "0" + day.toString() : day.toString()

        return data.getFullYear() + "-" + month + "-" + day
      } else {
        return data.toISOString()
      }
    } else {
      if (enumsMap.has(type)) {
        return data
      }
      if (!typeMap[type]) {
        // in case we dont know the type
        return data
      }

      // Get the actual type of this object
      type = this.findCorrectType(data, type)

      // get the map for the correct type.
      let attributeTypes = typeMap[type].getAttributeTypeMap()
      let instance: { [index: string]: any } = {}
      for (let index in attributeTypes) {
        let attributeType = attributeTypes[index]
        instance[attributeType.baseName] = ObjectSerializer.serialize(
          data[attributeType.name],
          attributeType.type,
          attributeType.format
        )
      }
      return instance
    }
  }

  public static deserialize(data: any, type: string, format: string) {
    // polymorphism may change the actual type.
    type = ObjectSerializer.findCorrectType(data, type)
    if (data == undefined) {
      return data
    } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
      return data
    } else if (type.lastIndexOf("Array<", 0) === 0) {
      // string.startsWith pre es6
      let subType: string = type.replace("Array<", "") // Array<Type> => Type>
      subType = subType.substring(0, subType.length - 1) // Type> => Type
      let transformedData: any[] = []
      for (let index in data) {
        let date = data[index]
        transformedData.push(
          ObjectSerializer.deserialize(date, subType, format)
        )
      }
      return transformedData
    } else if (type === "Date") {
      return new Date(data)
    } else {
      if (enumsMap.has(type)) {
        // is Enum
        return data
      }

      if (!typeMap[type]) {
        // dont know the type
        return data
      }
      let instance = new typeMap[type]()
      let attributeTypes = typeMap[type].getAttributeTypeMap()
      for (let index in attributeTypes) {
        let attributeType = attributeTypes[index]
        let value = ObjectSerializer.deserialize(
          data[attributeType.baseName],
          attributeType.type,
          attributeType.format
        )
        if (value !== undefined) {
          instance[attributeType.name] = value
        }
      }
      return instance
    }
  }

  /**
   * Normalize media type
   *
   * We currently do not handle any media types attributes, i.e. anything
   * after a semicolon. All content is assumed to be UTF-8 compatible.
   */
  public static normalizeMediaType(
    mediaType: string | undefined
  ): string | undefined {
    if (mediaType === undefined) {
      return undefined
    }
    return mediaType.split(";")[0].trim().toLowerCase()
  }

  /**
   * From a list of possible media types, choose the one we can handle best.
   *
   * The order of the given media types does not have any impact on the choice
   * made.
   */
  public static getPreferredMediaType(mediaTypes: Array<string>): string {
    /** According to OAS 3 we should default to json */
    if (!mediaTypes) {
      return "application/json"
    }

    const normalMediaTypes = mediaTypes.map(this.normalizeMediaType)
    let selectedMediaType: string | undefined = undefined
    let selectedRank: number = -Infinity
    for (const mediaType of normalMediaTypes) {
      if (supportedMediaTypes[mediaType!] > selectedRank) {
        selectedMediaType = mediaType
        selectedRank = supportedMediaTypes[mediaType!]
      }
    }

    if (selectedMediaType === undefined) {
      throw new Error(
        "None of the given media types are supported: " + mediaTypes.join(", ")
      )
    }

    return selectedMediaType!
  }

  /**
   * Convert data to a string according the given media type
   */
  public static stringify(data: any, mediaType: string): string {
    if (mediaType === "text/plain") {
      return String(data)
    }

    if (mediaType === "application/json") {
      return JSON.stringify(data)
    }

    throw new Error(
      "The mediaType " +
        mediaType +
        " is not supported by ObjectSerializer.stringify."
    )
  }

  /**
   * Parse data from a string according to the given media type
   */
  public static parse(rawData: string, mediaType: string | undefined) {
    if (mediaType === undefined) {
      throw new Error("Cannot parse content. No Content-Type defined.")
    }

    if (mediaType === "text/plain") {
      return rawData
    }

    if (mediaType === "application/json") {
      return JSON.parse(rawData)
    }

    if (mediaType === "text/html") {
      return rawData
    }

    throw new Error(
      "The mediaType " +
        mediaType +
        " is not supported by ObjectSerializer.parse."
    )
  }
}
