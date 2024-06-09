import fs from "fs";

export function generatePrismaSchema(modelName: string, exampleObject: any,
                                     prefix?: string, recursive: boolean = true): string | false {
    if(alreadyGenerated(modelName)){
        console.log(`Model ${modelName} already exists in schema`);
        return false;
    }
    const newSchemaArr: string[] = [];
    if(prefix && !modelName.startsWith(prefix)) {
        modelName = `${prefix}${modelName}`;
    }

    newSchemaArr.push(`\nmodel ${modelName} {`);

    function processProperty(propName: string, propValue: any, indent: string = '  ') {
        if (propName === 'id') {
            let idType: string;
            if (typeof propValue === 'string') {
                idType = 'String';
            } else if (typeof propValue === 'number') {
                idType = Number.isInteger(propValue) ? 'Int' : 'Float';
            } else {
                throw new Error('Unsupported id type. Id must be a string or a number.');
            }
            newSchemaArr.push(`${indent}id ${idType} @id`);
        } else if (propValue === null) {
            newSchemaArr.push(`${indent}${propName} String?`);
        } else if (Array.isArray(propValue) && recursive) {
            if (propValue.length > 0) {
                const pascalPropName = snakeToPascalCase(propName);
                let relatedModelName = `${modelName}${pascalPropName}`;
                if(prefix && !relatedModelName.startsWith(prefix)) {
                    relatedModelName = `${prefix}${relatedModelName}`;
                }
                newSchemaArr.push(`${indent}${propName} ${relatedModelName}[]`);
                newSchemaArr.push(`}`);
                newSchemaArr.push(``);
                newSchemaArr.push(`\nmodel ${relatedModelName} {`);
                processObject(propValue[0], '  ');
                newSchemaArr.push(`  ${modelName}Id Int`);
                newSchemaArr.push(`  ${modelName} ${modelName} @relation(fields: [${modelName}Id], references: [id])`);
            } else {
                newSchemaArr.push(`${indent}${propName} Json`);
            }
        } else if (typeof propValue === 'object' && recursive) {
            let pascalPropName = snakeToPascalCase(propName);
            let relatedModelName = `${modelName}${pascalPropName}`;
            if(prefix && !relatedModelName.startsWith(prefix)) {
                relatedModelName = `${prefix}${relatedModelName}`;
            }
            newSchemaArr.push(`${indent}${propName} ${relatedModelName}`);
            newSchemaArr.push(`}`);
            newSchemaArr.push(``);
            newSchemaArr.push(`\nmodel ${relatedModelName} {`);
            processObject(propValue, '  ');
        } else {
            let propType: string;
            switch (typeof propValue) {
                case 'string':
                    propType = 'String';
                    break;
                case 'number':
                    propType = Number.isInteger(propValue) ? 'Int' : 'Float';
                    break;
                case 'boolean':
                    propType = 'Boolean';
                    break;
                default:
                    propType = 'Json';
            }
            newSchemaArr.push(`${indent}${propName} ${propType}`);
        }
    }

    function processObject(obj: any, indent: string = '  ') {
        if (!obj.hasOwnProperty('id')) {
            newSchemaArr.push(`${indent}id Int @id @default(autoincrement())`);
        }
        for (const [propName, propValue] of Object.entries(obj)) {
            processProperty(propName, propValue, indent);
        }
    }

    processObject(exampleObject);
    newSchemaArr.push(`}`);

    const str =  newSchemaArr.join('\n');
    appendToPrismaSchema(str);
    return str;
}

function getPathToPrismaSchema() {
    return require('path').join(__dirname, '../../prisma/schema.prisma');
}

function getPrismaSchemaContents() {
    const path = getPathToPrismaSchema();
    return fs.readFileSync(path, 'utf8');
}

export function appendToPrismaSchema(newSchema: string) {
    const existing = getPrismaSchemaContents();
    if(existing.indexOf(newSchema) !== -1) {
       console.log(`Model already present in schema`);
       return;
    }
    fs.appendFileSync(getPathToPrismaSchema(), '\n'+newSchema);
}

function alreadyGenerated(modelName: string) {
    return existingSchemaContains(`model ${modelName} `);
}

function snakeToPascalCase(snakeCaseString: string): string {
    return snakeCaseString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}
function existingSchemaContains(str: string): boolean {
    return getPrismaSchemaContents().indexOf(str) !== -1;
}