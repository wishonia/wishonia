import { ToolType } from "@prisma/client"
import { createTool, stringifyMetadata } from "./base"

const metadata = {
  version: "1.0",
  dataPrivacy: "HIPAA compliant",
  requiresAuth: true
};

export const FDAI_TOOL = createTool({
  name: "FDAi Tools",
  type: ToolType.FUNCTION,
  description: "Tools for tracking health data and analyzing medical information",
  metadata: stringifyMetadata(metadata),
  functions: {
    record_measurement: {
      name: "record_measurement",
      description: "Record a health-related measurement",
      parameters: [{
        name: "type",
        description: "Type of measurement (medication, food, symptom, vital)",
        type: "string",
        required: true
      }, {
        name: "value",
        description: "The measurement value",
        type: "string",
        required: true
      }, {
        name: "unit",
        description: "Unit of measurement",
        type: "string",
        required: false
      }, {
        name: "timestamp",
        description: "When the measurement was taken",
        type: "string",
        required: false
      }]
    },
    search_pubmed: {
      name: "search_pubmed",
      description: "Search PubMed for medical research",
      parameters: [{
        name: "query",
        description: "The search query",
        type: "string",
        required: true
      }, {
        name: "maxResults",
        description: "Maximum number of results to return",
        type: "number",
        required: false
      }]
    },
    analyze_trends: {
      name: "analyze_trends",
      description: "Analyze trends in health measurements",
      parameters: [{
        name: "measurementType",
        description: "Type of measurement to analyze",
        type: "string",
        required: true
      }, {
        name: "timeframe",
        description: "Timeframe to analyze (e.g., '7d', '30d')",
        type: "string",
        required: false
      }]
    }
  }
}) 