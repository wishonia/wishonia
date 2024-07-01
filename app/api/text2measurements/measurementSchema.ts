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
  'Pieces',
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


// a set of measurements logged by the user
export type MeasurementSet = {
  measurements: (Measurement | UnknownText)[];
};

export interface Measurement {
  itemType: 'measurement',
  variableName: string;  // variableName is the name of the treatment, symptom, food, drink, etc.
  // For example, if the answer is "I took 5 mg of NMN", then this variableName is "NMN".
  // For example, if the answer is "I have been having trouble concentrating today", then this variableName is "Concentration".
  value: number; // value is the number of units of the treatment, symptom, food, drink, etc.
  // For example, if the answer is "I took 5 mg of NMN", then this value is 5.
  // For example, if the answer is "I have been feeling very tired and fatigued today", you would return two measurements
  // with the value 5 like this:
  // {variableName: "Tiredness", value: 5, unitName: "1 to 5 Rating", startAt: "00:00:00", endAt: "23:59:59", combinationOperation: "MEAN", variableCategoryName: "Symptoms"}
  // {variableName: "Fatigue", value: 5, unitName: "1 to 5 Rating", startAt: "00:00:00", endAt: "23:59:59", combinationOperation: "MEAN", variableCategoryName: "Symptoms"}
  // For example, if the answer is "I have been having trouble concentrating today", then this value is 1 and the object
  // would be {variableName: "Concentration", value: 1, unitName: "1 to 5 Rating", startAt: "00:00:00", endAt: "23:59:59", combinationOperation: "MEAN", variableCategoryName: "Symptoms"}
  // For example, if the answer is "I also took magnesium 200mg, Omega3 one capsule 500mg", then the measurements would be:
  // {variableName: "Magnesium", value: 200, unitName: "Milligrams", startAt: "00:00:00", endAt: "23:59:59", combinationOperation: "SUM", variableCategoryName: "Treatments"}
  // {variableName: "Omega3", value: 500, unitName: "Milligrams", startAt: "00:00:00", endAt: "23:59:59", combinationOperation: "SUM", variableCategoryName: "Treatments"}
  unitName: UnitName;
  // unitName is the unit of the treatment, symptom, food, drink, etc.
  // For example, if the answer is "I took 5 mg of NMN", then this unitName is "Milligrams".
  startDateLocal: string|null;  // startDate should be the date the measurement was taken in the format "YYYY-MM-DD" or null if no date is known
  startTimeLocal: string|null;  // startAt should be the time the measurement was taken in
  // the format "HH:MM:SS".  For instance, midday would be "12:00:00".
  // ex. The term `breakfast` would be a typical breakfast time of "08:00:00".
  // ex. The term `lunch` would be a typical lunchtime of "12:00:00".
  // ex. The term `dinner` would be a typical dinner time of "18:00:00".
  // If no time or date is known, then startTime should be null.
  endDateLocal: string|null;
  endTimeLocal: string|null;
  // If a time range is given, then endAt should be the end of that period. It should also be in the format "HH:MM:SS".
  combinationOperation: "SUM" | "MEAN"; // combinationOperation is the operation used to combine multiple measurements of the same variableName
  variableCategoryName: VariableCategoryName; // variableCategoryName is the category of the variableName
  // For example, if the answer is "I took 5 mg of NMN", then this variableCategoryName is "Treatments".
  originalText: string; // the text fragment that was used to create this measurement
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
