/**
 * @jest-environment node
 */
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import {getMetaAnalysis} from "@/app/dfda/dfdaActions";
import {searchClinicalTrialsGovInterventions, searchFdaTreatments} from "@/lib/clinicaltables";

describe("dFDA tests", () => {
  jest.setTimeout(6000000)
  it("Searches for searchClinicalTrialsGovInterventions", async () => {
    const treatmentMatches = await searchClinicalTrialsGovInterventions('Exercise');
    expect(treatmentMatches).toBeDefined()
  });
  it("searchFdaTreatments for treatments", async () => {
    const treatmentMatches = await searchFdaTreatments('Exercise');
    expect(treatmentMatches).toBeDefined()
  });
  
  it("Gets a meta analysis article", async () => {
    const article = await getMetaAnalysis('Exercise', 'Depression')
    expect(article).toBeDefined()
  });

  it.skip("Deletes dates and variable id from JSON file", async () => {
    // delete the updated_at, created_at, deleted_at, and variable_id fields from all 
    // the objects inn the array in the json files
    // in the prisma folder that start with ct_ and save them to a new file
    const prismaFolder = path.join(process.cwd(), 'prisma')
    const files = fs.readdirSync(prismaFolder).filter(file => file.startsWith('ct_'))
    for (const file of files) {
      const filePath = path.join(prismaFolder, file)
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      // delete the updated_at, created_at, deleted_at, and variable_id fields from all objects in
      // the array in the json file
      for (const obj of fileData) {
        delete obj.updated_at
        delete obj.created_at
        delete obj.deleted_at
        // delete all properties that end with `variable_id`
        for (const key in obj) {
          if (key.endsWith('variable_id')) {
            delete obj[key]
          }
        }
      }
      // save the new data to a new file
      let newFilePath = path.join(prismaFolder, file)
      // replace ct_ in the file name with dfda_
      newFilePath = file.replace('ct_', 'dfda_')
      // convert filename before extension from snake_case to PascalCase
        newFilePath = newFilePath.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      // make first letter of filename uppercase
        newFilePath = newFilePath.charAt(0).toUpperCase() + newFilePath.slice(1)
        newFilePath = path.join(prismaFolder, newFilePath)
      fs.writeFileSync(newFilePath, JSON.stringify(fileData, null, 2))
    }
  })

  async function importJsonToPrisma<T extends keyof PrismaClient>(prismaModel: T) {
    const prisma = new PrismaClient()
    const jsonPath = path.resolve(__dirname, '..', 'prisma', 'seeds', `${String(prismaModel)}.json`)
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  
    const camelCaseData = jsonData.map((obj: Record<string, unknown>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key.replace(/_([a-z])/g, g => g[1].toUpperCase()),
          value
        ])
      )
    })
    await (prisma[prismaModel] as any).createMany({
      data: camelCaseData,
      skipDuplicates: true,
    })
  }
  
  it.skip("Imports DfdaCause from JSON file", async () => {
    await importJsonToPrisma('dfdaCause')
    await importJsonToPrisma('dfdaCondition')
    await importJsonToPrisma('dfdaSymptom')
    await importJsonToPrisma('dfdaTreatment')
    await importJsonToPrisma('dfdaConditionCause')
    await importJsonToPrisma('dfdaConditionSymptom')
    await importJsonToPrisma('dfdaConditionTreatment')
    await importJsonToPrisma('dfdaSideEffect')
    await importJsonToPrisma('dfdaTreatmentSideEffect')
  })
})
