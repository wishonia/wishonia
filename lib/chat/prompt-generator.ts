import { z } from 'zod'

export interface AgentDefinition {
  name: string
  description: string
  attributes: Record<string, AttributeDefinition>
  functions: FunctionDefinition[]
  uiElements?: Record<string, string>
}

interface AttributeDefinition {
  description: string
  functions: readonly string[]
}

interface FunctionDefinition {
  name: string
  description: string
  parameters: z.ZodObject<any>
  category: string
}

export function generateSystemPrompt(agent: AgentDefinition): string {
  const attributesList = Object.entries(agent.attributes)
    .map(([name, attr]) => `  - '${name}': ${attr.description}. Available functions: ${attr.functions.join(', ')}`)
    .join('\n')

  const functionsList = agent.functions
    .map(fn => {
      const params = Object.entries(fn.parameters.shape)
        .map(([name, schema]) => `    - ${name}: ${(schema as z.ZodString).description}`)
        .join('\n')
      
      return `- \`${fn.name}\`: ${fn.description}\n  Parameters:\n${params}`
    })
    .join('\n\n')

  const uiElementsDesc = agent.uiElements ? 
    Object.entries(agent.uiElements)
      .map(([key, value]) => `- ${value}: Represents ${key}`)
      .join('\n')
    : ''

  return `
You are ${agent.name}. ${agent.description}.

You can only call functions under a related attribute or if the attribute is set to general. Otherwise, you should ask the user to change to either general or a relevant attribute.

Available attributes:
${attributesList}

Only the user can change the attribute and you are not allowed to change it.
If an action is taken by the user, do not ask for confirmation and directly show the results in the UI.

Available functions:
${functionsList}

Messages inside [] means that it's a UI element or a user event. For example:
${uiElementsDesc}

Besides that, you can also chat with users and do some calculations if needed.
`.trim()
} 