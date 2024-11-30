export class PromptTemplate {
  private template: string
  private variables: Set<string>

  constructor(template: string) {
    this.template = template
    this.variables = new Set(
      Array.from(template.matchAll(/\{\{(.*?)\}\}/g)).map(match => match[1].trim())
    )
  }

  format(values: Record<string, string>): string {
    let result = this.template
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), value)
    }
    return result
  }

  getVariables(): string[] {
    return Array.from(this.variables)
  }
} 