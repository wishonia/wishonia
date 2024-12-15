import { ToolType } from "@prisma/client"
import { toolFunctions } from "./functions"

export { toolFunctions }

// Type to ensure all ToolTypes have implementations
export type ToolFunctionMap = {
  [K in ToolType]: Record<string, Function>
}

// Type guard to check if a tool type has implementations
export function hasToolImplementation(type: ToolType): boolean {
  return type in toolFunctions
}

// Type guard to check if a function exists for a tool
export function hasToolFunction(type: ToolType, functionName: string): boolean {
  return type in toolFunctions && functionName in toolFunctions[type]
}

// Get available functions for a tool type
export function getToolFunctions(type: ToolType): string[] {
  if (type in toolFunctions) {
    return Object.keys(toolFunctions[type])
  }
  return []
} 