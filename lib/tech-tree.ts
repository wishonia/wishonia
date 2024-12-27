import fs from "fs"

import { classifyText } from "@/lib/classifier"
import { prisma } from "@/lib/db"
import { absPathFromRepo } from "@/lib/fileHelper"
import { createGlobalProblemSolution } from "@/lib/globalProblemSolutionGenerator"
import { isGoodSolution } from "@/lib/globalSolutions"
import { jsonArrayCompletion } from "@/lib/llm"

const trees = {
  longevity:
    "https://raw.githubusercontent.com/foresight-org/LongevityTechTree/main/ForesightTechTree/longevity.graph",
  neurotech:
    "https://raw.githubusercontent.com/foresight-org/LongevityTechTree/main/ForesightTechTree/neurotech.graph",
  cooperation:
    "https://github.com/foresight-org/LongevityTechTree/blob/main/ForesightIntcoopTree/intcoop.graph",
}
export async function getTechTree(
  type: "longevity" | "neurotech" | "cooperation"
) {
  // fetch tech tree from https://raw.githubusercontent.com/foresight-org/LongevityTechTree/main/ForesightTechTree/longevity.graph
  const response = await fetch(trees[type])
  const techTree = await response.json()
  return cleanArray(techTree.items)
}

export async function getArrayOfLabelsForEachParent(
  type: "longevity" | "neurotech" | "cooperation"
) {
  const techTree = await getTechTree(type)
  const labelsByParent: { [key: string]: string[] } = {}
  techTree.forEach((item) => {
    if (item.parent) {
      const parentNode = techTree.find((parent) => parent.id === item.parent)
      if (!labelsByParent[parentNode.label]) {
        labelsByParent[parentNode.label] = []
      }
      const clonedItem = JSON.parse(JSON.stringify(item))
      delete clonedItem.parent
      delete clonedItem.id
      labelsByParent[parentNode.label].push(clonedItem)
    }
  })
  return labelsByParent
}

export async function getSolutionsFromTechTree(
  type: "longevity" | "neurotech" | "cooperation"
) {
  const techTree = await getTechTree(type)
  return jsonArrayCompletion(
    `Please respond with a json array of strings of the items in this list that are solutions to 
        the problem of ${type}. Here's the list: ${JSON.stringify(techTree)}`
  )
}

export async function saveCleanedTechTree(
  type: "longevity" | "neurotech" | "cooperation"
) {
  const techTree = await getTechTree(type)
  return fs.writeFileSync(
    absPathFromRepo(`public/data/${type}-tech-tree-cleaned.json`),
    JSON.stringify(techTree, null, 4)
  )
}

function cleanArray(arr: Array<any>): Array<any> {
  // remove objects without label or empty label
  arr = arr.filter((obj) => obj.label && obj.label !== "")
  return arr.map((obj) => {
    const original = JSON.parse(JSON.stringify(obj))
    delete obj.nodelabelfontsize
    delete obj.fill
    delete obj.pos
    delete obj.kind
    //delete obj.id;
    for (const key in obj) {
      let value = obj[key]
      if (typeof value === "string") {
        value = value.trim()
      }
      if (typeof value === "boolean" || value === "" || !value) {
        delete obj[key]
      }
      // delete empty arrays
      if (Array.isArray(obj[key]) && obj[key].length === 0) {
        delete obj[key]
      }
    }
    return obj
  })
}

export async function getClassifiedTechTreeObjects(
  type: "longevity" | "neurotech" | "cooperation"
) {
  const techTree = await getTechTree(type)
  const classified = getTechTreeClassification(type)
  const classificationOptions = Object.keys(classified)
  for (const item of techTree) {
    if (alreadyClassifiedTechTree(item.label, type)) {
      continue
    }
    const openAIClassification = await classifyText(
      item.label,
      classificationOptions,
      `The type as it pertains to ${type}`
    )
    if (!classified[openAIClassification]) {
      classified[openAIClassification] = []
    }
    classified[openAIClassification].push(item)
    saveTechTreeClassification(type, classified)
  }
  return classified
}

function saveTechTreeClassification(
  type: "longevity" | "neurotech" | "cooperation",
  classification: any
) {
  fs.writeFileSync(
    getPathToTechTreeClassification(type),
    JSON.stringify(classification, null, 4)
  )
}

function getPathToTechTreeClassification(
  type: "longevity" | "neurotech" | "cooperation"
) {
  return absPathFromRepo(`public/data/${type}-tech-tree-classified.json`)
}

function alreadyClassifiedTechTree(
  label: string,
  type: "longevity" | "neurotech" | "cooperation"
) {
  const classified = getTechTreeClassification(type)
  for (const key in classified) {
    const items = classified[key]
    for (const item of items) {
      if (item.label === label) {
        return true
      }
    }
  }
}

function getTechTreeClassification(
  type: "longevity" | "neurotech" | "cooperation"
): { [key: string]: any[] } {
  if (!fs.existsSync(getPathToTechTreeClassification(type))) {
    return {
      solution: [],
      problem: [],
      organization: [],
      person: [],
      other: [],
    }
  }
  return JSON.parse(
    fs.readFileSync(getPathToTechTreeClassification(type)).toString()
  )
}

export async function createGlobalProblemSolutionsForAging() {
  const newGlobalProblemSolutions = []
  const classified = await getClassifiedTechTreeObjects("longevity")
  const solutionItems = classified.solution
  const globalProblem = await prisma.globalProblem.findFirst({
    where: {
      name: "Aging",
    },
  })
  if (!globalProblem) throw new Error("Global Problem Aging not found")
  for (const item of solutionItems) {
    const solutionName = item.label
    const globalSolution = await prisma.globalSolution.findFirst({
      where: {
        name: solutionName,
      },
    })
    if (globalSolution) {
      const existingGlobalProblemSolution =
        await prisma.globalProblemSolution.findFirst({
          where: {
            globalProblemId: globalProblem.id,
            globalSolutionId: globalSolution.id,
          },
        })
      if (existingGlobalProblemSolution) {
        console.log(
          `Skipping solution "${solutionName}" because it already exists`
        )
        continue
      }
    }
    const goodSolution = await isGoodSolution(globalProblem.name, solutionName)
    if (!goodSolution) {
      console.log(
        `Skipping solution "${solutionName}" because it was not a good solution for ${globalProblem.name}`
      )
      continue
    }
    const solutionDescription = item.desc || null
    const newGlobalProblemSolution = await createGlobalProblemSolution(
      solutionName,
      solutionDescription,
      globalProblem
    )
    newGlobalProblemSolutions.push(newGlobalProblemSolution)
  }
  return newGlobalProblemSolutions
}
