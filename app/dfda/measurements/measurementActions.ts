"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { getUserIdServer } from "@/lib/api/getUserIdServer"

import {postMeasurements} from "@/app/dfda/dfdaActions";

const measurementSchema = z.object({
  variableName: z.string(),
  variableCategoryName: z.string(),
  value: z.number().or(z.string()).optional(),
  unitAbbreviatedName: z.string(),
  note: z.string().optional(),
  startAt: z.date(),
  variableId: z.number().optional(),
})

export async function createMeasurement(
  data: z.infer<typeof measurementSchema>
) {
  try {
    const userId = await getUserIdServer()
    if (!userId) {
      throw new Error("Not authenticated")
    }

    const validated = measurementSchema.parse(data)

    // Format the measurement for the DFDA API
    const measurement = {
      variableId: validated.variableId,
      sourceName: "Wishonia",
      unitAbbreviatedName: validated.unitAbbreviatedName,
      value: validated.value,
      note: validated.note,
      startAt: validated.startAt.toISOString(),
      variableName: validated.variableName,
      variableCategoryName: validated.variableCategoryName,
    }

    await postMeasurements(measurement, userId)

    revalidatePath("/measurements")
    return { success: true }
  } catch (error) {
    console.error("Failed to save measurement:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to save measurement" }
  }
}
