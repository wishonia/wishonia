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

import { ConversionStep } from '../models/ConversionStep';
import { UnitCategory } from '../models/UnitCategory';


export class Unit {
    /**
    * Unit abbreviation
    */
    'abbreviatedName': string;
    /**
    * Ex: 1
    */
    'advanced'?: number;
    /**
    * Unit category
    */
    'category': UnitCategoryEnum;
    /**
    * Ex: 6
    */
    'categoryId'?: number;
    /**
    * Ex: Miscellany
    */
    'categoryName'?: string;
    /**
    * Conversion steps list
    */
    'conversionSteps': Array<ConversionStep>;
    /**
    * Ex: 29
    */
    'id'?: number;
    /**
    * Ex: https://static.quantimo.do/img/medical/png/pill.png
    */
    'image'?: string;
    /**
    * Ex: 0
    */
    'manualTracking'?: number;
    /**
    * The maximum allowed value for measurements. While you can record a value above this maximum, it will be excluded from the correlation analysis.
    */
    'maximumAllowedValue'?: number;
    /**
    * Ex: 4
    */
    'maximumValue': number;
    /**
    * The minimum allowed value for measurements. While you can record a value below this minimum, it will be excluded from the correlation analysis.
    */
    'minimumAllowedValue'?: number;
    /**
    * Ex: 0
    */
    'minimumValue'?: number;
    /**
    * Unit name
    */
    'name': string;
    'unitCategory': UnitCategory;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "abbreviatedName",
            "baseName": "abbreviatedName",
            "type": "string",
            "format": ""
        },
        {
            "name": "advanced",
            "baseName": "advanced",
            "type": "number",
            "format": ""
        },
        {
            "name": "category",
            "baseName": "category",
            "type": "UnitCategoryEnum",
            "format": ""
        },
        {
            "name": "categoryId",
            "baseName": "categoryId",
            "type": "number",
            "format": ""
        },
        {
            "name": "categoryName",
            "baseName": "categoryName",
            "type": "string",
            "format": ""
        },
        {
            "name": "conversionSteps",
            "baseName": "conversionSteps",
            "type": "Array<ConversionStep>",
            "format": ""
        },
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "image",
            "baseName": "image",
            "type": "string",
            "format": ""
        },
        {
            "name": "manualTracking",
            "baseName": "manualTracking",
            "type": "number",
            "format": ""
        },
        {
            "name": "maximumAllowedValue",
            "baseName": "maximumAllowedValue",
            "type": "number",
            "format": "double"
        },
        {
            "name": "maximumValue",
            "baseName": "maximumValue",
            "type": "number",
            "format": ""
        },
        {
            "name": "minimumAllowedValue",
            "baseName": "minimumAllowedValue",
            "type": "number",
            "format": "double"
        },
        {
            "name": "minimumValue",
            "baseName": "minimumValue",
            "type": "number",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "unitCategory",
            "baseName": "unitCategory",
            "type": "UnitCategory",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return Unit.attributeTypeMap;
    }

    public constructor() {
    }
}


export type UnitCategoryEnum = "Distance" | "Duration" | "Energy" | "Frequency" | "Miscellany" | "Pressure" | "Proportion" | "Rating" | "Temperature" | "Volume" | "Weight" | "Count" ;
