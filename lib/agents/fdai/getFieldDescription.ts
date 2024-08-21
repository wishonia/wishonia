import { z } from 'zod';

function getFieldDescription(schema: z.ZodType<any>, path: string): string | undefined {
    const parts = path.split('.');
    let current: z.ZodType<any> = schema;
    for (const part of parts) {
      if (current instanceof z.ZodObject) {
        current = current.shape[part];
      } else if (current instanceof z.ZodArray) {
        current = current.element;
      } else {
        return undefined;
      }
    }
    return current.description;
  }
  
  // Usage
  //const description = getFieldDescription(SafetySummarySchema, 'specialPopulations.pregnancy');
  //console.log(description); // Outputs: "Safety considerations for use during pregnancy"