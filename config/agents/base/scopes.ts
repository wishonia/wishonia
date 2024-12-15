export interface BaseScope {
  name: string;
  description: string;
  allowedFunctions: string[];
}

export interface SearchQualifier {
  qualifier: string;
  description: string;
  example: string;
}

export interface AgentRule {
  id: string;
  description: string;
  priority: number;
}

// Helper to create scopes with type safety
export function createScope<T extends string>(scope: Record<T, BaseScope>) {
  return scope;
}

// Helper to create qualifiers with type safety
export function createQualifiers<T extends string>(qualifiers: Record<T, SearchQualifier>) {
  return qualifiers;
}

// Helper to create rules with type safety
export function createRules<T extends string>(rules: Record<T, AgentRule>) {
  return rules;
} 