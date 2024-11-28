import { Measurement } from "@/types/models/Measurement"
import {
  convertToLocalDateTime,
  convertToUTC,
} from "@/lib/dateTimeWithTimezone"
import { getUserId } from "@/lib/getUserId"
import {
  getDateTimeFromStatementInUserTimezone,
  textCompletion,
} from "@/lib/llm"
import {postMeasurements} from "@/app/dfda/dfdaActions";

export function generateText2MeasurementsPrompt(
  statement: string,
  currentUtcDateTime: string,
  timeZoneOffset: number
): string {
  const currentLocalDateTime = convertToLocalDateTime(
    currentUtcDateTime,
    timeZoneOffset
  )
  const currentLocalDate = currentUtcDateTime.split("T")[0]

  return `
        You are a service that translates user requests into an array of JSON objects of type "Measurement" according to the following TypeScript definitions:
\`\`\`
export const VariableCategoryNames = [
  'Emotions',
  'Physique',
  'Physical Activity',
  'Locations',
  'Miscellaneous',
  'Sleep',
  'Social Interactions',
  'Vital Signs',
  'Cognitive Performance',
  'Symptoms',
  'Nutrients',
  'Goals',
  'Treatments',
  'Activities',
  'Foods',
  'Conditions',
  'Environment',
  'Causes of Illness',
  'Books',
  'Software',
  'Payments',
  'Movies and TV',
  'Music',
  'Electronics',
  'IT Metrics',
  'Economic Indicators',
  'Investment Strategies'
] as const;  // 'as const' makes it a readonly array

// Then you can use this array to define your type:
export type VariableCategoryName = typeof VariableCategoryNames[number];  // This will be a union of the array values

export const UnitNames = [
  'per Minute',
  'Yes/No',
  'Units',
  'Torr',
  'Tablets',
  'Sprays',
  'Serving',
  'Seconds',
  'Quarts',
  'Puffs',
  'Pounds',
  'Pills',
  'Percent',
  'Pascal',
  'Parts per Million',
  'Ounces',
  'Minutes',
  'Milliseconds',
  'Millimeters Merc',
  'Millimeters',
  'Milliliters',
  'Milligrams',
  'Millibar',
  'Miles per Hour',
  'Miles',
  'Micrograms per decilitre',
  'Micrograms',
  'Meters per Second',
  'Meters',
  'Liters',
  'Kilometers',
  'Kilograms',
  'Kilocalories',
  'International Units',
  'Index',
  'Inches',
  'Hours',
  'Hectopascal',
  'Grams',
  'Gigabecquerel',
  'Feet',
  'Event',
  'Drops',
  'Doses',
  'Dollars',
  'Degrees North',
  'Degrees Fahrenheit',
  'Degrees East',
  'Degrees Celsius',
  'Decibels',
  'Count',
  'Centimeters',
  'Capsules',
  'Calories',
  'Beats per Minute',
  'Applications',
  '1 to 5 Rating',
  '1 to 3 Rating',
  '1 to 10 Rating',
  '0 to 5 Rating',
  '0 to 1 Rating',
  '-4 to 4 Rating',
  '% Recommended Daily Allowance'
] as const;  // 'as const' makes it a readonly array

// Then you can use this array to define your type:
export type UnitName = typeof UnitNames[number];  // This will be a union of the array values

export interface Measurement {
  itemType: 'measurement',
  variableName: string;  // variableName is the name of the treatment, symptom, food, drink, etc.
  // For example, if the answer is "I took 5 mg of NMN", then this variableName is "NMN".
  // For example, if the answer is "I have been having trouble concentrating today", then this variableName is "Concentration".
  value: number; // value is the number of units of the treatment, symptom, food, drink, etc.
  // For example, if the answer is "I took 5 mg of NMN", then this value is 5.
  // For example, if the answer is "I have been feeling very tired and fatigued today", you would return two measurements
  // with the value 5 like this:
  // {variableName: "Tiredness", value: 5, unitName: "1 to 5 Rating", startAt: "${currentLocalDate}T00:00:00", endAt: "${currentLocalDate}T23:59:59", combinationOperation: "MEAN", variableCategoryName: "Symptoms"}
  // {variableName: "Fatigue", value: 5, unitName: "1 to 5 Rating", startAt: "${currentLocalDate}T00:00:00", endAt: "${currentLocalDate}T23:59:59", combinationOperation: "MEAN", variableCategoryName: "Symptoms"}
  // For example, if the answer is "I have been having trouble concentrating today", then this value is 1 and the object
  // would be {variableName: "Concentration", value: 1, unitName: "1 to 5 Rating", startAt: "${currentLocalDate}T00:00:00", endAt: "${currentLocalDate}T23:59:59", combinationOperation: "MEAN", variableCategoryName: "Symptoms"}
  // For example, if the answer is "I also took magnesium 200mg, Omega3 one capsule 500mg", then the measurements would be:
  // {variableName: "Magnesium", value: 200, unitName: "Milligrams", startAt: "${currentLocalDate}T00:00:00", endAt: "${currentLocalDate}T23:59:59", combinationOperation: "SUM", variableCategoryName: "Treatments"}
  // {variableName: "Omega3", value: 500, unitName: "Milligrams", startAt: "${currentLocalDate}T00:00:00", endAt: "${currentLocalDate}T23:59:59", combinationOperation: "SUM", variableCategoryName: "Treatments"}
  // (I just used the current date in those examples, but you should use the correct date if the user specifies a different date or time range.)
  unitName: UnitName;
  // unitName is the unit of the treatment, symptom, food, drink, etc.
  // For example, if the answer is "I took 5 mg of NMN", then this unitName is "Milligrams".
  startAt: string;  // startAt should be the local datetime the measurement was taken in the format "YYYY-MM-DDThh:mm:ss" inferred from the USER STATEMENT relative to and sometime before the current local datetime ${currentLocalDateTime}.
  endAt: string|null; // If a time range is suggested, then endAt should be the end of that period. It should also be in the format "YYYY-MM-DDThh:mm:ss" and should not be in the future relative to the current time ${currentLocalDateTime} .
  combinationOperation: "SUM" | "MEAN"; // combinationOperation is the operation used to combine multiple measurements of the same variableName
  variableCategoryName: VariableCategoryName; // variableCategoryName is the category of the variableName
  // For example, if the answer is "I took 5 mg of NMN", then this variableCategoryName is "Treatments".
  note: string; // the text fragment that was used to create this measurement
}

// Use this type for measurement items that match nothing else
export interface UnknownText {
  itemType: 'unknown',
  text: string; // The text that wasn't understood
}

export type Food = Measurement & {
  variableCategoryName: "Foods";
  combinationOperation: "SUM";
};

export type Drink = Measurement & {
  variableCategoryName: "Foods";
  combinationOperation: "SUM";
};

export type Treatment = Measurement & {
  variableCategoryName: "Treatments";
  combinationOperation: "SUM";
};

export type Symptom = Measurement & {
  variableCategoryName: "Symptoms";
  combinationOperation: "MEAN";
  unitName: '/5';
};

Remember, startAt and endAt should be in the format "YYYY-MM-DDThh:mm:ss" and should not be in the future relative to the current time ${currentLocalDateTime}.

USER STATEMENT TO CONVERT TO AN ARRAY OF MEASUREMENTS:
"""
${statement}
"""
The following is the user request translated into a JSON object with 2 spaces of indentation and no properties with the value undefined:

        `
}

export async function text2measurements(
  statement: string,
  currentUtcDateTime: string,
  timeZoneOffset: number
): Promise<Measurement[]> {
  const promptText = generateText2MeasurementsPrompt(
    statement,
    currentUtcDateTime,
    timeZoneOffset
  )
  const str = await textCompletion(promptText, "json_object")
  const localDateTime = await getDateTimeFromStatementInUserTimezone(
    statement,
    currentUtcDateTime,
    timeZoneOffset
  )
  const utcDateTimeFromStatement = convertToUTC(localDateTime, timeZoneOffset)
  let json = JSON.parse(str)
  if (!Array.isArray(str)) {
    json = [json]
  }
  const measurements: Measurement[] = []
  json.forEach((measurement: Measurement) => {
    measurement.startAt = utcDateTimeFromStatement
    measurements.push(measurement)
  })
  const userId = await getUserId()
  if (userId) {
    const response = await postMeasurements(measurements, userId)
  }
  return measurements
}
