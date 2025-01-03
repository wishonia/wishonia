import { Unit } from "@/types/models/Unit";

export const units: Unit[] = [
    {
        "abbreviatedName": "applications",
        "advanced": 1,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingType": "zero",
        "fillingValue": 0,
        "fontAwesome": "fas fa-medkit",
        "hint": null,
        "id": 14,
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "manualTracking": 1,
        "maximumDailyValue": 20,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Applications",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Applications",
            "applications",
            "Application",
            "application"
        ],
        "unitCategoryId": 13,
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "bpm",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 26,
        "manualTracking": 0,
        "maximumValue": 300,
        "minimumValue": 20,
        "name": "Beats per Minute",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Beats per Minute",
            "bpm"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/heart.png",
        "fontAwesome": "far fa-heart",
        "add": null,
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "maximumDailyValue": 20000,
        "abbreviatedName": "cal",
        "advanced": 1,
        "unitCategoryId": 7,
        "categoryName": "Energy",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 39,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Calories",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Calories",
            "cal",
            "Calory"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "abbreviatedName": "capsules",
        "advanced": 1,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingType": "zero",
        "fillingValue": 0,
        "fontAwesome": "fas fa-medkit",
        "hint": null,
        "id": 27,
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "manualTracking": 1,
        "maximumDailyValue": 20,
        "maximumValue": 1000,
        "minimumValue": 0,
        "name": "Capsules",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Capsules",
            "capsules",
            "Capsule",
            "capsule"
        ],
        "unitCategoryId": 13,
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "cm",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.01
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 31,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Centimeters",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Centimeters",
            "cm",
            "Centimeter"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "count",
        "advanced": 0,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": "SUM",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 23,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Count",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Ea",
            "Ct",
            "Count",
            "count"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "dB",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 212,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Decibels",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Decibels",
            "dB",
            "Decibel"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/ear.png",
        "fontAwesome": "fab fa-speaker-deck",
        "add": null,
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "C",
        "advanced": 1,
        "unitCategoryId": 11,
        "categoryName": "Temperature",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 46,
        "manualTracking": 1,
        "maximumValue": 101,
        "minimumValue": -66,
        "name": "Degrees Celsius",
        "scale": "interval",
        "suffix": null,
        "synonyms": [
            "C",
            "\u00b0C"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "degrees east",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 17,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Degrees East",
        "scale": "interval",
        "suffix": null,
        "synonyms": [
            "Degrees East",
            "degrees east"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "F",
        "advanced": 1,
        "unitCategoryId": 11,
        "categoryName": "Temperature",
        "combinationOperation": "MEAN",
        "conversionSteps": [
            {
                "operation": "ADD",
                "value": -32
            },
            {
                "operation": "MULTIPLY",
                "value": 0.55555555555556
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 45,
        "manualTracking": 1,
        "maximumValue": 214,
        "minimumValue": -87,
        "name": "Degrees Fahrenheit",
        "scale": "interval",
        "suffix": null,
        "synonyms": [
            "Degrees Fahrenheit",
            "F",
            "\u00b0F"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "degrees north",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 18,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Degrees North",
        "scale": "interval",
        "suffix": null,
        "synonyms": [
            "Degrees North",
            "degrees north"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "$",
        "advanced": 1,
        "unitCategoryId": 12,
        "categoryName": "Currency",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 49,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Dollars",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Dollars",
            "$",
            "Dollar"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "dose",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 210,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Doses",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Doses",
            "dose",
            "Dose"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "fontAwesome": "fas fa-medkit",
        "add": null,
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 100,
        "abbreviatedName": "drops",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 201,
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "fontAwesome": "fas fa-medkit",
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Drops",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Drops",
            "drops",
            "Drop",
            "drop"
        ],
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "event",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": "SUM",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 41,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Event",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Event",
            "event"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "ft",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.3048
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 36,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Feet",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Feet",
            "ft"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "GBq",
        "advanced": 1,
        "unitCategoryId": 7,
        "categoryName": "Energy",
        "combinationOperation": "SUM",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 217,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Gigabecquerel",
        "scale": "interval",
        "suffix": null,
        "synonyms": [
            "Gigabecquerel",
            "GBq"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "g",
        "advanced": 0,
        "unitCategoryId": 3,
        "categoryName": "Weight",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.001
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 6,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Grams",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Grams",
            "g",
            "Gram"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "hPa",
        "advanced": 1,
        "unitCategoryId": 10,
        "categoryName": "Pressure",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 100
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 214,
        "manualTracking": 0,
        "maximumValue": 11132.5,
        "minimumValue": 101.32,
        "name": "Hectopascal",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Hectopascal ",
            "hPa"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 24,
        "abbreviatedName": "h",
        "advanced": 0,
        "unitCategoryId": 1,
        "categoryName": "Duration",
        "combinationOperation": "SUM",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 3600
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 34,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Hours",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Hours",
            "h",
            "Hour"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "in",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.0254
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 35,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Inches",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Inches",
            "in",
            "Inch"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "index",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 15,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Index",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "Index",
            "index"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "IU",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 207,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "International Units",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "International Units",
            "IU",
            "International Unit"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "maximumDailyValue": 20000,
        "abbreviatedName": "kcal",
        "advanced": 1,
        "unitCategoryId": 7,
        "categoryName": "Energy",
        "combinationOperation": "SUM",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 22,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Kilocalories",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Kilocalories",
            "kcal",
            "Kilocalory"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "kg",
        "advanced": 1,
        "unitCategoryId": 3,
        "categoryName": "Weight",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 5,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Kilograms",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Kilograms",
            "kg",
            "Kilogram"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "km",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1000
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 16,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Kilometers",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Kilometers",
            "km",
            "Kilometer"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 10,
        "abbreviatedName": "L",
        "advanced": 1,
        "unitCategoryId": 4,
        "categoryName": "Volume",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 205,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Liters",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Liters",
            "L",
            "Liter"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "m\/s",
        "advanced": 1,
        "unitCategoryId": 9,
        "categoryName": "Frequency",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 208,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Meters per Second",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Meters per Second",
            "m\/s"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "m",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 3,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Meters",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Meters",
            "m",
            "Meter"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "mg\/dL",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 43,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Micrograms per decilitre",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Micrograms per decilitre",
            "mg\/dL"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 10000,
        "abbreviatedName": "mcg",
        "advanced": 1,
        "unitCategoryId": 3,
        "categoryName": "Weight",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1.0e-6
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 32,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Micrograms",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Micrograms",
            "mcg",
            "Microgram"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "mph",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 215,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Miles per Hour",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Miles per Hour",
            "mph"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "mi",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1609.34
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 4,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Miles",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Miles",
            "mi",
            "Mile"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "mbar",
        "advanced": 1,
        "unitCategoryId": 10,
        "categoryName": "Pressure",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 133.32239
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 213,
        "manualTracking": 0,
        "maximumValue": 10130,
        "minimumValue": 101,
        "name": "Millibar",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Millibar",
            "mbar"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 1000000,
        "abbreviatedName": "mg",
        "advanced": 0,
        "unitCategoryId": 3,
        "categoryName": "Weight",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1.0e-6
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 7,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Milligrams",
        "scale": "ratio",
        "suffix": "Intake",
        "synonyms": [
            "Milligrams",
            "mg",
            "Milligram"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 1000000,
        "abbreviatedName": "mL",
        "advanced": 0,
        "unitCategoryId": 4,
        "categoryName": "Volume",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.001
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 9,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Milliliters",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Milliliters",
            "mL",
            "Milliliter"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "mmHg",
        "advanced": 1,
        "unitCategoryId": 10,
        "categoryName": "Pressure",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 133.32239
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 30,
        "manualTracking": 1,
        "maximumValue": 100000,
        "minimumValue": 1,
        "name": "Millimeters Merc",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Millimeters Merc",
            "mmHg"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "mm",
        "advanced": 1,
        "unitCategoryId": 2,
        "categoryName": "Distance",
        "combinationOperation": "SUM",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.001
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 48,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Millimeters",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Millimeters",
            "mm",
            "Millimeter"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 86400000,
        "abbreviatedName": "ms",
        "advanced": 1,
        "unitCategoryId": 1,
        "categoryName": "Duration",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.001
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 204,
        "manualTracking": 0,
        "maximumValue": 864000000,
        "minimumValue": 0,
        "name": "Milliseconds",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Milliseconds",
            "ms",
            "Millisecond"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 1440,
        "abbreviatedName": "min",
        "advanced": 0,
        "unitCategoryId": 1,
        "categoryName": "Duration",
        "combinationOperation": "SUM",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 60
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 2,
        "manualTracking": 1,
        "maximumValue": 10080,
        "minimumValue": 0,
        "name": "Minutes",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Minutes",
            "min",
            "Minute"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "-4 to 4",
        "advanced": 1,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "ADD",
                "value": 4
            },
            {
                "operation": "MULTIPLY",
                "value": 12.5
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 25,
        "manualTracking": 0,
        "maximumValue": 4,
        "minimumValue": -4,
        "name": "-4 to 4 Rating",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "-4 to 4 Rating",
            "-4 to 4"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "\/5",
        "advanced": 0,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 25
            },
            {
                "operation": "ADD",
                "value": -25
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 10,
        "manualTracking": 1,
        "maximumValue": 5,
        "minimumValue": 1,
        "name": "1 to 5 Rating",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "out of five",
            "out of 5",
            "1 to 5 Rating",
            "\/5"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "\/10",
        "advanced": 0,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 11.111111111111
            },
            {
                "operation": "ADD",
                "value": -11.111111111111
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 203,
        "manualTracking": 1,
        "maximumValue": 10,
        "minimumValue": 1,
        "name": "1 to 10 Rating",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "1 to 10 Rating",
            "\/10"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "\/3",
        "advanced": 1,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": "MEAN",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 50
            },
            {
                "operation": "ADD",
                "value": -50
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 216,
        "manualTracking": 1,
        "maximumValue": 3,
        "minimumValue": 1,
        "name": "1 to 3 Rating",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "out of three",
            "out of 3",
            "1 to 3 Rating",
            "\/3"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "oz",
        "advanced": 1,
        "unitCategoryId": 4,
        "categoryName": "Volume",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.0295735
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 206,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Ounces",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Ounces",
            "oz",
            "Ounce"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "ppm",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 211,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Parts per Million",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Parts per Million",
            "ppm"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "Pa",
        "advanced": 1,
        "unitCategoryId": 10,
        "categoryName": "Pressure",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 47,
        "manualTracking": 0,
        "maximumValue": 1113250,
        "minimumValue": 10132,
        "name": "Pascal",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Pascal",
            "Pa"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "%",
        "advanced": 1,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 21,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": null,
        "name": "Percent",
        "scale": "interval",
        "suffix": null,
        "synonyms": [
            "Percent",
            "%"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "\/minute",
        "advanced": 1,
        "unitCategoryId": 9,
        "categoryName": "Frequency",
        "combinationOperation": "MEAN",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 202,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "per Minute",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "per Minute",
            "\/minute"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 100,
        "abbreviatedName": "pieces",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 28,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Pieces",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Pieces",
            "pieces",
            "Piece",
            "piece"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 100,
        "abbreviatedName": "pills",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 24,
        "manualTracking": 1,
        "maximumValue": 20,
        "minimumValue": 0,
        "name": "Pills",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Pills",
            "pills",
            "Pill",
            "pill"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "fontAwesome": "fas fa-medkit",
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "lb",
        "advanced": 1,
        "unitCategoryId": 3,
        "categoryName": "Weight",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.453592
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 8,
        "manualTracking": 1,
        "maximumValue": 1000,
        "minimumValue": 0,
        "name": "Pounds",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "lbs",
            "Pounds",
            "lb",
            "Pound"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "puffs",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 13,
        "manualTracking": 1,
        "maximumValue": 100,
        "minimumValue": 0,
        "name": "Puffs",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Puffs",
            "puffs",
            "Puff",
            "puff"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "qt",
        "advanced": 1,
        "unitCategoryId": 4,
        "categoryName": "Volume",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 0.946353
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 209,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Quarts",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Quarts",
            "qt",
            "Quart"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "maximumDailyValue": 10000,
        "abbreviatedName": "%RDA",
        "advanced": 1,
        "unitCategoryId": 6,
        "categoryName": "Miscellany",
        "combinationOperation": "SUM",
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": -1,
        "hint": null,
        "id": 29,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "% Recommended Daily Allowance",
        "scale": "ratio",
        "suffix": "intake",
        "synonyms": [
            "% Recommended Daily Allowance",
            "%RDA",
            "Percent Recommended Daily Allowance"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/protein.png",
        "fontAwesome": "fas fa-utensil-spoon",
        "add": null,
        "fillingType": "none",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 86400,
        "abbreviatedName": "s",
        "advanced": 1,
        "unitCategoryId": 1,
        "categoryName": "Duration",
        "combinationOperation": null,
        "conversionSteps": [],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 1,
        "manualTracking": 0,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Seconds",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Seconds",
            "s",
            "Second"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 40,
        "abbreviatedName": "serving",
        "advanced": 0,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 44,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Serving",
        "scale": "ratio",
        "suffix": "Consumption",
        "synonyms": [
            "Serving",
            "serving"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/fast-food.png",
        "fontAwesome": "fas fa-utensil-spoon",
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "abbreviatedName": "sprays",
        "advanced": 1,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingType": "zero",
        "fillingValue": 0,
        "fontAwesome": "fas fa-medkit",
        "hint": null,
        "id": 50,
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "manualTracking": 1,
        "maximumDailyValue": 50,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Sprays",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Sprays",
            "sprays",
            "Spray",
            "spray"
        ],
        "unitCategoryId": 13,
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "maximumDailyValue": 20,
        "abbreviatedName": "tablets",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 11,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Tablets",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Tablets",
            "tablets",
            "Tablet",
            "tablet"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/medical\/png\/pill.png",
        "fontAwesome": "fas fa-medkit",
        "add": null,
        "inputType": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "torr",
        "advanced": 1,
        "unitCategoryId": 10,
        "categoryName": "Pressure",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 133.322
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 42,
        "manualTracking": 0,
        "maximumValue": 7600,
        "minimumValue": 76,
        "name": "Torr",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Torr",
            "torr"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "units",
        "advanced": 1,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 12,
        "manualTracking": 1,
        "maximumValue": null,
        "minimumValue": 0,
        "name": "Units",
        "scale": "ratio",
        "suffix": null,
        "synonyms": [
            "Units",
            "units",
            "Unit",
            "unit"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "zero",
        "abbreviatedName": "yes\/no",
        "advanced": 0,
        "unitCategoryId": 13,
        "categoryName": "Count",
        "combinationOperation": "SUM",
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 1
            }
        ],
        "defaultValue": null,
        "fillingValue": 0,
        "hint": null,
        "id": 19,
        "manualTracking": 1,
        "maximumValue": 1,
        "minimumValue": 0,
        "name": "Yes\/No",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "Yes\/No",
            "yes\/no"
        ],
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/check-list.png",
        "fontAwesome": "far fa-check-circle",
        "add": null,
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "\/6",
        "advanced": 1,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 20
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 40,
        "manualTracking": 0,
        "maximumValue": 5,
        "minimumValue": 0,
        "name": "0 to 5 Rating",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "0 to 5 Rating",
            "\/6"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    },
    {
        "fillingType": "none",
        "abbreviatedName": "\/1",
        "advanced": 1,
        "unitCategoryId": 5,
        "categoryName": "Rating",
        "combinationOperation": null,
        "conversionSteps": [
            {
                "operation": "MULTIPLY",
                "value": 100
            }
        ],
        "defaultValue": null,
        "fillingValue": null,
        "hint": null,
        "id": 20,
        "manualTracking": 0,
        "maximumValue": 1,
        "minimumValue": 0,
        "name": "0 to 1 Rating",
        "scale": "ordinal",
        "suffix": null,
        "synonyms": [
            "0 to 1 Rating",
            "\/1"
        ],
        "add": null,
        "fontAwesome": null,
        "image": "https:\/\/static.quantimo.do\/img\/fitness\/png\/measuring-tape.png",
        "inputType": null,
        "maximumDailyValue": null,
        "multiply": null
    }
];