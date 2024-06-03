import {absPathFromRepo} from "@/lib/fileHelper";
import fs from "fs";
import {formatPrismaModelSchema} from "@/lib/prismaAgent";

export async function addModelsToPrismaSchema(){
    const pathToSchema = absPathFromRepo('lib/db/schema.prisma');
    const newSchemaContents = fs.readFileSync(pathToSchema, 'utf8');
    const models = extractPrismaModelDefinitions(newSchemaContents);
    const formattedModels: string[] = [];
    for (const model of models){
        formattedModels.push(await formatModelSchema(model));
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

function extractPrismaModelDefinitions(schema: string): string[] {
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
export async function formatModelSchema(prismaModel: string): Promise<string> {
    return formatPrismaModelSchema(prismaModel);
}

export async function getPrismaModelDefinitions(): Promise<string[]> {
    const schema = await readPrismaSchema();
    return extractPrismaModelDefinitions(schema);
}