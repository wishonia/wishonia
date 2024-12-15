import type { BaseScope, SearchQualifier, AgentRule } from './scopes';

export interface PromptConfig {
  agentDescription: string;
  scopes: Record<string, BaseScope>;
  qualifiers?: Record<string, SearchQualifier>;
  rules: AgentRule[];
  examples?: string[];
  uiEvents?: string[];
}

function generateScopesSection(scopes: Record<string, BaseScope>): string {
  const scopeDescriptions = Object.values(scopes)
    .map(scope => `  - '${scope.name}' means that ${scope.description}.${
      scope.allowedFunctions.length ? ` Functions allowed: ${scope.allowedFunctions.join(', ')}` : ''
    }`)
    .join('\n');

  return `Available scopes/attributes:\n${scopeDescriptions}`;
}

function generateQualifiersSection(qualifiers: Record<string, SearchQualifier>): string {
  const qualifierDescriptions = Object.values(qualifiers)
    .map(q => `  - ${q.qualifier}: ${q.description}\n    Example: ${q.example}`)
    .join('\n');

  return `Search Query Construction:\nYou can combine these search qualifiers to create precise searches:\n${qualifierDescriptions}`;
}

function generateRulesSection(rules: AgentRule[]): string {
  // Sort rules by priority
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
  const rulesList = sortedRules
    .map((rule, index) => `${index + 1}. ${rule.description}`)
    .join('\n');

  return `Rules:\n${rulesList}`;
}

function generateExamplesSection(examples: string[]): string {
  const examplesList = examples
    .map(ex => `- ${ex}`)
    .join('\n');

  return `Examples:\n${examplesList}`;
}

function generateUIEventsSection(events: string[]): string {
  const eventsList = events
    .map(event => `- "${event}"`)
    .join('\n');

  return `Messages inside [] represent UI events or states, for example:\n${eventsList}`;
}

export function generateAgentPrompt({
  agentDescription,
  scopes,
  qualifiers,
  rules,
  examples,
  uiEvents
}: PromptConfig): string {
  const sections = [
    agentDescription,
    generateScopesSection(scopes),
    qualifiers && generateQualifiersSection(qualifiers),
    uiEvents && generateUIEventsSection(uiEvents),
    generateRulesSection(rules),
    examples && generateExamplesSection(examples)
  ].filter(Boolean);

  return sections.join('\n\n');
} 