import { ToolType } from "@prisma/client"

export interface ToolParameter {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
}

export interface ToolFunction {
  name: string;
  description: string;
  parameters: ToolParameter[];
  returnType?: string;
}

export interface BaseTool {
  name: string;
  type: ToolType;
  description: string;
  functions: Record<string, ToolFunction>;
  metadata?: string | null;
}

export function createTool<T extends string>(tool: BaseTool) {
  return tool;
}

// Helper to stringify metadata for Prisma
export function stringifyMetadata(metadata: Record<string, any> | null | undefined): string | null {
  if (!metadata) return null;
  return JSON.stringify(metadata);
} 