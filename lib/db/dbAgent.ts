import {absPathFromRepo} from "@/lib/fileHelper";
import fs from "fs";
import {textCompletion} from "@/lib/llm";

export async function addModelsToPrismaSchema(){
    const pathToSchema = absPathFromRepo('lib/db/schema.prisma');
    const newSchemaContents = fs.readFileSync(pathToSchema, 'utf8');
    const models = extractModelDefinitions(newSchemaContents);
    const formattedModels: string[] = [];
    for (const model of models){
        formattedModels.push(await formatModel(model));
    }
    const existingSchemaContents = await readPrismaSchema();
    const newSchema = formattedModels.join('\n\n');
    const updatedSchema = existingSchemaContents + '\n\n' + newSchema;
    const path = absPathFromRepo('prisma/schema.prisma');
    fs.writeFileSync(path, updatedSchema, 'utf8');
}

export async function readPrismaSchema(){
    const path = absPathFromRepo('prisma/schema.prisma');
    return fs.readFileSync(path, 'utf8');
}

function extractModelDefinitions(schema: string): string[] {
    const modelRegex = /model\s+\w+\s*{/;
    const closingBraceRegex = /^\s*}\s*$/;

    const modelDefinitions: string[] = [];
    const lines = schema.split('\n');

    let currentModel = '';
    let insideModel = false;

    for (const line of lines) {
        if (insideModel) {
            currentModel += line + '\n';
            if (closingBraceRegex.test(line)) {
                modelDefinitions.push(currentModel.trim());
                currentModel = '';
                insideModel = false;
            }
        } else if (modelRegex.test(line)) {
            insideModel = true;
            currentModel = line + '\n';
        }
    }

    return modelDefinitions;
}
export async function formatModel(model: string): Promise<string> {
    //model = convertFieldNamesToCamelCase(model);
    const result = await textCompletion(`Please format this prisma model to:
    1. Make sure the id is a string uuid like:  "id    String   @id @default(cuid())"
    2. use camelCase for the field names that are not relations
    3. Make sure the field names for the relations match the related model name so if the type is "BotAppearance[]" the field name should be "BotAppearance"
    
    Only return the model block.  No chit chat or code blocks please.  
    Your response should start with "model" and end with "}".
    
    Here's the prisma model for you to update: ${model}`, 'text');
    // remove the "```prisma" and "```" from the response
    return result.replace(/```prisma/g, '').replace(/```/g, '');
}