/**
 * @jest-environment node
 */
import {PrismaClient} from "@prisma/client";
import {getOrCreateTestUser} from "@/tests/test-helpers";
import {loadJsonToDatabase} from "@/lib/prisma/dumpDatabaseToJson";
import {generateGlobalProblemSolutionsForGlobalProblem} from "@/lib/globalSolutionsGenerator";
import {absPathFromRepo} from "@/lib/fileHelper";
import fs from "fs";
let prisma = new PrismaClient();

function cleanArray(arr: Array<any>): Array<any> {
    // remove objects without label or empty label
    arr = arr.filter(obj => obj.label && obj.label !== '');
    return arr.map(obj => {
        const original = JSON.parse(JSON.stringify(obj));
        delete obj.nodelabelfontsize;
        delete obj.fill;
        delete obj.pos;
        delete obj.kind;
        delete obj.id;
        for (let key in obj) {
            let value = obj[key];
            if(typeof value === 'string') {
                value = value.trim();
            }
            if (typeof value === 'boolean' || value === '' || !value) {
                delete obj[key];
            }
            // delete empty arrays
            if (Array.isArray(obj[key]) && obj[key].length === 0) {
                delete obj[key];
            }
        }
        return obj;
    });
}
describe("Global Problem Solutions", () => {
    jest.setTimeout(6000000);
    it("Cleans the longevity tech tree", async () => {
        const str = fs.readFileSync(absPathFromRepo("public/data/longevity-tech-tree.json"), 'utf8');
        const arr = JSON.parse(str);
        const cleaned = cleanArray(arr.items);
        fs.writeFileSync(absPathFromRepo("public/data/longevity-tech-tree-cleaned.json"), JSON.stringify(cleaned, null, 4));
    });
    it("Generates GlobalProblemSolutions for aging", async () => {
        const testUser = await getOrCreateTestUser();
        const globalProblem  = await prisma.globalProblem.findFirst({
            where: {
                name: "Aging"
            }
        });
        if(!globalProblem) throw new Error("Global Problem Aging not found");
        const globalProblemSolutions =
            await generateGlobalProblemSolutionsForGlobalProblem(globalProblem);

    });
    it("Load GlobalProblemSolution fixture", async () => {
        await loadJsonToDatabase("GlobalProblemSolution");
    }, 6000000);

});