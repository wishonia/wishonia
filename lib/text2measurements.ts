import { Measurement } from "@/types/models/Measurement"
import {
  convertToLocalDateTime,
} from "@/lib/dateTimeWithTimezone"
import { getUserId } from "@/lib/getUserId"
import { postMeasurements } from "@/app/dfda/dfdaActions"
import { z } from 'zod'
import { generateObject } from 'ai'
import { getModel } from '@/lib/utils/modelUtils'
import { VariableCategoryNames, UnitNames } from '@/app/api/text2measurements/measurementSchema'

// Define the enums as Zod enums using the imported arrays
const VariableCategoryEnum = z.enum(VariableCategoryNames)
const UnitEnum = z.enum(UnitNames)

// Helper function to validate ISO datetime
const isValidISODateTime = (date: string) => {
  try {
    return Boolean(new Date(date).toISOString())
  } catch {
    return false
  }
}

// Define the Measurement schema
const MeasurementSchema = z.object({
  variableName: z.string().describe('Name of the treatment, symptom, food, etc.'),
  value: z.number().describe('Numerical value of the measurement'),
  unitName: UnitEnum.describe('Unit of measurement'),
  startAt: z.string()
    .refine(isValidISODateTime, 'Must be a valid ISO datetime string')
    .describe('Start time of the measurement in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ). For ongoing conditions or recent events without specific time, use current time. For past events with duration (e.g., "for the past year"), set this to the start of that period.'),
  endAt: z.string()
    .refine(isValidISODateTime, 'Must be a valid ISO datetime string')
    .describe('End time of the measurement in ISO format. For ongoing conditions, use current time. For past events with duration, this should be current time if still ongoing, or the end of the mentioned period if ended.'),
  combinationOperation: z.enum(['SUM', 'MEAN']).describe('How to combine multiple measurements. Use SUM for cumulative things like food/medicine intake, MEAN for conditions/symptoms'),
  variableCategoryName: VariableCategoryEnum.describe('Category of the variable being measured'),
  note: z.string().describe('The original text fragment that was used to create this measurement'),
  unitAbbreviatedName: z.string().optional().describe('Abbreviated unit name')
})

// Define a wrapper schema for the array
const MeasurementsWrapperSchema = z.object({
  measurements: z.array(MeasurementSchema).describe('Array of measurements parsed from the text')
})

export async function text2measurements(
  statement: string,
  currentUtcDateTime: string,
  timeZoneOffset: number
): Promise<Measurement[]> {
  try {
    console.log('Input parameters:', {
      statement,
      currentUtcDateTime,
      timeZoneOffset
    })

    const currentLocalDateTime = convertToLocalDateTime(
      currentUtcDateTime,
      timeZoneOffset
    )

    const prompt = `Convert the following statement into measurements, paying special attention to time context:

Current local time: ${currentLocalDateTime}

Guidelines for temporal interpretation:
1. If no specific time is mentioned, assume the event just happened (use current time)
2. For ongoing conditions (e.g., "I've been having back pain for a year"):
   - startAt should be one year ago from current time
   - endAt should be current time
3. For completed events with duration (e.g., "I had a headache yesterday from 2pm to 4pm"):
   - Set precise startAt and endAt times
4. For point-in-time events (e.g., "I took an aspirin"):
   - Both startAt and endAt should be the same time
5. All times must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)

Statement to analyze: "${statement}"

Please convert this into measurements, ensuring all dates are valid ISO strings and properly account for any mentioned durations or time periods.`

    const result = await generateObject({
      model: getModel(),
      schema: MeasurementsWrapperSchema,
      prompt,
    })

    console.log('AI response:', result.object)

    const measurements = result.object.measurements.map(measurement => {
      try {
        const processed = {
          ...measurement,
          sourceName: 'text2measurements',
          unitAbbreviatedName: measurement.unitAbbreviatedName || measurement.unitName
        }
        console.log('Processed measurement:', processed)
        return processed
      } catch (error) {
        console.error('Error processing measurement:', {
          measurement,
          error: error instanceof Error ? error.message : String(error)
        })
        throw error
      }
    }) as Measurement[]

    console.log('Final measurements:', measurements)

    const userId = await getUserId()
    if (userId) {
      await postMeasurements(measurements, userId)
    }

    return measurements
  } catch (error) {
    console.error('Error in text2measurements:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : String(error),
      inputs: {
        statement,
        currentUtcDateTime,
        timeZoneOffset
      }
    })
    throw error
  }
}
